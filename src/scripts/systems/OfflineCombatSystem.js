import EventBus, { EVENTS } from '../utils/EventBus.js';
import { MAP_CONFIG } from '../config/MapConfig.js';
import { MONSTER_CONFIG } from '../config/MonsterConfig.js';
import { DROP_CONFIG } from '../config/DropConfig.js';
import { EQUIP_BASES } from '../config/EquipmentConfig.js';
import { randomInt, chance, weightedRandom } from '../utils/Random.js';

const MAX_OFFLINE_HOURS = 8;
const OFFLINE_EFFICIENCY = 0.50;
const DROP_RATE_MULTIPLIER = 2.5;

const MONSTER_HP_MULT = 2.0;

function _monsterScaling(level, isBoss) {
  const l = Math.max(0, level - 8);
  const hpMult = isBoss
    ? Math.max(0.12, 1.0 - l * 0.015)
    : Math.max(0.18, 1.0 - l * 0.014);
  const defMult = Math.max(0.35, 1.0 - l * 0.010);
  return { hpMult: hpMult * MONSTER_HP_MULT, defMult };
}

function settleOfflineRewards(lastOfflineTime, mapId, playerStats) {
  if (!lastOfflineTime || !mapId) return null;

  const now = Date.now();
  const offlineMs = Math.min(now - lastOfflineTime, MAX_OFFLINE_HOURS * 3600 * 1000);
  if (offlineMs < 60000) return null;

  const offlineMinutes = offlineMs / 60000;
  const map = MAP_CONFIG[mapId];
  if (!map) return null;

  const expBonus = playerStats.expBonus || 0;
  const goldBonus = playerStats.goldBonus || 0;
  const magicFind = playerStats.magicFind || 0;

  const totalExp = Math.floor(map.expPerMinute * offlineMinutes * OFFLINE_EFFICIENCY * (1 + expBonus));
  const totalGold = Math.floor(map.goldPerMinute * offlineMinutes * OFFLINE_EFFICIENCY * (1 + goldBonus));

  const avgKillTimeSec = _estimateKillTime(map, playerStats);
  const effectiveSeconds = offlineMinutes * 60 * OFFLINE_EFFICIENCY;
  const estimatedKills = Math.floor(effectiveSeconds / Math.max(1, avgKillTimeSec));

  const playerLevel = playerStats.level || 1;
  const drops = _rollOfflineDrops(map, estimatedKills, magicFind, playerLevel);

  const result = {
    minutes: Math.floor(offlineMinutes),
    offlineMinutes: Math.floor(offlineMinutes),
    efficiency: OFFLINE_EFFICIENCY,
    exp: totalExp,
    gold: totalGold,
    items: drops,
    drops,
    estimatedKills
  };

  EventBus.emit(EVENTS.OFFLINE_REWARD, result);
  return result;
}

function _estimateKillTime(map, playerStats) {
  const monsters = map.monsters;
  if (!monsters || monsters.length === 0) return 3;

  let totalHp = 0;
  let count = 0;
  for (const mid of monsters) {
    const m = MONSTER_CONFIG[mid];
    if (m) {
      const s = _monsterScaling(m.level, false);
      totalHp += Math.floor(m.hp * s.hpMult);
      count++;
    }
  }
  if (count === 0) return 3;

  const avgHp = totalHp / count;
  const atk = Math.max(playerStats.attack || 0, playerStats.magicAttack || 0);
  if (atk <= 0) return 5;

  const dps = atk * (playerStats.attackSpeed || 1);
  const seconds = Math.max(1, Math.ceil(avgHp / dps));
  return Math.min(seconds, 10);
}

function _rollOfflineDrops(map, kills, magicFind, playerLevel) {
  const drops = [];
  const maxDrops = 60;
  const monsters = map.monsters;
  if (!monsters || monsters.length === 0) return drops;

  const maxEquipLevel = (playerLevel || 1) + 8;

  for (let i = 0; i < kills && drops.length < maxDrops; i++) {
    const monsterId = monsters[randomInt(0, monsters.length - 1)];
    const dropCfg = DROP_CONFIG[monsterId];
    if (!dropCfg) continue;

    const dropChance = Math.min(1, dropCfg.baseDropChance * DROP_RATE_MULTIPLIER * (1 + magicFind));
    if (!chance(dropChance)) continue;

    const quality = weightedRandom(dropCfg.qualityWeights);
    const allItems = dropCfg.items;
    if (!allItems || allItems.length === 0) continue;

    const filtered = allItems.filter(id => {
      const key = id.replace(/^equip_/, '');
      const base = EQUIP_BASES[key] || EQUIP_BASES[id];
      return !base || base.requiredLevel <= maxEquipLevel;
    });
    const items = filtered.length > 0 ? filtered : allItems;

    const FOUR_SLOT_PASS = 0.30;
    let itemId = items[randomInt(0, items.length - 1)];
    for (let r = 0; r < 3; r++) {
      if (!/hat_lv|medal_lv|drum_lv|talisman_lv/.test(itemId) || chance(FOUR_SLOT_PASS)) break;
      itemId = items[randomInt(0, items.length - 1)];
    }
    drops.push({ configId: itemId, quality, sourceMonster: monsterId, dropTime: Date.now() });
  }

  return drops;
}

export default { settleOfflineRewards, MAX_OFFLINE_HOURS, OFFLINE_EFFICIENCY };
export { settleOfflineRewards, MAX_OFFLINE_HOURS, OFFLINE_EFFICIENCY };

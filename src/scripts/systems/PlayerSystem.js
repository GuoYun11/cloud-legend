import EventBus, { EVENTS } from '../utils/EventBus.js';
import { JOB_CONFIG, LEVEL_CONFIG, getExpToLevel } from '../config/PlayerConfig.js';
import { uuid } from '../utils/Random.js';

const RATE_KEYS = new Set([
  'critRate', 'critDamage', 'dodgeRate', 'attackSpeed',
  'expBonus', 'goldBonus', 'magicFind', 'damageReduction'
]);

let player = null;
let _gameState = null;

export function init(savedData, gameState) {
  _gameState = gameState || null;
  player = savedData ? { ...savedData } : null;
}

export function createPlayer(name, job) {
  const config = JOB_CONFIG[job];
  if (!config) return null;
  const base = config.baseStats;
  player = {
    id: uuid(),
    name,
    job,
    level: 1,
    exp: 0,
    baseStats: { ...base },
    currentHp: base.maxHp,
    currentMp: base.maxMp,
    stats: {
      totalKills: 0, totalDeaths: 0, totalGoldEarned: 0,
      maxDamage: 0, bossKills: 0, totalPlayTime: 0
    },
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
    lastOfflineRewardAt: Date.now()
  };
  EventBus.emit(EVENTS.STATS_CHANGED, player);
  return player;
}

export function getPlayer() {
  return player;
}

export function getBaseStats() {
  if (!player) return null;
  const config = JOB_CONFIG[player.job];
  const { growth } = config;
  const lvl = player.level - 1;
  return {
    maxHp: config.baseStats.maxHp + Math.floor(growth.hpPerLevel * lvl),
    maxMp: config.baseStats.maxMp + Math.floor(growth.mpPerLevel * lvl),
    attack: config.baseStats.attack + Math.floor(growth.attackPerLevel * lvl),
    magicAttack: config.baseStats.magicAttack + Math.floor(growth.magicAttackPerLevel * lvl),
    defense: config.baseStats.defense + Math.floor(growth.defensePerLevel * lvl),
    magicDefense: config.baseStats.magicDefense + Math.floor(growth.magicDefensePerLevel * lvl),
    critRate: config.baseStats.critRate,
    critDamage: config.baseStats.critDamage,
    dodgeRate: config.baseStats.dodgeRate,
    attackSpeed: config.baseStats.attackSpeed,
    hpRegen: config.baseStats.hpRegen,
    mpRegen: config.baseStats.mpRegen,
    expBonus: config.baseStats.expBonus,
    goldBonus: config.baseStats.goldBonus,
    magicFind: config.baseStats.magicFind,
    damageReduction: config.baseStats.damageReduction
  };
}

export function getFinalStats() {
  const base = getBaseStats();
  if (!base) return null;

  const equipBonus = _gameState?.equipSystem?.getEquipmentStats?.() || {};
  const zodiacBonus = _gameState?.zodiacSystem?.getZodiacBonusStats?.() || {};

  const final = { ...base };
  const keys = Object.keys(final);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (typeof final[k] === 'number') {
      final[k] += (equipBonus[k] || 0) + (zodiacBonus[k] || 0);
    }
  }

  if (player.job === 'mage') {
    final.attack = Math.max(final.attack, final.magicAttack);
  }

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (!RATE_KEYS.has(k) && typeof final[k] === 'number') {
      final[k] = Math.floor(final[k]);
    }
  }

  return final;
}

export function addExp(amount) {
  if (!player || amount <= 0) return;
  player.exp += Math.floor(amount);
  EventBus.emit(EVENTS.PLAYER_EXP_GAINED, { exp: amount, totalExp: player.exp });

  let leveled = false;
  while (player.level < LEVEL_CONFIG.maxLevel) {
    const needed = getExpToLevel(player.level + 1);
    if (player.exp < needed) break;
    player.exp -= needed;
    player.level++;
    leveled = true;
    EventBus.emit(EVENTS.PLAYER_LEVEL_UP, { level: player.level });
  }

  if (player.level >= LEVEL_CONFIG.maxLevel) {
    player.exp = 0;
  }

  if (leveled) {
    const stats = getFinalStats();
    player.currentHp = stats.maxHp;
    player.currentMp = stats.maxMp;
    EventBus.emit(EVENTS.STATS_CHANGED, player);
  }
}

export function consumeHp(amount) {
  if (!player) return;
  player.currentHp = Math.max(0, player.currentHp - Math.floor(amount));
  EventBus.emit(EVENTS.PLAYER_HP_CHANGED, { currentHp: player.currentHp });
  if (player.currentHp <= 0) {
    EventBus.emit(EVENTS.PLAYER_DEAD, player);
  }
}

export function restoreHp(amount) {
  if (!player) return;
  const maxHp = getFinalStats().maxHp;
  player.currentHp = Math.min(maxHp, player.currentHp + Math.floor(amount));
  EventBus.emit(EVENTS.PLAYER_HP_CHANGED, { currentHp: player.currentHp });
}

export function consumeMp(amount) {
  if (!player) return;
  player.currentMp = Math.max(0, player.currentMp - Math.floor(amount));
}

export function restoreMp(amount) {
  if (!player) return;
  const maxMp = getFinalStats().maxMp;
  player.currentMp = Math.min(maxMp, player.currentMp + Math.floor(amount));
}

export function isAlive() {
  return player !== null && player.currentHp > 0;
}

export function revive() {
  if (!player) return;
  const maxHp = getFinalStats().maxHp;
  player.currentHp = Math.floor(maxHp * 0.5);
  EventBus.emit(EVENTS.PLAYER_REVIVE, { currentHp: player.currentHp });
  EventBus.emit(EVENTS.PLAYER_HP_CHANGED, { currentHp: player.currentHp });
}

export function updateStats(partial) {
  if (!player) return;
  Object.assign(player.stats, partial);
}

export function getData() {
  if (!player) return null;
  return {
    id: player.id,
    name: player.name,
    job: player.job,
    level: player.level,
    exp: player.exp,
    baseStats: { ...player.baseStats },
    currentHp: player.currentHp,
    currentMp: player.currentMp,
    stats: { ...player.stats },
    createdAt: player.createdAt,
    lastLoginAt: player.lastLoginAt,
    lastOfflineRewardAt: player.lastOfflineRewardAt
  };
}

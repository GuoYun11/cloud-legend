import EventBus, { EVENTS } from '../utils/EventBus.js';
import { uuid, random, randomInt, randomFloat, chance, weightedRandom } from '../utils/Random.js';
import {
  QUALITY_CONFIG, EQUIP_SLOT_NAMES, SET_CONFIG,
  ENHANCE_CONFIG, EQUIP_BASES, RING_SLOTS, BRACELET_SLOTS,
  LUCKY_CONFIG, MATERIAL_CONFIG
} from '../config/EquipmentConfig.js';
import * as EconomySystem from './EconomySystem.js';

const PERCENT_STATS = new Set([
  'critRate', 'critDamage', 'dodgeRate', 'attackSpeed',
  'expBonus', 'goldBonus', 'magicFind'
]);

const EXTRA_STAT_POOL = [
  'attack', 'defense', 'maxHp', 'critRate', 'critDamage',
  'dodgeRate', 'attackSpeed', 'hpRegen', 'expBonus', 'goldBonus', 'magicFind'
];

const QUALITY_DROP_WEIGHTS = {
  normal:    { mythic: 0.003, legendary: 0.01, epic: 0.04, rare: 0.14, uncommon: 0.39 },
  boss:      { mythic: 0.01,  legendary: 0.05, epic: 0.15, rare: 0.35, uncommon: 0.60 }
};

const inventory = { capacity: 60, items: [] };
const equipped = { slots: {} };
const materials = {};
let _playerJob = 'warrior';
let _playerLevel = 1;

function _rollExtraStatValue(stat, level) {
  if (PERCENT_STATS.has(stat)) {
    const ranges = {
      critRate: [0.005, 0.02], critDamage: [0.02, 0.08], dodgeRate: [0.005, 0.02],
      attackSpeed: [0.01, 0.05], expBonus: [0.01, 0.03], goldBonus: [0.01, 0.05],
      magicFind: [0.01, 0.05]
    };
    const [min, max] = ranges[stat];
    return +randomFloat(min, max).toFixed(4);
  }
  const scales = { attack: 0.5, defense: 0.4, maxHp: 3.0, hpRegen: 0.2 };
  const s = scales[stat] || 0.3;
  return randomInt(Math.max(1, Math.floor(level * s * 0.5)), Math.max(2, Math.floor(level * s * 1.5)));
}

function _rollQuality(isBoss, magicFind) {
  const mf = Math.min(magicFind || 0, 1);
  const t = isBoss ? QUALITY_DROP_WEIGHTS.boss : QUALITY_DROP_WEIGHTS.normal;
  const roll = random();
  if (roll < t.mythic + mf * 0.005) return 'mythic';
  if (roll < t.legendary + mf * 0.02) return 'legendary';
  if (roll < t.epic + mf * 0.05) return 'epic';
  if (roll < t.rare + mf * 0.08) return 'rare';
  if (roll < t.uncommon + mf * 0.1) return 'uncommon';
  return 'normal';
}

function calcSellPrice(item) {
  const base = EQUIP_BASES[item.configId];
  const qMult = QUALITY_CONFIG[item.quality]?.multiplier || 1;
  return Math.floor(((base?.requiredLevel || 1) * 5 + 20) * qMult * (1 + item.enhanceLevel * 0.15));
}

function init(inventoryData, equipmentData, materialsData) {
  if (inventoryData) {
    inventory.capacity = inventoryData.capacity || 60;
    inventory.items = inventoryData.items || [];
  } else {
    inventory.capacity = 60;
    inventory.items = [];
  }
  equipped.slots = equipmentData?.slots || {};
  Object.keys(materials).forEach(k => delete materials[k]);
  if (materialsData) Object.assign(materials, materialsData);
}

function setPlayerJob(job) {
  _playerJob = job;
}

function setPlayerLevel(lv) {
  _playerLevel = lv || 1;
}

function getInventory() {
  return [...inventory.items];
}

function getEquipped() {
  return { slots: { ...equipped.slots } };
}

function _itemFingerprint(it) {
  const b = `${it.configId}|${it.quality}|${it.enhanceLevel||0}|${it.lucky||0}|${it.curse||0}`;
  const st = it.stats ? Object.keys(it.stats).sort().map(k => `${k}=${it.stats[k]}`).join(',') : '';
  const ex = it.extraStats?.length ? it.extraStats.map(e => `${e.stat}=${e.value}`).sort().join(',') : '';
  return `${b}|${st}|${ex}`;
}

function _countUniqueStacks() {
  const seen = new Set();
  for (const it of inventory.items) seen.add(_itemFingerprint(it));
  return seen.size;
}

function addToInventory(item) {
  const fp = _itemFingerprint(item);
  const hasStack = inventory.items.some(it => _itemFingerprint(it) === fp);
  if (!hasStack && _countUniqueStacks() >= inventory.capacity) return false;
  inventory.items.push(item);
  EventBus.emit(EVENTS.INVENTORY_CHANGED, { type: 'add', item });
  return true;
}

function removeFromInventory(instanceId) {
  const idx = inventory.items.findIndex(i => i.instanceId === instanceId);
  if (idx === -1) return null;
  const [item] = inventory.items.splice(idx, 1);
  EventBus.emit(EVENTS.INVENTORY_CHANGED, { type: 'remove', item });
  return item;
}

function _resolveSlot(item) {
  const slot = item.slot;
  if (RING_SLOTS.includes(slot)) {
    if (!equipped.slots[RING_SLOTS[0]]) return RING_SLOTS[0];
    if (!equipped.slots[RING_SLOTS[1]]) return RING_SLOTS[1];
    return RING_SLOTS[0];
  }
  if (BRACELET_SLOTS.includes(slot)) {
    if (!equipped.slots[BRACELET_SLOTS[0]]) return BRACELET_SLOTS[0];
    if (!equipped.slots[BRACELET_SLOTS[1]]) return BRACELET_SLOTS[1];
    return BRACELET_SLOTS[0];
  }
  return slot;
}

function equip(instanceId) {
  const itemIdx = inventory.items.findIndex(i => i.instanceId === instanceId);
  if (itemIdx === -1) return { success: false, reason: '物品不存在' };

  const item = inventory.items[itemIdx];
  const base = EQUIP_BASES[item.configId];
  if (base && base.job !== 'all' && base.job !== _playerJob) {
    return { success: false, reason: '职业不符' };
  }
  const reqLevel = item.level || base?.requiredLevel || 1;
  const EQUIP_LEVEL_TOLERANCE = 3;
  if (_playerLevel < reqLevel - EQUIP_LEVEL_TOLERANCE) {
    return { success: false, reason: `等级不足（需要Lv.${Math.max(1, reqLevel - EQUIP_LEVEL_TOLERANCE)}，当前Lv.${_playerLevel}）` };
  }

  const slot = _resolveSlot(item);
  const oldItem = equipped.slots[slot] || null;

  inventory.items.splice(itemIdx, 1);

  if (oldItem) {
    inventory.items.push(oldItem);
    EventBus.emit(EVENTS.INVENTORY_CHANGED, { type: 'swap', added: oldItem, removed: item });
  } else {
    EventBus.emit(EVENTS.INVENTORY_CHANGED, { type: 'remove', item });
  }

  equipped.slots[slot] = item;
  EventBus.emit(EVENTS.EQUIP_CHANGED, { slot, item, oldItem });
  EventBus.emit(EVENTS.STATS_CHANGED);
  return { success: true, oldItem };
}

function unequip(slot) {
  const item = equipped.slots[slot];
  if (!item) return { success: false, reason: '该位置没有装备' };
  const fp = _itemFingerprint(item);
  const hasStack = inventory.items.some(it => _itemFingerprint(it) === fp);
  if (!hasStack && _countUniqueStacks() >= inventory.capacity) return { success: false, reason: '背包已满' };

  delete equipped.slots[slot];
  inventory.items.push(item);
  EventBus.emit(EVENTS.INVENTORY_CHANGED, { type: 'add', item });
  EventBus.emit(EVENTS.EQUIP_CHANGED, { slot, item: null, oldItem: item });
  EventBus.emit(EVENTS.STATS_CHANGED);
  return { success: true, item };
}

function getEquipmentStats() {
  const total = {};

  for (const item of Object.values(equipped.slots)) {
    if (!item) continue;
    const eMult = 1 + item.enhanceLevel * ENHANCE_CONFIG.bonusPerLevel;
    for (const [stat, value] of Object.entries(item.stats)) {
      const adjusted = PERCENT_STATS.has(stat)
        ? +(value * eMult).toFixed(4)
        : Math.floor(value * eMult);
      total[stat] = (total[stat] || 0) + adjusted;
    }
    for (const { stat, value } of item.extraStats) {
      total[stat] = (total[stat] || 0) + value;
    }
  }

  const setData = getSetBonus();
  for (const [key, set] of Object.entries(setData)) {
    if (key === 'activeSets' || !set.bonuses) continue;
    for (const tier of set.bonuses) {
      for (const [stat, value] of Object.entries(tier.bonus)) {
        total[stat] = (total[stat] || 0) + value;
      }
    }
  }

  return total;
}

function getSetBonus() {
  const counts = {};
  for (const item of Object.values(equipped.slots)) {
    if (item?.setId) counts[item.setId] = (counts[item.setId] || 0) + 1;
  }

  const result = {};
  const activeSets = [];
  for (const [setId, count] of Object.entries(counts)) {
    const cfg = SET_CONFIG[setId];
    if (!cfg) continue;
    const bonuses = cfg.setBonuses.filter(b => count >= b.count);
    if (bonuses.length > 0) {
      result[setId] = { name: cfg.name, count, bonuses };
    }
    const bonusTexts = bonuses.map(b => {
      return Object.entries(b.bonus).map(([k, v]) => {
        const n = { attack: '攻击', magicAttack: '魔攻', defense: '防御', maxHp: '生命', maxMp: '魔法', magicDefense: '魔防', critRate: '暴击率', critDamage: '暴伤', expBonus: '经验', dodgeRate: '闪避' }[k] || k;
        return PERCENT_STATS.has(k) ? `${n}+${(v * 100).toFixed(1)}%` : `${n}+${v}`;
      }).join(' ');
    });
    activeSets.push({
      setName: cfg.name, count,
      total: cfg.pieces.length,
      bonuses: bonusTexts
    });
  }
  result.activeSets = activeSets;
  return result;
}

function enhance(instanceId) {
  let item = inventory.items.find(i => i.instanceId === instanceId);
  let inEquipped = false;
  if (!item) {
    for (const eq of Object.values(equipped.slots)) {
      if (eq?.instanceId === instanceId) { item = eq; inEquipped = true; break; }
    }
  }
  if (!item) return { success: false, reason: '装备不存在' };
  if (item.enhanceLevel >= ENHANCE_CONFIG.maxLevel) return { success: false, reason: '已达最高强化等级' };

  const cost = ENHANCE_CONFIG.goldCost(item.enhanceLevel);
  if (!EconomySystem.spendGold(cost)) return { success: false, reason: '金币不足', cost };

  const rate = ENHANCE_CONFIG.successRate[item.enhanceLevel];
  if (chance(rate)) {
    item.enhanceLevel++;
    EventBus.emit(EVENTS.EQUIP_ENHANCED, { item, success: true, level: item.enhanceLevel });
    if (inEquipped) EventBus.emit(EVENTS.STATS_CHANGED);
    return { success: true, enhanceLevel: item.enhanceLevel };
  }

  EventBus.emit(EVENTS.EQUIP_ENHANCED, { item, success: false, level: item.enhanceLevel });
  return { success: false, reason: '强化失败', enhanceLevel: item.enhanceLevel };
}

function _resolveBase(configId) {
  if (EQUIP_BASES[configId]) return EQUIP_BASES[configId];
  const stripped = configId.replace(/^equip_/, '');
  if (EQUIP_BASES[stripped]) return EQUIP_BASES[stripped];
  for (const key of Object.keys(EQUIP_BASES)) {
    if (key.endsWith(stripped) || stripped.endsWith(key)) return EQUIP_BASES[key];
  }
  return null;
}

function generateItem(configId, quality = 'normal', source = 'drop') {
  const base = _resolveBase(configId);
  if (!base) return null;

  const qc = QUALITY_CONFIG[quality] || QUALITY_CONFIG.normal;
  const stats = {};
  for (const [stat, val] of Object.entries(base.stats)) {
    stats[stat] = PERCENT_STATS.has(stat)
      ? +(val * qc.multiplier).toFixed(4)
      : Math.floor(val * qc.multiplier);
  }

  const extraStats = [];
  const existing = new Set(Object.keys(stats));
  const pool = EXTRA_STAT_POOL.filter(s => !existing.has(s));
  for (let i = 0; i < qc.extraStats && pool.length > 0; i++) {
    const idx = randomInt(0, pool.length - 1);
    const stat = pool.splice(idx, 1)[0];
    extraStats.push({ stat, value: _rollExtraStatValue(stat, base.requiredLevel) });
  }

  return {
    instanceId: uuid(),
    configId: base.configId || configId,
    name: base.name || configId,
    quality,
    level: base.requiredLevel,
    slot: base.slot,
    setId: base.setId || null,
    stats,
    extraStats,
    enhanceLevel: 0,
    lucky: base.lucky || 0,
    curse: 0,
    isLocked: false,
    obtainedAt: Date.now(),
    source
  };
}

function generateDrop(mapId, isBoss = false, magicFind = 0) {
  const mapLevel = parseInt(String(mapId).replace(/\D/g, ''), 10) || 1;

  const eligible = Object.keys(EQUIP_BASES).filter(id => {
    const b = EQUIP_BASES[id];
    return b.requiredLevel <= mapLevel + 5 && b.requiredLevel >= Math.max(1, mapLevel - 15);
  });
  if (eligible.length === 0) return null;

  const configId = eligible[randomInt(0, eligible.length - 1)];
  const quality = _rollQuality(isBoss, magicFind);
  return generateItem(configId, quality, isBoss ? 'boss' : 'drop');
}

function sellItem(instanceId) {
  const item = inventory.items.find(i => i.instanceId === instanceId);
  if (!item) return { success: false, reason: '物品不存在' };
  if (item.isLocked) return { success: false, reason: '装备已锁定' };

  const price = calcSellPrice(item);
  removeFromInventory(instanceId);
  EconomySystem.addGold(price, `sell_${item.name || item.configId}`);
  return { success: true, gold: price, goldGained: price };
}

function _findItem(instanceId) {
  for (const [slot, eq] of Object.entries(equipped.slots)) {
    if (eq?.instanceId === instanceId) return { item: eq, inEquipped: true, slot };
  }
  const item = inventory.items.find(i => i.instanceId === instanceId);
  return item ? { item, inEquipped: false } : null;
}

function useBlessingOil(instanceId, useSuper = false) {
  const found = _findItem(instanceId);
  if (!found) return { success: false, reason: '装备不存在' };
  const { item, inEquipped } = found;
  if (item.slot !== 'weapon') return { success: false, reason: '只能对武器使用祝福油' };
  if ((item.lucky || 0) >= LUCKY_CONFIG.weaponMaxLucky) return { success: false, reason: `幸运已达上限(${LUCKY_CONFIG.weaponMaxLucky})` };

  let rate, cost = 0, oilName;
  if (useSuper) {
    if ((materials.super_oil_item || 0) <= 0) return { success: false, reason: '没有超级祝福油' };
    rate = LUCKY_CONFIG.superBlessingOil.successRate;
    oilName = '超级祝福油';
    materials.super_oil_item--;
    if (materials.super_oil_item <= 0) delete materials.super_oil_item;
  } else {
    cost = LUCKY_CONFIG.blessingOil.buyPrice;
    if (!EconomySystem.spendGold(cost, 'blessing_oil')) return { success: false, reason: `金币不足(需${cost})`, cost };
    rate = LUCKY_CONFIG.blessingOil.successRate;
    oilName = '祝福油';
  }

  if (chance(rate)) {
    item.lucky = (item.lucky || 0) + 1;
    EventBus.emit(EVENTS.EQUIP_CHANGED, { action: 'blessing', item, lucky: item.lucky });
    if (inEquipped) EventBus.emit(EVENTS.STATS_CHANGED);
    return { success: true, lucky: item.lucky, cost, oil: oilName };
  }

  return { success: false, reason: '祝福失败', lucky: item.lucky || 0, cost, oil: oilName };
}

function upgradeNecklaceLucky(instanceId) {
  const found = _findItem(instanceId);
  if (!found) return { success: false, reason: '装备不存在' };
  const { item, inEquipped } = found;
  if (item.slot !== 'necklace') return { success: false, reason: '只能对项链进行幸运升级' };

  const curLucky = item.lucky || 0;
  if (curLucky >= LUCKY_CONFIG.necklaceMaxLucky) return { success: false, reason: `项链幸运已达上限(${LUCKY_CONFIG.necklaceMaxLucky})` };

  const cfg = LUCKY_CONFIG.necklaceUpgrade[curLucky];
  if (!cfg) return { success: false, reason: '配置错误' };

  for (const [matId, need] of Object.entries(cfg.materials)) {
    if ((materials[matId] || 0) < need) {
      const matName = MATERIAL_CONFIG[matId]?.name || matId;
      return { success: false, reason: `${matName}不足(需${need}，有${materials[matId] || 0})` };
    }
  }
  if (!EconomySystem.spendGold(cfg.gold, 'necklace_lucky')) {
    return { success: false, reason: `金币不足(需${cfg.gold})`, gold: cfg.gold };
  }

  for (const [matId, need] of Object.entries(cfg.materials)) {
    materials[matId] -= need;
    if (materials[matId] <= 0) delete materials[matId];
  }

  if (chance(cfg.rate)) {
    item.lucky = curLucky + 1;
    EventBus.emit(EVENTS.EQUIP_CHANGED, { action: 'necklace_lucky', item, lucky: item.lucky });
    if (inEquipped) EventBus.emit(EVENTS.STATS_CHANGED);
    return { success: true, lucky: item.lucky, gold: cfg.gold, desc: LUCKY_CONFIG.necklaceLuckyDesc[item.lucky] };
  }

  return { success: false, reason: '升级失败，材料已消耗', lucky: curLucky, gold: cfg.gold };
}

function getTotalLucky() {
  let weaponLucky = 0, necklaceLucky = 0, curse = 0;
  for (const item of Object.values(equipped.slots)) {
    if (!item) continue;
    if (item.slot === 'weapon') weaponLucky += (item.lucky || 0);
    else if (item.slot === 'necklace') necklaceLucky += (item.lucky || 0);
    curse += (item.curse || 0);
  }
  const total = weaponLucky + necklaceLucky;
  return { lucky: total, weaponLucky, necklaceLucky, curse, net: Math.max(0, total - curse) };
}

function getNecklaceLuckyBonus() {
  const neck = equipped.slots.necklace;
  if (!neck) return {};
  const lv = neck.lucky || 0;
  const bonus = {};
  for (let i = 0; i < lv; i++) {
    const cfg = LUCKY_CONFIG.necklaceUpgrade[i];
    if (cfg?.bonus) {
      for (const [k, v] of Object.entries(cfg.bonus)) {
        bonus[k] = (bonus[k] || 0) + v;
      }
    }
  }
  return bonus;
}

function addMaterial(matId, count = 1) {
  materials[matId] = (materials[matId] || 0) + count;
  EventBus.emit(EVENTS.INVENTORY_CHANGED, { type: 'material', matId, count: materials[matId] });
}

function getMaterials() {
  return { ...materials };
}

function getMaterialsData() {
  return { ...materials };
}

function getInventoryData() {
  return { capacity: inventory.capacity, items: inventory.items };
}

function getEquipmentData() {
  return { slots: equipped.slots };
}

export {
  init, setPlayerJob, setPlayerLevel,
  getInventory, getEquipped,
  addToInventory, removeFromInventory,
  equip, unequip,
  getEquipmentStats, getSetBonus,
  enhance, calcSellPrice,
  generateItem, generateDrop,
  sellItem, useBlessingOil, upgradeNecklaceLucky,
  getTotalLucky, getNecklaceLuckyBonus,
  addMaterial, getMaterials, getMaterialsData,
  getInventoryData, getEquipmentData
};

export default {
  init, setPlayerJob, setPlayerLevel,
  getInventory, getEquipped,
  addToInventory, removeFromInventory,
  equip, unequip,
  getEquipmentStats, getSetBonus,
  enhance, calcSellPrice,
  generateItem, generateDrop,
  sellItem, useBlessingOil, upgradeNecklaceLucky,
  getTotalLucky, getNecklaceLuckyBonus,
  addMaterial, getMaterials, getMaterialsData,
  getInventoryData, getEquipmentData
};

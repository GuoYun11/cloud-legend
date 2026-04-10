import EventBus, { EVENTS } from '../utils/EventBus.js';
import {
  ZODIAC_ANIMAL_CONFIG,
  ZODIAC_QUALITY_CONFIG,
  ZODIAC_SET_BONUS
} from '../config/ZodiacConfig.js';

const QUALITY_ORDER = ['none', 'low', 'mid', 'high', 'elite', 'immortal', 'legendary'];
const QUALITY_LEVEL_MAP = { low: 1, mid: 3, high: 5, elite: 8, immortal: 11, legendary: 15 };
const ANIMAL_CFG_MAP = new Map(ZODIAC_ANIMAL_CONFIG.map(c => [c.animalId, c]));

let zodiacProgress = null;

function createDefaultAnimals() {
  return ZODIAC_ANIMAL_CONFIG.map(cfg => ({
    animalId: cfg.animalId,
    animalName: cfg.name,
    quality: 'none',
    level: 0,
    isEquipped: false
  }));
}

function calcAnimalStat(animalId, quality, level) {
  if (level < 1 || quality === 'none') return 0;
  const cfg = ANIMAL_CFG_MAP.get(animalId);
  if (!cfg) return 0;
  return (cfg.baseValue[quality] || 0) + (cfg.growthPerLevel[quality] || 0) * (level - 1);
}

function countEquipped() {
  let n = 0;
  for (let i = 0; i < zodiacProgress.animals.length; i++) {
    const a = zodiacProgress.animals[i];
    if (a.level >= 1 && a.isEquipped) n++;
  }
  return n;
}

function recalcTotalStats() {
  const stats = {};
  const animals = zodiacProgress.animals;

  for (let i = 0; i < animals.length; i++) {
    const animal = animals[i];
    if (animal.level < 1 || !animal.isEquipped) continue;
    const cfg = ANIMAL_CFG_MAP.get(animal.animalId);
    if (!cfg) continue;
    const value = calcAnimalStat(animal.animalId, animal.quality, animal.level);
    stats[cfg.statType] = (stats[cfg.statType] || 0) + value;
  }

  const equippedCount = countEquipped();
  for (let i = 0; i < ZODIAC_SET_BONUS.length; i++) {
    const set = ZODIAC_SET_BONUS[i];
    if (equippedCount < set.count) break;
    const keys = Object.keys(set.bonus);
    for (let j = 0; j < keys.length; j++) {
      stats[keys[j]] = (stats[keys[j]] || 0) + set.bonus[keys[j]];
    }
  }

  zodiacProgress.totalStats = stats;
}

function checkSetBonusActivation(prevCount, newCount) {
  for (let i = 0; i < ZODIAC_SET_BONUS.length; i++) {
    const bonus = ZODIAC_SET_BONUS[i];
    if (prevCount < bonus.count && newCount >= bonus.count) {
      EventBus.emit(EVENTS.ZODIAC_SET_BONUS, { ...bonus });
    }
  }
}

// ── 公共接口 ──

export function init(savedData) {
  if (savedData?.animals) {
    zodiacProgress = {
      animals: savedData.animals.map(a => ({
        animalId: a.animalId,
        animalName: a.animalName,
        quality: a.quality || 'none',
        level: a.level || 0,
        isEquipped: a.isEquipped || false
      })),
      totalStats: {}
    };
  } else {
    zodiacProgress = {
      animals: createDefaultAnimals(),
      totalStats: {}
    };
  }
  recalcTotalStats();
}

export function getProgress() {
  return zodiacProgress;
}

export function getAnimal(animalId) {
  if (!zodiacProgress) return null;
  return zodiacProgress.animals.find(a => a.animalId === animalId) || null;
}

export function addZodiac(animalId, quality) {
  const animal = getAnimal(animalId);
  if (!animal) return { success: false, reason: '生肖不存在' };

  const oldIdx = QUALITY_ORDER.indexOf(animal.quality);
  const newIdx = QUALITY_ORDER.indexOf(quality);
  if (newIdx <= 0) return { success: false, reason: '无效品质' };
  if (newIdx <= oldIdx) return { success: false, reason: 'already_have_better', currentQuality: animal.quality };

  const prevCount = countEquipped();
  const oldQuality = animal.quality;
  animal.quality = quality;
  animal.level = QUALITY_LEVEL_MAP[quality] || 1;
  if (!animal.isEquipped) animal.isEquipped = true;

  recalcTotalStats();
  checkSetBonusActivation(prevCount, countEquipped());

  const qCfg = ZODIAC_QUALITY_CONFIG[quality];
  EventBus.emit(EVENTS.ZODIAC_UPGRADED, {
    animalId, animal: { ...animal }, oldQuality, newQuality: quality,
    qualityName: qCfg?.name || quality
  });
  EventBus.emit(EVENTS.STATS_CHANGED);
  return { success: true, quality, level: animal.level, oldQuality };
}

export function replaceQuality(animalId, newQuality) {
  return addZodiac(animalId, newQuality);
}

export function getTotalStats() {
  return { ...zodiacProgress.totalStats };
}

export function getZodiacBonusStats() {
  return getTotalStats();
}

export function getSetBonusStatus() {
  const equippedCount = countEquipped();
  const activeBonuses = ZODIAC_SET_BONUS.filter(b => equippedCount >= b.count);
  const nextBonus = ZODIAC_SET_BONUS.find(b => equippedCount < b.count) || null;
  const missingAnimals = zodiacProgress.animals
    .filter(a => a.level < 1 || !a.isEquipped)
    .map(a => ({ animalId: a.animalId, animalName: a.animalName }));

  return { equippedCount, activeBonuses, nextBonus, missingAnimals };
}

export function getData() {
  if (!zodiacProgress) return null;
  return {
    animals: zodiacProgress.animals.map(a => ({ ...a })),
    totalStats: { ...zodiacProgress.totalStats }
  };
}

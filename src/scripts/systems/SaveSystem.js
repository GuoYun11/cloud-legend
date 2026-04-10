import EventBus, { EVENTS } from '../utils/EventBus.js';

const STORAGE_KEYS = {
  PLAYER_DATA: 'yctl_player',
  INVENTORY: 'yctl_inventory',
  EQUIPMENT: 'yctl_equipment',
  MAP_PROGRESS: 'yctl_map',
  ZODIAC: 'yctl_zodiac',
  WALLET: 'yctl_wallet',
  POTIONS: 'yctl_potions',
  MATERIALS: 'yctl_materials',
  SKILLS: 'yctl_skills',
  COMBAT_STATE: 'yctl_combat',
  SETTINGS: 'yctl_settings',
  LAST_SAVE: 'yctl_last_save'
};

const DEFAULT_SETTINGS = {
  bgmVolume: 0.6,
  sfxVolume: 0.8,
  combatLogVisible: true,
  floatDamageVisible: true,
  autoSellQuality: 'none'
};

let _autoSaveTimer = null;

function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveAll(gameState) {
  const { player, inventory, equipment, mapProgress, zodiac, wallet, potions, materials, skills } = gameState;
  if (player) save(STORAGE_KEYS.PLAYER_DATA, player);
  if (inventory) save(STORAGE_KEYS.INVENTORY, inventory);
  if (equipment) save(STORAGE_KEYS.EQUIPMENT, equipment);
  if (mapProgress) save(STORAGE_KEYS.MAP_PROGRESS, mapProgress);
  if (zodiac) save(STORAGE_KEYS.ZODIAC, zodiac);
  if (wallet) save(STORAGE_KEYS.WALLET, wallet);
  if (potions) save(STORAGE_KEYS.POTIONS, potions);
  if (materials) save(STORAGE_KEYS.MATERIALS, materials);
  if (skills) save(STORAGE_KEYS.SKILLS, skills);
  save(STORAGE_KEYS.LAST_SAVE, Date.now());
  EventBus.emit(EVENTS.GAME_SAVED, { time: Date.now() });
}

function loadAll() {
  const lastSave = load(STORAGE_KEYS.LAST_SAVE);
  if (!lastSave) return null;
  return {
    player: load(STORAGE_KEYS.PLAYER_DATA),
    inventory: load(STORAGE_KEYS.INVENTORY),
    equipment: load(STORAGE_KEYS.EQUIPMENT),
    mapProgress: load(STORAGE_KEYS.MAP_PROGRESS),
    zodiac: load(STORAGE_KEYS.ZODIAC),
    wallet: load(STORAGE_KEYS.WALLET),
    potions: load(STORAGE_KEYS.POTIONS),
    materials: load(STORAGE_KEYS.MATERIALS),
    skills: load(STORAGE_KEYS.SKILLS),
    lastSave
  };
}

function startAutoSave(getStateFn, interval = 30000) {
  stopAutoSave();
  _autoSaveTimer = setInterval(() => {
    const state = typeof getStateFn === 'function' ? getStateFn() : getStateFn;
    saveAll(state);
  }, interval);
}

function stopAutoSave() {
  if (_autoSaveTimer) {
    clearInterval(_autoSaveTimer);
    _autoSaveTimer = null;
  }
}

function saveCombatState(state) {
  save(STORAGE_KEYS.COMBAT_STATE, state);
}

function loadCombatState() {
  return load(STORAGE_KEYS.COMBAT_STATE);
}

function loadSettings() {
  const saved = load(STORAGE_KEYS.SETTINGS);
  return saved ? { ...DEFAULT_SETTINGS, ...saved } : { ...DEFAULT_SETTINGS };
}

function saveSettings(settings) {
  save(STORAGE_KEYS.SETTINGS, settings);
}

function clearAll() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}

function exportSave() {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const val = localStorage.getItem(key);
    if (val !== null) data[name] = val;
  });
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

function importSave(str) {
  try {
    const data = JSON.parse(decodeURIComponent(atob(str)));
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      if (data[name] !== undefined) {
        localStorage.setItem(key, data[name]);
      }
    });
    return true;
  } catch {
    return false;
  }
}

function updateOfflineRewardTime(time) {
  save(STORAGE_KEYS.LAST_SAVE, time);
}

export {
  STORAGE_KEYS,
  save,
  load,
  saveAll,
  loadAll,
  startAutoSave,
  stopAutoSave,
  saveCombatState,
  loadCombatState,
  loadSettings,
  saveSettings,
  clearAll,
  exportSave,
  importSave,
  updateOfflineRewardTime
};

export default {
  STORAGE_KEYS,
  save,
  load,
  saveAll,
  loadAll,
  startAutoSave,
  stopAutoSave,
  saveCombatState,
  loadCombatState,
  loadSettings,
  saveSettings,
  clearAll,
  exportSave,
  importSave,
  updateOfflineRewardTime
};

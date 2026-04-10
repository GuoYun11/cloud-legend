import EventBus, { EVENTS } from '../utils/EventBus.js';
import { POTION_TYPES, AUTO_POTION_DEFAULTS } from '../config/PotionConfig.js';

let _inventory = {};
let _autoSettings = { ...AUTO_POTION_DEFAULTS };
let _playerRef = null;
let _economyRef = null;

const POTION_CD_MS = 2000;
let _hpCdUntil = 0;
let _mpCdUntil = 0;

function init(savedData, playerRef, economyRef) {
  _playerRef = playerRef;
  _economyRef = economyRef;
  _hpCdUntil = 0;
  _mpCdUntil = 0;
  if (savedData) {
    _inventory = savedData.inventory || {};
    _autoSettings = { ...AUTO_POTION_DEFAULTS, ...(savedData.autoSettings || {}) };
  } else {
    _inventory = {};
    _autoSettings = { ...AUTO_POTION_DEFAULTS };
  }
}

function setRefs(playerRef, economyRef) {
  _playerRef = playerRef;
  _economyRef = economyRef;
}

function buyPotion(potionId, count = 1) {
  const cfg = POTION_TYPES[potionId];
  if (!cfg) return { success: false, reason: '药品不存在' };

  const playerLevel = _playerRef?.getLevel?.() || 1;
  if (playerLevel < cfg.unlockLevel) return { success: false, reason: `需要 ${cfg.unlockLevel} 级解锁` };

  const totalCost = cfg.buyPrice * count;
  if (!_economyRef?.spendGold?.(totalCost, `buy_${cfg.name}`)) {
    return { success: false, reason: '金币不足', cost: totalCost };
  }

  _inventory[potionId] = (_inventory[potionId] || 0) + count;
  EventBus.emit(EVENTS.POTION_CHANGED, { potionId, count: _inventory[potionId], action: 'buy' });
  return { success: true, count: _inventory[potionId], cost: totalCost };
}

function addPotion(potionId, count = 1) {
  if (!POTION_TYPES[potionId] || count <= 0) return false;
  _inventory[potionId] = (_inventory[potionId] || 0) + count;
  EventBus.emit(EVENTS.POTION_CHANGED, { potionId, count: _inventory[potionId], action: 'drop' });
  return true;
}

function usePotion(potionId, silent) {
  const cfg = POTION_TYPES[potionId];
  if (!cfg) return { success: false, reason: '药品不存在' };
  if ((_inventory[potionId] || 0) <= 0) return { success: false, reason: '数量不足' };

  const now = Date.now();
  if (cfg.type === 'hp' && now < _hpCdUntil) {
    const remain = ((_hpCdUntil - now) / 1000).toFixed(1);
    return { success: false, reason: `药剂冷却中(${remain}s)`, cooldown: true };
  }
  if (cfg.type === 'mp' && now < _mpCdUntil) {
    const remain = ((_mpCdUntil - now) / 1000).toFixed(1);
    return { success: false, reason: `药剂冷却中(${remain}s)`, cooldown: true };
  }

  const stats = _playerRef?.getStats?.();
  if (!stats) return { success: false, reason: '角色数据异常' };

  let healed = 0;
  if (cfg.type === 'hp') {
    const missing = (stats.maxHp || 100) - (stats.currentHp || 0);
    if (missing <= 0) return { success: false, reason: '生命值已满' };
    healed = Math.min(cfg.value, missing);
    const newHp = (stats.currentHp || 0) + healed;
    _playerRef.setHp?.(newHp);
    EventBus.emit(EVENTS.PLAYER_HP_CHANGED, { currentHp: newHp, maxHp: stats.maxHp, heal: healed });
    _hpCdUntil = now + POTION_CD_MS;
  } else if (cfg.type === 'mp') {
    const missing = (stats.maxMp || 50) - (stats.currentMp || 0);
    if (missing <= 0) return { success: false, reason: '魔法值已满' };
    healed = Math.min(cfg.value, missing);
    const newMp = (stats.currentMp || 0) + healed;
    _playerRef.setMp?.(newMp);
    _mpCdUntil = now + POTION_CD_MS;
  }

  _inventory[potionId]--;
  if (_inventory[potionId] <= 0) delete _inventory[potionId];
  EventBus.emit(EVENTS.POTION_CHANGED, { potionId, count: _inventory[potionId] || 0, action: 'use', healed });
  return { success: true, healed, remaining: _inventory[potionId] || 0 };
}

function tryAutoPotion() {
  const stats = _playerRef?.getStats?.();
  if (!stats) return;

  if (_autoSettings.hpEnabled && _autoSettings.hpPotionId) {
    const hpRatio = (stats.currentHp || 0) / (stats.maxHp || 1);
    if (hpRatio < _autoSettings.hpThreshold && (_inventory[_autoSettings.hpPotionId] || 0) > 0) {
      usePotion(_autoSettings.hpPotionId);
    }
  }

  if (_autoSettings.mpEnabled && _autoSettings.mpPotionId) {
    const mpRatio = (stats.currentMp || 0) / (stats.maxMp || 1);
    if (mpRatio < _autoSettings.mpThreshold && (_inventory[_autoSettings.mpPotionId] || 0) > 0) {
      usePotion(_autoSettings.mpPotionId);
    }
  }
}

function setAutoSettings(settings) {
  Object.assign(_autoSettings, settings);
  EventBus.emit(EVENTS.POTION_CHANGED, { action: 'settings_changed' });
}

function getAutoSettings() {
  return { ..._autoSettings };
}

function getInventory() {
  return { ..._inventory };
}

function getCount(potionId) {
  return _inventory[potionId] || 0;
}

function getData() {
  return {
    inventory: { ..._inventory },
    autoSettings: { ..._autoSettings }
  };
}

export {
  init, setRefs,
  buyPotion, addPotion, usePotion, tryAutoPotion,
  setAutoSettings, getAutoSettings,
  getInventory, getCount, getData
};

export default {
  init, setRefs,
  buyPotion, addPotion, usePotion, tryAutoPotion,
  setAutoSettings, getAutoSettings,
  getInventory, getCount, getData
};

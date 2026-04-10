import EventBus, { EVENTS } from '../utils/EventBus.js';
import { MAP_CONFIG, MAP_ORDER } from '../config/MapConfig.js';
import { MONSTER_CONFIG } from '../config/MonsterConfig.js';

let _progress = {
  unlockedMaps: ['map_biqi'],
  currentMapId: 'map_biqi',
  bossKillRecords: {}
};

function init(savedData) {
  if (savedData) {
    _progress.unlockedMaps = savedData.unlockedMaps || ['map_biqi'];
    _progress.currentMapId = savedData.currentMapId || 'map_biqi';
    _progress.bossKillRecords = savedData.bossKillRecords || {};
  } else {
    _progress = {
      unlockedMaps: ['map_biqi'],
      currentMapId: 'map_biqi',
      bossKillRecords: {}
    };
  }
}

function getProgress() {
  return { ..._progress };
}

function isUnlocked(mapId) {
  return _progress.unlockedMaps.includes(mapId);
}

function switchMap(mapId) {
  if (!MAP_CONFIG[mapId]) return false;
  if (!isUnlocked(mapId)) return false;
  const prevMapId = _progress.currentMapId;
  _progress.currentMapId = mapId;
  EventBus.emit(EVENTS.MAP_SWITCHED, { prevMapId, newMapId: mapId, mapConfig: MAP_CONFIG[mapId] });
  return true;
}

function checkAndUnlock(playerLevel, bossKillRecords) {
  const newlyUnlocked = [];
  for (let i = 0; i < MAP_ORDER.length; i++) {
    const mapId = MAP_ORDER[i];
    if (isUnlocked(mapId)) continue;
    const cfg = MAP_CONFIG[mapId];
    if (!cfg.unlockCondition) continue;

    let met = false;
    const cond = cfg.unlockCondition;
    if (cond.type === 'level') {
      met = playerLevel >= cond.value;
    } else if (cond.type === 'boss_kill') {
      const bossId = cond.value || cond.bossId;
      met = !!(_progress.bossKillRecords[bossId]);
    }

    if (met) {
      _progress.unlockedMaps.push(mapId);
      newlyUnlocked.push(mapId);
      EventBus.emit(EVENTS.MAP_UNLOCKED, { mapId, mapConfig: cfg });
    }
  }
  return newlyUnlocked;
}

function recordBossKill(bossId) {
  const now = Date.now();
  const cfg = MONSTER_CONFIG[bossId];
  if (!cfg || !cfg.isBoss) return;

  const isFirstKill = !_progress.bossKillRecords[bossId];
  const respawnMs = (cfg.respawnMinutes || 30) * 60 * 1000;

  _progress.bossKillRecords[bossId] = {
    lastKillTime: now,
    nextRespawnTime: now + respawnMs,
    killCount: (_progress.bossKillRecords[bossId]?.killCount || 0) + 1,
    firstKill: isFirstKill ? false : (_progress.bossKillRecords[bossId]?.firstKill ?? true)
  };

  if (isFirstKill) {
    _progress.bossKillRecords[bossId].firstKill = true;
  }

  return isFirstKill;
}

function getBossRespawnTime(bossId) {
  const record = _progress.bossKillRecords[bossId];
  if (!record || !record.nextRespawnTime) return 0;
  const remaining = record.nextRespawnTime - Date.now();
  return Math.max(0, Math.ceil(remaining / 1000));
}

function getAvailableBosses(mapId) {
  const cfg = MAP_CONFIG[mapId];
  if (!cfg || !cfg.bosses) return [];
  const now = Date.now();
  return cfg.bosses.filter(bossId => {
    const record = _progress.bossKillRecords[bossId];
    if (!record) return true;
    return now >= record.nextRespawnTime;
  });
}

function getCurrentMap() {
  return MAP_CONFIG[_progress.currentMapId] || null;
}

function getData() {
  return {
    unlockedMaps: [..._progress.unlockedMaps],
    currentMapId: _progress.currentMapId,
    bossKillRecords: JSON.parse(JSON.stringify(_progress.bossKillRecords))
  };
}

export default { init, getProgress, isUnlocked, switchMap, checkAndUnlock, recordBossKill, getBossRespawnTime, getAvailableBosses, getCurrentMap, getData };
export { init, getProgress, isUnlocked, switchMap, checkAndUnlock, recordBossKill, getBossRespawnTime, getAvailableBosses, getCurrentMap, getData };

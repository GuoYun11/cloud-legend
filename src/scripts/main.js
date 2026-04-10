import EventBus, { EVENTS } from './utils/EventBus.js';
import { formatNumber, formatTime, getJobName, getQualityName, getQualityColor } from './utils/Formatter.js';
import { getExpToLevel } from './config/PlayerConfig.js';
import { MAP_CONFIG } from './config/MapConfig.js';

import * as SaveSystem from './systems/SaveSystem.js';
import * as PlayerSystem from './systems/PlayerSystem.js';
import * as EconomySystem from './systems/EconomySystem.js';
import * as EquipmentSystem from './systems/EquipmentSystem.js';
import * as MapSystem from './systems/MapSystem.js';
import * as CombatSystem from './systems/CombatSystem.js';
import * as OfflineCombatSystem from './systems/OfflineCombatSystem.js';
import * as ZodiacSystem from './systems/ZodiacSystem.js';
import * as PotionSystem from './systems/PotionSystem.js';
import * as SkillSystem from './systems/SkillSystem.js';
import { POTION_TYPES } from './config/PotionConfig.js';
import { LUCKY_CONFIG, MATERIAL_CONFIG, ENHANCE_CONFIG, EQUIP_BASES } from './config/EquipmentConfig.js';
import { SKILL_UPGRADE_COSTS } from './config/SkillConfig.js';
import { ZODIAC_ANIMAL_CONFIG, ZODIAC_QUALITY_CONFIG } from './config/ZodiacConfig.js';

const gameState = {};
let uiUpdateTimer = null;

function buildPlayerRef() {
  return {
    getId: () => PlayerSystem.getPlayer()?.id ?? 'player',
    getLevel: () => PlayerSystem.getPlayer()?.level ?? 1,
    getStats: () => {
      const p = PlayerSystem.getPlayer();
      const f = PlayerSystem.getFinalStats();
      if (!p || !f) return { attack: 10, defense: 5, maxHp: 100, currentHp: 100, maxMp: 50, currentMp: 50, critRate: 0.05, critDamage: 1.5, dodgeRate: 0.03, attackSpeed: 1, hpRegen: 2, expBonus: 0, goldBonus: 0, magicFind: 0, damageReduction: 0, lucky: 0 };
      const luckyInfo = EquipmentSystem.getTotalLucky ? EquipmentSystem.getTotalLucky() : { net: 0, weaponLucky: 0, necklaceLucky: 0 };
      const neckBonus = EquipmentSystem.getNecklaceLuckyBonus ? EquipmentSystem.getNecklaceLuckyBonus() : {};
      const merged = { ...f, currentHp: p.currentHp, currentMp: p.currentMp, magicAttack: f.magicAttack || 0, lucky: luckyInfo.net };
      if (neckBonus.critDamage) merged.critDamage = (merged.critDamage || 1.5) + neckBonus.critDamage;
      if (neckBonus.critRate) merged.critRate = (merged.critRate || 0) + neckBonus.critRate;
      return merged;
    },
    addExp: (amount) => PlayerSystem.addExp(amount),
    addGold: (amount) => EconomySystem.addGold(amount, 'combat'),
    setHp: (hp) => {
      const p = PlayerSystem.getPlayer();
      if (p) p.currentHp = Math.max(0, Math.min(hp, PlayerSystem.getFinalStats()?.maxHp || 9999));
    },
    setMp: (mp) => {
      const p = PlayerSystem.getPlayer();
      if (p) p.currentMp = Math.max(0, Math.min(mp, PlayerSystem.getFinalStats()?.maxMp || 9999));
    },
    addItem: (item) => {
      if (item && item.configId) {
        const generated = EquipmentSystem.generateItem
          ? EquipmentSystem.generateItem(item.configId, item.quality || 'normal', 'monster')
          : item;
        EquipmentSystem.addToInventory(generated);
      }
    }
  };
}

function getGameStateForSave() {
  return {
    player: PlayerSystem.getData(),
    inventory: EquipmentSystem.getInventoryData ? EquipmentSystem.getInventoryData() : EquipmentSystem.getInventory?.(),
    equipment: EquipmentSystem.getEquipmentData ? EquipmentSystem.getEquipmentData() : EquipmentSystem.getEquipped?.(),
    mapProgress: MapSystem.getData ? MapSystem.getData() : MapSystem.getProgress?.(),
    zodiac: ZodiacSystem.getData ? ZodiacSystem.getData() : ZodiacSystem.getProgress?.(),
    wallet: EconomySystem.getData ? EconomySystem.getData() : EconomySystem.getWallet?.(),
    potions: PotionSystem.getData(),
    materials: EquipmentSystem.getMaterialsData ? EquipmentSystem.getMaterialsData() : {},
    skills: SkillSystem.getData()
  };
}

function initNewGame(name, job) {
  gameState.equipSystem = EquipmentSystem;
  gameState.zodiacSystem = ZodiacSystem;

  PlayerSystem.init(null, gameState);
  PlayerSystem.createPlayer(name, job);
  EconomySystem.init(null);
  EconomySystem.addGold(1000, 'combat');
  EquipmentSystem.init(null, null, null);
  if (EquipmentSystem.setPlayerJob) EquipmentSystem.setPlayerJob(job);
  if (EquipmentSystem.setPlayerLevel) EquipmentSystem.setPlayerLevel(1);
  MapSystem.init(null);
  ZodiacSystem.init(null);

  const playerRef = buildPlayerRef();
  PotionSystem.init(null, playerRef, EconomySystem);
  PotionSystem.buyPotion('hp_small', 20);
  PotionSystem.buyPotion('mp_small', 10);

  SkillSystem.init(null, job, 1, {
    playerRef,
    economyRef: EconomySystem,
    materialRef: EquipmentSystem
  });

  CombatSystem.init(playerRef, { addMaterial: EquipmentSystem.addMaterial, skillSystemReady: true });
  CombatSystem.startCombat('map_biqi');

  SaveSystem.saveCombatState({ mapId: 'map_biqi' });
  SaveSystem.saveAll(getGameStateForSave());
  SaveSystem.startAutoSave(getGameStateForSave, 30000);
}

function restoreGame(saveData) {
  gameState.equipSystem = EquipmentSystem;
  gameState.zodiacSystem = ZodiacSystem;

  PlayerSystem.init(saveData.player, gameState);
  EconomySystem.init(saveData.wallet);
  EquipmentSystem.init(saveData.inventory, saveData.equipment, saveData.materials || null);
  if (EquipmentSystem.setPlayerJob) EquipmentSystem.setPlayerJob(saveData.player?.job);
  if (EquipmentSystem.setPlayerLevel) EquipmentSystem.setPlayerLevel(saveData.player?.level || 1);
  MapSystem.init(saveData.mapProgress);
  ZodiacSystem.init(saveData.zodiac);

  const playerRef = buildPlayerRef();
  PotionSystem.init(saveData.potions || null, playerRef, EconomySystem);

  SkillSystem.init(saveData.skills || null, saveData.player?.job, saveData.player?.level || 1, {
    playerRef,
    economyRef: EconomySystem,
    materialRef: EquipmentSystem
  });

  CombatSystem.init(playerRef, { addMaterial: EquipmentSystem.addMaterial, skillSystemReady: true });

  const combatState = SaveSystem.loadCombatState();
  const mapId = combatState?.mapId ?? MapSystem.getProgress?.()?.currentMapId ?? 'map_biqi';
  CombatSystem.startCombat(mapId);

  const lastSave = saveData.lastSave || Date.now();
  const p = PlayerSystem.getPlayer();
  if (p) {
    const offlineMs = Date.now() - (p.lastOfflineRewardAt || lastSave);
    const offlineMin = offlineMs / 60000;
    if (offlineMin >= 1) {
      const _offStats = { ...PlayerSystem.getFinalStats(), level: p.level || 1 };
      const rawResult = OfflineCombatSystem.settleOfflineRewards
        ? OfflineCombatSystem.settleOfflineRewards(p.lastOfflineRewardAt || lastSave, mapId, _offStats)
        : calcOfflineReward(offlineMin, mapId);
      const result = _applyOfflineDrops(rawResult);
      if (result && result.exp > 0) {
        PlayerSystem.addExp(result.exp);
        EconomySystem.addGold(result.gold || 0, 'offline_reward');
        p.lastOfflineRewardAt = Date.now();
        showOfflineReward(result);
        if (result.overflowItemCount > 0) {
          showToast(`背包已满，离线掉落遗失 ${result.overflowItemCount} 件装备`, 'warning');
        }
      }
    }
  }

  SaveSystem.startAutoSave(getGameStateForSave, 30000);
}

function calcOfflineReward(offlineMin, mapId) {
  const map = MAP_CONFIG[mapId];
  if (!map) return { exp: 0, gold: 0, items: [], drops: [], minutes: 0, offlineMinutes: 0 };
  const minutes = Math.min(offlineMin, 480);
  const stats = PlayerSystem.getFinalStats() || {};
  const exp = Math.floor(map.expPerMinute * minutes * 0.30 * (1 + (stats.expBonus || 0)));
  const gold = Math.floor(map.goldPerMinute * minutes * 0.30 * (1 + (stats.goldBonus || 0)));
  return {
    exp,
    gold,
    items: [],
    drops: [],
    minutes: Math.floor(minutes),
    offlineMinutes: Math.floor(minutes)
  };
}

function _normalizeOfflineReward(data) {
  if (!data) return null;
  const minutes = Number.isFinite(data.minutes)
    ? data.minutes
    : (Number.isFinite(data.offlineMinutes) ? data.offlineMinutes : 0);
  const items = Array.isArray(data.items)
    ? data.items
    : (Array.isArray(data.drops) ? data.drops : []);
  return {
    ...data,
    minutes,
    offlineMinutes: minutes,
    items,
    drops: items
  };
}

function _applyOfflineDrops(data) {
  const reward = _normalizeOfflineReward(data);
  if (!reward) return null;

  let receivedItemCount = 0;
  let overflowItemCount = 0;
  const receivedItems = [];

  for (const item of reward.items) {
    if (!item?.configId) continue;
    const generated = EquipmentSystem.generateItem
      ? EquipmentSystem.generateItem(item.configId, item.quality || 'normal', 'offline_reward')
      : item;
    if (!generated) continue;
    if (EquipmentSystem.addToInventory(generated)) {
      receivedItemCount++;
      receivedItems.push(generated);
    } else {
      overflowItemCount++;
    }
  }

  return {
    ...reward,
    items: receivedItems,
    drops: receivedItems,
    receivedItemCount,
    overflowItemCount
  };
}

function showOfflineReward(data) {
  const reward = _normalizeOfflineReward(data);
  const modal = document.getElementById('offline-modal');
  if (!modal || !reward || reward.exp <= 0) return;
  modal.querySelector('.offline-time').textContent = formatTime((reward.minutes || 0) * 60);
  modal.querySelector('.offline-exp').textContent = formatNumber(reward.exp);
  modal.querySelector('.offline-gold').textContent = formatNumber(reward.gold || 0);
  const itemCount = reward.receivedItemCount ?? reward.items?.length ?? 0;
  modal.querySelector('.offline-items').textContent = reward.overflowItemCount > 0
    ? `${itemCount}件（满包遗失${reward.overflowItemCount}件）`
    : `${itemCount}件`;
  modal.style.display = 'flex';
}

function switchMap(mapId) {
  CombatSystem.stopCombat();
  const result = MapSystem.switchMap(mapId);
  if (result === false || (result && result.success === false)) return false;
  const playerRef = buildPlayerRef();
  CombatSystem.init(playerRef);
  CombatSystem.startCombat(mapId);
  SaveSystem.saveCombatState({ mapId });
  return true;
}

function challengeBoss(bossId) {
  return CombatSystem.challengeBoss(bossId);
}

function updateHeaderUI() {
  const p = PlayerSystem.getPlayer();
  const f = PlayerSystem.getFinalStats();
  if (!p || !f) return;

  const nameEl = document.getElementById('player-name');
  const levelEl = document.getElementById('player-level');
  const goldEl = document.getElementById('player-gold');
  if (nameEl) nameEl.textContent = p.name;
  if (levelEl) levelEl.textContent = `Lv.${p.level} ${getJobName(p.job)}`;
  if (goldEl) goldEl.textContent = `💰 ${formatNumber(EconomySystem.getGold())}`;

  updateBar('hp', p.currentHp, f.maxHp);
  updateBar('mp', p.currentMp, f.maxMp);

  const expNeeded = getExpToLevel(p.level + 1);
  if (expNeeded > 0) {
    updateBar('exp', p.exp, expNeeded);
  } else {
    updateBar('exp', 1, 1);
  }
}

function updateBar(type, current, max) {
  const fill = document.getElementById(type + '-fill');
  const text = document.getElementById(type + '-text');
  if (!fill || !text) return;
  const pct = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;
  fill.style.width = pct + '%';
  text.textContent = `${formatNumber(Math.floor(current))}/${formatNumber(Math.floor(max))}`;
}

function updateCombatUI() {
  const state = CombatSystem.getState();
  if (!state) return;

  const mapCfg = MAP_CONFIG[state.mapId];
  const mapNameEl = document.getElementById('combat-map-name');
  if (mapNameEl && mapCfg) mapNameEl.textContent = mapCfg.name;

  const monster = state.currentMonster;
  const monsterNameEl = document.getElementById('monster-name');
  const monsterLevelEl = document.getElementById('monster-level');
  const monsterHpFill = document.getElementById('monster-hp-fill');
  const monsterHpText = document.getElementById('monster-hp-text');

  if (monster) {
    if (monsterNameEl) monsterNameEl.textContent = (monster.isBoss ? '🔥 ' : '') + monster.name;
    if (monsterLevelEl) monsterLevelEl.textContent = 'Lv.' + monster.level;
    if (monsterHpFill) {
      const pct = monster.maxHp > 0 ? (monster.currentHp / monster.maxHp * 100) : 0;
      monsterHpFill.style.width = Math.max(0, pct) + '%';
    }
    if (monsterHpText) monsterHpText.textContent = `${formatNumber(Math.max(0, monster.currentHp))}/${formatNumber(monster.maxHp)}`;
  }

  const kills = document.getElementById('session-kills');
  const exp = document.getElementById('session-exp');
  const gold = document.getElementById('session-gold');
  const drops = document.getElementById('session-drops');
  if (state.sessionStats) {
    if (kills) kills.textContent = formatNumber(state.sessionStats.kills);
    if (exp) exp.textContent = formatNumber(state.sessionStats.expGained);
    if (gold) gold.textContent = formatNumber(state.sessionStats.goldGained);
    if (drops) drops.textContent = state.sessionStats.itemsDropped;
  }

  const deathModal = document.getElementById('death-modal');
  const weakStatus = document.getElementById('weak-status');

  if (deathModal) {
    if (state.isDead) {
      deathModal.style.display = 'flex';
      const remaining = Math.max(0, Math.ceil((state.reviveAt - Date.now()) / 1000));
      const countdownEl = document.getElementById('death-countdown-text');
      if (countdownEl) countdownEl.textContent = remaining > 0 ? `${remaining}秒后可自动复活` : '可以复活了';

      const reviveBtn = document.getElementById('death-revive-btn');
      const townBtn = document.getElementById('death-town-btn');
      const autoCheck = document.getElementById('death-auto-check');

      if (reviveBtn && !reviveBtn._bound) {
        reviveBtn._bound = true;
        const level = PlayerSystem.getPlayer()?.level || 1;
        const cost = level * 20;
        reviveBtn.textContent = `⚡ 立即复活·50%HP (${formatNumber(cost)}💰)`;
        reviveBtn.addEventListener('click', () => {
          const gold = EconomySystem.getGold?.() || 0;
          if (gold >= cost) {
            EconomySystem.spendGold?.(cost, 'quick_revive');
            CombatSystem.reviveNow();
            deathModal.style.display = 'none';
            reviveBtn._bound = false;
            showToast('立即复活成功', 'success');
          } else {
            showToast('金币不足', 'warning');
          }
        });
      }
      if (townBtn && !townBtn._bound) {
        townBtn._bound = true;
        townBtn.addEventListener('click', () => {
          CombatSystem.reviveInTown();
          deathModal.style.display = 'none';
          townBtn._bound = false;
          showToast('已回到盟重土城', 'success');
        });
      }
      if (autoCheck && !autoCheck._bound) {
        autoCheck._bound = true;
        autoCheck.addEventListener('change', () => {
          CombatSystem.setAutoRevive(autoCheck.checked);
        });
      }
    } else {
      deathModal.style.display = 'none';
      const reviveBtn = document.getElementById('death-revive-btn');
      const townBtn = document.getElementById('death-town-btn');
      const autoCheck = document.getElementById('death-auto-check');
      if (reviveBtn) reviveBtn._bound = false;
      if (townBtn) townBtn._bound = false;
      if (autoCheck) autoCheck._bound = false;
    }
  }

  if (weakStatus) {
    if (state.weakStacks > 0 && Date.now() < state.weakExpiresAt) {
      weakStatus.style.display = 'block';
      const remainSec = Math.ceil((state.weakExpiresAt - Date.now()) / 1000);
      const pct = state.weakStacks * 10;
      weakStatus.textContent = `⚠️ 虚弱×${state.weakStacks}（属性-${pct}%）${remainSec}s`;
    } else {
      weakStatus.style.display = 'none';
    }
  }

  updatePotionBar();
}

function updatePotionBar() {
  const bar = document.getElementById('potion-bar');
  if (!bar) return;
  const potionInv = PotionSystem.getInventory();
  const settings = PotionSystem.getAutoSettings();

  const hpId = settings.hpPotionId || 'hp_small';
  const mpId = settings.mpPotionId || 'mp_small';
  const hpCfg = POTION_TYPES[hpId];
  const mpCfg = POTION_TYPES[mpId];
  const hpCount = potionInv[hpId] || 0;
  const mpCount = potionInv[mpId] || 0;

  bar.innerHTML = `
    <div style="flex:1;display:flex;align-items:center;gap:4px;background:#2a1f15;border-radius:6px;padding:4px 8px;border:1px solid ${settings.hpEnabled ? '#dc2626' : '#4a3828'}">
      <span style="font-size:14px">${hpCfg?.icon || '🧪'}</span>
      <span style="font-size:11px;color:#ef4444;flex:1">${hpCfg?.name || 'HP药'}</span>
      <span style="font-size:12px;color:#fbbf24;font-weight:bold">${hpCount}</span>
    </div>
    <div style="flex:1;display:flex;align-items:center;gap:4px;background:#2a1f15;border-radius:6px;padding:4px 8px;border:1px solid ${settings.mpEnabled ? '#2563eb' : '#4a3828'}">
      <span style="font-size:14px">${mpCfg?.icon || '💧'}</span>
      <span style="font-size:11px;color:#3b82f6;flex:1">${mpCfg?.name || 'MP药'}</span>
      <span style="font-size:12px;color:#fbbf24;font-weight:bold">${mpCount}</span>
    </div>`;
}

function setupBattleLog() {
  const logList = document.getElementById('battle-log-list');
  if (!logList) return;

  EventBus.on(EVENTS.COMBAT_LOG, (entry) => {
    if (!entry) return;
    const div = document.createElement('div');
    div.className = 'log-entry log-' + (entry.type || 'player_attack');
    let text = entry.text || '';
    if (entry.isCrit) text = '💥 ' + text;
    div.textContent = text;
    logList.appendChild(div);
    if (logList.children.length > 50) logList.removeChild(logList.firstChild);
    logList.scrollTop = logList.scrollHeight;
  });
}

function setupItemDropHandler() {
  EventBus.on(EVENTS.COMBAT_ITEM_DROP, (data) => {
    if (!data || !data.item) return;
    const item = data.item;
    if (item.configId) {
      const generated = EquipmentSystem.generateItem
        ? EquipmentSystem.generateItem(item.configId, item.quality || 'normal', 'monster')
        : null;
      if (generated) {
        EquipmentSystem.addToInventory(generated);
        const qName = getQualityName(generated.quality || 'normal');
        const name = generated.name || generated.configId;
        showToast(`获得 [${qName}]${name}`, generated.quality);
      }
    }
  });
}

function setupBossKillHandler() {
  EventBus.on(EVENTS.BOSS_KILLED, (data) => {
    if (!data) return;
    if (MapSystem.recordBossKill) MapSystem.recordBossKill(data.bossId);
    const newMaps = MapSystem.checkAndUnlock
      ? MapSystem.checkAndUnlock(PlayerSystem.getPlayer()?.level || 1)
      : [];
    if (newMaps && newMaps.length > 0) {
      newMaps.forEach(id => {
        const map = MAP_CONFIG[id];
        if (map) showToast(`🗺️ 新地图解锁: ${map.name}`, 'success');
      });
    }
  });
}

function setupLevelUpHandler() {
  EventBus.on(EVENTS.PLAYER_LEVEL_UP, (data) => {
    if (!data) return;
    showToast(`🎉 恭喜升级到 ${data.level} 级！`, 'success');
    SkillSystem.setLevel(data.level);
    if (EquipmentSystem.setPlayerLevel) EquipmentSystem.setPlayerLevel(data.level);
    const newMaps = MapSystem.checkAndUnlock
      ? MapSystem.checkAndUnlock(data.level)
      : [];
    if (newMaps && newMaps.length > 0) {
      newMaps.forEach(id => {
        const map = MAP_CONFIG[id];
        if (map) showToast(`🗺️ 新地图解锁: ${map.name}`, 'success');
      });
    }
  });
}

function setupSkillHandlers() {
  EventBus.on(EVENTS.SKILL_UNLOCKED, (data) => {
    if (data) showToast(`📜 新技能解锁: ${data.name}`, 'success');
  });
  EventBus.on(EVENTS.SKILL_UPGRADED, (data) => {
    if (data) showToast(`⬆️ ${data.name} 升至 Lv.${data.level}`, 'success');
  });
}

function showToast(message, type) {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  const colors = {
    info: '#3b82f6', success: '#22c55e', warning: '#f59e0b', error: '#ef4444',
    normal: '#9ca3af', uncommon: '#22c55e', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b', mythic: '#ef4444'
  };
  const color = colors[type] || colors.info;
  toast.style.cssText = `
    background: linear-gradient(135deg, ${color}22, ${color}44);
    border: 1px solid ${color}; border-radius: 8px; padding: 8px 16px;
    color: #fff; font-size: 13px; white-space: nowrap; max-width: 90vw;
    overflow: hidden; text-overflow: ellipsis; animation: slideUp 0.3s ease;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  `;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function createToastContainer() {
  const c = document.createElement('div');
  c.id = 'toast-container';
  c.style.cssText = 'position:fixed;top:50px;left:50%;transform:translateX(-50%);z-index:300;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none';
  document.body.appendChild(c);
  return c;
}

function setupPageSwitching() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const pageEl = document.getElementById('page-' + page);
      if (pageEl) pageEl.classList.add('active');
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function setupCreateScreen() {
  const nameInput = document.getElementById('char-name-input');
  const createBtn = document.getElementById('create-btn');
  const errorEl = document.getElementById('create-error');
  const jobCards = document.querySelectorAll('.job-card');
  let selectedJob = null;

  jobCards.forEach(card => {
    card.addEventListener('click', () => {
      jobCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedJob = card.dataset.job;
      validateCreate();
    });
  });

  nameInput.addEventListener('input', validateCreate);

  function validateCreate() {
    const name = nameInput.value.trim();
    createBtn.disabled = !name || !selectedJob;
    if (errorEl) errorEl.textContent = '';
  }

  createBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name || !selectedJob) return;
    if (name.length < 1 || name.length > 8) {
      if (errorEl) errorEl.textContent = '角色名需要1-8个字符';
      return;
    }
    initNewGame(name, selectedJob);
    document.getElementById('create-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';
    startUILoop();
    showToast(`欢迎来到玛法大陆，${name}！`, 'success');
  });
}

function setupOfflineModal() {
  const btn = document.getElementById('offline-collect-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      document.getElementById('offline-modal').style.display = 'none';
    });
  }
}

function initEquipPage() {
  const page = document.getElementById('page-equip');
  if (!page) return;
  page.innerHTML = '<div style="padding:12px;overflow-y:auto;height:100%"><div id="equip-content"></div></div>';
  const EQ_SLOT_NAMES = { weapon:'武器', armor:'衣服', helmet:'头盔', necklace:'项链', leftRing:'左戒指', rightRing:'右戒指', leftBracelet:'左手镯', rightBracelet:'右手镯', belt:'腰带', shoes:'鞋子', medal:'勋章', hat:'斗笠', drum:'军鼓', talisman:'符咒' };

  function render() {
    const content = document.getElementById('equip-content');
    if (!content) return;
    const equipped = EquipmentSystem.getEquipped ? EquipmentSystem.getEquipped() : {};
    const slots = equipped.slots || equipped || {};
    const p = PlayerSystem.getPlayer();
    const f = PlayerSystem.getFinalStats();
    if (!f) return;

    const SLOTS = ['weapon','helmet','armor','necklace','leftRing','rightRing','leftBracelet','rightBracelet','belt','shoes','hat','medal','drum','talisman'];
    const SLOT_NAMES = { weapon:'武器', armor:'衣服', helmet:'头盔', necklace:'项链', leftRing:'左戒指', rightRing:'右戒指', leftBracelet:'左手镯', rightBracelet:'右手镯', belt:'腰带', shoes:'鞋子', medal:'勋章', hat:'斗笠', drum:'军鼓', talisman:'符咒' };

    let html = '<div style="font-size:16px;color:#ffd700;font-weight:bold;margin-bottom:12px">⚔ 装备</div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">';
    for (const slot of SLOTS) {
      const item = typeof slots[slot] === 'object' ? slots[slot] : null;
      if (item) {
        const qColor = getQualityColor(item.quality || 'normal');
        const enhance = item.enhanceLevel > 0 ? `+${item.enhanceLevel}` : '';
        const SN = { attack:'攻', magicAttack:'魔攻', defense:'防', magicDefense:'魔防', maxHp:'HP', maxMp:'MP', critRate:'暴击', critDamage:'暴伤', dodgeRate:'闪', attackSpeed:'速' };
        const PCT = new Set(['critRate','critDamage','dodgeRate','attackSpeed','expBonus','goldBonus','magicFind']);
        let statLine = '';
        if (item.stats) {
          statLine = Object.entries(item.stats).filter(([,v]) => v > 0).slice(0, 2)
            .map(([k,v]) => { const n = SN[k]||k; return PCT.has(k) ? `${n}${(v*100).toFixed(0)}%` : `${n}+${Math.floor(v)}`; }).join(' ');
        }
        html += `<div style="background:#2a1f15;border:1px solid ${qColor};border-radius:6px;padding:6px 8px;cursor:pointer" data-slot="${slot}" class="equip-slot-item">
          <div style="font-size:11px;color:${qColor};font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.name || item.configId}${enhance}</div>
          <div style="font-size:9px;color:#b09878">${SLOT_NAMES[slot]}</div>
          ${statLine ? `<div style="font-size:9px;color:#7a6548;margin-top:1px">${statLine}</div>` : ''}
        </div>`;
      } else {
        html += `<div style="background:#1a0f0a;border:1px dashed #4a3828;border-radius:6px;padding:8px;text-align:center">
          <div style="font-size:11px;color:#7a6548">${SLOT_NAMES[slot]}</div>
        </div>`;
      }
    }
    html += '</div>';

    const setInfo = EquipmentSystem.getSetBonus ? EquipmentSystem.getSetBonus() : null;
    if (setInfo && setInfo.activeSets && setInfo.activeSets.length > 0) {
      html += '<div style="background:#2a1f15;border:1px solid #6b5238;border-radius:6px;padding:8px;margin-bottom:12px">';
      html += '<div style="color:#ffd700;font-size:12px;font-weight:bold;margin-bottom:4px">套装效果</div>';
      for (const set of setInfo.activeSets) {
        html += `<div style="font-size:11px;color:#e8d5b5">${set.setName} (${set.count}/${set.total || 6})</div>`;
        if (set.bonuses) set.bonuses.forEach(b => { html += `<div style="font-size:10px;color:#22c55e;padding-left:8px">${b}</div>`; });
      }
      html += '</div>';
    }

    html += '<div style="background:#2a1f15;border:1px solid #6b5238;border-radius:6px;padding:8px">';
    html += '<div style="color:#ffd700;font-size:12px;font-weight:bold;margin-bottom:6px">属性面板</div>';
    const luckyInfo = EquipmentSystem.getTotalLucky ? EquipmentSystem.getTotalLucky() : { lucky: 0, curse: 0, net: 0, weaponLucky: 0, necklaceLucky: 0 };
    const neckBonus = EquipmentSystem.getNecklaceLuckyBonus ? EquipmentSystem.getNecklaceLuckyBonus() : {};
    const effCritDmg = (f.critDamage || 1.5) + (neckBonus.critDamage || 0);
    const effCritRate = (f.critRate || 0) + (neckBonus.critRate || 0);
    const statRows = [
      ['攻击', f.attack], ['魔攻', f.magicAttack], ['防御', f.defense], ['魔防', f.magicDefense],
      ['生命', f.maxHp], ['魔法', f.maxMp], ['暴击率', (effCritRate * 100).toFixed(1) + '%'],
      ['暴击伤害', (effCritDmg * 100).toFixed(0) + '%'], ['闪避率', (f.dodgeRate * 100).toFixed(1) + '%'],
      ['攻速', f.attackSpeed?.toFixed(2)], ['经验加成', ((f.expBonus || 0) * 100).toFixed(1) + '%'],
      ['金币加成', ((f.goldBonus || 0) * 100).toFixed(1) + '%'],
      ['🍀幸运', `${luckyInfo.net}(武${luckyInfo.weaponLucky||0}/链${luckyInfo.necklaceLucky||0})` + (luckyInfo.curse > 0 ? ` 咒-${luckyInfo.curse}` : '')]
    ];
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px">';
    for (const [label, val] of statRows) {
      html += `<div style="font-size:11px;display:flex;justify-content:space-between;padding:2px 4px">
        <span style="color:#b09878">${label}</span>
        <span style="color:#e8d5b5">${typeof val === 'number' ? formatNumber(Math.floor(val)) : val}</span>
      </div>`;
    }
    html += '</div></div>';

    const mats = EquipmentSystem.getMaterials ? EquipmentSystem.getMaterials() : {};

    const weaponItem = slots['weapon'];
    if (weaponItem) {
      const wLucky = weaponItem.lucky || 0;
      const maxW = LUCKY_CONFIG.weaponMaxLucky;
      const superCnt = mats.super_oil_item || 0;
      html += `<div style="background:#2a1f15;border:1px solid #6b5238;border-radius:6px;padding:8px;margin-top:8px">
        <div style="color:#ffd700;font-size:12px;font-weight:bold;margin-bottom:6px">🍀 武器祝福 · 幸运 ${wLucky}/${maxW}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <div style="flex:1;background:#3d2e1e;border-radius:4px;height:8px;overflow:hidden">
            <div style="width:${(wLucky / maxW * 100)}%;height:100%;background:linear-gradient(90deg,#22c55e,#fbbf24);border-radius:4px"></div>
          </div>
          <span style="font-size:11px;color:#c8b896">${wLucky >= maxW ? '✅ 满幸运' : `武器幸运 ${wLucky}/${maxW}`}</span>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-primary btn-sm" id="use-oil-normal" style="font-size:11px;padding:4px 10px" ${wLucky >= maxW ? 'disabled' : ''}>
            祝福油 (${LUCKY_CONFIG.blessingOil.buyPrice}💰 | ${(LUCKY_CONFIG.blessingOil.successRate * 100)}%)
          </button>
          <button class="btn btn-sm" id="use-oil-super" style="font-size:11px;padding:4px 10px;background:#7c3aed;color:#fff;border:1px solid #a78bfa" ${wLucky >= maxW || superCnt <= 0 ? 'disabled' : ''}>
            🧴超级(${superCnt}个 | ${(LUCKY_CONFIG.superBlessingOil.successRate * 100)}%)
          </button>
        </div>
        <div style="font-size:10px;color:#7a6548;margin-top:4px">总幸运(武器+项链)≥9 = 100%上限伤害，超级祝福油由BOSS掉落</div>
      </div>`;
    }

    const neckItem = slots['necklace'];
    if (neckItem) {
      const nLucky = neckItem.lucky || 0;
      const maxN = LUCKY_CONFIG.necklaceMaxLucky;
      const nextCfg = nLucky < maxN ? LUCKY_CONFIG.necklaceUpgrade[nLucky] : null;
      html += `<div style="background:#2a1f15;border:1px solid #6b5238;border-radius:6px;padding:8px;margin-top:8px">
        <div style="color:#ffd700;font-size:12px;font-weight:bold;margin-bottom:6px">📿 项链幸运 · ${nLucky}/${maxN}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <div style="flex:1;background:#3d2e1e;border-radius:4px;height:8px;overflow:hidden">
            <div style="width:${(nLucky / maxN * 100)}%;height:100%;background:linear-gradient(90deg,#60a5fa,#c084fc);border-radius:4px"></div>
          </div>
        </div>`;
      if (nLucky > 0) {
        const desc = LUCKY_CONFIG.necklaceLuckyDesc[nLucky] || '';
        html += `<div style="font-size:11px;color:#22c55e;margin-bottom:4px">当前效果：${desc}</div>`;
      }
      if (nextCfg) {
        let costText = `${nextCfg.gold}💰`;
        for (const [matId, need] of Object.entries(nextCfg.materials)) {
          const mc = MATERIAL_CONFIG[matId];
          const have = mats[matId] || 0;
          const color = have >= need ? '#22c55e' : '#ef4444';
          costText += ` + <span style="color:${color}">${mc?.icon || ''}${mc?.name || matId} ${have}/${need}</span>`;
        }
        const bonusText = nextCfg.bonus ? Object.entries(nextCfg.bonus).map(([k, v]) => k === 'critDamage' ? `暴伤+${(v * 100).toFixed(0)}%` : `暴击率+${(v * 100).toFixed(0)}%`).join(' ') : '';
        html += `<div style="font-size:11px;color:#c8b896;margin-bottom:6px">升至 +${nextCfg.level}：${costText} (${(nextCfg.rate * 100)}%成功)${bonusText ? ` → ${bonusText}` : ''}</div>`;
        html += `<button class="btn btn-primary btn-sm" id="upgrade-neck-lucky" style="font-size:11px;padding:4px 12px">升级项链幸运</button>`;
      } else {
        html += `<div style="font-size:11px;color:#fbbf24">✅ 已满级！暴击伤害+15%，暴击率+5%</div>`;
      }
      html += '</div>';
    }

    content.innerHTML = html;

    const oilNormalBtn = document.getElementById('use-oil-normal');
    if (oilNormalBtn && weaponItem) {
      oilNormalBtn.addEventListener('click', () => {
        const result = EquipmentSystem.useBlessingOil(weaponItem.instanceId, false);
        if (result.success) showToast(`祝福成功！武器幸运 → ${result.lucky}`, 'success');
        else showToast(result.reason, 'error');
        render();
      });
    }
    const oilSuperBtn = document.getElementById('use-oil-super');
    if (oilSuperBtn && weaponItem) {
      oilSuperBtn.addEventListener('click', () => {
        const result = EquipmentSystem.useBlessingOil(weaponItem.instanceId, true);
        if (result.success) showToast(`超级祝福成功！武器幸运 → ${result.lucky}`, 'success');
        else showToast(result.reason, 'error');
        render();
      });
    }
    const neckUpBtn = document.getElementById('upgrade-neck-lucky');
    if (neckUpBtn && neckItem) {
      neckUpBtn.addEventListener('click', () => {
        const result = EquipmentSystem.upgradeNecklaceLucky(neckItem.instanceId);
        if (result.success) showToast(`项链幸运提升！→ +${result.lucky} ${result.desc || ''}`, 'success');
        else showToast(result.reason, 'error');
        render();
      });
    }

    content.querySelectorAll('.equip-slot-item').forEach(el => {
      el.addEventListener('click', () => {
        const slot = el.dataset.slot;
        const eqData = EquipmentSystem.getEquipped ? EquipmentSystem.getEquipped() : {};
        const eqSlots = eqData.slots || eqData || {};
        const item = eqSlots[slot];
        if (!item) return;
        _showEquipDetailPanel(item, slot, render);
      });
    });
  }

  function _showEquipDetailPanel(item, slot, renderCb) {
    let overlay = document.getElementById('equip-detail-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'equip-detail-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:800;display:flex;align-items:center;justify-content:center';
      document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';

    const qColor = getQualityColor(item.quality || 'normal');
    const qName = getQualityName(item.quality || 'normal');
    const enhLv = item.enhanceLevel || 0;
    const maxLv = ENHANCE_CONFIG.maxLevel;
    const canEnhance = enhLv < maxLv;
    const cost = canEnhance ? ENHANCE_CONFIG.goldCost(enhLv) : 0;
    const rate = canEnhance ? ENHANCE_CONFIG.successRate[enhLv] : 0;
    const gold = EconomySystem.getGold ? EconomySystem.getGold() : 0;

    const SN = { attack:'攻击', magicAttack:'魔攻', defense:'防御', magicDefense:'魔防', maxHp:'生命', maxMp:'魔法', critRate:'暴击率', critDamage:'暴击伤害', dodgeRate:'闪避', attackSpeed:'攻速', hpRegen:'HP回复', mpRegen:'MP回复', expBonus:'经验加成', goldBonus:'金币加成', magicFind:'掉落加成' };
    const PCT = new Set(['critRate','critDamage','dodgeRate','attackSpeed','expBonus','goldBonus','magicFind']);
    function fmtStat(k, v) { return PCT.has(k) ? `${SN[k]||k} +${(v*100).toFixed(1)}%` : `${SN[k]||k} +${Math.floor(v)}`; }

    let statsHtml = '';
    if (item.stats) {
      for (const [k, v] of Object.entries(item.stats)) { if (v > 0) statsHtml += `<div style="font-size:11px;color:#e8d5b5;padding:2px 0">${fmtStat(k, v)}</div>`; }
    }
    if (item.extraStats) {
      for (const e of item.extraStats) { if (e.value > 0) statsHtml += `<div style="font-size:11px;color:#22c55e;padding:2px 0">${fmtStat(e.stat, e.value)}</div>`; }
    }
    const bonusPct = Math.floor(ENHANCE_CONFIG.bonusPerLevel * 100);

    overlay.innerHTML = `<div style="background:#1a0f0a;border:2px solid ${qColor};border-radius:10px;padding:16px;width:85%;max-width:340px;max-height:80vh;overflow-y:auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div style="font-size:16px;font-weight:bold;color:${qColor}">${item.name || item.configId}${enhLv > 0 ? ' +' + enhLv : ''}</div>
        <div style="cursor:pointer;font-size:20px;color:#7a6548;padding:4px" id="eqd-close">✕</div>
      </div>
      <div style="font-size:11px;color:#7a6548;margin-bottom:8px">${EQ_SLOT_NAMES[slot] || slot} · ${qName} · 需Lv.${Math.max(1, (item.level || 1) - 3)}</div>
      <div style="border-top:1px solid #4a3828;padding-top:8px;margin-bottom:10px">${statsHtml}</div>
      <div style="background:#2a1f15;border:1px solid #6b5238;border-radius:6px;padding:10px;margin-bottom:10px">
        <div style="font-size:13px;color:#ffd700;font-weight:bold;margin-bottom:6px">🔨 强化 (${enhLv}/${maxLv})</div>
        ${canEnhance ? `
          <div style="font-size:11px;color:#c8b896;margin-bottom:4px">强化+1：属性提升${bonusPct}% · 成功率 ${Math.floor(rate * 100)}%</div>
          <div style="font-size:11px;color:#fbbf24;margin-bottom:8px">费用：${formatNumber(cost)} 💰 ${gold < cost ? '<span style="color:#ef4444">(不足)</span>' : ''}</div>
          <button class="btn btn-primary btn-block" id="eqd-enhance" style="font-size:12px;padding:8px 0">🔨 强化 (+${enhLv + 1})</button>
        ` : `<div style="font-size:11px;color:#22c55e">已达最高强化等级 +${maxLv}</div>`}
      </div>
      <button class="btn btn-secondary btn-block" id="eqd-unequip" style="font-size:12px;padding:8px 0">卸下装备</button>
    </div>`;

    document.getElementById('eqd-close').addEventListener('click', () => { overlay.style.display = 'none'; });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.style.display = 'none'; });

    const enhBtn = document.getElementById('eqd-enhance');
    if (enhBtn) {
      enhBtn.addEventListener('click', () => {
        const result = EquipmentSystem.enhance(item.instanceId);
        if (result.success) {
          showToast(`强化成功！→ +${result.enhanceLevel}`, 'success');
        } else {
          showToast(result.reason || '强化失败', result.reason === '金币不足' ? 'warning' : 'error');
        }
        renderCb();
        _showEquipDetailPanel(item, slot, renderCb);
      });
    }

    document.getElementById('eqd-unequip').addEventListener('click', () => {
      EquipmentSystem.unequip(slot);
      showToast('已卸下装备', 'info');
      overlay.style.display = 'none';
      renderCb();
    });
  }

  EventBus.on(EVENTS.EQUIP_CHANGED, render);
  EventBus.on(EVENTS.STATS_CHANGED, render);
  EventBus.on(EVENTS.INVENTORY_CHANGED, render);
  page._render = render;
  render();
}

function initBagPage() {
  const page = document.getElementById('page-bag');
  if (!page) return;
  page.innerHTML = '<div style="padding:12px;overflow-y:auto;height:100%"><div id="bag-content"></div><div id="item-detail-panel" style="display:none"></div></div>';

  const STAT_NAMES = { attack:'攻击', magicAttack:'魔攻', defense:'防御', magicDefense:'魔防', maxHp:'生命', maxMp:'魔法', critRate:'暴击率', critDamage:'暴击伤害', dodgeRate:'闪避率', attackSpeed:'攻速', hpRegen:'回血', mpRegen:'回蓝', expBonus:'经验加成', goldBonus:'金币加成', magicFind:'寻宝率' };
  const PERCENT_STATS = new Set(['critRate','critDamage','dodgeRate','attackSpeed','expBonus','goldBonus','magicFind']);
  const SLOT_NAMES = { weapon:'武器', armor:'衣服', helmet:'头盔', necklace:'项链', leftRing:'戒指', rightRing:'戒指', leftBracelet:'手镯', rightBracelet:'手镯', belt:'腰带', shoes:'鞋子', medal:'勋章', hat:'斗笠', drum:'军鼓', talisman:'符咒' };

  function formatStat(key, val) {
    const name = STAT_NAMES[key] || key;
    if (PERCENT_STATS.has(key)) return `${name} +${(val * 100).toFixed(1)}%`;
    return `${name} +${Math.floor(val)}`;
  }

  let selectedItemId = null;

  function showDetail(item) {
    selectedItemId = item.instanceId;
    const panel = document.getElementById('item-detail-panel');
    if (!panel) return;
    const qColor = getQualityColor(item.quality || 'normal');
    const qName = getQualityName(item.quality || 'normal');
    const enhance = item.enhanceLevel > 0 ? `+${item.enhanceLevel}` : '';
    const slotName = SLOT_NAMES[item.slot] || item.slot;
    const sellPrice = EquipmentSystem.calcSellPrice ? EquipmentSystem.calcSellPrice(item) : 0;

    let statsHtml = '';
    if (item.stats) {
      for (const [k, v] of Object.entries(item.stats)) {
        if (v > 0) statsHtml += `<div style="font-size:11px;color:#c8b896;padding:2px 0">${formatStat(k, v)}</div>`;
      }
    }
    if (item.extraStats && item.extraStats.length > 0) {
      for (const es of item.extraStats) {
        statsHtml += `<div style="font-size:11px;color:#4ade80;padding:2px 0">${formatStat(es.stat, es.value)}</div>`;
      }
    }
    if (item.setId) {
      statsHtml += `<div style="font-size:11px;color:#fbbf24;padding:4px 0 0">套装：${item.setId.replace('set_','')}</div>`;
    }
    if (item.lucky > 0) {
      statsHtml += `<div style="font-size:11px;color:#22c55e;padding:2px 0">🍀 幸运 +${item.lucky}</div>`;
    }
    if (item.curse > 0) {
      statsHtml += `<div style="font-size:11px;color:#ef4444;padding:2px 0">💀 诅咒 +${item.curse}</div>`;
    }

    panel.style.display = 'block';
    panel.innerHTML = `
      <div style="position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center" id="detail-overlay">
        <div style="background:#2a1f15;border:2px solid ${qColor};border-radius:10px;padding:16px;width:85%;max-width:320px;animation:slideUp 0.2s ease">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <div>
              <div style="font-size:16px;font-weight:bold;color:${qColor}">${item.name || item.configId}${enhance}</div>
              <div style="font-size:11px;color:#7a6548;margin-top:2px">${slotName} · ${qName} · 需Lv.${Math.max(1, (item.level || 1) - 3)}</div>
            </div>
            <div style="cursor:pointer;font-size:20px;color:#7a6548;padding:4px" id="detail-close">✕</div>
          </div>
          <div style="border-top:1px solid #4a3828;padding-top:8px;margin-bottom:10px">${statsHtml}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-top:1px solid #4a3828">
            <span style="font-size:12px;color:#fbbf24">💰 出售价格: ${formatNumber(sellPrice)}</span>
          </div>
          <div style="display:flex;gap:8px;margin-top:10px">
            <button class="btn btn-primary" style="flex:1;font-size:13px;min-height:36px" id="detail-equip">穿戴</button>
            <button class="btn btn-danger" style="flex:1;font-size:13px;min-height:36px" id="detail-sell">出售 (${formatNumber(sellPrice)}💰)</button>
          </div>
        </div>
      </div>`;

    document.getElementById('detail-close').addEventListener('click', () => { panel.style.display = 'none'; selectedItemId = null; });
    document.getElementById('detail-overlay').addEventListener('click', (e) => { if (e.target.id === 'detail-overlay') { panel.style.display = 'none'; selectedItemId = null; } });
    document.getElementById('detail-equip').addEventListener('click', () => {
      const result = EquipmentSystem.equip(item.instanceId);
      if (result && result.success !== false) showToast('装备成功', 'success');
      else showToast(result?.message || result?.reason || '穿戴失败', 'error');
      panel.style.display = 'none'; selectedItemId = null; render();
    });
    document.getElementById('detail-sell').addEventListener('click', () => {
      const result = EquipmentSystem.sellItem(item.instanceId);
      if (result && result.success !== false) showToast(`出售获得 ${formatNumber(result.goldGained || 0)} 金币`, 'success');
      panel.style.display = 'none'; selectedItemId = null; render();
    });
  }

  function render() {
    const content = document.getElementById('bag-content');
    if (!content) return;
    const allItems = EquipmentSystem.getInventory ? EquipmentSystem.getInventory() : [];
    const eqData = EquipmentSystem.getEquipped ? EquipmentSystem.getEquipped() : {};
    const eqSlots = eqData.slots || eqData || {};
    const equippedIds = new Set(Object.values(eqSlots).filter(v => v?.instanceId).map(v => v.instanceId));
    const items = allItems.filter(i => !equippedIds.has(i.instanceId));
    const capacity = 60;
    const gold = EconomySystem.getGold ? EconomySystem.getGold() : 0;

    let html = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <span style="font-size:16px;color:#ffd700;font-weight:bold">🎒 背包 ${items.length}/${capacity}</span>
      <span style="color:#fbbf24;font-size:13px">💰 ${formatNumber(gold)}</span>
    </div>`;

    html += `<button class="btn btn-secondary btn-block" id="batch-sell-btn" style="margin-bottom:10px;font-size:12px;padding:6px 0">批量出售装备</button>`;

    const mats = EquipmentSystem.getMaterials ? EquipmentSystem.getMaterials() : {};
    const hasAnyMat = Object.entries(mats).some(([k, v]) => k !== 'skill_book_page' && v > 0);
    if (hasAnyMat) {
      html += '<div style="background:#2a1f15;border:1px solid #6b5238;border-radius:6px;padding:8px;margin-bottom:10px">';
      html += '<div style="color:#ffd700;font-size:12px;font-weight:bold;margin-bottom:4px">📦 材料</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
      for (const [matId, cnt] of Object.entries(mats)) { if (matId === 'skill_book_page') continue; const mc = MATERIAL_CONFIG[matId]; if (mc && cnt > 0) { html += `<div style="background:#3d2e1e;border-radius:4px;padding:4px 8px;font-size:11px;color:#e8d5b5">${mc.icon} ${mc.name} ×${cnt}</div>`; } }
      html += '</div></div>';
    }

    if (items.length === 0) {
      html += '<div style="text-align:center;color:#7a6548;padding:40px">背包为空</div>';
    } else {
      const qOrder = { mythic: 6, legendary: 5, epic: 4, rare: 3, uncommon: 2, normal: 1 };
      const slotOrd = { weapon:1, armor:2, helmet:3, necklace:4, leftRing:5, rightRing:6, leftBracelet:7, rightBracelet:8, belt:9, shoes:10, medal:11, hat:12, drum:13, talisman:14 };
      const sorted = [...items].sort((a, b) => {
        const ld = (b.level || 0) - (a.level || 0);
        if (ld !== 0) return ld;
        const qd = (qOrder[b.quality] || 0) - (qOrder[a.quality] || 0);
        if (qd !== 0) return qd;
        return (slotOrd[a.slot] || 99) - (slotOrd[b.slot] || 99);
      });

      const _STAT_WEIGHT = { attack:1.5, magicAttack:1.5, defense:1, magicDefense:1, maxHp:0.1, maxMp:0.05, critRate:120, critDamage:80, dodgeRate:100, attackSpeed:60 };
      function _itemScore(it) {
        if (!it || !it.stats) return 0;
        let s = 0;
        for (const [k, v] of Object.entries(it.stats)) { s += (v || 0) * (_STAT_WEIGHT[k] || 1); }
        if (it.extraStats) { for (const e of it.extraStats) { s += (e.value || 0) * (_STAT_WEIGHT[e.stat] || 1); } }
        s += (it.enhanceLevel || 0) * 5;
        return s;
      }
      const PAIRED_SLOTS = { leftRing: ['leftRing', 'rightRing'], rightRing: ['leftRing', 'rightRing'], leftBracelet: ['leftBracelet', 'rightBracelet'], rightBracelet: ['leftBracelet', 'rightBracelet'] };
      const _pLv = PlayerSystem.getPlayer()?.level || 1;
      const _pJob = PlayerSystem.getPlayer()?.job || 'warrior';
      function _isUpgrade(it) {
        const base = EQUIP_BASES[it.configId];
        if (base && base.job !== 'all' && base.job !== _pJob) return false;
        const reqLv = it.level || 1;
        if (_pLv < reqLv - 3) return false;
        const slots = PAIRED_SLOTS[it.slot] || [it.slot];
        const bagScore = _itemScore(it);
        for (const sl of slots) {
          const cur = eqSlots[sl];
          if (!cur) return true;
          if (bagScore > _itemScore(cur)) return true;
        }
        return false;
      }

      function _fp(it) {
        const b = `${it.configId}|${it.quality}|${it.enhanceLevel||0}|${it.lucky||0}|${it.curse||0}`;
        const st = it.stats ? Object.keys(it.stats).sort().map(k => `${k}=${it.stats[k]}`).join(',') : '';
        const ex = it.extraStats?.length ? it.extraStats.map(e => `${e.stat}=${e.value}`).sort().join(',') : '';
        return `${b}|${st}|${ex}`;
      }
      const stacks = []; const seen = {};
      for (const item of sorted) {
        const fp = _fp(item);
        if (seen[fp] !== undefined) { stacks[seen[fp]].count++; stacks[seen[fp]].ids.push(item.instanceId); }
        else { seen[fp] = stacks.length; stacks.push({ item, count: 1, ids: [item.instanceId] }); }
      }

      const slotsUsed = stacks.length;
      html = html.replace(/🎒 背包 \d+\/\d+/, `🎒 背包 ${slotsUsed}/${capacity}`);

      for (const stack of stacks) {
        const item = stack.item;
        const qColor = getQualityColor(item.quality || 'normal');
        const qName = getQualityName(item.quality || 'normal');
        const enhance = item.enhanceLevel > 0 ? `+${item.enhanceLevel}` : '';
        const slotName = SLOT_NAMES[item.slot] || item.slot;
        const sellPrice = EquipmentSystem.calcSellPrice ? EquipmentSystem.calcSellPrice(item) : 0;
        const mainStats = item.stats ? Object.entries(item.stats).filter(([, v]) => v > 0).slice(0, 3).map(([k, v]) => formatStat(k, v)).join('  ') : '';
        const badge = stack.count > 1 ? `<span style="font-size:10px;color:#fbbf24;background:#3d2e1e;border-radius:3px;padding:1px 5px;margin-left:4px">×${stack.count}</span>` : '';
        const upgrade = _isUpgrade(item);
        const upgradeBadge = upgrade ? '<span style="font-size:11px;color:#22c55e;margin-left:4px;font-weight:bold" title="强于当前装备">▲</span>' : '';
        const borderStyle = upgrade ? `border-left:3px solid ${qColor};border-right:3px solid #22c55e` : `border-left:3px solid ${qColor}`;
        html += `<div style="padding:8px;margin-bottom:4px;background:${upgrade ? '#1a2a15' : '#2a1f15'};border-radius:6px;${borderStyle};cursor:pointer" class="bag-item" data-id="${item.instanceId}">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:13px;color:${qColor};font-weight:bold">${item.name || item.configId}${enhance}${badge}${upgradeBadge}</div>
            <span style="font-size:10px;color:#fbbf24">💰${formatNumber(sellPrice)}</span>
          </div>
          <div style="font-size:10px;color:#7a6548;margin-top:2px">${slotName} · ${qName} · 需Lv.${Math.max(1, (item.level || 1) - 3)}</div>
          <div style="font-size:10px;color:#b09878;margin-top:3px">${mainStats}</div>
        </div>`;
      }
    }

    // Potion Shop
    const playerLevel = PlayerSystem.getPlayer()?.level || 1;
    const potionInv = PotionSystem.getInventory();
    const autoSet = PotionSystem.getAutoSettings();
    html += `<div style="margin-top:16px;padding-top:12px;border-top:1px solid #6b5238">
      <div style="font-size:16px;color:#ffd700;font-weight:bold;margin-bottom:10px">🧪 药剂商店</div>`;

    const potionGroups = [
      { label: '生命药剂', type: 'hp', color: '#ef4444', autoKey: 'hpPotionId', enableKey: 'hpEnabled' },
      { label: '魔法药剂', type: 'mp', color: '#3b82f6', autoKey: 'mpPotionId', enableKey: 'mpEnabled' }
    ];
    for (const group of potionGroups) {
      html += `<div style="font-size:12px;color:${group.color};font-weight:bold;margin:8px 0 4px">${group.label}</div>`;
      const groupPotions = Object.values(POTION_TYPES).filter(p => p.type === group.type);
      for (const pot of groupPotions) {
        const locked = playerLevel < pot.unlockLevel;
        const count = potionInv[pot.id] || 0;
        const isAuto = autoSet[group.autoKey] === pot.id && autoSet[group.enableKey];
        html += `<div style="display:flex;align-items:center;gap:6px;padding:6px 8px;margin-bottom:3px;background:#2a1f15;border-radius:6px;border:1px solid ${isAuto ? group.color : '#3d2e1e'};opacity:${locked ? '0.4' : '1'}">
          <span style="font-size:16px">${pot.icon}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;color:#e8d5b5;font-weight:bold">${pot.name} ${locked ? '🔒Lv.' + pot.unlockLevel : ''}</div>
            <div style="font-size:10px;color:#7a6548">恢复${pot.type === 'hp' ? '生命' : '魔法'}${pot.value} · 💰${pot.buyPrice}</div>
          </div>
          <span style="font-size:12px;color:#fbbf24;min-width:24px;text-align:center">${count}</span>
          ${locked ? '' : `<button class="btn btn-sm btn-primary potion-buy" data-id="${pot.id}" style="padding:3px 8px;font-size:10px">买x10</button>`}
          ${locked ? '' : `<button class="btn btn-sm ${isAuto ? 'btn-danger' : 'btn-secondary'} potion-auto" data-id="${pot.id}" data-type="${group.type}" style="padding:3px 8px;font-size:10px">${isAuto ? '自动✓' : '自动'}</button>`}
        </div>`;
      }
    }
    html += '</div>';

    content.innerHTML = html;

    content.querySelectorAll('.bag-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        const item = items.find(i => i.instanceId === id);
        if (item) showDetail(item);
      });
    });

    const batchBtn = document.getElementById('batch-sell-btn');
    if (batchBtn) {
      batchBtn.addEventListener('click', () => {
        _showBatchSellPanel(items, render);
      });
    }

    content.querySelectorAll('.potion-buy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const result = PotionSystem.buyPotion(btn.dataset.id, 10);
        if (result.success) showToast(`购买成功，花费 ${formatNumber(result.cost)} 金币`, 'success');
        else showToast(result.reason, 'warning');
        render();
      });
    });

    content.querySelectorAll('.potion-auto').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const potionId = btn.dataset.id;
        const type = btn.dataset.type;
        const current = PotionSystem.getAutoSettings();
        const potName = POTION_TYPES[potionId]?.name || '药剂';
        if (type === 'hp') {
          const isActive = current.hpPotionId === potionId && current.hpEnabled;
          PotionSystem.setAutoSettings({ hpPotionId: potionId, hpEnabled: !isActive });
          showToast(isActive ? `已关闭自动使用${potName}` : `已开启自动使用${potName}`, 'info');
        } else {
          const isActive = current.mpPotionId === potionId && current.mpEnabled;
          PotionSystem.setAutoSettings({ mpPotionId: potionId, mpEnabled: !isActive });
          showToast(isActive ? `已关闭自动使用${potName}` : `已开启自动使用${potName}`, 'info');
        }
        render();
      });
    });
  }

  EventBus.on(EVENTS.INVENTORY_CHANGED, render);
  EventBus.on(EVENTS.GOLD_CHANGED, render);
  EventBus.on(EVENTS.POTION_CHANGED, render);
  page._render = render;
  render();
}

function _showBatchSellPanel(bagItems, renderCallback) {
  const existing = document.getElementById('batch-sell-overlay');
  if (existing) existing.remove();

  const QUALITIES = [
    { key: 'normal',    name: '普通', color: '#9ca3af', checked: true },
    { key: 'uncommon',  name: '优秀', color: '#22c55e', checked: true },
    { key: 'rare',      name: '稀有', color: '#3b82f6', checked: true },
    { key: 'epic',      name: '史诗', color: '#a855f7', checked: false },
    { key: 'legendary', name: '传说', color: '#f59e0b', checked: false },
    { key: 'mythic',    name: '神话', color: '#ef4444', checked: false }
  ];
  const checkedSet = new Set(QUALITIES.filter(q => q.checked).map(q => q.key));

  function calcPreview() {
    const matched = bagItems.filter(i => checkedSet.has(i.quality || 'normal') && !i.isLocked);
    let gold = 0;
    for (const it of matched) gold += EquipmentSystem.calcSellPrice ? EquipmentSystem.calcSellPrice(it) : 0;
    return { count: matched.length, gold };
  }

  function buildHTML() {
    const preview = calcPreview();
    let h = `<div id="batch-sell-overlay" style="position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center">
      <div style="background:linear-gradient(180deg,#43321e,#3a2a18);border:2px solid #8b7355;border-radius:12px;width:85%;max-width:340px;padding:16px;box-shadow:0 0 40px rgba(0,0,0,.5)">
        <div style="font-size:16px;color:#ffd700;font-weight:bold;text-align:center;margin-bottom:12px">批量出售</div>
        <div style="font-size:12px;color:#b8a88a;text-align:center;margin-bottom:12px">勾选要出售的品质</div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">`;

    for (const q of QUALITIES) {
      const on = checkedSet.has(q.key);
      const qItems = bagItems.filter(i => (i.quality || 'normal') === q.key && !i.isLocked);
      const qGold = qItems.reduce((s, it) => s + (EquipmentSystem.calcSellPrice ? EquipmentSystem.calcSellPrice(it) : 0), 0);
      h += `<label data-qkey="${q.key}" style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:${on ? '#2a2015' : '#1e1610'};border:1px solid ${on ? q.color : '#3d2e1e'};border-radius:6px;cursor:pointer;transition:border-color .15s">
        <input type="checkbox" class="bsq-cb" data-q="${q.key}" ${on ? 'checked' : ''} style="width:16px;height:16px;accent-color:${q.color};cursor:pointer">
        <span style="color:${q.color};font-weight:bold;font-size:13px;flex:1">${q.name}</span>
        <span style="font-size:11px;color:#b8a88a">${qItems.length}件</span>
        <span style="font-size:11px;color:#fbbf24">💰${formatNumber(qGold)}</span>
      </label>`;
    }

    h += `</div>
        <div style="background:#2a1f15;border:1px solid #5a4a38;border-radius:6px;padding:8px 12px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:13px;color:#b8a88a">合计</span>
          <span style="font-size:14px;font-weight:bold"><span style="color:#e8d5b5">${preview.count}件</span> · <span style="color:#fbbf24">💰${formatNumber(preview.gold)}</span></span>
        </div>
        <div style="display:flex;gap:8px">
          <button id="bs-cancel" style="flex:1;padding:10px 0;border:1px solid #5a4a38;border-radius:6px;background:#2e2218;color:#b8a88a;font-size:13px;cursor:pointer">取消</button>
          <button id="bs-confirm" style="flex:1;padding:10px 0;border:1px solid #fbbf24;border-radius:6px;background:linear-gradient(180deg,#5a4520,#4a3818);color:#ffd700;font-size:13px;font-weight:bold;cursor:pointer;${preview.count === 0 ? 'opacity:0.4;pointer-events:none' : ''}">确认出售</button>
        </div>
      </div>
    </div>`;
    return h;
  }

  function mount() {
    document.body.insertAdjacentHTML('beforeend', buildHTML());
    const ov = document.getElementById('batch-sell-overlay');

    ov.querySelectorAll('.bsq-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) checkedSet.add(cb.dataset.q);
        else checkedSet.delete(cb.dataset.q);
        ov.remove();
        mount();
      });
    });

    ov.addEventListener('click', (e) => {
      if (e.target === ov || e.target.id === 'bs-cancel') { ov.remove(); return; }
    });

    const confirmBtn = document.getElementById('bs-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const toSell = bagItems.filter(i => checkedSet.has(i.quality || 'normal') && !i.isLocked);
        let totalGold = 0, cnt = 0;
        for (const item of toSell) {
          if (EquipmentSystem.sellItem) {
            const r = EquipmentSystem.sellItem(item.instanceId);
            if (r && r.success !== false) { totalGold += (r.goldGained || 0); cnt++; }
          }
        }
        ov.remove();
        if (cnt > 0) showToast(`批量出售 ${cnt} 件装备，获得 ${formatNumber(totalGold)} 金币`, 'success');
        else showToast('没有可出售的装备', 'info');
        renderCallback();
      });
    }
  }

  mount();
}

function initMapPage() {
  const page = document.getElementById('page-map');
  if (!page) return;
  page.innerHTML = '<div style="padding:12px;overflow-y:auto;height:100%"><div id="map-content"></div></div>';

  function render() {
    const content = document.getElementById('map-content');
    if (!content) return;
    const progress = MapSystem.getProgress ? MapSystem.getProgress() : { unlockedMaps: ['map_biqi'], currentMapId: 'map_biqi' };
    const playerLevel = PlayerSystem.getPlayer()?.level || 1;
    const maps = Object.values(MAP_CONFIG).sort((a, b) => a.unlockLevel - b.unlockLevel);

    let html = '<div style="font-size:16px;color:#ffd700;font-weight:bold;margin-bottom:12px">🗺️ 地图</div>';

    for (const map of maps) {
      const unlocked = progress.unlockedMaps?.includes(map.id);
      const isCurrent = progress.currentMapId === map.id;
      const borderColor = isCurrent ? '#ffd700' : unlocked ? '#6b5238' : '#3d2e1e';
      const opacity = unlocked ? '1' : '0.5';

      html += `<div style="background:#2a1f15;border:1px solid ${borderColor};border-radius:8px;padding:10px;margin-bottom:8px;opacity:${opacity}${isCurrent ? ';box-shadow:0 0 8px rgba(255,215,0,0.3)' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div>
            <span style="font-size:14px;font-weight:bold;color:${isCurrent ? '#ffd700' : '#e8d5b5'}">${map.name}</span>
            <span style="font-size:10px;color:#7a6548;margin-left:6px">${map.zone}</span>
          </div>
          ${unlocked ? (isCurrent
            ? '<span style="font-size:11px;color:#ffd700;padding:3px 8px;background:#ffd70022;border-radius:4px">当前</span>'
            : `<button class="btn btn-sm btn-primary map-go-btn" data-map="${map.id}" style="padding:3px 10px;font-size:11px">前往</button>`)
            : `<span style="font-size:11px;color:#7a6548">🔒 Lv.${map.unlockLevel}</span>`}
        </div>
        <div style="font-size:10px;color:#b09878">推荐等级 ${map.recommendLevel[0]}-${map.recommendLevel[1]} · 经验${formatNumber(map.expPerMinute)}/分 · 金币${formatNumber(map.goldPerMinute)}/分</div>
      </div>`;
    }

    content.innerHTML = html;

    content.querySelectorAll('.map-go-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mapId = btn.dataset.map;
        if (switchMap(mapId)) {
          showToast(`前往 ${MAP_CONFIG[mapId]?.name}`, 'info');
          render();
        }
      });
    });
  }

  EventBus.on(EVENTS.MAP_SWITCHED, render);
  EventBus.on(EVENTS.MAP_UNLOCKED, render);
  page._render = render;
  render();
}

function initZodiacPage() {
  const page = document.getElementById('page-zodiac');
  if (!page) return;
  page.innerHTML = '<div style="padding:12px;overflow-y:auto;height:100%"><div id="zodiac-content"></div></div>';

  const ZODIAC_CFG_MAP = new Map(ZODIAC_ANIMAL_CONFIG.map(c => [c.animalId, c]));
  const QUALITY_COLORS = { none:'#666', low:'#9ca3af', mid:'#22c55e', high:'#3b82f6', elite:'#a855f7', immortal:'#f59e0b', legendary:'#ef4444' };
  const QUALITY_NAMES = { none:'未获得', low:'下品', mid:'中品', high:'上品', elite:'极品', immortal:'仙品', legendary:'传奇' };
  const STAT_LABELS = { attack:'攻击', defense:'防御', maxHp:'生命', maxMp:'法力', magicAttack:'魔攻', magicDefense:'魔防', critRate:'暴击率', critDamage:'暴击伤害', dodgeRate:'闪避率', attackSpeed:'攻速', hpRegen:'回血', mpRegen:'回蓝', expBonus:'经验加成', goldBonus:'金币加成', magicFind:'掉宝率', allStatsPercent:'全属性%' };
  const PCT_STATS = new Set(['critRate','critDamage','dodgeRate','attackSpeed','expBonus','goldBonus','magicFind','allStatsPercent']);

  function fmtStat(type, val) {
    if (val == null) return '0';
    return PCT_STATS.has(type) ? (val * 100).toFixed(1) + '%' : formatNumber(Math.floor(val));
  }

  function calcStat(animalId, quality, level) {
    if (level < 1 || quality === 'none') return 0;
    const cfg = ZODIAC_CFG_MAP.get(animalId);
    if (!cfg) return 0;
    return (cfg.baseValue[quality] || 0) + (cfg.growthPerLevel[quality] || 0) * (level - 1);
  }

  function render() {
    const content = document.getElementById('zodiac-content');
    if (!content) return;
    const progress = ZodiacSystem.getProgress ? ZodiacSystem.getProgress() : { animals: [] };
    const animals = progress.animals || [];
    const equipped = animals.filter(a => a.level > 0 && a.isEquipped).length;

    let html = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <span style="font-size:16px;color:#ffd700;font-weight:bold">🐲 生肖</span>
      <span style="font-size:12px;color:#b09878">${equipped}/12 已激活</span>
    </div>`;

    const setStatus = ZodiacSystem.getSetBonusStatus ? ZodiacSystem.getSetBonusStatus() : null;
    if (setStatus && setStatus.activeBonuses && setStatus.activeBonuses.length > 0) {
      html += '<div style="background:#2a1f15;border:1px solid #6b5238;border-radius:6px;padding:8px;margin-bottom:12px">';
      html += '<div style="color:#ffd700;font-size:12px;font-weight:bold;margin-bottom:4px">套装效果</div>';
      for (const b of setStatus.activeBonuses) {
        html += `<div style="font-size:11px;color:#22c55e">✓ ${b.name || ''}: ${b.desc || ''}</div>`;
      }
      html += '</div>';
    }

    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">';
    for (let i = 0; i < 12; i++) {
      const animal = animals[i] || { animalId: i + 1, quality: 'none', level: 0 };
      const cfg = ZODIAC_CFG_MAP.get(animal.animalId);
      if (!cfg) continue;
      const q = animal.quality || 'none';
      const color = QUALITY_COLORS[q] || '#666';
      const active = animal.level > 0;
      const statVal = active ? calcStat(animal.animalId, q, animal.level) : 0;
      const statLabel = STAT_LABELS[cfg.statType] || cfg.statType;

      html += `<div style="background:${active ? '#2a1f15' : '#1a0f0a'};border:2px solid ${active ? color : '#3d2e1e'};border-radius:8px;padding:8px 6px;text-align:center;cursor:pointer;opacity:${active ? '1' : '0.5'}" class="zodiac-cell" data-id="${animal.animalId}">
        <div style="font-size:22px">${cfg.icon}</div>
        <div style="font-size:12px;font-weight:bold;color:${color}">${cfg.name}</div>
        ${active
          ? `<div style="font-size:9px;color:${color}">${QUALITY_NAMES[q]}</div>
             <div style="font-size:10px;color:#ffd700;margin-top:2px">${statLabel} +${fmtStat(cfg.statType, statVal)}</div>`
          : `<div style="font-size:9px;color:#7a6548">未获得</div>
             <div style="font-size:9px;color:#5a4a38;margin-top:2px">${statLabel}</div>`}
      </div>`;
    }
    html += '</div>';

    const totalStats = ZodiacSystem.getTotalStats ? ZodiacSystem.getTotalStats() : {};
    const statKeys = Object.keys(totalStats).filter(k => totalStats[k]);
    if (statKeys.length > 0) {
      html += '<div style="background:#2a1f15;border:1px solid #6b5238;border-radius:8px;padding:10px 12px;margin-top:12px">';
      html += '<div style="font-size:13px;color:#ffd700;font-weight:bold;margin-bottom:6px">✦ 生肖总属性加成</div>';
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:3px 14px">';
      for (const k of statKeys) {
        html += `<div style="display:flex;justify-content:space-between;font-size:11px;padding:2px 0;border-bottom:1px solid rgba(107,82,56,0.3)">
          <span style="color:#b8a88a">${STAT_LABELS[k] || k}</span>
          <span style="color:#e8d5b5;font-weight:bold">+${fmtStat(k, totalStats[k])}</span>
        </div>`;
      }
      html += '</div></div>';
    }

    content.innerHTML = html;

    content.querySelectorAll('.zodiac-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const aid = Number(cell.dataset.id);
        _showZodiacDetail(aid, animals, ZODIAC_CFG_MAP, QUALITY_COLORS, QUALITY_NAMES, STAT_LABELS, PCT_STATS, fmtStat, calcStat);
      });
    });
  }

  EventBus.on(EVENTS.ZODIAC_UPGRADED, render);
  EventBus.on(EVENTS.ZODIAC_SET_BONUS, render);
  page._render = render;
  render();
}

function _showZodiacDetail(animalId, animals, cfgMap, qColors, qNames, statLabels, pctStats, fmtStat, calcStat) {
  const animal = animals.find(a => a.animalId === animalId);
  if (!animal) return;
  const cfg = cfgMap.get(animalId);
  if (!cfg) return;
  const active = animal.level > 0 && animal.quality !== 'none';
  const q = animal.quality || 'none';
  const color = qColors[q] || '#666';
  const statVal = active ? calcStat(animalId, q, animal.level) : 0;
  const qOrder = ['low','mid','high','elite','immortal','legendary'];
  const curQi = qOrder.indexOf(q);

  let h = `<div style="position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center" id="zodiac-detail-ov">
    <div style="background:#2a1f15;border:2px solid ${color};border-radius:12px;padding:16px;width:80%;max-width:300px">
      <div style="text-align:center;font-size:48px">${cfg.icon}</div>
      <div style="text-align:center;font-size:17px;font-weight:bold;color:${color}">${cfg.name}</div>
      <div style="text-align:center;font-size:11px;color:#b8a88a;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #5a4a38">
        ${active ? `<span style="color:${color}">${qNames[q]}</span> · ` : '<span style="color:#666">未获得</span> · '}${cfg.element}属 · ${cfg.desc}
      </div>`;

  if (active) {
    h += `<div style="text-align:center;font-size:20px;font-weight:bold;color:#ffd700;margin:8px 0;text-shadow:0 0 8px rgba(255,215,0,.3)">
      <span style="font-size:12px;color:#b8a88a;font-weight:normal">${statLabels[cfg.statType] || cfg.statType} </span>+${fmtStat(cfg.statType, statVal)}
    </div>`;
  }

  h += '<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin:8px 0">';
  for (let i = 0; i < qOrder.length; i++) {
    const qk = qOrder[i];
    const qc = qColors[qk] || '#666';
    const isCur = i === curQi;
    const isBelow = i < curQi;
    const style = isCur
      ? `color:${qc};border-color:${qc};font-weight:bold`
      : isBelow
        ? 'color:#5a4a38;border-color:#3a2a1a;text-decoration:line-through'
        : 'color:#7a6a5a;border-color:#5a4a38';
    h += `<span style="padding:3px 8px;border-radius:4px;font-size:10px;border:1px solid;${style}">${qNames[qk]}</span>`;
  }
  h += '</div>';

  if (!active) {
    h += '<div style="text-align:center;color:#666;font-size:12px;margin:14px 0">击杀怪物有几率掉落生肖</div>';
  }

  h += `<div style="display:block;padding:10px 0;border:1px solid #5a4a38;border-radius:6px;background:#2e2218;color:#b8a88a;font-size:13px;text-align:center;cursor:pointer;margin-top:8px" id="zodiac-detail-close">关闭</div>
    </div></div>`;

  const existing = document.getElementById('zodiac-detail-ov');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', h);

  const ov = document.getElementById('zodiac-detail-ov');
  ov.addEventListener('click', (e) => {
    if (e.target === ov || e.target.id === 'zodiac-detail-close') ov.remove();
  });
}

function initSkillPage() {
  const page = document.getElementById('page-skill');
  if (!page) return;
  page.innerHTML = '<div style="padding:12px;overflow-y:auto;height:100%"><div id="skill-content"></div></div>';

  function render() {
    const content = document.getElementById('skill-content');
    if (!content) return;
    const p = PlayerSystem.getPlayer();
    if (!p) return;
    const unlocked = SkillSystem.getUnlockedSkills();
    const allDefs = SkillSystem.getAllSkillDefs();
    const gold = EconomySystem.getGold ? EconomySystem.getGold() : 0;
    const mats = EquipmentSystem.getMaterials ? EquipmentSystem.getMaterials() : {};
    const pages = mats.skill_book_page || 0;

    let html = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <span style="font-size:16px;color:#ffd700;font-weight:bold">📜 技能</span>
      <span style="font-size:12px;color:#b09878">📜技能书页: <span style="color:#fbbf24">${pages}</span></span>
    </div>`;

    for (const def of allDefs) {
      const isUnlocked = unlocked.find(s => s.id === def.id);
      const lv = isUnlocked ? isUnlocked.currentLevel : 0;
      const locked = !isUnlocked;
      const borderColor = locked ? '#3d2e1e' : (def.color || '#6b5238');
      const opacity = locked ? '0.5' : '1';

      html += `<div style="background:#2a1f15;border:1px solid ${borderColor};border-radius:8px;padding:10px;margin-bottom:8px;opacity:${opacity}">`;
      html += `<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">`;
      html += `<div>`;
      html += `<span style="font-size:14px;font-weight:bold;color:${locked ? '#7a6548' : (def.color || '#e8d5b5')}">${def.name}</span>`;
      if (locked) {
        html += ` <span style="font-size:11px;color:#7a6548">🔒 Lv.${def.unlockLevel}解锁</span>`;
      } else {
        html += ` <span style="font-size:11px;color:#fbbf24">Lv.${lv}/${def.maxLevel}</span>`;
      }
      html += `</div>`;
      html += `<span style="font-size:10px;color:#7a6548;padding:2px 6px;background:#1a0f0a;border-radius:4px">${def.type === 'passive' ? '被动' : def.type === 'summon' ? '召唤' : '主动'}</span>`;
      html += `</div>`;

      html += `<div style="font-size:11px;color:#b09878;margin-bottom:6px">${_getSkillDesc(def, lv)}</div>`;

      if (def.manaCost > 0 && !locked) {
        html += `<div style="font-size:10px;color:#3b82f6;margin-bottom:4px">蓝耗: ${def.manaCost} MP${def.cooldownMs > 0 ? ` · CD: ${(def.cooldownMs / 1000).toFixed(0)}s` : ''}</div>`;
      }

      if (isUnlocked && lv < def.maxLevel) {
        const cost = SkillSystem.getUpgradeCost(def.id);
        if (cost) {
          const canAffordGold = gold >= cost.gold;
          const canAffordPages = pages >= cost.bookPages;
          const canUpgrade = canAffordGold && canAffordPages;
          html += `<div style="display:flex;align-items:center;gap:6px;margin-top:6px">`;
          html += `<button class="btn btn-sm ${canUpgrade ? 'btn-primary' : 'btn-secondary'} skill-upgrade-btn" data-id="${def.id}" style="font-size:11px;padding:4px 10px">升级 → Lv.${lv + 1}</button>`;
          html += `<span style="font-size:10px;color:${canAffordPages ? '#22c55e' : '#ef4444'}">📜${pages}/${cost.bookPages}</span>`;
          html += `<span style="font-size:10px;color:${canAffordGold ? '#22c55e' : '#ef4444'}">💰${formatNumber(cost.gold)}</span>`;
          html += `</div>`;
        }
      } else if (isUnlocked && lv >= def.maxLevel) {
        html += `<div style="font-size:10px;color:#fbbf24;margin-top:4px">✅ 已满级</div>`;
      }

      html += `</div>`;
    }

    html += `<div style="background:#1a0f0a;border:1px solid #3d2e1e;border-radius:8px;padding:10px;margin-top:12px">
      <div style="font-size:12px;color:#7a6548;font-weight:bold;margin-bottom:6px">升级费用表</div>`;
    for (const cost of SKILL_UPGRADE_COSTS) {
      html += `<div style="font-size:10px;color:#b09878;padding:2px 0">Lv.${cost.targetLevel}: 📜${cost.bookPages}页 + 💰${formatNumber(cost.gold)}</div>`;
    }
    html += `</div>`;

    content.innerHTML = html;

    content.querySelectorAll('.skill-upgrade-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const result = SkillSystem.upgradeSkill(id);
        if (!result.success) showToast(result.reason, 'warning');
        render();
      });
    });
  }

  EventBus.on(EVENTS.SKILL_CHANGED, render);
  EventBus.on(EVENTS.SKILL_UNLOCKED, render);
  EventBus.on(EVENTS.SKILL_UPGRADED, render);
  EventBus.on(EVENTS.GOLD_CHANGED, render);
  EventBus.on(EVENTS.INVENTORY_CHANGED, render);
  page._render = render;
  render();
}

function _getSkillDesc(def, lv) {
  const e = def.effect;
  const s = def.levelScaling || {};
  if (!lv || lv === 0) {
    if (e.type === 'damage') return `攻击时有几率触发，造成 ${(e.multiplier * 100).toFixed(0)}% 攻击伤害`;
    if (e.type === 'heal') return `低血量自动治愈，恢复 ${(e.healRatio * 100).toFixed(0)}%+${e.flatHeal} HP`;
    if (e.type === 'dot') return `对目标施加持续毒伤`;
    if (e.type === 'buff') return `对BOSS时自动爆发，${Math.floor((e.durationMs || 0) / 1000)}秒内技能伤害提升 ${(e.value * 100).toFixed(0)}%`;
    if (e.type === 'shield') return `受伤时部分伤害转为MP消耗`;
    if (e.type === 'damage_reduction') return `被动减伤`;
    if (e.type === 'spell_boost') return `提升魔法伤害`;
    if (e.type === 'summon') return `召唤战斗伙伴`;
    return def.desc || '';
  }
  if (e.type === 'damage') {
    const cur = e.multiplier + (s.multiplierPerLevel || 0) * (lv - 1);
    const next = lv < def.maxLevel ? cur + (s.multiplierPerLevel || 0) : cur;
    return `${(cur * 100).toFixed(0)}% 攻击伤害${lv < def.maxLevel ? ` → Lv.${lv + 1}: ${(next * 100).toFixed(0)}%` : ''}`;
  }
  if (e.type === 'heal') {
    const curR = e.healRatio + (s.healRatioPerLevel || 0) * (lv - 1);
    const curF = e.flatHeal + (s.flatHealPerLevel || 0) * (lv - 1);
    return `恢复 ${(curR * 100).toFixed(0)}%+${curF.toFixed(0)} HP`;
  }
  if (e.type === 'dot') {
    const cur = e.value + (s.valuePerLevel || 0) * (lv - 1);
    return `${(cur * 100).toFixed(0)}% 持续毒伤 (${(e.durationMs / 1000)}s，最多${e.maxStacks}层)`;
  }
  if (e.type === 'buff') {
    const cur = e.value + (s.valuePerLevel || 0) * (lv - 1);
    const next = lv < def.maxLevel ? cur + (s.valuePerLevel || 0) : cur;
    return `${Math.floor((e.durationMs || 0) / 1000)}秒内技能伤害提升 ${(cur * 100).toFixed(0)}%${lv < def.maxLevel ? ` → Lv.${lv + 1}: ${(next * 100).toFixed(0)}%` : ''}`;
  }
  if (e.type === 'shield') {
    const cur = e.value + (s.valuePerLevel || 0) * (lv - 1);
    return `吸收 ${(cur * 100).toFixed(0)}% 伤害转MP消耗 (×${e.mpCostRatio})`;
  }
  if (e.type === 'damage_reduction') {
    const cur = e.value + (s.valuePerLevel || 0) * (lv - 1);
    return `被动减伤 ${(cur * 100).toFixed(0)}%`;
  }
  if (e.type === 'spell_boost') {
    const cur = e.value + (s.valuePerLevel || 0) * (lv - 1);
    return `魔法伤害提升 ${(cur * 100).toFixed(0)}%`;
  }
  if (e.type === 'summon') {
    const cur = e.inheritRatio + (s.inheritPerLevel || 0) * (lv - 1);
    return `召唤物继承 ${(cur * 100).toFixed(0)}% 攻击力`;
  }
  return '';
}

function startUILoop() {
  if (uiUpdateTimer) clearInterval(uiUpdateTimer);
  let potionTick = 0;
  uiUpdateTimer = setInterval(() => {
    updateHeaderUI();
    updateCombatUI();
    potionTick++;
    if (potionTick % 4 === 0) {
      PotionSystem.tryAutoPotion();
    }
  }, 250);
}

window.Game = { switchMap, challengeBoss };

function setupSettingsPanel() {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeBtn = document.getElementById('settings-close-btn');
  const recreateBtn = document.getElementById('settings-recreate-btn');
  const exportBtn = document.getElementById('settings-export-btn');
  const importBtn = document.getElementById('settings-import-btn');

  if (!settingsBtn || !settingsModal) return;

  settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
  });
  closeBtn?.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.style.display = 'none';
  });

  exportBtn?.addEventListener('click', () => {
    try {
      const code = SaveSystem.exportSave();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          showToast('存档码已复制到剪贴板', 'success');
        }).catch(() => {
          prompt('复制下方存档码：', code);
        });
      } else {
        prompt('复制下方存档码：', code);
      }
    } catch {
      showToast('导出失败', 'error');
    }
  });

  importBtn?.addEventListener('click', () => {
    settingsModal.style.display = 'none';
    const importModal = document.getElementById('import-modal');
    if (importModal) importModal.style.display = 'flex';
  });

  const importCancelBtn = document.getElementById('import-cancel-btn');
  const importDoBtn = document.getElementById('import-do-btn');
  const importModal = document.getElementById('import-modal');

  importCancelBtn?.addEventListener('click', () => {
    if (importModal) importModal.style.display = 'none';
  });
  importDoBtn?.addEventListener('click', () => {
    const textarea = document.getElementById('import-textarea');
    const code = textarea?.value?.trim();
    if (!code) { showToast('请粘贴存档码', 'error'); return; }
    const ok = SaveSystem.importSave(code);
    if (ok) {
      showToast('导入成功，即将重新加载…', 'success');
      setTimeout(() => location.reload(), 800);
    } else {
      showToast('存档码无效', 'error');
    }
  });

  const confirmModal = document.getElementById('recreate-confirm-modal');
  const confirmBtn = document.getElementById('recreate-confirm-btn');
  const cancelBtn = document.getElementById('recreate-cancel-btn');

  recreateBtn?.addEventListener('click', () => {
    settingsModal.style.display = 'none';
    if (confirmModal) confirmModal.style.display = 'flex';
  });
  cancelBtn?.addEventListener('click', () => {
    if (confirmModal) confirmModal.style.display = 'none';
  });
  confirmBtn?.addEventListener('click', () => {
    CombatSystem.stopCombat();
    SaveSystem.clearAll();
    showToast('角色数据已清除，正在重新加载…', 'success');
    setTimeout(() => location.reload(), 800);
  });
}

async function boot() {
  const loaderFill = document.getElementById('loader-fill');
  if (loaderFill) loaderFill.style.width = '30%';

  await new Promise(r => setTimeout(r, 300));
  if (loaderFill) loaderFill.style.width = '60%';

  const saveData = SaveSystem.loadAll();
  if (loaderFill) loaderFill.style.width = '90%';

  await new Promise(r => setTimeout(r, 200));
  if (loaderFill) loaderFill.style.width = '100%';

  await new Promise(r => setTimeout(r, 300));
  document.getElementById('loading-screen').style.display = 'none';

  setupPageSwitching();
  setupBattleLog();
  setupItemDropHandler();
  setupBossKillHandler();
  setupLevelUpHandler();
  setupSkillHandlers();
  setupOfflineModal();
  createToastContainer();
  setupSettingsPanel();

  if (saveData && saveData.player) {
    restoreGame(saveData);
    document.getElementById('game-screen').style.display = 'flex';
    initEquipPage();
    initBagPage();
    initSkillPage();
    initMapPage();
    initZodiacPage();
    startUILoop();
  } else {
    setupCreateScreen();
    document.getElementById('create-screen').style.display = 'flex';

    const origCreateBtn = document.getElementById('create-btn');
    const origHandler = origCreateBtn._clickHandler;
    const observer = new MutationObserver(() => {
      if (document.getElementById('game-screen').style.display === 'flex') {
        observer.disconnect();
        initEquipPage();
        initBagPage();
        initSkillPage();
        initMapPage();
        initZodiacPage();
      }
    });
    observer.observe(document.getElementById('game-screen'), { attributes: true, attributeFilter: ['style'] });
  }
}

boot();

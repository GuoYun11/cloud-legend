import EventBus, { EVENTS } from '../../utils/EventBus.js';
import * as PlayerSystem from '../../systems/PlayerSystem.js';
import CombatSystem from '../../systems/CombatSystem.js';
import { formatNumber } from '../../utils/Formatter.js';
import { getExpToLevel } from '../../config/PlayerConfig.js';

let els = {};
let unsubs = [];
let logQueue = [];
let damageFloats = [];
let _sessionStart = 0;

const JOB_NAMES = { warrior: '战士', mage: '法师', taoist: '道士' };

function cacheEls() {
  const ids = [
    'page-main',
    'player-name', 'player-level', 'player-job',
    'hp-bar', 'hp-fill', 'hp-text',
    'mp-bar', 'mp-fill', 'mp-text',
    'exp-bar', 'exp-fill', 'exp-text',
    'combat-map-name', 'monster-name', 'monster-hp-bar', 'monster-hp-fill', 'monster-hp-text',
    'battle-log-list', 'battle-area',
    'session-kills', 'session-exp', 'session-gold', 'session-drops'
  ];
  for (const id of ids) {
    els[id] = document.getElementById(id);
  }
}

function buildDynamicUI() {
  const page = els['page-main'];
  if (!page) return;

  if (!els['hp-fill']) {
    const hpBar = els['hp-bar'];
    if (hpBar && !hpBar.querySelector('.bar-fill')) {
      injectBarInner(hpBar, 'hp');
    }
  }
  if (!els['mp-fill']) {
    const mpBar = els['mp-bar'];
    if (mpBar && !mpBar.querySelector('.bar-fill')) {
      injectBarInner(mpBar, 'mp');
    }
  }
  if (!els['exp-fill']) {
    const expBar = els['exp-bar'];
    if (expBar && !expBar.querySelector('.bar-fill')) {
      injectBarInner(expBar, 'exp');
    }
  }
  if (!els['monster-hp-fill']) {
    const mhpBar = els['monster-hp-bar'];
    if (mhpBar && !mhpBar.querySelector('.bar-fill')) {
      injectBarInner(mhpBar, 'monster-hp');
    }
  }

  cacheEls();
}

function injectBarInner(bar, prefix) {
  Object.assign(bar.style, {
    position: 'relative', height: '18px', borderRadius: '9px',
    overflow: 'hidden', background: 'var(--color-' + prefix.replace('monster-', '') + '-bg, #222)'
  });

  const fill = document.createElement('div');
  fill.id = prefix + '-fill';
  fill.className = 'bar-fill';
  Object.assign(fill.style, {
    position: 'absolute', left: '0', top: '0', height: '100%', width: '100%',
    borderRadius: '9px', transition: 'width 0.3s ease',
    background: getBarColor(prefix)
  });
  bar.appendChild(fill);

  const text = document.createElement('span');
  text.id = prefix + '-text';
  text.className = 'bar-text';
  Object.assign(text.style, {
    position: 'absolute', left: '0', top: '0', width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 'var(--font-size-xs)', color: '#fff', fontWeight: 'bold',
    textShadow: '0 1px 2px rgba(0,0,0,0.8)', zIndex: '1'
  });
  bar.appendChild(text);
}

function getBarColor(prefix) {
  if (prefix.includes('hp')) return 'linear-gradient(90deg, #b91c1c, #dc2626)';
  if (prefix.includes('mp')) return 'linear-gradient(90deg, #1d4ed8, #2563eb)';
  if (prefix.includes('exp')) return 'linear-gradient(90deg, #15803d, #16a34a)';
  return 'linear-gradient(90deg, #b91c1c, #dc2626)';
}

function setBar(fillEl, textEl, current, max) {
  if (!fillEl) return;
  const pct = max > 0 ? Math.min(1, Math.max(0, current / max)) : 0;
  fillEl.style.width = (pct * 100).toFixed(1) + '%';
  if (textEl) textEl.textContent = formatNumber(current) + '/' + formatNumber(max);
}

function setText(el, val) {
  if (el) el.textContent = val;
}

function updatePlayerInfo() {
  const player = PlayerSystem.getPlayer();
  if (!player) return;
  setText(els['player-name'], player.name);
  setText(els['player-level'], 'Lv.' + player.level);
  setText(els['player-job'], JOB_NAMES[player.job] || player.job);
}

function updateBars() {
  const player = PlayerSystem.getPlayer();
  if (!player) return;
  const stats = PlayerSystem.getFinalStats();
  if (!stats) return;

  setBar(els['hp-fill'], els['hp-text'], player.currentHp, stats.maxHp);
  setBar(els['mp-fill'], els['mp-text'], player.currentMp, stats.maxMp);

  const nextExp = getExpToLevel(player.level + 1);
  setBar(els['exp-fill'], els['exp-text'], player.exp, nextExp);
}

function updateMonster() {
  const state = CombatSystem.getState();
  if (!state) return;

  setText(els['combat-map-name'], state.mapId ? getMapDisplayName(state.mapId) : '未知区域');

  const m = state.currentMonster;
  if (m) {
    setText(els['monster-name'], (m.isBoss ? '🔥 ' : '') + m.name + ' Lv.' + m.level);
    setBar(els['monster-hp-fill'], els['monster-hp-text'], m.currentHp, m.maxHp);
    if (els['monster-hp-bar']) els['monster-hp-bar'].style.display = '';
  } else {
    setText(els['monster-name'], '寻找怪物中...');
    if (els['monster-hp-bar']) els['monster-hp-bar'].style.display = 'none';
  }
}

function getMapDisplayName(mapId) {
  try {
    const cfg = window._mapConfig?.[mapId];
    return cfg?.name || mapId;
  } catch { return mapId; }
}

function updateSession() {
  const state = CombatSystem.getState();
  if (!state) return;
  const s = state.sessionStats;
  setText(els['session-kills'], formatNumber(s.kills));
  setText(els['session-exp'], formatNumber(s.expGained));
  setText(els['session-gold'], formatNumber(s.goldGained));
  setText(els['session-drops'], formatNumber(s.itemsDropped));
}

function appendLog(entry) {
  const list = els['battle-log-list'];
  if (!list) return;

  const li = document.createElement('div');
  li.className = 'log-entry';
  Object.assign(li.style, {
    padding: '3px 8px', fontSize: 'var(--font-size-xs)',
    borderBottom: '1px solid rgba(107,82,56,0.2)',
    animation: 'fadeIn 0.2s ease'
  });

  const color = getLogColor(entry.type, entry.isCrit);
  li.style.color = color;

  let text = entry.text || '';
  if (entry.isCrit) text = '💥暴击! ' + text;

  li.textContent = text;
  list.appendChild(li);

  while (list.children.length > 20) {
    list.removeChild(list.firstChild);
  }
  list.scrollTop = list.scrollHeight;
}

function getLogColor(type, isCrit) {
  if (isCrit) return 'var(--color-crit)';
  switch (type) {
    case 'player_attack': return 'var(--color-text-gold)';
    case 'monster_attack': return 'var(--color-danger)';
    case 'kill': return 'var(--color-success)';
    case 'boss': return '#ff8c00';
    case 'death': return '#ff4040';
    case 'revive': return 'var(--color-heal)';
    case 'bonus': return '#ffd700';
    case 'miss': case 'dodge': return 'var(--color-miss)';
    default: return 'var(--color-text-secondary)';
  }
}

function showDamageFloat(data) {
  const area = els['battle-area'];
  if (!area) return;

  const el = document.createElement('div');
  el.className = 'damage-float';

  const isPlayer = data.source === 'player';
  const text = data.isCrit ? '暴击 ' + formatNumber(data.damage) : formatNumber(data.damage);
  el.textContent = (isPlayer ? '-' : '') + text;

  Object.assign(el.style, {
    position: 'absolute',
    left: (20 + Math.random() * 60) + '%',
    top: (30 + Math.random() * 30) + '%',
    color: data.isCrit ? 'var(--color-crit)' : (isPlayer ? 'var(--color-text-gold)' : 'var(--color-danger)'),
    fontSize: data.isCrit ? '20px' : '16px',
    fontWeight: 'bold',
    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
    pointerEvents: 'none',
    zIndex: '10',
    animation: 'floatUp 1s ease-out forwards'
  });

  area.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function showKillEffect() {
  const area = els['battle-area'];
  if (!area) return;

  const flash = document.createElement('div');
  Object.assign(flash.style, {
    position: 'absolute', inset: '0',
    background: 'radial-gradient(circle, rgba(255,215,0,0.3), transparent 70%)',
    pointerEvents: 'none', animation: 'fadeIn 0.2s ease forwards',
    zIndex: '5'
  });
  area.appendChild(flash);
  setTimeout(() => flash.remove(), 400);
}

function showDropFloat(data) {
  const area = els['battle-area'];
  if (!area) return;

  const el = document.createElement('div');
  const name = data.item?.configId || '未知物品';
  el.textContent = '🎁 ' + name;
  Object.assign(el.style, {
    position: 'absolute', left: '50%', top: '60%',
    transform: 'translateX(-50%)',
    color: '#ffd700', fontSize: '14px', fontWeight: 'bold',
    textShadow: '0 0 8px rgba(255,215,0,0.6)',
    pointerEvents: 'none', animation: 'floatUp 1.5s ease-out forwards',
    zIndex: '10'
  });
  area.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

function showLevelUpEffect() {
  const area = els['battle-area'];
  if (!area) return;

  const el = document.createElement('div');
  el.textContent = '⚔ 升级!';
  Object.assign(el.style, {
    position: 'absolute', left: '50%', top: '20%',
    transform: 'translateX(-50%)',
    color: '#ffd700', fontSize: '26px', fontWeight: 'bold',
    textShadow: '0 0 16px rgba(255,215,0,0.8)',
    pointerEvents: 'none', animation: 'floatUp 2s ease-out forwards',
    zIndex: '20'
  });
  area.appendChild(el);
  setTimeout(() => el.remove(), 2000);

  const lvEl = els['player-level'];
  if (lvEl) {
    lvEl.style.animation = 'glow 0.6s ease 3';
    setTimeout(() => { lvEl.style.animation = ''; }, 1800);
  }
}

function bindEvents() {
  unsubs.push(EventBus.on(EVENTS.COMBAT_LOG, entry => {
    appendLog(entry);
  }));

  unsubs.push(EventBus.on(EVENTS.COMBAT_DAMAGE, data => {
    updateMonster();
    showDamageFloat(data);
  }));

  unsubs.push(EventBus.on(EVENTS.PLAYER_HP_CHANGED, () => {
    updateBars();
  }));

  unsubs.push(EventBus.on(EVENTS.PLAYER_LEVEL_UP, () => {
    updatePlayerInfo();
    updateBars();
    showLevelUpEffect();
  }));

  unsubs.push(EventBus.on(EVENTS.COMBAT_MONSTER_DEAD, () => {
    showKillEffect();
    updateSession();
  }));

  unsubs.push(EventBus.on(EVENTS.COMBAT_ITEM_DROP, data => {
    showDropFloat(data);
    updateSession();
  }));

  unsubs.push(EventBus.on(EVENTS.GOLD_CHANGED, () => {
    updateSession();
  }));

  unsubs.push(EventBus.on(EVENTS.PLAYER_EXP_GAINED, () => {
    updateBars();
    updateSession();
  }));
}

function unbindEvents() {
  for (const unsub of unsubs) unsub();
  unsubs.length = 0;
}

function onShow() {
  cacheEls();
  buildDynamicUI();
  bindEvents();
  _sessionStart = Date.now();

  const existing = CombatSystem.getBattleLog();
  for (const entry of existing) appendLog(entry);

  update();
}

function onHide() {
  unbindEvents();
}

function update() {
  updatePlayerInfo();
  updateBars();
  updateMonster();
  updateSession();
}

export { onShow, onHide, update };
export default { onShow, onHide, update };

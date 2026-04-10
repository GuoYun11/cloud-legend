import EventBus, { EVENTS } from '../../utils/EventBus.js';
import { MAP_CONFIG, MAP_ORDER } from '../../config/MapConfig.js';
import MapSystem from '../../systems/MapSystem.js';
import CombatSystem from '../../systems/CombatSystem.js';
import { MONSTER_CONFIG } from '../../config/MonsterConfig.js';
import { formatNumber, formatTime } from '../../utils/Formatter.js';

let els = {};
let unsubs = [];
let listContainer = null;
let mapCards = {};

function cacheEls() {
  els.page = document.getElementById('page-map');
}

function getOrderedMaps() {
  if (MAP_ORDER && MAP_ORDER.length) return MAP_ORDER.map(id => MAP_CONFIG[id]).filter(Boolean);
  return Object.values(MAP_CONFIG).sort((a, b) => (a.unlockLevel || 0) - (b.unlockLevel || 0));
}

function buildList() {
  const page = els.page;
  if (!page) return;

  listContainer = page.querySelector('.map-list');
  if (!listContainer) {
    listContainer = document.createElement('div');
    listContainer.className = 'map-list';
    Object.assign(listContainer.style, {
      flex: '1', overflowY: 'auto', padding: 'var(--space-sm)',
      display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)'
    });
    page.appendChild(listContainer);
  }

  listContainer.innerHTML = '';
  mapCards = {};

  const maps = getOrderedMaps();
  const progress = MapSystem.getProgress();
  const currentMapId = progress.currentMapId;

  for (const cfg of maps) {
    const card = createMapCard(cfg, progress, currentMapId);
    listContainer.appendChild(card);
    mapCards[cfg.id] = card;
  }
}

function createMapCard(cfg, progress, currentMapId) {
  const unlocked = progress.unlockedMaps.includes(cfg.id);
  const isCurrent = cfg.id === currentMapId;

  const card = document.createElement('div');
  card.className = 'panel map-card';
  card.dataset.mapId = cfg.id;

  Object.assign(card.style, {
    opacity: unlocked ? '1' : '0.5',
    position: 'relative',
    transition: 'all var(--transition-fast)'
  });

  if (isCurrent) {
    card.style.border = '1px solid var(--color-border-gold)';
    card.style.boxShadow = 'var(--shadow-gold)';
  }

  const header = document.createElement('div');
  Object.assign(header.style, {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 'var(--space-sm)'
  });

  const nameWrap = document.createElement('div');
  const nameEl = document.createElement('span');
  nameEl.style.cssText = 'font-size:var(--font-size-lg);font-weight:bold;color:var(--color-text-gold);';
  nameEl.textContent = cfg.name;

  const zoneTag = document.createElement('span');
  zoneTag.style.cssText = 'font-size:var(--font-size-xs);color:var(--color-text-muted);margin-left:8px;' +
    'padding:2px 6px;border-radius:var(--radius-sm);background:var(--color-bg-active);';
  zoneTag.textContent = cfg.zone;

  nameWrap.appendChild(nameEl);
  nameWrap.appendChild(zoneTag);

  const actionBtn = document.createElement('button');
  actionBtn.className = isCurrent ? 'btn btn-secondary btn-sm' : (unlocked ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm');
  actionBtn.textContent = isCurrent ? '当前' : (unlocked ? '前往' : '未解锁');
  actionBtn.disabled = isCurrent || !unlocked;

  if (!isCurrent && unlocked) {
    actionBtn.addEventListener('click', () => {
      if (window.Game && window.Game.switchMap) {
        window.Game.switchMap(cfg.id);
      } else {
        MapSystem.switchMap(cfg.id);
      }
      buildList();
    });
  }

  header.appendChild(nameWrap);
  header.appendChild(actionBtn);
  card.appendChild(header);

  const info = document.createElement('div');
  info.style.cssText = 'display:flex;gap:var(--space-lg);flex-wrap:wrap;font-size:var(--font-size-sm);margin-bottom:var(--space-sm);';

  const lvRange = cfg.recommendLevel;
  info.innerHTML =
    `<span style="color:var(--color-text-secondary)">推荐 <b style="color:var(--color-text-primary)">Lv.${lvRange[0]}-${lvRange[1]}</b></span>` +
    `<span style="color:var(--color-text-secondary)">经验 <b style="color:var(--color-exp)">${formatNumber(cfg.expPerMinute)}/分</b></span>` +
    `<span style="color:var(--color-text-secondary)">金币 <b style="color:var(--color-gold)">${formatNumber(cfg.goldPerMinute)}/分</b></span>`;

  card.appendChild(info);

  if (!unlocked && cfg.unlockCondition) {
    const lockInfo = document.createElement('div');
    lockInfo.style.cssText = 'font-size:var(--font-size-xs);color:var(--color-warning);padding:4px 0;';
    lockInfo.textContent = '🔒 ' + getUnlockText(cfg.unlockCondition);
    card.appendChild(lockInfo);
  }

  if (unlocked && cfg.bosses && cfg.bosses.length > 0) {
    const bossSection = document.createElement('div');
    bossSection.className = 'boss-section';
    bossSection.style.cssText = 'margin-top:var(--space-sm);padding-top:var(--space-sm);border-top:1px solid var(--color-border);';

    const bossTitle = document.createElement('div');
    bossTitle.style.cssText = 'font-size:var(--font-size-xs);color:var(--color-crit);font-weight:bold;margin-bottom:var(--space-xs);';
    bossTitle.textContent = '🔥 BOSS';
    bossSection.appendChild(bossTitle);

    for (const bossId of cfg.bosses) {
      const bossRow = createBossRow(bossId, cfg.id);
      if (bossRow) bossSection.appendChild(bossRow);
    }

    card.appendChild(bossSection);
  }

  return card;
}

function createBossRow(bossId, mapId) {
  const bossCfg = MONSTER_CONFIG[bossId];
  if (!bossCfg) return null;

  const row = document.createElement('div');
  row.className = 'boss-row';
  row.dataset.bossId = bossId;
  Object.assign(row.style, {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '4px 0', fontSize: 'var(--font-size-sm)'
  });

  const left = document.createElement('div');
  left.style.cssText = 'display:flex;align-items:center;gap:6px;';

  const bossName = document.createElement('span');
  bossName.style.color = '#ff8c00';
  bossName.textContent = bossCfg.name;

  const bossLv = document.createElement('span');
  bossLv.style.cssText = 'font-size:var(--font-size-xs);color:var(--color-text-muted);';
  bossLv.textContent = 'Lv.' + bossCfg.level;

  left.appendChild(bossName);
  left.appendChild(bossLv);

  const right = document.createElement('div');
  right.style.cssText = 'display:flex;align-items:center;gap:6px;';

  const cdSpan = document.createElement('span');
  cdSpan.className = 'boss-cd';
  cdSpan.dataset.bossId = bossId;
  cdSpan.style.cssText = 'font-size:var(--font-size-xs);color:var(--color-text-muted);';

  const remaining = MapSystem.getBossRespawnTime(bossId);
  if (remaining > 0) {
    cdSpan.textContent = formatTime(remaining);
  }

  const challBtn = document.createElement('button');
  challBtn.className = 'btn btn-danger btn-sm';
  challBtn.style.cssText = 'padding:2px 10px;min-height:24px;font-size:var(--font-size-xs);';
  challBtn.textContent = '挑战';

  if (remaining > 0) {
    challBtn.disabled = true;
    challBtn.style.opacity = '0.5';
  }

  challBtn.addEventListener('click', () => {
    const progress = MapSystem.getProgress();
    if (progress.currentMapId !== mapId) {
      if (window.Game && window.Game.switchMap) {
        window.Game.switchMap(mapId);
      } else {
        MapSystem.switchMap(mapId);
      }
    }
    CombatSystem.challengeBoss(bossId);
  });

  right.appendChild(cdSpan);
  right.appendChild(challBtn);

  row.appendChild(left);
  row.appendChild(right);
  return row;
}

function getUnlockText(cond) {
  if (!cond) return '';
  if (cond.type === 'level') return `需要等级 ${cond.value}`;
  if (cond.type === 'boss_kill') {
    const boss = MONSTER_CONFIG[cond.bossId];
    return `需要击杀 ${boss?.name || cond.bossId}`;
  }
  return '未知条件';
}

function updateBossTimers() {
  const cdSpans = listContainer?.querySelectorAll('.boss-cd');
  if (!cdSpans) return;

  for (const span of cdSpans) {
    const bossId = span.dataset.bossId;
    const remaining = MapSystem.getBossRespawnTime(bossId);

    span.textContent = remaining > 0 ? formatTime(remaining) : '';

    const row = span.closest('.boss-row');
    if (!row) continue;
    const btn = row.querySelector('.btn-danger');
    if (!btn) continue;
    btn.disabled = remaining > 0;
    btn.style.opacity = remaining > 0 ? '0.5' : '1';
  }
}

function bindEvents() {
  unsubs.push(EventBus.on(EVENTS.MAP_SWITCHED, () => {
    buildList();
  }));

  unsubs.push(EventBus.on(EVENTS.MAP_UNLOCKED, () => {
    buildList();
  }));

  unsubs.push(EventBus.on(EVENTS.BOSS_KILLED, () => {
    updateBossTimers();
  }));
}

function unbindEvents() {
  for (const unsub of unsubs) unsub();
  unsubs.length = 0;
}

function onShow() {
  cacheEls();
  buildList();
  bindEvents();
}

function onHide() {
  unbindEvents();
}

function update() {
  updateBossTimers();
}

export { onShow, onHide, update };
export default { onShow, onHide, update };

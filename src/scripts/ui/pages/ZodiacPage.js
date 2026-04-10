import EventBus, { EVENTS } from '../../utils/EventBus.js';
import * as ZodiacSystem from '../../systems/ZodiacSystem.js';
import { ZODIAC_ANIMAL_CONFIG, ZODIAC_QUALITY_CONFIG, ZODIAC_SET_BONUS } from '../../config/ZodiacConfig.js';
import { formatNumber, formatPercent } from '../../utils/Formatter.js';

const PERCENT_STAT_TYPES = new Set([
  'critRate', 'critDamage', 'dodgeRate', 'attackSpeed',
  'expBonus', 'goldBonus', 'magicFind', 'allStatsPercent'
]);

const STAT_LABELS = {
  attack: '攻击', defense: '防御', maxHp: '生命', maxMp: '法力',
  magicAttack: '魔攻', magicDefense: '魔防',
  critRate: '暴击率', critDamage: '暴击伤害', dodgeRate: '闪避率',
  attackSpeed: '攻速', hpRegen: '回血', mpRegen: '回蓝',
  expBonus: '经验加成', goldBonus: '金币加成', magicFind: '掉宝率',
  allStatsPercent: '全属性%'
};

const QUALITY_ORDER = ['none', 'low', 'mid', 'high', 'elite', 'immortal', 'legendary'];
const CFG_MAP = new Map(ZODIAC_ANIMAL_CONFIG.map(c => [c.animalId, c]));

let container = null;
let unsubs = [];

function fmtVal(statType, val) {
  if (val == null) return '0';
  return PERCENT_STAT_TYPES.has(statType) ? formatPercent(val) : formatNumber(val);
}

function calcAnimalStat(animalId, quality, level) {
  if (level < 1 || quality === 'none') return 0;
  const cfg = CFG_MAP.get(animalId);
  if (!cfg) return 0;
  return (cfg.baseValue[quality] || 0) + (cfg.growthPerLevel[quality] || 0) * (level - 1);
}

function injectStyles() {
  if (document.getElementById('zp-css')) return;
  const s = document.createElement('style');
  s.id = 'zp-css';
  s.textContent = `
.zp-wrap{padding:12px 10px 20px;color:#e8d5b5;overflow-y:auto;height:100%;box-sizing:border-box;-webkit-overflow-scrolling:touch}
.zp-hdr{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;margin-bottom:10px;background:linear-gradient(135deg,#2a1f14,#352818);border:1px solid #6b5238;border-radius:8px;box-shadow:inset 0 1px 0 rgba(255,215,0,.08)}
.zp-hdr-t{font-size:18px;font-weight:bold;color:#ffd700;text-shadow:0 0 8px rgba(255,215,0,.3)}
.zp-hdr-c{font-size:13px;color:#b8a88a}
.zp-hdr-c b{color:#ffd700;font-size:15px}
.zp-bonus{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.zp-badge{flex:1;min-width:70px;padding:8px 4px;background:linear-gradient(180deg,#2e2218,#261c12);border:1px solid #5a4a38;border-radius:6px;text-align:center;font-size:10px;color:#666;transition:all .2s}
.zp-badge.on{border-color:#8b7355;color:#ffd700;background:linear-gradient(180deg,#3e3018,#352818);box-shadow:0 0 8px rgba(255,215,0,.12)}
.zp-badge-ct{font-size:14px;font-weight:bold;display:block;margin-bottom:2px}
.zp-badge-nm{font-size:9px;display:block;opacity:.8}
.zp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px}
.zp-cell{background:linear-gradient(180deg,#3a2a1c,#33251a);border:2px solid #4a3a2a;border-radius:8px;padding:8px 4px;text-align:center;cursor:pointer;transition:border-color .15s,transform .1s}
.zp-cell:active{transform:scale(.95)}
.zp-cell.owned{border-color:#6b5238}
.zp-icon{font-size:28px;line-height:1.2;filter:grayscale(1) opacity(.4)}
.zp-cell.owned .zp-icon{filter:none}
.zp-aname{font-size:11px;margin-top:2px;font-weight:bold}
.zp-cell:not(.owned) .zp-aname{color:#666}
.zp-alv{font-size:9px;color:#ffd700;margin-top:1px}
.zp-aquality{font-size:9px;margin-top:1px}
.zp-total{background:linear-gradient(180deg,#2e2218,#261c12);border:1px solid #6b5238;border-radius:8px;padding:10px 12px}
.zp-total-t{font-size:13px;color:#ffd700;margin-bottom:6px;text-shadow:0 0 4px rgba(255,215,0,.2)}
.zp-total-g{display:grid;grid-template-columns:1fr 1fr;gap:3px 14px}
.zp-total-i{display:flex;justify-content:space-between;font-size:11px;padding:2px 0;border-bottom:1px solid rgba(107,82,56,.3)}
.zp-total-l{color:#b8a88a}.zp-total-v{color:#e8d5b5;font-weight:bold}
.zp-ov{position:absolute;inset:0;background:rgba(0,0,0,.78);z-index:100;display:flex;align-items:center;justify-content:center;animation:zpFade .15s}
@keyframes zpFade{from{opacity:0}to{opacity:1}}
.zp-pn{background:linear-gradient(180deg,#43321e,#3a2a18);border:2px solid #8b7355;border-radius:12px;width:82%;max-height:78%;overflow-y:auto;padding:16px;box-shadow:0 0 40px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,215,0,.06)}
.zp-pn-icon{text-align:center;font-size:48px;line-height:1.2;margin-bottom:4px}
.zp-pn-t{font-size:17px;font-weight:bold;text-align:center;margin-bottom:2px}
.zp-pn-m{text-align:center;font-size:11px;color:#b8a88a;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #5a4a38}
.zp-pn-desc{text-align:center;font-size:12px;color:#b8a88a;margin-bottom:8px}
.zp-pn-stat{text-align:center;font-size:20px;font-weight:bold;color:#ffd700;margin-bottom:8px;text-shadow:0 0 8px rgba(255,215,0,.3)}
.zp-pn-stat span{font-size:12px;color:#b8a88a;font-weight:normal}
.zp-pn-qlist{margin:8px 0;display:flex;gap:4px;flex-wrap:wrap;justify-content:center}
.zp-pn-qtag{padding:3px 8px;border-radius:4px;font-size:10px;border:1px solid #5a4a38;background:#2a1f14}
.zp-pn-qtag.cur{border-width:2px;font-weight:bold}
.zp-btn-cl{display:block;padding:10px 0;border:1px solid #5a4a38;border-radius:6px;background:#2e2218;color:#b8a88a;font-size:13px;text-align:center;cursor:pointer;margin-top:8px;width:100%}
`;
  document.head.appendChild(s);
}

function render() {
  if (!container) return;
  let wrap = container.querySelector('.zp-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'zp-wrap';
    container.appendChild(wrap);
  }

  const progress = ZodiacSystem.getProgress();
  if (!progress) { wrap.innerHTML = '<div style="text-align:center;padding:40px;color:#7a6a5a">生肖数据加载中…</div>'; return; }

  const animals = progress.animals;
  const bonusStatus = ZodiacSystem.getSetBonusStatus();
  const totalStats = ZodiacSystem.getTotalStats();
  const activatedCount = animals.filter(a => a.level >= 1).length;

  let h = '';

  h += `<div class="zp-hdr">
    <span class="zp-hdr-t">🐲 生肖</span>
    <span class="zp-hdr-c">已激活 <b>${activatedCount}</b>/12</span>
  </div>`;

  h += `<div class="zp-bonus">`;
  for (const tier of ZODIAC_SET_BONUS) {
    const on = bonusStatus.equippedCount >= tier.count;
    h += `<div class="zp-badge${on ? ' on' : ''}">
      <span class="zp-badge-ct">${tier.count}</span>
      <span class="zp-badge-nm">${tier.name}</span>
    </div>`;
  }
  h += `</div>`;

  h += `<div class="zp-grid">`;
  for (const animal of animals) {
    const cfg = CFG_MAP.get(animal.animalId);
    if (!cfg) continue;
    const owned = animal.level >= 1 && animal.quality !== 'none';
    const qCfg = ZODIAC_QUALITY_CONFIG[animal.quality] || ZODIAC_QUALITY_CONFIG.none;
    const borderColor = owned ? qCfg.color : '#4a3a2a';
    h += `<div class="zp-cell${owned ? ' owned' : ''}" data-aid="${animal.animalId}" style="border-color:${borderColor}">
      <div class="zp-icon">${cfg.icon}</div>
      <div class="zp-aname" style="color:${owned ? qCfg.color : ''}">${cfg.name}</div>`;
    if (owned) {
      h += `<div class="zp-aquality" style="color:${qCfg.color}">${qCfg.name}</div>`;
    }
    h += `</div>`;
  }
  h += `</div>`;

  const statKeys = Object.keys(totalStats);
  if (statKeys.length > 0) {
    h += `<div class="zp-total"><div class="zp-total-t">✦ 生肖加成</div><div class="zp-total-g">`;
    for (const k of statKeys) {
      if (totalStats[k]) {
        h += `<div class="zp-total-i"><span class="zp-total-l">${STAT_LABELS[k] || k}</span><span class="zp-total-v">+${fmtVal(k, totalStats[k])}</span></div>`;
      }
    }
    h += `</div></div>`;
  }

  wrap.innerHTML = h;
}

function showOverlay(animalId) {
  closeOverlay();
  const animal = ZodiacSystem.getAnimal(animalId);
  if (!animal) return;
  const cfg = CFG_MAP.get(animalId);
  if (!cfg) return;

  const owned = animal.level >= 1 && animal.quality !== 'none';
  const qCfg = ZODIAC_QUALITY_CONFIG[animal.quality] || ZODIAC_QUALITY_CONFIG.none;
  const color = qCfg.color;
  const statVal = calcAnimalStat(animalId, animal.quality, animal.level);

  let h = `<div class="zp-pn">`;
  h += `<div class="zp-pn-icon">${cfg.icon}</div>`;
  h += `<div class="zp-pn-t" style="color:${color}">${cfg.name}</div>`;
  h += `<div class="zp-pn-m">`;
  if (owned) {
    h += `<span style="color:${color}">${qCfg.name}</span> · ${cfg.element}属`;
  } else {
    h += `<span style="color:#666">未获得</span> · ${cfg.element}属`;
  }
  h += `</div>`;

  h += `<div class="zp-pn-desc">${cfg.desc}</div>`;

  if (owned) {
    h += `<div class="zp-pn-stat"><span>${STAT_LABELS[cfg.statType] || cfg.statType} </span>${fmtVal(cfg.statType, statVal)}</div>`;
  }

  h += `<div class="zp-pn-qlist">`;
  const curIdx = QUALITY_ORDER.indexOf(animal.quality);
  for (let qi = 1; qi < QUALITY_ORDER.length; qi++) {
    const q = QUALITY_ORDER[qi];
    const qc = ZODIAC_QUALITY_CONFIG[q];
    const isCur = qi === curIdx;
    const isBelow = qi < curIdx;
    const style = isCur
      ? `color:${qc.color};border-color:${qc.color}`
      : isBelow
        ? `color:#5a4a38;border-color:#3a2a1a;text-decoration:line-through`
        : `color:#7a6a5a;border-color:#5a4a38`;
    h += `<span class="zp-pn-qtag${isCur ? ' cur' : ''}" style="${style}">${qc.name}</span>`;
  }
  h += `</div>`;

  if (!owned) {
    h += `<div style="text-align:center;color:#666;font-size:12px;margin:14px 0">击杀怪物有几率掉落生肖</div>`;
  }

  h += `<div class="zp-btn-cl" data-act="close">关闭</div>`;
  h += `</div>`;

  const ov = document.createElement('div');
  ov.className = 'zp-ov';
  ov.innerHTML = h;
  container.appendChild(ov);

  ov.addEventListener('click', (e) => {
    if (e.target === ov) { closeOverlay(); return; }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'close') closeOverlay();
  });
}

function closeOverlay() {
  const ov = container?.querySelector('.zp-ov');
  if (ov) ov.remove();
}

function handleClick(e) {
  if (e.target.closest('.zp-ov')) return;
  const cell = e.target.closest('[data-aid]');
  if (cell) showOverlay(Number(cell.dataset.aid));
}

function onShow() {
  container = document.getElementById('page-zodiac');
  if (!container) return;
  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  injectStyles();
  render();
  container.addEventListener('click', handleClick);
  const refresh = () => render();
  unsubs.push(EventBus.on(EVENTS.ZODIAC_UPGRADED, refresh));
  unsubs.push(EventBus.on(EVENTS.ZODIAC_SET_BONUS, refresh));
}

function onHide() {
  closeOverlay();
  if (container) container.removeEventListener('click', handleClick);
  unsubs.forEach(fn => fn());
  unsubs = [];
}

function update() {}

export { onShow, onHide, update };
export default { onShow, onHide, update };

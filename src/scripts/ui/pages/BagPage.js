import EventBus, { EVENTS } from '../../utils/EventBus.js';
import EquipmentSystem from '../../systems/EquipmentSystem.js';
import * as EconomySystem from '../../systems/EconomySystem.js';
import { QUALITY_CONFIG, EQUIP_SLOT_NAMES, EQUIP_BASES, ENHANCE_CONFIG } from '../../config/EquipmentConfig.js';
import { formatNumber, getQualityColor, getQualityName } from '../../utils/Formatter.js';

const PERCENT_STATS = new Set([
  'critRate', 'critDamage', 'dodgeRate', 'attackSpeed',
  'expBonus', 'goldBonus', 'magicFind', 'damageReduction'
]);

const STAT_LABELS = {
  attack: '攻击', defense: '防御', maxHp: '生命', maxMp: '法力',
  magicAttack: '魔攻', magicDefense: '魔防',
  critRate: '暴击率', critDamage: '暴击伤害', dodgeRate: '闪避率',
  attackSpeed: '攻速', hpRegen: '回血', mpRegen: '回蓝',
  expBonus: '经验加成', goldBonus: '金币加成', magicFind: '掉宝率', damageReduction: '减伤'
};

let container = null;
let unsubs = [];

function fmtStat(key, val) {
  if (val == null) return '0';
  return PERCENT_STATS.has(key) ? Math.round(val * 100) + '%' : formatNumber(val);
}

function itemName(item) {
  return EQUIP_BASES[item.configId]?.name || '未知装备';
}

function calcSellPrice(item) {
  const base = EQUIP_BASES[item.configId];
  const qMult = QUALITY_CONFIG[item.quality]?.multiplier || 1;
  return Math.floor(((base?.requiredLevel || 1) * 5 + 20) * qMult * (1 + item.enhanceLevel * 0.15));
}

function injectStyles() {
  if (document.getElementById('bp-css')) return;
  const s = document.createElement('style');
  s.id = 'bp-css';
  s.textContent = `
.bp-wrap{display:flex;flex-direction:column;height:100%;color:#e8d5b5;box-sizing:border-box;overflow:hidden}
.bp-hdr{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;margin:10px 10px 0;background:linear-gradient(135deg,#2a1f14,#352818);border:1px solid #6b5238;border-radius:8px;box-shadow:inset 0 1px 0 rgba(255,215,0,.08);flex-shrink:0}
.bp-hdr-t{font-size:18px;font-weight:bold;color:#ffd700;text-shadow:0 0 8px rgba(255,215,0,.3)}
.bp-hdr-r{text-align:right;font-size:12px}
.bp-hdr-cap{color:#b8a88a}.bp-hdr-gold{color:#ffd700;font-size:13px}
.bp-empty{flex:1;display:flex;align-items:center;justify-content:center;color:#7a6a5a;font-size:14px}
.bp-list{flex:1;overflow-y:auto;padding:8px 10px;-webkit-overflow-scrolling:touch}
.bp-item{display:flex;align-items:stretch;background:linear-gradient(90deg,#3a2a1c,#35271a);border:1px solid #5a4a38;border-radius:6px;margin-bottom:6px;cursor:pointer;transition:border-color .15s,transform .1s;overflow:hidden}
.bp-item:active{transform:scale(.98);border-color:#8b7355}
.bp-qbar{width:4px;flex-shrink:0;border-radius:3px 0 0 3px}
.bp-info{flex:1;padding:8px 10px;min-width:0}
.bp-row1{display:flex;align-items:baseline;gap:6px}
.bp-name{font-size:13px;font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bp-enh{font-size:12px;color:#ffd700}
.bp-row2{font-size:10px;color:#8b7355;margin-top:2px}
.bp-row3{font-size:10px;color:#b8a88a;margin-top:2px}
.bp-lock{display:flex;align-items:center;justify-content:center;width:32px;font-size:14px;flex-shrink:0;color:#ffd700}
.bp-foot{padding:10px;flex-shrink:0}
.bp-sell-all{width:100%;padding:12px 0;border:1px solid #6b5238;border-radius:8px;background:linear-gradient(180deg,#4a3828,#3d2e1e);color:#e8d5b5;font-size:14px;font-weight:bold;text-align:center;cursor:pointer;transition:transform .1s}
.bp-sell-all:active{transform:scale(.97)}
.bp-ov{position:absolute;inset:0;background:rgba(0,0,0,.78);z-index:100;display:flex;align-items:center;justify-content:center;animation:bpFade .15s}
@keyframes bpFade{from{opacity:0}to{opacity:1}}
.bp-pn{background:linear-gradient(180deg,#43321e,#3a2a18);border:2px solid #8b7355;border-radius:12px;width:88%;max-height:78%;overflow-y:auto;padding:16px;box-shadow:0 0 40px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,215,0,.06)}
.bp-pn-t{font-size:17px;font-weight:bold;text-align:center;margin-bottom:2px}
.bp-pn-m{text-align:center;font-size:11px;color:#b8a88a;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #5a4a38}
.bp-pn-sec{margin-bottom:10px}
.bp-pn-lb{font-size:11px;color:#8b7355;border-bottom:1px solid #5a4a38;padding-bottom:3px;margin-bottom:5px}
.bp-pn-st{display:flex;justify-content:space-between;font-size:12px;padding:2px 0}
.bp-pn-st .l{color:#b8a88a}.bp-pn-st .v{color:#e8d5b5}
.bp-pn-st.extra .v{color:#22c55e}
.bp-pn-btns{display:flex;gap:8px;margin-top:14px}
.bp-btn{flex:1;padding:10px 0;border:1px solid #6b5238;border-radius:6px;background:linear-gradient(180deg,#4a3828,#3d2e1e);color:#e8d5b5;font-size:13px;font-weight:bold;text-align:center;cursor:pointer;transition:transform .1s}
.bp-btn:active{transform:scale(.95)}
.bp-btn-grn{border-color:#1a6b1a;background:linear-gradient(180deg,#2a4a1a,#1e3a14);color:#88cc88}
.bp-btn-rd{border-color:#6b2020;background:linear-gradient(180deg,#4a2020,#3a1818);color:#ff7777}
.bp-btn-yl{border-color:#6b6020;background:linear-gradient(180deg,#4a4020,#3a3518);color:#ffd700}
.bp-btn-cl{display:block;padding:10px 0;border:1px solid #5a4a38;border-radius:6px;background:#2e2218;color:#b8a88a;font-size:13px;text-align:center;cursor:pointer;margin-top:8px;width:100%}
.bp-msg{text-align:center;font-size:12px;padding:6px 10px;border-radius:4px;margin-top:6px}
.bp-sell-price{font-size:10px;color:#ffd700;text-align:center;margin-top:4px}
`;
  document.head.appendChild(s);
}

function render() {
  if (!container) return;
  let wrap = container.querySelector('.bp-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'bp-wrap';
    container.appendChild(wrap);
  }

  const { capacity, items } = EquipmentSystem.getInventory();
  const gold = EconomySystem.getGold();

  let h = '';

  h += `<div class="bp-hdr">
    <span class="bp-hdr-t">📦 背包</span>
    <div class="bp-hdr-r">
      <div class="bp-hdr-cap">${items.length}/${capacity}</div>
      <div class="bp-hdr-gold">💰 ${formatNumber(gold)}</div>
    </div>
  </div>`;

  if (items.length === 0) {
    h += `<div class="bp-empty">背包空空如也…</div>`;
  } else {
    h += `<div class="bp-list">`;
    const sorted = [...items].sort((a, b) => {
      const qo = ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'normal'];
      const qi = qo.indexOf(a.quality) - qo.indexOf(b.quality);
      return qi !== 0 ? qi : b.level - a.level;
    });
    for (const item of sorted) {
      const color = getQualityColor(item.quality);
      const name = itemName(item);
      const enh = item.enhanceLevel > 0 ? `+${item.enhanceLevel}` : '';
      const slotName = EQUIP_SLOT_NAMES[item.slot] || '';
      const mainStat = Object.entries(item.stats)[0];
      const statTxt = mainStat ? `${STAT_LABELS[mainStat[0]] || mainStat[0]} ${fmtStat(mainStat[0], mainStat[1])}` : '';
      h += `<div class="bp-item" data-id="${item.instanceId}">
        <div class="bp-qbar" style="background:${color}"></div>
        <div class="bp-info">
          <div class="bp-row1">
            <span class="bp-name" style="color:${color}">${name}</span>
            ${enh ? `<span class="bp-enh">${enh}</span>` : ''}
          </div>
          <div class="bp-row2">Lv.${item.level} · ${slotName} · ${getQualityName(item.quality)}</div>
          <div class="bp-row3">${statTxt}</div>
        </div>
        ${item.isLocked ? '<div class="bp-lock">🔒</div>' : ''}
      </div>`;
    }
    h += `</div>`;
  }

  const normalCount = items.filter(i => i.quality === 'normal' && !i.isLocked).length;
  h += `<div class="bp-foot">
    <div class="bp-sell-all" data-act="batchsell">一键出售普通装备${normalCount > 0 ? ` (${normalCount}件)` : ''}</div>
  </div>`;

  wrap.innerHTML = h;
}

function showOverlay(instanceId) {
  closeOverlay();
  const { items } = EquipmentSystem.getInventory();
  const item = items.find(i => i.instanceId === instanceId);
  if (!item) return;

  const color = getQualityColor(item.quality);
  const qName = getQualityName(item.quality);
  const name = itemName(item);
  const price = calcSellPrice(item);
  const eMult = 1 + item.enhanceLevel * ENHANCE_CONFIG.bonusPerLevel;

  let h = `<div class="bp-pn">`;
  h += `<div class="bp-pn-t" style="color:${color}">${name}</div>`;
  h += `<div class="bp-pn-m"><span style="color:${color}">${qName}</span> · Lv.${item.level}`;
  if (item.enhanceLevel > 0) h += ` · <span style="color:#ffd700">+${item.enhanceLevel}</span>`;
  h += ` · ${EQUIP_SLOT_NAMES[item.slot] || ''}</div>`;

  h += `<div class="bp-pn-sec"><div class="bp-pn-lb">基础属性</div>`;
  for (const [k, v] of Object.entries(item.stats)) {
    const enhanced = PERCENT_STATS.has(k) ? +(v * eMult).toFixed(4) : Math.floor(v * eMult);
    h += `<div class="bp-pn-st"><span class="l">${STAT_LABELS[k] || k}</span><span class="v">${fmtStat(k, enhanced)}</span></div>`;
  }
  h += `</div>`;

  if (item.extraStats?.length > 0) {
    h += `<div class="bp-pn-sec"><div class="bp-pn-lb">附加词条</div>`;
    for (const { stat, value } of item.extraStats) {
      h += `<div class="bp-pn-st extra"><span class="l">${STAT_LABELS[stat] || stat}</span><span class="v">+${fmtStat(stat, value)}</span></div>`;
    }
    h += `</div>`;
  }

  h += `<div class="bp-sell-price">出售价格: ${formatNumber(price)} 金币</div>`;
  h += `<div id="bp-msg-box"></div>`;
  h += `<div class="bp-pn-btns">`;
  h += `<div class="bp-btn bp-btn-grn" data-act="equip">穿戴</div>`;
  h += `<div class="bp-btn bp-btn-rd" data-act="sell">出售</div>`;
  h += `<div class="bp-btn bp-btn-yl" data-act="lock">${item.isLocked ? '解锁' : '锁定'}</div>`;
  h += `</div>`;
  h += `<div class="bp-btn-cl" data-act="close">关闭</div>`;
  h += `</div>`;

  const ov = document.createElement('div');
  ov.className = 'bp-ov';
  ov.innerHTML = h;
  container.appendChild(ov);

  ov.addEventListener('click', (e) => {
    if (e.target === ov) { closeOverlay(); return; }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (!act) return;
    const msgBox = ov.querySelector('#bp-msg-box');

    if (act === 'close') {
      closeOverlay();
    } else if (act === 'equip') {
      const res = EquipmentSystem.equip(item.instanceId);
      if (res.success) {
        closeOverlay();
        render();
      } else {
        msgBox.innerHTML = `<div class="bp-msg" style="background:#3a1a1a;color:#ff6666">${res.reason}</div>`;
      }
    } else if (act === 'sell') {
      if (item.isLocked) {
        msgBox.innerHTML = `<div class="bp-msg" style="background:#3a1a1a;color:#ff6666">装备已锁定，无法出售</div>`;
        return;
      }
      const res = EquipmentSystem.sellItem(item.instanceId);
      if (res.success) {
        closeOverlay();
        render();
      } else {
        msgBox.innerHTML = `<div class="bp-msg" style="background:#3a1a1a;color:#ff6666">${res.reason}</div>`;
      }
    } else if (act === 'lock') {
      item.isLocked = !item.isLocked;
      showOverlay(item.instanceId);
      render();
    }
  });
}

function batchSell() {
  const { items } = EquipmentSystem.getInventory();
  const ids = items.filter(i => i.quality === 'normal' && !i.isLocked).map(i => i.instanceId);
  let count = 0, total = 0;
  for (const id of ids) {
    const res = EquipmentSystem.sellItem(id);
    if (res.success) { count++; total += res.gold; }
  }
  render();
  if (count > 0) {
    const msgEl = container.querySelector('.bp-sell-all');
    if (msgEl) {
      msgEl.textContent = `已出售${count}件，获得${formatNumber(total)}金币`;
      setTimeout(() => render(), 1500);
    }
  }
}

function closeOverlay() {
  const ov = container?.querySelector('.bp-ov');
  if (ov) ov.remove();
}

function handleClick(e) {
  if (e.target.closest('.bp-ov')) return;
  const sellBtn = e.target.closest('[data-act="batchsell"]');
  if (sellBtn) { batchSell(); return; }
  const row = e.target.closest('[data-id]');
  if (row) showOverlay(row.dataset.id);
}

function onShow() {
  container = document.getElementById('page-bag');
  if (!container) return;
  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  injectStyles();
  render();
  container.addEventListener('click', handleClick);
  const refresh = () => render();
  unsubs.push(EventBus.on(EVENTS.INVENTORY_CHANGED, refresh));
  unsubs.push(EventBus.on(EVENTS.GOLD_CHANGED, refresh));
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

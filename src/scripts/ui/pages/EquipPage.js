import EventBus, { EVENTS } from '../../utils/EventBus.js';
import EquipmentSystem from '../../systems/EquipmentSystem.js';
import * as PlayerSystem from '../../systems/PlayerSystem.js';
import { EQUIP_SLOT_NAMES, QUALITY_CONFIG, SET_CONFIG, EQUIP_BASES, ENHANCE_CONFIG } from '../../config/EquipmentConfig.js';
import { formatNumber, formatPercent, getQualityColor, getQualityName } from '../../utils/Formatter.js';

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

const STAT_ORDER = [
  'attack', 'magicAttack', 'defense', 'magicDefense', 'maxHp', 'maxMp',
  'critRate', 'critDamage', 'dodgeRate', 'attackSpeed',
  'hpRegen', 'mpRegen', 'expBonus', 'goldBonus', 'magicFind'
];

const MAIN_SLOTS = ['weapon', 'helmet', 'armor', 'necklace', 'leftRing', 'rightRing', 'belt', 'shoes'];
const ACC_SLOTS = ['medal', 'hat', 'drum', 'talisman'];

let container = null;
let unsubs = [];

function fmtStat(key, val) {
  if (val == null) return '0';
  return PERCENT_STATS.has(key) ? formatPercent(val) : formatNumber(val);
}

function itemName(item) {
  return EQUIP_BASES[item.configId]?.name || '未知装备';
}

function calcPower(stats) {
  if (!stats) return 0;
  return Math.floor(
    (stats.attack || 0) * 1.5 + (stats.magicAttack || 0) * 1.5 +
    (stats.defense || 0) * 1.2 + (stats.magicDefense || 0) +
    (stats.maxHp || 0) * 0.1 + (stats.critRate || 0) * 800 +
    (stats.critDamage || 0) * 300 + (stats.dodgeRate || 0) * 600 +
    (stats.attackSpeed || 0) * 400 + (stats.hpRegen || 0) * 2
  );
}

function injectStyles() {
  if (document.getElementById('ep-css')) return;
  const s = document.createElement('style');
  s.id = 'ep-css';
  s.textContent = `
.ep-wrap{padding:12px 10px 20px;color:#e8d5b5;overflow-y:auto;height:100%;box-sizing:border-box;-webkit-overflow-scrolling:touch}
.ep-hdr{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;margin-bottom:10px;background:linear-gradient(135deg,#2a1f14 0%,#352818 100%);border:1px solid #6b5238;border-radius:8px;box-shadow:inset 0 1px 0 rgba(255,215,0,.08)}
.ep-hdr-t{font-size:18px;font-weight:bold;color:#ffd700;text-shadow:0 0 8px rgba(255,215,0,.3)}
.ep-hdr-p{font-size:13px;color:#b8a88a}
.ep-hdr-p b{color:#ffd700;font-size:15px}
.ep-grid{display:flex;gap:8px;margin-bottom:10px}
.ep-sec{background:linear-gradient(180deg,#2e2218 0%,#261c12 100%);border:1px solid #6b5238;border-radius:8px;padding:8px}
.ep-sec-t{font-size:11px;color:#8b7355;text-align:center;margin-bottom:6px;letter-spacing:3px}
.ep-slots{display:grid;gap:5px}
.ep-slot{background:#4a3828;border:1px solid #5a4a38;border-radius:6px;padding:7px 5px;text-align:center;cursor:pointer;min-height:50px;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:border-color .15s,transform .1s}
.ep-slot:active{transform:scale(.96);border-color:#8b7355}
.ep-slot-n{font-size:11px;font-weight:bold;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.ep-slot-s{font-size:9px;color:#b8a88a;margin-top:2px}
.ep-slot-e{font-size:11px;color:#7a6a5a}
.ep-sets{background:linear-gradient(180deg,#2e2218,#261c12);border:1px solid #6b5238;border-radius:8px;padding:10px 12px;margin-bottom:10px}
.ep-sets-t{font-size:13px;color:#ffd700;margin-bottom:6px;text-shadow:0 0 4px rgba(255,215,0,.2)}
.ep-set-r{margin-bottom:6px}
.ep-set-nm{color:#f0c060;font-weight:bold;font-size:12px}
.ep-set-ct{color:#b8a88a;font-size:11px}
.ep-set-b{font-size:10px;padding:1px 0 1px 10px}
.ep-sp{background:linear-gradient(180deg,#2e2218,#261c12);border:1px solid #6b5238;border-radius:8px;padding:10px 12px}
.ep-sp-t{font-size:13px;color:#ffd700;margin-bottom:8px;text-shadow:0 0 4px rgba(255,215,0,.2)}
.ep-sp-g{display:grid;grid-template-columns:1fr 1fr;gap:3px 14px}
.ep-sp-i{display:flex;justify-content:space-between;font-size:11px;padding:2px 0;border-bottom:1px solid rgba(107,82,56,.3)}
.ep-sp-l{color:#b8a88a}.ep-sp-v{color:#e8d5b5;font-weight:bold}
.ep-ov{position:absolute;inset:0;background:rgba(0,0,0,.78);z-index:100;display:flex;align-items:center;justify-content:center;animation:epFadeIn .15s}
@keyframes epFadeIn{from{opacity:0}to{opacity:1}}
.ep-pn{background:linear-gradient(180deg,#43321e 0%,#3a2a18 100%);border:2px solid #8b7355;border-radius:12px;width:88%;max-height:78%;overflow-y:auto;padding:16px;box-shadow:0 0 40px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,215,0,.06)}
.ep-pn-t{font-size:17px;font-weight:bold;text-align:center;margin-bottom:2px}
.ep-pn-m{text-align:center;font-size:11px;color:#b8a88a;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #5a4a38}
.ep-pn-sec{margin-bottom:10px}
.ep-pn-lb{font-size:11px;color:#8b7355;border-bottom:1px solid #5a4a38;padding-bottom:3px;margin-bottom:5px}
.ep-pn-st{display:flex;justify-content:space-between;font-size:12px;padding:2px 0}
.ep-pn-st .l{color:#b8a88a}.ep-pn-st .v{color:#e8d5b5}
.ep-pn-st.extra .v{color:#22c55e}
.ep-pn-btns{display:flex;gap:8px;margin-top:14px}
.ep-btn{flex:1;padding:10px 0;border:1px solid #6b5238;border-radius:6px;background:linear-gradient(180deg,#4a3828,#3d2e1e);color:#e8d5b5;font-size:13px;font-weight:bold;text-align:center;cursor:pointer;transition:transform .1s}
.ep-btn:active{transform:scale(.95)}
.ep-btn-gd{border-color:#8b6914;background:linear-gradient(180deg,#5a4a1a,#4a3a10);color:#ffd700}
.ep-btn-rd{border-color:#6b2020;background:linear-gradient(180deg,#4a2020,#3a1818);color:#ff7777}
.ep-btn-cl{display:block;padding:10px 0;border:1px solid #5a4a38;border-radius:6px;background:#2e2218;color:#b8a88a;font-size:13px;text-align:center;cursor:pointer;margin-top:8px;width:100%}
.ep-msg{text-align:center;font-size:12px;padding:6px 10px;border-radius:4px;margin-top:6px}
`;
  document.head.appendChild(s);
}

function slotHTML(slot, item) {
  if (item) {
    const color = getQualityColor(item.quality);
    const name = itemName(item);
    const enh = item.enhanceLevel > 0 ? `<span style="color:#ffd700"> +${item.enhanceLevel}</span>` : '';
    const main = Object.entries(item.stats)[0];
    const stat = main ? `${STAT_LABELS[main[0]] || main[0]} ${fmtStat(main[0], main[1])}` : '';
    return `<div class="ep-slot" data-slot="${slot}" style="border-left:3px solid ${color}">
      <div class="ep-slot-n" style="color:${color}">${name}${enh}</div>
      <div class="ep-slot-s">${stat}</div>
    </div>`;
  }
  return `<div class="ep-slot" data-slot="${slot}">
    <div class="ep-slot-e">${EQUIP_SLOT_NAMES[slot]}</div>
  </div>`;
}

function render() {
  if (!container) return;
  let wrap = container.querySelector('.ep-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'ep-wrap';
    container.appendChild(wrap);
  }

  const { slots } = EquipmentSystem.getEquipped();
  const finalStats = PlayerSystem.getFinalStats();
  const setData = EquipmentSystem.getSetBonus();
  const power = calcPower(finalStats);

  let h = '';

  h += `<div class="ep-hdr">
    <span class="ep-hdr-t">⚔ 装备</span>
    <span class="ep-hdr-p">战力 <b>${formatNumber(power)}</b></span>
  </div>`;

  h += `<div class="ep-grid">`;
  h += `<div class="ep-sec" style="flex:1">
    <div class="ep-sec-t">主 装 备</div>
    <div class="ep-slots" style="grid-template-columns:1fr 1fr">`;
  for (const s of MAIN_SLOTS) h += slotHTML(s, slots[s]);
  h += `</div></div>`;

  h += `<div class="ep-sec" style="width:42%">
    <div class="ep-sec-t">配 饰</div>
    <div class="ep-slots" style="grid-template-columns:1fr 1fr">`;
  for (const s of ACC_SLOTS) h += slotHTML(s, slots[s]);
  h += `</div></div></div>`;

  const setEntries = Object.entries(setData);
  if (setEntries.length > 0) {
    h += `<div class="ep-sets"><div class="ep-sets-t">✦ 套装效果</div>`;
    for (const [setId, data] of setEntries) {
      const cfg = SET_CONFIG[setId];
      const total = cfg?.pieces?.length || 0;
      h += `<div class="ep-set-r"><span class="ep-set-nm">${data.name}</span><span class="ep-set-ct"> (${data.count}/${total})</span>`;
      for (const tier of cfg.setBonuses) {
        const active = data.count >= tier.count;
        const txt = Object.entries(tier.bonus).map(([k, v]) => `${STAT_LABELS[k] || k}+${fmtStat(k, v)}`).join(' ');
        h += `<div class="ep-set-b" style="color:${active ? '#88cc88' : '#555'}">${active ? '✓' : '○'} ${tier.count}件: ${txt}</div>`;
      }
      h += `</div>`;
    }
    h += `</div>`;
  }

  if (finalStats) {
    h += `<div class="ep-sp"><div class="ep-sp-t">📊 属性面板</div><div class="ep-sp-g">`;
    for (const k of STAT_ORDER) {
      const v = finalStats[k];
      if (v != null && v !== 0) {
        h += `<div class="ep-sp-i"><span class="ep-sp-l">${STAT_LABELS[k] || k}</span><span class="ep-sp-v">${fmtStat(k, v)}</span></div>`;
      }
    }
    h += `</div></div>`;
  }

  wrap.innerHTML = h;
}

function showOverlay(item, slot) {
  closeOverlay();
  const color = getQualityColor(item.quality);
  const qName = getQualityName(item.quality);
  const name = itemName(item);
  const canEnhance = item.enhanceLevel < ENHANCE_CONFIG.maxLevel;
  const eCost = canEnhance ? ENHANCE_CONFIG.goldCost(item.enhanceLevel) : 0;
  const eRate = canEnhance ? ENHANCE_CONFIG.successRate[item.enhanceLevel] : 0;
  const eMult = 1 + item.enhanceLevel * ENHANCE_CONFIG.bonusPerLevel;

  let h = `<div class="ep-pn">`;
  h += `<div class="ep-pn-t" style="color:${color}">${name}</div>`;
  h += `<div class="ep-pn-m"><span style="color:${color}">${qName}</span> · Lv.${item.level}`;
  if (item.enhanceLevel > 0) h += ` · <span style="color:#ffd700">+${item.enhanceLevel}</span>`;
  if (item.setId && SET_CONFIG[item.setId]) h += ` · ${SET_CONFIG[item.setId].name}`;
  h += `</div>`;

  h += `<div class="ep-pn-sec"><div class="ep-pn-lb">基础属性</div>`;
  for (const [k, v] of Object.entries(item.stats)) {
    const enhanced = PERCENT_STATS.has(k) ? +(v * eMult).toFixed(4) : Math.floor(v * eMult);
    h += `<div class="ep-pn-st"><span class="l">${STAT_LABELS[k] || k}</span><span class="v">${fmtStat(k, enhanced)}</span></div>`;
  }
  h += `</div>`;

  if (item.extraStats?.length > 0) {
    h += `<div class="ep-pn-sec"><div class="ep-pn-lb">附加词条</div>`;
    for (const { stat, value } of item.extraStats) {
      h += `<div class="ep-pn-st extra"><span class="l">${STAT_LABELS[stat] || stat}</span><span class="v">+${fmtStat(stat, value)}</span></div>`;
    }
    h += `</div>`;
  }

  if (item.setId && SET_CONFIG[item.setId]) {
    const cfg = SET_CONFIG[item.setId];
    const { slots: eqSlots } = EquipmentSystem.getEquipped();
    let cnt = 0;
    for (const eq of Object.values(eqSlots)) if (eq?.setId === item.setId) cnt++;
    h += `<div class="ep-pn-sec"><div class="ep-pn-lb">${cfg.name} (${cnt}/${cfg.pieces.length})</div>`;
    for (const tier of cfg.setBonuses) {
      const on = cnt >= tier.count;
      const txt = Object.entries(tier.bonus).map(([k, v]) => `${STAT_LABELS[k] || k}+${fmtStat(k, v)}`).join(' ');
      h += `<div style="font-size:11px;color:${on ? '#88cc88' : '#555'};padding:1px 0">${on ? '✓' : '○'} ${tier.count}件: ${txt}</div>`;
    }
    h += `</div>`;
  }

  h += `<div id="ep-msg-box"></div>`;
  h += `<div class="ep-pn-btns">`;
  if (canEnhance) {
    h += `<div class="ep-btn ep-btn-gd" data-act="enhance">强化<br><span style="font-size:10px;font-weight:normal">${formatNumber(eCost)}金 ${Math.round(eRate * 100)}%</span></div>`;
  }
  h += `<div class="ep-btn ep-btn-rd" data-act="unequip">卸下</div>`;
  h += `</div>`;
  h += `<div class="ep-btn-cl" data-act="close">关闭</div>`;
  h += `</div>`;

  const ov = document.createElement('div');
  ov.className = 'ep-ov';
  ov.innerHTML = h;
  container.appendChild(ov);

  ov.addEventListener('click', (e) => {
    if (e.target === ov) { closeOverlay(); return; }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (!act) return;

    if (act === 'close') {
      closeOverlay();
    } else if (act === 'enhance') {
      const res = EquipmentSystem.enhance(item.instanceId);
      const mb = ov.querySelector('#ep-msg-box');
      if (res.success) {
        mb.innerHTML = `<div class="ep-msg" style="background:#1a3a1a;color:#88cc88">强化成功！+${res.enhanceLevel}</div>`;
        render();
        setTimeout(() => showOverlay(item, slot), 60);
      } else {
        mb.innerHTML = `<div class="ep-msg" style="background:#3a1a1a;color:#ff6666">${res.reason}</div>`;
      }
    } else if (act === 'unequip') {
      const res = EquipmentSystem.unequip(slot);
      if (res.success) {
        closeOverlay();
        render();
      } else {
        const mb = ov.querySelector('#ep-msg-box');
        mb.innerHTML = `<div class="ep-msg" style="background:#3a1a1a;color:#ff6666">${res.reason}</div>`;
      }
    }
  });
}

function closeOverlay() {
  const ov = container?.querySelector('.ep-ov');
  if (ov) ov.remove();
}

function handleClick(e) {
  if (e.target.closest('.ep-ov')) return;
  const el = e.target.closest('[data-slot]');
  if (!el) return;
  const slot = el.dataset.slot;
  const { slots } = EquipmentSystem.getEquipped();
  if (slots[slot]) showOverlay(slots[slot], slot);
}

function onShow() {
  container = document.getElementById('page-equip');
  if (!container) return;
  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  injectStyles();
  render();
  container.addEventListener('click', handleClick);
  const refresh = () => render();
  unsubs.push(EventBus.on(EVENTS.EQUIP_CHANGED, refresh));
  unsubs.push(EventBus.on(EVENTS.STATS_CHANGED, refresh));
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

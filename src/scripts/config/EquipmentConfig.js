export const QUALITY_CONFIG = {
  normal:    { multiplier: 1.0, extraStats: 0, color: '#9ca3af', name: '普通' },
  uncommon:  { multiplier: 1.3, extraStats: 1, color: '#22c55e', name: '优秀' },
  rare:      { multiplier: 1.7, extraStats: 2, color: '#3b82f6', name: '稀有' },
  epic:      { multiplier: 2.3, extraStats: 3, color: '#a855f7', name: '史诗' },
  legendary: { multiplier: 3.0, extraStats: 4, color: '#f59e0b', name: '传说' },
  mythic:    { multiplier: 4.0, extraStats: 5, color: '#ef4444', name: '神话' }
};

export const EQUIP_SLOT_NAMES = {
  weapon: '武器', armor: '衣服', helmet: '头盔', necklace: '项链',
  leftRing: '左戒指', rightRing: '右戒指',
  leftBracelet: '左手镯', rightBracelet: '右手镯',
  belt: '腰带', shoes: '鞋子',
  medal: '勋章', hat: '斗笠', drum: '军鼓', talisman: '符咒'
};

export const RING_SLOTS = ['leftRing', 'rightRing'];
export const BRACELET_SLOTS = ['leftBracelet', 'rightBracelet'];

export const SET_CONFIG = {
  set_zuma: {
    name: '祖玛套装', minLevel: 12, job: 'all',
    baseStats: { attack: 30, defense: 25, maxHp: 200, magicDefense: 15 },
    pieces: [
      { configId: 'zuma_weapon', slot: 'weapon' },
      { configId: 'zuma_armor', slot: 'armor' },
      { configId: 'zuma_helmet', slot: 'helmet' },
      { configId: 'zuma_necklace', slot: 'necklace' },
      { configId: 'zuma_ring', slot: 'leftRing' },
      { configId: 'zuma_bracelet', slot: 'leftBracelet' },
      { configId: 'zuma_belt', slot: 'belt' },
      { configId: 'zuma_shoes', slot: 'shoes' }
    ],
    setBonuses: [
      { count: 2, bonus: { attack: 15, defense: 10 } },
      { count: 4, bonus: { attack: 25, defense: 15, maxHp: 100 } },
      { count: 6, bonus: { attack: 40, defense: 25, maxHp: 200, expBonus: 0.05 } }
    ]
  },
  set_shengzhan: {
    name: '圣战套装', minLevel: 30, job: 'warrior',
    baseStats: { attack: 60, defense: 50, maxHp: 500, critRate: 0.03 },
    pieces: [
      { configId: 'shengzhan_weapon', slot: 'weapon' },
      { configId: 'shengzhan_armor', slot: 'armor' },
      { configId: 'shengzhan_helmet', slot: 'helmet' },
      { configId: 'shengzhan_necklace', slot: 'necklace' },
      { configId: 'shengzhan_ring', slot: 'leftRing' },
      { configId: 'shengzhan_bracelet', slot: 'leftBracelet' },
      { configId: 'shengzhan_belt', slot: 'belt' },
      { configId: 'shengzhan_shoes', slot: 'shoes' }
    ],
    setBonuses: [
      { count: 2, bonus: { attack: 30, defense: 20 } },
      { count: 4, bonus: { attack: 50, defense: 30, maxHp: 200 } },
      { count: 6, bonus: { attack: 80, defense: 50, maxHp: 400, critRate: 0.05 } }
    ]
  },
  set_fashen: {
    name: '法神套装', minLevel: 30, job: 'mage',
    baseStats: { magicAttack: 70, defense: 30, maxHp: 300, maxMp: 400 },
    pieces: [
      { configId: 'fashen_weapon', slot: 'weapon' },
      { configId: 'fashen_armor', slot: 'armor' },
      { configId: 'fashen_helmet', slot: 'helmet' },
      { configId: 'fashen_necklace', slot: 'necklace' },
      { configId: 'fashen_ring', slot: 'leftRing' },
      { configId: 'fashen_bracelet', slot: 'leftBracelet' },
      { configId: 'fashen_belt', slot: 'belt' },
      { configId: 'fashen_shoes', slot: 'shoes' }
    ],
    setBonuses: [
      { count: 2, bonus: { magicAttack: 35, maxMp: 100 } },
      { count: 4, bonus: { magicAttack: 60, defense: 20, maxMp: 200 } },
      { count: 6, bonus: { magicAttack: 100, defense: 30, maxHp: 300, maxMp: 400 } }
    ]
  },
  set_tianzun: {
    name: '天尊套装', minLevel: 30, job: 'taoist',
    baseStats: { attack: 40, magicAttack: 40, defense: 40, maxHp: 400 },
    pieces: [
      { configId: 'tianzun_weapon', slot: 'weapon' },
      { configId: 'tianzun_armor', slot: 'armor' },
      { configId: 'tianzun_helmet', slot: 'helmet' },
      { configId: 'tianzun_necklace', slot: 'necklace' },
      { configId: 'tianzun_ring', slot: 'leftRing' },
      { configId: 'tianzun_bracelet', slot: 'leftBracelet' },
      { configId: 'tianzun_belt', slot: 'belt' },
      { configId: 'tianzun_shoes', slot: 'shoes' }
    ],
    setBonuses: [
      { count: 2, bonus: { attack: 20, magicAttack: 20 } },
      { count: 4, bonus: { attack: 35, magicAttack: 35, defense: 20 } },
      { count: 6, bonus: { attack: 50, magicAttack: 50, defense: 35, maxHp: 300 } }
    ]
  },
  set_molong: {
    name: '魔龙套装', minLevel: 45, job: 'all',
    baseStats: { attack: 100, magicAttack: 80, defense: 85, maxHp: 850, critRate: 0.04 },
    pieces: [
      { configId: 'molong_helmet', slot: 'helmet' },
      { configId: 'molong_armor', slot: 'armor' },
      { configId: 'molong_necklace', slot: 'necklace' },
      { configId: 'molong_ring', slot: 'leftRing' },
      { configId: 'molong_bracelet', slot: 'leftBracelet' },
      { configId: 'molong_belt', slot: 'belt' },
      { configId: 'molong_shoes', slot: 'shoes' }
    ],
    setBonuses: [
      { count: 2, bonus: { attack: 40, magicAttack: 30, defense: 30 } },
      { count: 4, bonus: { attack: 70, magicAttack: 55, defense: 50, maxHp: 350 } },
      { count: 6, bonus: { attack: 110, magicAttack: 90, defense: 80, maxHp: 700, critRate: 0.06 } }
    ]
  },
  set_leiting: {
    name: '雷霆套装', minLevel: 45, job: 'warrior',
    baseStats: { attack: 120, defense: 100, maxHp: 1000, critRate: 0.05 },
    pieces: [
      { configId: 'leiting_weapon', slot: 'weapon' },
      { configId: 'leiting_armor', slot: 'armor' },
      { configId: 'leiting_helmet', slot: 'helmet' },
      { configId: 'leiting_necklace', slot: 'necklace' },
      { configId: 'leiting_ring', slot: 'leftRing' },
      { configId: 'leiting_bracelet', slot: 'leftBracelet' },
      { configId: 'leiting_belt', slot: 'belt' },
      { configId: 'leiting_shoes', slot: 'shoes' }
    ],
    setBonuses: [
      { count: 2, bonus: { attack: 50, defense: 40 } },
      { count: 4, bonus: { attack: 90, defense: 70, maxHp: 400 } },
      { count: 6, bonus: { attack: 150, defense: 100, maxHp: 800, critRate: 0.08 } }
    ]
  },
  set_leiyan: {
    name: '雷炎套装', minLevel: 55, job: 'all',
    baseStats: { attack: 155, magicAttack: 140, defense: 130, maxHp: 1200, critRate: 0.06 },
    pieces: [
      { configId: 'leiyan_helmet', slot: 'helmet' },
      { configId: 'leiyan_armor', slot: 'armor' },
      { configId: 'leiyan_necklace', slot: 'necklace' },
      { configId: 'leiyan_ring', slot: 'leftRing' },
      { configId: 'leiyan_bracelet', slot: 'leftBracelet' },
      { configId: 'leiyan_belt', slot: 'belt' },
      { configId: 'leiyan_shoes', slot: 'shoes' }
    ],
    setBonuses: [
      { count: 2, bonus: { attack: 55, magicAttack: 50, defense: 45 } },
      { count: 4, bonus: { attack: 100, magicAttack: 90, defense: 80, maxHp: 500 } },
      { count: 6, bonus: { attack: 160, magicAttack: 145, defense: 120, maxHp: 1000, critRate: 0.08 } }
    ]
  },
  set_xingwang: {
    name: '星王套装', minLevel: 57, job: 'all',
    baseStats: { attack: 180, magicAttack: 180, defense: 150, maxHp: 1500 },
    pieces: [
      { configId: 'xingwang_weapon', slot: 'weapon' },
      { configId: 'xingwang_armor', slot: 'armor' },
      { configId: 'xingwang_helmet', slot: 'helmet' },
      { configId: 'xingwang_necklace', slot: 'necklace' },
      { configId: 'xingwang_ring', slot: 'leftRing' },
      { configId: 'xingwang_bracelet', slot: 'leftBracelet' },
      { configId: 'xingwang_belt', slot: 'belt' },
      { configId: 'xingwang_shoes', slot: 'shoes' }
    ],
    setBonuses: [
      { count: 2, bonus: { attack: 60, magicAttack: 60 } },
      { count: 4, bonus: { attack: 100, magicAttack: 100, defense: 70, maxHp: 600 } },
      { count: 6, bonus: { attack: 160, magicAttack: 160, defense: 120, maxHp: 1200, expBonus: 0.10 } }
    ]
  },
  set_wolong: {
    name: '卧龙套装', minLevel: 60, job: 'all',
    baseStats: { attack: 200, magicAttack: 190, defense: 170, maxHp: 1700, critRate: 0.08 },
    pieces: [
      { configId: 'wolong_helmet', slot: 'helmet' },
      { configId: 'wolong_armor', slot: 'armor' },
      { configId: 'wolong_necklace', slot: 'necklace' },
      { configId: 'wolong_ring', slot: 'leftRing' },
      { configId: 'wolong_bracelet', slot: 'leftBracelet' },
      { configId: 'wolong_belt', slot: 'belt' },
      { configId: 'wolong_shoes', slot: 'shoes' }
    ],
    setBonuses: [
      { count: 2, bonus: { attack: 70, magicAttack: 65, defense: 55 } },
      { count: 4, bonus: { attack: 130, magicAttack: 120, defense: 100, maxHp: 700 } },
      { count: 6, bonus: { attack: 200, magicAttack: 185, defense: 160, maxHp: 1400, critRate: 0.10 } }
    ]
  },
  set_wangzhe: {
    name: '王者套装', minLevel: 63, job: 'all',
    baseStats: { attack: 250, magicAttack: 250, defense: 200, maxHp: 2200, critRate: 0.08 },
    pieces: [
      { configId: 'wangzhe_weapon', slot: 'weapon' },
      { configId: 'wangzhe_armor', slot: 'armor' },
      { configId: 'wangzhe_helmet', slot: 'helmet' },
      { configId: 'wangzhe_necklace', slot: 'necklace' },
      { configId: 'wangzhe_ring', slot: 'leftRing' },
      { configId: 'wangzhe_bracelet', slot: 'leftBracelet' },
      { configId: 'wangzhe_belt', slot: 'belt' },
      { configId: 'wangzhe_shoes', slot: 'shoes' }
    ],
    setBonuses: [
      { count: 2, bonus: { attack: 80, magicAttack: 80, defense: 50 } },
      { count: 4, bonus: { attack: 150, magicAttack: 150, defense: 100, maxHp: 800 } },
      { count: 6, bonus: { attack: 250, magicAttack: 250, defense: 180, maxHp: 1600, critRate: 0.10 } }
    ]
  },
  set_huyue: {
    name: '狐月套装', minLevel: 65, job: 'all',
    baseStats: { attack: 280, magicAttack: 260, defense: 220, maxHp: 2400, critRate: 0.10 },
    pieces: [
      { configId: 'huyue_helmet', slot: 'helmet' },
      { configId: 'huyue_armor', slot: 'armor' },
      { configId: 'huyue_necklace', slot: 'necklace' },
      { configId: 'huyue_ring', slot: 'leftRing' },
      { configId: 'huyue_bracelet', slot: 'leftBracelet' },
      { configId: 'huyue_belt', slot: 'belt' },
      { configId: 'huyue_shoes', slot: 'shoes' }
    ],
    setBonuses: [
      { count: 2, bonus: { attack: 90, magicAttack: 85, defense: 70 } },
      { count: 4, bonus: { attack: 170, magicAttack: 160, defense: 130, maxHp: 900 } },
      { count: 6, bonus: { attack: 280, magicAttack: 260, defense: 210, maxHp: 2000, critRate: 0.12 } }
    ]
  },
  set_tianlong: {
    name: '天龙套装', minLevel: 68, job: 'all',
    baseStats: { attack: 350, magicAttack: 350, defense: 280, maxHp: 3000, critRate: 0.12 },
    pieces: [
      { configId: 'tianlong_weapon', slot: 'weapon' },
      { configId: 'tianlong_armor', slot: 'armor' },
      { configId: 'tianlong_helmet', slot: 'helmet' },
      { configId: 'tianlong_necklace', slot: 'necklace' },
      { configId: 'tianlong_ring', slot: 'leftRing' },
      { configId: 'tianlong_bracelet', slot: 'leftBracelet' },
      { configId: 'tianlong_belt', slot: 'belt' },
      { configId: 'tianlong_shoes', slot: 'shoes' }
    ],
    setBonuses: [
      { count: 2, bonus: { attack: 120, magicAttack: 120, defense: 80 } },
      { count: 4, bonus: { attack: 220, magicAttack: 220, defense: 160, maxHp: 1200 } },
      { count: 6, bonus: { attack: 350, magicAttack: 350, defense: 250, maxHp: 2500, critRate: 0.15 } }
    ]
  }
};

export const ACCESSORY_CONFIG = {
  hat: [
    { configId: 'hat_lv10', name: '草帽', requiredLevel: 5, stats: { defense: 5, maxHp: 30 } },
    { configId: 'hat_lv25', name: '铁笠', requiredLevel: 13, stats: { defense: 15, maxHp: 80 } },
    { configId: 'hat_lv40', name: '精钢笠', requiredLevel: 33, stats: { defense: 30, maxHp: 150 } },
    { configId: 'hat_lv55', name: '玄铁笠', requiredLevel: 48, stats: { defense: 50, maxHp: 280 } },
    { configId: 'hat_lv70', name: '天蚕笠', requiredLevel: 63, stats: { defense: 80, maxHp: 450 } }
  ],
  medal: [
    { configId: 'medal_lv10', name: '铜勋章', requiredLevel: 5, stats: { attack: 8, expBonus: 0.01 } },
    { configId: 'medal_lv25', name: '银勋章', requiredLevel: 13, stats: { attack: 20, expBonus: 0.02 } },
    { configId: 'medal_lv40', name: '金勋章', requiredLevel: 33, stats: { attack: 40, expBonus: 0.03 } },
    { configId: 'medal_lv55', name: '白金勋章', requiredLevel: 48, stats: { attack: 65, expBonus: 0.04 } },
    { configId: 'medal_lv70', name: '钻石勋章', requiredLevel: 63, stats: { attack: 100, expBonus: 0.06 } }
  ],
  drum: [
    { configId: 'drum_lv10', name: '小军鼓', requiredLevel: 5, stats: { attackSpeed: 0.02, critRate: 0.01 } },
    { configId: 'drum_lv25', name: '战鼓', requiredLevel: 13, stats: { attackSpeed: 0.04, critRate: 0.02 } },
    { configId: 'drum_lv40', name: '龙纹鼓', requiredLevel: 33, stats: { attackSpeed: 0.06, critRate: 0.03 } },
    { configId: 'drum_lv55', name: '天雷鼓', requiredLevel: 48, stats: { attackSpeed: 0.08, critRate: 0.04 } },
    { configId: 'drum_lv70', name: '神威鼓', requiredLevel: 63, stats: { attackSpeed: 0.10, critRate: 0.06 } }
  ],
  talisman: [
    { configId: 'talisman_lv10', name: '护身符', requiredLevel: 5, stats: { magicDefense: 8, dodgeRate: 0.01 } },
    { configId: 'talisman_lv25', name: '避邪符', requiredLevel: 13, stats: { magicDefense: 20, dodgeRate: 0.02 } },
    { configId: 'talisman_lv40', name: '灵符', requiredLevel: 33, stats: { magicDefense: 40, dodgeRate: 0.03 } },
    { configId: 'talisman_lv55', name: '天符', requiredLevel: 48, stats: { magicDefense: 65, dodgeRate: 0.04 } },
    { configId: 'talisman_lv70', name: '仙符', requiredLevel: 63, stats: { magicDefense: 100, dodgeRate: 0.06 } }
  ]
};

export const MATERIAL_CONFIG = {
  lucky_stone:     { id: 'lucky_stone',     name: '幸运符石',   icon: '💎', desc: '蕴含幸运之力的符石，用于项链幸运升级' },
  blessing_gem:    { id: 'blessing_gem',    name: '祝福宝石',   icon: '🔮', desc: '高级祝福材料，高阶幸运升级必备' },
  super_oil_item:  { id: 'super_oil_item',  name: '超级祝福油', icon: '🧴', desc: '稀有道具，90%几率提升武器幸运值' },
  skill_book_page: { id: 'skill_book_page', name: '技能书页',   icon: '📜', desc: '蕴含古老力量的书页，用于技能升级' }
};

export const LUCKY_CONFIG = {
  weaponMaxLucky: 7,
  necklaceMaxLucky: 5,
  maxCurse: 7,

  blessingOil: {
    name: '祝福油', buyPrice: 1500, successRate: 0.50
  },
  superBlessingOil: {
    name: '超级祝福油', successRate: 0.90
  },

  necklaceUpgrade: [
    { level: 1, gold: 500,   materials: { lucky_stone: 2 },                    rate: 0.80 },
    { level: 2, gold: 1500,  materials: { lucky_stone: 5 },                    rate: 0.65 },
    { level: 3, gold: 5000,  materials: { lucky_stone: 3, blessing_gem: 2 },   rate: 0.50 },
    { level: 4, gold: 15000, materials: { blessing_gem: 6 },                   rate: 0.35, bonus: { critDamage: 0.15 } },
    { level: 5, gold: 50000, materials: { blessing_gem: 12 },                  rate: 0.20, bonus: { critRate: 0.05 } }
  ],

  necklaceLuckyDesc: [
    '', '幸运+1', '幸运+2', '幸运+3',
    '幸运+4 暴击伤害+15%',
    '幸运+5 暴击率+5%'
  ]
};

export const ENHANCE_CONFIG = {
  maxLevel: 10,
  bonusPerLevel: 0.08,
  goldCost: (level) => Math.floor(200 * Math.pow(1.6, level)),
  successRate: [1.0, 0.95, 0.90, 0.80, 0.70, 0.60, 0.50, 0.40, 0.30, 0.20]
};

const _PERCENT_STATS = new Set(['critRate', 'critDamage', 'dodgeRate', 'attackSpeed', 'expBonus', 'goldBonus', 'magicFind']);

const _SLOT_WEIGHTS = {
  weapon:        { attack: 1.5, magicAttack: 1.5, defense: 0.2, maxHp: 0.2, maxMp: 0.2, magicDefense: 0.1, critRate: 1.2 },
  armor:         { attack: 0.2, magicAttack: 0.2, defense: 1.4, maxHp: 1.2, maxMp: 1.0, magicDefense: 0.6, critRate: 0.2 },
  helmet:        { attack: 0.1, magicAttack: 0.1, defense: 1.0, maxHp: 0.8, maxMp: 0.6, magicDefense: 1.3, critRate: 0.2 },
  necklace:      { attack: 0.7, magicAttack: 0.7, defense: 0.4, maxHp: 0.5, maxMp: 0.5, magicDefense: 0.4, critRate: 0.8 },
  leftRing:      { attack: 0.5, magicAttack: 0.5, defense: 0.3, maxHp: 0.3, maxMp: 0.3, magicDefense: 0.2, critRate: 1.5 },
  rightRing:     { attack: 0.5, magicAttack: 0.5, defense: 0.3, maxHp: 0.3, maxMp: 0.3, magicDefense: 0.2, critRate: 1.5 },
  leftBracelet:  { attack: 0.8, magicAttack: 0.8, defense: 0.3, maxHp: 0.4, maxMp: 0.3, magicDefense: 0.3, critRate: 0.6 },
  rightBracelet: { attack: 0.8, magicAttack: 0.8, defense: 0.3, maxHp: 0.4, maxMp: 0.3, magicDefense: 0.3, critRate: 0.6 },
  belt:          { attack: 0.2, magicAttack: 0.2, defense: 0.6, maxHp: 0.5, maxMp: 0.3, magicDefense: 0.5, critRate: 0.3 },
  shoes:         { attack: 0.1, magicAttack: 0.1, defense: 0.7, maxHp: 0.7, maxMp: 0.5, magicDefense: 0.4, critRate: 0.2 }
};

function _buildEquipBases() {
  const bases = {};

  for (const [setId, set] of Object.entries(SET_CONFIG)) {
    for (const piece of set.pieces) {
      const w = _SLOT_WEIGHTS[piece.slot];
      const stats = {};
      for (const [stat, baseVal] of Object.entries(set.baseStats)) {
        const weight = w?.[stat] ?? 0.3;
        const val = _PERCENT_STATS.has(stat)
          ? +(baseVal * weight).toFixed(4)
          : Math.floor(baseVal * weight);
        if (val > 0) stats[stat] = val;
      }
      const slotLabel = EQUIP_SLOT_NAMES[piece.slot]?.replace(/[左右]/, '') || piece.slot;
      bases[piece.configId] = {
        configId: piece.configId,
        name: `${set.name.replace('套装', '')}·${piece.displayName || slotLabel}`,
        slot: piece.slot,
        requiredLevel: set.minLevel,
        job: set.job,
        setId,
        stats,
        lucky: 0
      };
    }
  }

  for (const [slot, tiers] of Object.entries(ACCESSORY_CONFIG)) {
    for (const tier of tiers) {
      bases[tier.configId] = {
        configId: tier.configId, name: tier.name, slot,
        requiredLevel: tier.requiredLevel, job: 'all', setId: null,
        stats: { ...tier.stats }, lucky: 0
      };
    }
  }

  const basicItems = [
    { configId: 'cloth_armor', name: '布衣', slot: 'armor', requiredLevel: 1, stats: { defense: 3, maxHp: 15 } },
    { configId: 'cloth_boots', name: '布靴', slot: 'shoes', requiredLevel: 1, stats: { defense: 2, maxHp: 10 } },
    { configId: 'wooden_sword', name: '木剑', slot: 'weapon', requiredLevel: 1, stats: { attack: 5 } },
    { configId: 'iron_sword', name: '铁剑', slot: 'weapon', requiredLevel: 8, stats: { attack: 15, critRate: 0.01 } },
    { configId: 'iron_armor', name: '铁甲', slot: 'armor', requiredLevel: 8, stats: { defense: 10, maxHp: 50 } },
    { configId: 'iron_necklace', name: '铁项链', slot: 'necklace', requiredLevel: 8, stats: { attack: 8, magicAttack: 5 } },
    { configId: 'iron_ring', name: '铁戒指', slot: 'leftRing', requiredLevel: 8, stats: { attack: 6, critRate: 0.01 } },
    { configId: 'iron_bracelet', name: '铁手镯', slot: 'leftBracelet', requiredLevel: 8, stats: { attack: 10, magicAttack: 6 } },
    { configId: 'leather_boots', name: '皮靴', slot: 'shoes', requiredLevel: 8, stats: { defense: 6, maxHp: 30 } },
    { configId: 'steel_sword', name: '钢剑', slot: 'weapon', requiredLevel: 12, stats: { attack: 25, critRate: 0.015 } },
    { configId: 'bronze_bracelet', name: '青铜手镯', slot: 'leftBracelet', requiredLevel: 15, stats: { attack: 16, magicAttack: 12, maxHp: 20 } },
    { configId: 'silver_bracelet', name: '白银手镯', slot: 'leftBracelet', requiredLevel: 18, stats: { attack: 30, magicAttack: 22, maxHp: 50 } }
  ];
  for (const item of basicItems) {
    bases[item.configId] = {
      configId: item.configId, name: item.name, slot: item.slot,
      requiredLevel: item.requiredLevel, job: 'all', setId: null,
      stats: { ...item.stats }, lucky: 0
    };
  }

  return bases;
}

export const EQUIP_BASES = _buildEquipBases();

export const DROP_CONFIG = {

  // ==================== 比奇郊外 ====================
  'monster_ji': {
    baseDropChance: 0.12,
    goldMin: 2, goldMax: 6,
    qualityWeights: { normal: 85, uncommon: 12, rare: 3, epic: 0, legendary: 0, mythic: 0 },
    items: ['equip_cloth_armor', 'equip_wooden_sword'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.15 }]
  },
  'monster_lu': {
    baseDropChance: 0.13,
    goldMin: 3, goldMax: 8,
    qualityWeights: { normal: 82, uncommon: 14, rare: 4, epic: 0, legendary: 0, mythic: 0 },
    items: ['equip_cloth_armor', 'equip_wooden_sword', 'equip_cloth_boots'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.16 }]
  },
  'monster_caocaoren': {
    baseDropChance: 0.15,
    goldMin: 5, goldMax: 10,
    qualityWeights: { normal: 78, uncommon: 16, rare: 5, epic: 1, legendary: 0, mythic: 0 },
    items: ['equip_cloth_armor', 'equip_wooden_sword', 'equip_cloth_boots', 'equip_iron_ring', 'equip_iron_bracelet'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.18 }]
  },
  'monster_xiezi': {
    baseDropChance: 0.14,
    goldMin: 7, goldMax: 14,
    qualityWeights: { normal: 80, uncommon: 15, rare: 4, epic: 1, legendary: 0, mythic: 0 },
    items: ['equip_cloth_armor', 'equip_wooden_sword', 'equip_cloth_boots', 'equip_iron_ring', 'equip_iron_bracelet'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.16 }]
  },
  'monster_banshouren': {
    baseDropChance: 0.14,
    goldMin: 12, goldMax: 20,
    qualityWeights: { normal: 80, uncommon: 15, rare: 4, epic: 1, legendary: 0, mythic: 0 },
    items: ['equip_cloth_armor', 'equip_wooden_sword', 'equip_cloth_boots', 'equip_iron_ring', 'equip_iron_bracelet'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.16 }]
  },
  'boss_caocaoren_wang': {
    baseDropChance: 0.80,
    goldMin: 60, goldMax: 150,
    qualityWeights: { normal: 40, uncommon: 35, rare: 20, epic: 5, legendary: 0, mythic: 0 },
    items: ['equip_iron_sword', 'equip_iron_armor', 'equip_iron_ring', 'equip_iron_necklace', 'equip_iron_bracelet', 'equip_hat_lv10', 'equip_medal_lv10', 'equip_drum_lv10', 'equip_talisman_lv10'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.60, min: 2, max: 4 }]
  },

  // ==================== 盟重郊外 ====================
  'monster_yang': {
    baseDropChance: 0.12,
    goldMin: 10, goldMax: 22,
    qualityWeights: { normal: 80, uncommon: 15, rare: 4, epic: 1, legendary: 0, mythic: 0 },
    items: ['equip_iron_sword', 'equip_iron_armor', 'equip_leather_boots', 'equip_hat_lv10'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.06 }, { id: 'skill_book_page', chance: 0.18 }]
  },
  'monster_lang': {
    baseDropChance: 0.14,
    goldMin: 15, goldMax: 30,
    qualityWeights: { normal: 76, uncommon: 17, rare: 6, epic: 1, legendary: 0, mythic: 0 },
    items: ['equip_iron_sword', 'equip_iron_armor', 'equip_leather_boots', 'equip_iron_necklace', 'equip_bronze_bracelet', 'equip_medal_lv10'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.08 }, { id: 'skill_book_page', chance: 0.2 }]
  },
  'monster_wugong': {
    baseDropChance: 0.14,
    goldMin: 18, goldMax: 35,
    qualityWeights: { normal: 80, uncommon: 15, rare: 4, epic: 1, legendary: 0, mythic: 0 },
    items: ['equip_iron_sword', 'equip_iron_armor', 'equip_iron_ring', 'equip_iron_necklace', 'equip_iron_bracelet', 'equip_drum_lv10'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.16 }]
  },
  'monster_kulou': {
    baseDropChance: 0.14,
    goldMin: 22, goldMax: 42,
    qualityWeights: { normal: 80, uncommon: 15, rare: 4, epic: 1, legendary: 0, mythic: 0 },
    items: ['equip_iron_sword', 'equip_iron_armor', 'equip_iron_ring', 'equip_iron_necklace', 'equip_iron_bracelet', 'equip_talisman_lv10'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.16 }]
  },
  'boss_banshouren': {
    baseDropChance: 0.82,
    goldMin: 250, goldMax: 500,
    qualityWeights: { normal: 30, uncommon: 35, rare: 25, epic: 8, legendary: 2, mythic: 0 },
    items: ['equip_iron_armor', 'equip_steel_sword', 'equip_iron_necklace', 'equip_iron_ring', 'equip_leather_boots', 'equip_bronze_bracelet', 'equip_hat_lv10', 'equip_medal_lv10', 'equip_drum_lv10', 'equip_talisman_lv10'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.50, min: 1, max: 3 }, { id: 'skill_book_page', chance: 0.65, min: 2, max: 5 }]
  },

  // ==================== 石墓阵 ====================
  'monster_hei_yezhu': {
    baseDropChance: 0.13,
    goldMin: 25, goldMax: 55,
    qualityWeights: { normal: 70, uncommon: 20, rare: 8, epic: 2, legendary: 0, mythic: 0 },
    items: ['equip_zuma_helmet', 'equip_zuma_armor', 'equip_zuma_belt', 'equip_hat_lv10', 'equip_drum_lv10'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.10 }, { id: 'skill_book_page', chance: 0.22, min: 1, max: 2 }]
  },
  'monster_hong_yezhu': {
    baseDropChance: 0.14,
    goldMin: 30, goldMax: 60,
    qualityWeights: { normal: 68, uncommon: 20, rare: 9, epic: 3, legendary: 0, mythic: 0 },
    items: ['equip_zuma_shoes', 'equip_zuma_bracelet', 'equip_zuma_necklace', 'equip_medal_lv10', 'equip_talisman_lv10'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.10 }, { id: 'skill_book_page', chance: 0.22, min: 1, max: 2 }]
  },
  'monster_shimu_shiwei': {
    baseDropChance: 0.16,
    goldMin: 35, goldMax: 65,
    qualityWeights: { normal: 65, uncommon: 22, rare: 10, epic: 3, legendary: 0, mythic: 0 },
    items: ['equip_iron_sword', 'equip_iron_armor', 'equip_iron_ring', 'equip_iron_necklace', 'equip_hat_lv10', 'equip_medal_lv10'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.16 }]
  },
  'monster_shimu_wugong': {
    baseDropChance: 0.16,
    goldMin: 40, goldMax: 72,
    qualityWeights: { normal: 65, uncommon: 22, rare: 10, epic: 3, legendary: 0, mythic: 0 },
    items: ['equip_iron_sword', 'equip_iron_armor', 'equip_iron_bracelet', 'equip_iron_necklace', 'equip_drum_lv10', 'equip_talisman_lv10'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.16 }]
  },
  'boss_bai_yezhu': {
    baseDropChance: 0.85,
    goldMin: 500, goldMax: 1100,
    qualityWeights: { normal: 20, uncommon: 30, rare: 30, epic: 15, legendary: 5, mythic: 0 },
    items: ['equip_zuma_helmet', 'equip_zuma_armor', 'equip_zuma_belt', 'equip_zuma_shoes', 'equip_zuma_bracelet', 'equip_zuma_necklace', 'equip_zuma_ring', 'equip_hat_lv10', 'equip_medal_lv10', 'equip_drum_lv10', 'equip_talisman_lv10', 'equip_hat_lv25'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.70, min: 2, max: 5 }, { id: 'skill_book_page', chance: 0.7, min: 3, max: 6 }]
  },

  // ==================== 封魔谷 ====================
  'monster_hongmo_zhiwei': {
    baseDropChance: 0.14,
    goldMin: 45, goldMax: 80,
    qualityWeights: { normal: 66, uncommon: 22, rare: 9, epic: 3, legendary: 0, mythic: 0 },
    items: ['equip_zuma_helmet', 'equip_zuma_armor', 'equip_zuma_ring', 'equip_silver_bracelet', 'equip_hat_lv10', 'equip_hat_lv25'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.12 }, { id: 'skill_book_page', chance: 0.24, min: 1, max: 2 }]
  },
  'monster_xieshe': {
    baseDropChance: 0.15,
    goldMin: 55, goldMax: 90,
    qualityWeights: { normal: 64, uncommon: 22, rare: 10, epic: 4, legendary: 0, mythic: 0 },
    items: ['equip_zuma_belt', 'equip_zuma_bracelet', 'equip_zuma_necklace', 'equip_silver_bracelet', 'equip_medal_lv10', 'equip_drum_lv25'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.12 }, { id: 'skill_book_page', chance: 0.24, min: 1, max: 2 }]
  },
  'monster_fengmo_shiguai': {
    baseDropChance: 0.16,
    goldMin: 60, goldMax: 100,
    qualityWeights: { normal: 65, uncommon: 22, rare: 10, epic: 3, legendary: 0, mythic: 0 },
    items: ['equip_zuma_weapon', 'equip_zuma_armor', 'equip_zuma_helmet', 'equip_zuma_necklace', 'equip_hat_lv25'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.2 }]
  },
  'monster_chulong': {
    baseDropChance: 0.18,
    goldMin: 70, goldMax: 120,
    qualityWeights: { normal: 50, uncommon: 25, rare: 17, epic: 6, legendary: 2, mythic: 0 },
    items: ['equip_zuma_weapon', 'equip_zuma_belt', 'equip_zuma_shoes', 'equip_zuma_bracelet', 'equip_medal_lv25'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.2 }]
  },
  'boss_xiedu_she': {
    baseDropChance: 0.86,
    goldMin: 1000, goldMax: 1600,
    qualityWeights: { normal: 15, uncommon: 28, rare: 32, epic: 18, legendary: 7, mythic: 0 },
    items: ['equip_zuma_helmet', 'equip_zuma_armor', 'equip_zuma_belt', 'equip_zuma_shoes', 'equip_zuma_bracelet', 'equip_zuma_necklace', 'equip_zuma_ring', 'equip_hat_lv25', 'equip_medal_lv25', 'equip_drum_lv25', 'equip_talisman_lv25'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.80, min: 2, max: 5 }, { id: 'blessing_gem', chance: 0.20 }, { id: 'skill_book_page', chance: 0.75, min: 3, max: 7 }]
  },

  // ==================== 祖玛寺庙 1-4层 ====================
  'monster_zuma_gong': {
    baseDropChance: 0.15,
    goldMin: 60, goldMax: 140,
    qualityWeights: { normal: 60, uncommon: 24, rare: 12, epic: 4, legendary: 0, mythic: 0 },
    items: ['equip_zuma_helmet', 'equip_zuma_armor', 'equip_zuma_belt', 'equip_zuma_shoes', 'equip_hat_lv25'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.14 }, { id: 'skill_book_page', chance: 0.26, min: 1, max: 2 }]
  },
  'monster_zuma_weishi': {
    baseDropChance: 0.16,
    goldMin: 75, goldMax: 150,
    qualityWeights: { normal: 58, uncommon: 24, rare: 13, epic: 5, legendary: 0, mythic: 0 },
    items: ['equip_zuma_bracelet', 'equip_zuma_necklace', 'equip_zuma_ring', 'equip_medal_lv25'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.14 }, { id: 'skill_book_page', chance: 0.26, min: 1, max: 2 }]
  },
  'monster_zuma_diaoxiangbing': {
    baseDropChance: 0.18,
    goldMin: 80, goldMax: 155,
    qualityWeights: { normal: 50, uncommon: 25, rare: 17, epic: 6, legendary: 2, mythic: 0 },
    items: ['equip_zuma_weapon', 'equip_zuma_armor', 'equip_zuma_helmet', 'equip_zuma_necklace', 'equip_zuma_ring', 'equip_drum_lv25'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.2 }]
  },
  'monster_jiaoying': {
    baseDropChance: 0.18,
    goldMin: 90, goldMax: 170,
    qualityWeights: { normal: 50, uncommon: 25, rare: 17, epic: 6, legendary: 2, mythic: 0 },
    items: ['equip_zuma_weapon', 'equip_zuma_belt', 'equip_zuma_shoes', 'equip_zuma_bracelet', 'equip_talisman_lv25'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.2 }]
  },
  'boss_zuma_diaoxiang': {
    baseDropChance: 0.88,
    goldMin: 1500, goldMax: 3500,
    qualityWeights: { normal: 10, uncommon: 25, rare: 32, epic: 22, legendary: 10, mythic: 1 },
    items: ['equip_zuma_helmet', 'equip_zuma_armor', 'equip_zuma_belt', 'equip_zuma_shoes', 'equip_zuma_bracelet', 'equip_zuma_necklace', 'equip_zuma_ring', 'equip_hat_lv25', 'equip_medal_lv25', 'equip_drum_lv25', 'equip_talisman_lv25'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.90, min: 3, max: 6 }, { id: 'blessing_gem', chance: 0.35, min: 1, max: 2 }, { id: 'skill_book_page', chance: 0.8, min: 4, max: 8 }]
  },

  // ==================== 祖玛寺庙 5-7层 ====================
  'monster_zuma_hufa': {
    baseDropChance: 0.16,
    goldMin: 100, goldMax: 200,
    qualityWeights: { normal: 55, uncommon: 25, rare: 14, epic: 5, legendary: 1, mythic: 0 },
    items: ['equip_zuma_helmet', 'equip_zuma_armor', 'equip_zuma_belt', 'equip_zuma_shoes', 'equip_hat_lv25', 'equip_drum_lv25'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.15 }, { id: 'blessing_gem', chance: 0.03 }, { id: 'skill_book_page', chance: 0.28, min: 1, max: 3 }]
  },
  'monster_qie_e': {
    baseDropChance: 0.17,
    goldMin: 120, goldMax: 220,
    qualityWeights: { normal: 52, uncommon: 26, rare: 15, epic: 6, legendary: 1, mythic: 0 },
    items: ['equip_zuma_bracelet', 'equip_zuma_necklace', 'equip_zuma_ring', 'equip_medal_lv25', 'equip_talisman_lv25'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.15 }, { id: 'blessing_gem', chance: 0.04 }, { id: 'skill_book_page', chance: 0.28, min: 1, max: 3 }]
  },
  'monster_zuma_xianfeng': {
    baseDropChance: 0.18,
    goldMin: 130, goldMax: 230,
    qualityWeights: { normal: 50, uncommon: 25, rare: 17, epic: 6, legendary: 2, mythic: 0 },
    items: ['equip_zuma_weapon', 'equip_zuma_armor', 'equip_zuma_helmet', 'equip_zuma_necklace', 'equip_hat_lv25'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.2 }]
  },
  'monster_xuejuren': {
    baseDropChance: 0.18,
    goldMin: 145, goldMax: 260,
    qualityWeights: { normal: 50, uncommon: 25, rare: 17, epic: 6, legendary: 2, mythic: 0 },
    items: ['equip_zuma_weapon', 'equip_zuma_belt', 'equip_zuma_shoes', 'equip_zuma_ring', 'equip_drum_lv25'],
    materialDrops: [{ id: 'skill_book_page', chance: 0.2 }]
  },
  'boss_zuma_jiaozhu': {
    baseDropChance: 0.90,
    goldMin: 3500, goldMax: 5500,
    qualityWeights: { normal: 5, uncommon: 20, rare: 32, epic: 26, legendary: 14, mythic: 3 },
    items: ['equip_zuma_helmet', 'equip_zuma_armor', 'equip_zuma_belt', 'equip_zuma_shoes', 'equip_zuma_bracelet', 'equip_zuma_necklace', 'equip_zuma_ring', 'equip_hat_lv25', 'equip_medal_lv25', 'equip_drum_lv25', 'equip_talisman_lv25'],
    materialDrops: [{ id: 'lucky_stone', chance: 1.0, min: 3, max: 8 }, { id: 'blessing_gem', chance: 0.50, min: 1, max: 3 }, { id: 'skill_book_page', chance: 0.85, min: 5, max: 10 }]
  },

  // ==================== 赤月峡谷 ====================
  'monster_yueling_zhizhu': {
    baseDropChance: 0.15,
    goldMin: 150, goldMax: 350,
    qualityWeights: { normal: 48, uncommon: 28, rare: 16, epic: 6, legendary: 2, mythic: 0 },
    items: ['equip_shengzhan_helmet', 'equip_fashen_helmet', 'equip_tianzun_helmet', 'equip_shengzhan_armor', 'equip_fashen_armor', 'equip_tianzun_armor', 'equip_hat_lv25'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.16 }, { id: 'blessing_gem', chance: 0.05 }, { id: 'skill_book_page', chance: 0.3, min: 1, max: 3 }]
  },
  'monster_chiyue_shi': {
    baseDropChance: 0.16,
    goldMin: 180, goldMax: 380,
    qualityWeights: { normal: 45, uncommon: 28, rare: 17, epic: 8, legendary: 2, mythic: 0 },
    items: ['equip_shengzhan_belt', 'equip_fashen_belt', 'equip_tianzun_belt', 'equip_shengzhan_shoes', 'equip_fashen_shoes', 'equip_tianzun_shoes', 'equip_medal_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.16 }, { id: 'blessing_gem', chance: 0.06 }, { id: 'skill_book_page', chance: 0.3, min: 1, max: 3 }]
  },
  'monster_chiyue_qishi': {
    baseDropChance: 0.2,
    goldMin: 200, goldMax: 400,
    qualityWeights: { normal: 35, uncommon: 25, rare: 22, epic: 12, legendary: 5, mythic: 1 },
    items: ['equip_shengzhan_weapon', 'equip_fashen_weapon', 'equip_tianzun_weapon', 'equip_shengzhan_armor', 'equip_fashen_armor', 'equip_tianzun_armor', 'equip_hat_lv25'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.24 }]
  },
  'monster_cuimo': {
    baseDropChance: 0.2,
    goldMin: 280, goldMax: 460,
    qualityWeights: { normal: 35, uncommon: 25, rare: 22, epic: 12, legendary: 5, mythic: 1 },
    items: ['equip_shengzhan_helmet', 'equip_fashen_helmet', 'equip_tianzun_helmet', 'equip_shengzhan_belt', 'equip_fashen_belt', 'equip_tianzun_belt', 'equip_drum_lv40', 'equip_talisman_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.24 }]
  },
  'boss_shuangtou_xuemo': {
    baseDropChance: 0.88,
    goldMin: 4500, goldMax: 9000,
    qualityWeights: { normal: 5, uncommon: 18, rare: 30, epic: 28, legendary: 15, mythic: 4 },
    items: ['equip_shengzhan_helmet', 'equip_shengzhan_armor', 'equip_shengzhan_belt', 'equip_shengzhan_shoes', 'equip_shengzhan_bracelet', 'equip_shengzhan_necklace', 'equip_shengzhan_ring', 'equip_hat_lv40', 'equip_medal_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 1.0, min: 4, max: 8 }, { id: 'blessing_gem', chance: 0.60, min: 1, max: 3 }, { id: 'skill_book_page', chance: 0.85, min: 5, max: 10 }]
  },
  'boss_shuangtou_jingang': {
    baseDropChance: 0.88,
    goldMin: 5000, goldMax: 10000,
    qualityWeights: { normal: 5, uncommon: 17, rare: 28, epic: 30, legendary: 16, mythic: 4 },
    items: ['equip_fashen_helmet', 'equip_fashen_armor', 'equip_fashen_belt', 'equip_fashen_shoes', 'equip_fashen_bracelet', 'equip_fashen_necklace', 'equip_fashen_ring', 'equip_drum_lv40', 'equip_talisman_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 1.0, min: 4, max: 8 }, { id: 'blessing_gem', chance: 0.60, min: 1, max: 3 }, { id: 'skill_book_page', chance: 0.85, min: 5, max: 10 }]
  },
  'boss_chiyue_emo': {
    baseDropChance: 0.92,
    goldMin: 6000, goldMax: 12000,
    qualityWeights: { normal: 3, uncommon: 12, rare: 25, epic: 32, legendary: 20, mythic: 8 },
    items: ['equip_shengzhan_helmet', 'equip_shengzhan_armor', 'equip_fashen_helmet', 'equip_fashen_armor', 'equip_tianzun_helmet', 'equip_tianzun_armor', 'equip_tianzun_bracelet', 'equip_tianzun_necklace', 'equip_tianzun_ring', 'equip_hat_lv40', 'equip_medal_lv40', 'equip_drum_lv40', 'equip_talisman_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 1.0, min: 5, max: 10 }, { id: 'blessing_gem', chance: 0.75, min: 2, max: 4 }, { id: 'super_oil_item', chance: 0.05 }, { id: 'skill_book_page', chance: 0.9, min: 6, max: 12 }]
  },

  // ==================== 困惑殿堂 ====================
  'monster_hunhuan_shi': {
    baseDropChance: 0.16,
    goldMin: 350, goldMax: 550,
    qualityWeights: { normal: 42, uncommon: 28, rare: 18, epic: 9, legendary: 3, mythic: 0 },
    items: ['equip_shengzhan_bracelet', 'equip_fashen_bracelet', 'equip_tianzun_bracelet', 'equip_hat_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.18 }, { id: 'blessing_gem', chance: 0.07 }, { id: 'skill_book_page', chance: 0.32, min: 2, max: 3 }]
  },
  'monster_hunhuan_zhanzhe': {
    baseDropChance: 0.17,
    goldMin: 400, goldMax: 600,
    qualityWeights: { normal: 40, uncommon: 28, rare: 19, epic: 10, legendary: 3, mythic: 0 },
    items: ['equip_shengzhan_necklace', 'equip_fashen_necklace', 'equip_tianzun_necklace', 'equip_medal_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.18 }, { id: 'blessing_gem', chance: 0.08 }, { id: 'skill_book_page', chance: 0.32, min: 2, max: 3 }]
  },
  'monster_hunhuan_cike': {
    baseDropChance: 0.2,
    goldMin: 420, goldMax: 620,
    qualityWeights: { normal: 35, uncommon: 25, rare: 22, epic: 12, legendary: 5, mythic: 1 },
    items: ['equip_shengzhan_necklace', 'equip_fashen_necklace', 'equip_tianzun_necklace', 'equip_shengzhan_ring', 'equip_fashen_ring', 'equip_tianzun_ring', 'equip_drum_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.24 }]
  },
  'monster_kunhuo_zhi_ling': {
    baseDropChance: 0.2,
    goldMin: 440, goldMax: 660,
    qualityWeights: { normal: 35, uncommon: 25, rare: 22, epic: 12, legendary: 5, mythic: 1 },
    items: ['equip_shengzhan_bracelet', 'equip_fashen_bracelet', 'equip_tianzun_bracelet', 'equip_shengzhan_shoes', 'equip_fashen_shoes', 'equip_tianzun_shoes', 'equip_talisman_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.24 }]
  },
  'boss_hunhuan_zhiwang': {
    baseDropChance: 0.90,
    goldMin: 12000, goldMax: 18000,
    qualityWeights: { normal: 2, uncommon: 10, rare: 24, epic: 32, legendary: 22, mythic: 10 },
    items: ['equip_shengzhan_helmet', 'equip_shengzhan_armor', 'equip_shengzhan_belt', 'equip_shengzhan_shoes', 'equip_shengzhan_bracelet', 'equip_shengzhan_necklace', 'equip_shengzhan_ring', 'equip_fashen_ring', 'equip_tianzun_ring', 'equip_hat_lv40', 'equip_medal_lv40', 'equip_drum_lv40', 'equip_talisman_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 1.0, min: 5, max: 10 }, { id: 'blessing_gem', chance: 0.80, min: 2, max: 5 }, { id: 'super_oil_item', chance: 0.08 }, { id: 'skill_book_page', chance: 0.9, min: 6, max: 12 }]
  },

  // ==================== 地狱烈焰 ====================
  'monster_diyu_zhanshi': {
    baseDropChance: 0.16,
    goldMin: 360, goldMax: 560,
    qualityWeights: { normal: 42, uncommon: 28, rare: 18, epic: 9, legendary: 3, mythic: 0 },
    items: ['equip_shengzhan_ring', 'equip_fashen_ring', 'equip_tianzun_ring', 'equip_drum_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.18 }, { id: 'blessing_gem', chance: 0.08 }, { id: 'skill_book_page', chance: 0.32, min: 2, max: 3 }]
  },
  'monster_diyu_gong': {
    baseDropChance: 0.17,
    goldMin: 380, goldMax: 580,
    qualityWeights: { normal: 40, uncommon: 28, rare: 19, epic: 10, legendary: 3, mythic: 0 },
    items: ['equip_shengzhan_belt', 'equip_fashen_belt', 'equip_tianzun_belt', 'equip_talisman_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.18 }, { id: 'blessing_gem', chance: 0.08 }, { id: 'skill_book_page', chance: 0.32, min: 2, max: 3 }]
  },
  'monster_diyu_fashi': {
    baseDropChance: 0.2,
    goldMin: 400, goldMax: 600,
    qualityWeights: { normal: 35, uncommon: 25, rare: 22, epic: 12, legendary: 5, mythic: 1 },
    items: ['equip_shengzhan_armor', 'equip_fashen_armor', 'equip_tianzun_armor', 'equip_shengzhan_belt', 'equip_fashen_belt', 'equip_hat_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.24 }]
  },
  'monster_yanmo_wei': {
    baseDropChance: 0.2,
    goldMin: 430, goldMax: 650,
    qualityWeights: { normal: 35, uncommon: 25, rare: 22, epic: 12, legendary: 5, mythic: 1 },
    items: ['equip_shengzhan_shoes', 'equip_fashen_shoes', 'equip_tianzun_shoes', 'equip_shengzhan_ring', 'equip_fashen_ring', 'equip_medal_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.24 }]
  },
  'boss_diyu_huoshe': {
    baseDropChance: 0.90,
    goldMin: 13000, goldMax: 19000,
    qualityWeights: { normal: 2, uncommon: 10, rare: 22, epic: 33, legendary: 23, mythic: 10 },
    items: ['equip_fashen_helmet', 'equip_fashen_armor', 'equip_fashen_belt', 'equip_fashen_shoes', 'equip_fashen_bracelet', 'equip_fashen_necklace', 'equip_fashen_ring', 'equip_tianzun_armor', 'equip_shengzhan_shoes', 'equip_hat_lv40', 'equip_medal_lv40', 'equip_drum_lv40', 'equip_talisman_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 1.0, min: 5, max: 10 }, { id: 'blessing_gem', chance: 0.80, min: 2, max: 5 }, { id: 'super_oil_item', chance: 0.08 }, { id: 'skill_book_page', chance: 0.9, min: 6, max: 12 }]
  },

  // ==================== 魔龙岭 ====================
  'monster_molong_shi': {
    baseDropChance: 0.16,
    goldMin: 450, goldMax: 700,
    qualityWeights: { normal: 38, uncommon: 28, rare: 20, epic: 10, legendary: 4, mythic: 0 },
    items: ['equip_molong_helmet', 'equip_molong_armor', 'equip_molong_belt', 'equip_leiting_helmet', 'equip_leiting_armor', 'equip_hat_lv40', 'equip_hat_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.20 }, { id: 'blessing_gem', chance: 0.10 }, { id: 'skill_book_page', chance: 0.34, min: 2, max: 4 }]
  },
  'monster_molong_lishi': {
    baseDropChance: 0.17,
    goldMin: 550, goldMax: 800,
    qualityWeights: { normal: 35, uncommon: 28, rare: 21, epic: 12, legendary: 4, mythic: 0 },
    items: ['equip_molong_shoes', 'equip_molong_bracelet', 'equip_molong_necklace', 'equip_leiting_shoes', 'equip_leiting_bracelet', 'equip_medal_lv40', 'equip_medal_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.20 }, { id: 'blessing_gem', chance: 0.10 }, { id: 'skill_book_page', chance: 0.34, min: 2, max: 4 }]
  },
  'monster_molong_gong': {
    baseDropChance: 0.22,
    goldMin: 500, goldMax: 750,
    qualityWeights: { normal: 20, uncommon: 22, rare: 25, epic: 18, legendary: 10, mythic: 5 },
    items: ['equip_molong_helmet', 'equip_molong_armor', 'equip_molong_necklace', 'equip_molong_belt', 'equip_leiting_weapon', 'equip_leiting_belt', 'equip_drum_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.24 }]
  },
  'monster_molong_daobing': {
    baseDropChance: 0.22,
    goldMin: 560, goldMax: 820,
    qualityWeights: { normal: 20, uncommon: 22, rare: 25, epic: 18, legendary: 10, mythic: 5 },
    items: ['equip_molong_shoes', 'equip_molong_bracelet', 'equip_molong_ring', 'equip_molong_belt', 'equip_leiting_necklace', 'equip_leiting_ring', 'equip_talisman_lv40'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.24 }]
  },
  'boss_molong_teshi': {
    baseDropChance: 0.90,
    goldMin: 17000, goldMax: 24000,
    qualityWeights: { normal: 2, uncommon: 8, rare: 20, epic: 32, legendary: 26, mythic: 12 },
    items: ['equip_molong_helmet', 'equip_molong_armor', 'equip_molong_belt', 'equip_molong_shoes', 'equip_molong_bracelet', 'equip_molong_necklace', 'equip_molong_ring', 'equip_leiting_weapon', 'equip_leiting_helmet', 'equip_leiting_armor', 'equip_hat_lv55', 'equip_medal_lv55', 'equip_drum_lv55', 'equip_talisman_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 1.0, min: 6, max: 12 }, { id: 'blessing_gem', chance: 0.85, min: 3, max: 6 }, { id: 'super_oil_item', chance: 0.12 }, { id: 'skill_book_page', chance: 0.92, min: 8, max: 15 }]
  },

  // ==================== 魔龙血域 ====================
  'monster_molong_xiwei': {
    baseDropChance: 0.16,
    goldMin: 500, goldMax: 900,
    qualityWeights: { normal: 35, uncommon: 28, rare: 21, epic: 12, legendary: 4, mythic: 0 },
    items: ['equip_molong_helmet', 'equip_molong_armor', 'equip_molong_ring', 'equip_leiting_helmet', 'equip_leiting_armor', 'equip_hat_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.22 }, { id: 'blessing_gem', chance: 0.12 }, { id: 'skill_book_page', chance: 0.36, min: 2, max: 4 }]
  },
  'monster_molong_zhanjiang': {
    baseDropChance: 0.17,
    goldMin: 600, goldMax: 1000,
    qualityWeights: { normal: 32, uncommon: 28, rare: 22, epic: 13, legendary: 5, mythic: 0 },
    items: ['equip_molong_belt', 'equip_molong_shoes', 'equip_molong_bracelet', 'equip_leiting_belt', 'equip_leiting_shoes', 'equip_leiting_bracelet', 'equip_medal_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.22 }, { id: 'blessing_gem', chance: 0.12 }, { id: 'skill_book_page', chance: 0.36, min: 2, max: 4 }]
  },
  'monster_molong_fashi': {
    baseDropChance: 0.22,
    goldMin: 580, goldMax: 950,
    qualityWeights: { normal: 20, uncommon: 22, rare: 25, epic: 18, legendary: 10, mythic: 5 },
    items: ['equip_molong_helmet', 'equip_molong_armor', 'equip_molong_necklace', 'equip_molong_ring', 'equip_leiting_weapon', 'equip_leiting_necklace', 'equip_drum_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.28 }]
  },
  'monster_molong_jianshi': {
    baseDropChance: 0.22,
    goldMin: 640, goldMax: 1050,
    qualityWeights: { normal: 20, uncommon: 22, rare: 25, epic: 18, legendary: 10, mythic: 5 },
    items: ['equip_molong_shoes', 'equip_molong_bracelet', 'equip_molong_belt', 'equip_molong_necklace', 'equip_leiting_ring', 'equip_leiting_shoes', 'equip_talisman_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.28 }]
  },
  'boss_molong_jiaozhu': {
    baseDropChance: 0.92,
    goldMin: 18000, goldMax: 32000,
    qualityWeights: { normal: 0, uncommon: 5, rare: 18, epic: 32, legendary: 28, mythic: 17 },
    items: ['equip_molong_helmet', 'equip_molong_armor', 'equip_molong_belt', 'equip_molong_shoes', 'equip_molong_bracelet', 'equip_molong_necklace', 'equip_molong_ring', 'equip_leiting_weapon', 'equip_leiting_helmet', 'equip_leiting_armor', 'equip_leiting_belt', 'equip_leiting_shoes', 'equip_leiting_bracelet', 'equip_leiting_necklace', 'equip_leiting_ring', 'equip_hat_lv55', 'equip_medal_lv55', 'equip_drum_lv55', 'equip_talisman_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 1.0, min: 6, max: 12 }, { id: 'blessing_gem', chance: 0.90, min: 3, max: 6 }, { id: 'super_oil_item', chance: 0.15 }, { id: 'skill_book_page', chance: 0.95, min: 8, max: 15 }]
  },

  // ==================== 雷炎洞穴 ====================
  'monster_leiyan_shi': {
    baseDropChance: 0.17,
    goldMin: 800, goldMax: 1500,
    qualityWeights: { normal: 30, uncommon: 28, rare: 23, epic: 14, legendary: 5, mythic: 0 },
    items: ['equip_leiyan_helmet', 'equip_leiyan_armor', 'equip_leiyan_belt', 'equip_xingwang_helmet', 'equip_xingwang_armor', 'equip_hat_lv55', 'equip_drum_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.25 }, { id: 'blessing_gem', chance: 0.14 }, { id: 'skill_book_page', chance: 0.38, min: 3, max: 5 }]
  },
  'monster_leiyan_wu': {
    baseDropChance: 0.18,
    goldMin: 1000, goldMax: 1700,
    qualityWeights: { normal: 28, uncommon: 27, rare: 24, epic: 15, legendary: 6, mythic: 0 },
    items: ['equip_leiyan_shoes', 'equip_leiyan_bracelet', 'equip_leiyan_necklace', 'equip_xingwang_shoes', 'equip_xingwang_bracelet', 'equip_medal_lv55', 'equip_talisman_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.25 }, { id: 'blessing_gem', chance: 0.14 }, { id: 'skill_book_page', chance: 0.38, min: 3, max: 5 }]
  },
  'monster_leiyan_zhanbing': {
    baseDropChance: 0.22,
    goldMin: 900, goldMax: 1600,
    qualityWeights: { normal: 20, uncommon: 22, rare: 25, epic: 18, legendary: 10, mythic: 5 },
    items: ['equip_leiyan_helmet', 'equip_leiyan_armor', 'equip_leiyan_belt', 'equip_leiyan_necklace', 'equip_xingwang_weapon', 'equip_xingwang_belt', 'equip_hat_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.28 }]
  },
  'monster_leiyan_xiezi': {
    baseDropChance: 0.22,
    goldMin: 1100, goldMax: 1800,
    qualityWeights: { normal: 20, uncommon: 22, rare: 25, epic: 18, legendary: 10, mythic: 5 },
    items: ['equip_leiyan_shoes', 'equip_leiyan_bracelet', 'equip_leiyan_ring', 'equip_leiyan_necklace', 'equip_xingwang_necklace', 'equip_xingwang_ring', 'equip_drum_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.28 }]
  },
  'boss_leiyan_mo': {
    baseDropChance: 0.93,
    goldMin: 35000, goldMax: 65000,
    qualityWeights: { normal: 0, uncommon: 3, rare: 15, epic: 30, legendary: 30, mythic: 22 },
    items: ['equip_leiyan_helmet', 'equip_leiyan_armor', 'equip_leiyan_belt', 'equip_leiyan_shoes', 'equip_leiyan_bracelet', 'equip_leiyan_necklace', 'equip_leiyan_ring', 'equip_xingwang_weapon', 'equip_xingwang_helmet', 'equip_xingwang_armor', 'equip_xingwang_belt', 'equip_xingwang_shoes', 'equip_xingwang_bracelet', 'equip_xingwang_necklace', 'equip_xingwang_ring', 'equip_hat_lv55', 'equip_medal_lv55', 'equip_drum_lv55', 'equip_talisman_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 1.0, min: 8, max: 15 }, { id: 'blessing_gem', chance: 0.95, min: 4, max: 8 }, { id: 'super_oil_item', chance: 0.20 }, { id: 'skill_book_page', chance: 0.95, min: 10, max: 18 }]
  },

  // ==================== 卧龙山庄 ====================
  'monster_wolong_shi': {
    baseDropChance: 0.17,
    goldMin: 1400, goldMax: 2400,
    qualityWeights: { normal: 25, uncommon: 27, rare: 25, epic: 16, legendary: 7, mythic: 0 },
    items: ['equip_wolong_helmet', 'equip_wolong_armor', 'equip_wolong_belt', 'equip_xingwang_helmet', 'equip_xingwang_armor', 'equip_hat_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.28 }, { id: 'blessing_gem', chance: 0.16 }, { id: 'skill_book_page', chance: 0.4, min: 3, max: 5 }]
  },
  'monster_wolong_cike': {
    baseDropChance: 0.18,
    goldMin: 1600, goldMax: 2800,
    qualityWeights: { normal: 22, uncommon: 26, rare: 26, epic: 18, legendary: 8, mythic: 0 },
    items: ['equip_wolong_shoes', 'equip_wolong_bracelet', 'equip_wolong_necklace', 'equip_xingwang_shoes', 'equip_xingwang_bracelet', 'equip_medal_lv70'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.28 }, { id: 'blessing_gem', chance: 0.16 }, { id: 'skill_book_page', chance: 0.4, min: 3, max: 5 }]
  },
  'monster_wolong_gong': {
    baseDropChance: 0.25,
    goldMin: 1500, goldMax: 2600,
    qualityWeights: { normal: 10, uncommon: 15, rare: 25, epic: 22, legendary: 18, mythic: 10 },
    items: ['equip_wolong_helmet', 'equip_wolong_armor', 'equip_wolong_belt', 'equip_wolong_necklace', 'equip_xingwang_weapon', 'equip_xingwang_belt', 'equip_xingwang_necklace', 'equip_hat_lv55'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.28 }]
  },
  'monster_wolong_wushi': {
    baseDropChance: 0.25,
    goldMin: 1700, goldMax: 3000,
    qualityWeights: { normal: 10, uncommon: 15, rare: 25, epic: 22, legendary: 18, mythic: 10 },
    items: ['equip_wolong_shoes', 'equip_wolong_bracelet', 'equip_wolong_ring', 'equip_wolong_necklace', 'equip_xingwang_ring', 'equip_xingwang_shoes', 'equip_drum_lv70'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.28 }]
  },
  'boss_wolong_zhuangzhu': {
    baseDropChance: 0.93,
    goldMin: 80000, goldMax: 170000,
    qualityWeights: { normal: 0, uncommon: 2, rare: 12, epic: 28, legendary: 32, mythic: 26 },
    items: ['equip_wolong_helmet', 'equip_wolong_armor', 'equip_wolong_belt', 'equip_wolong_shoes', 'equip_wolong_bracelet', 'equip_wolong_necklace', 'equip_wolong_ring', 'equip_xingwang_weapon', 'equip_xingwang_helmet', 'equip_xingwang_armor', 'equip_xingwang_belt', 'equip_xingwang_shoes', 'equip_xingwang_bracelet', 'equip_xingwang_necklace', 'equip_xingwang_ring', 'equip_wangzhe_helmet', 'equip_wangzhe_armor', 'equip_wangzhe_weapon', 'equip_hat_lv70', 'equip_medal_lv70', 'equip_drum_lv70', 'equip_talisman_lv70'],
    materialDrops: [{ id: 'lucky_stone', chance: 1.0, min: 10, max: 18 }, { id: 'blessing_gem', chance: 1.0, min: 5, max: 10 }, { id: 'super_oil_item', chance: 0.25 }, { id: 'skill_book_page', chance: 1, min: 12, max: 20 }]
  },

  // ==================== 狐月山 ====================
  'monster_huyue_hu': {
    baseDropChance: 0.17,
    goldMin: 1700, goldMax: 3000,
    qualityWeights: { normal: 20, uncommon: 25, rare: 27, epic: 18, legendary: 8, mythic: 2 },
    items: ['equip_huyue_helmet', 'equip_huyue_armor', 'equip_huyue_belt', 'equip_wangzhe_helmet', 'equip_wangzhe_armor', 'equip_hat_lv70'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.30 }, { id: 'blessing_gem', chance: 0.18 }, { id: 'skill_book_page', chance: 0.42, min: 3, max: 6 }]
  },
  'monster_huyue_yaohu': {
    baseDropChance: 0.18,
    goldMin: 2000, goldMax: 3200,
    qualityWeights: { normal: 18, uncommon: 24, rare: 27, epic: 20, legendary: 9, mythic: 2 },
    items: ['equip_huyue_shoes', 'equip_huyue_bracelet', 'equip_huyue_necklace', 'equip_wangzhe_shoes', 'equip_wangzhe_bracelet', 'equip_medal_lv70'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.30 }, { id: 'blessing_gem', chance: 0.18 }, { id: 'skill_book_page', chance: 0.42, min: 3, max: 6 }]
  },
  'monster_huyue_yaojiang': {
    baseDropChance: 0.25,
    goldMin: 2100, goldMax: 3400,
    qualityWeights: { normal: 10, uncommon: 15, rare: 25, epic: 22, legendary: 18, mythic: 10 },
    items: ['equip_huyue_helmet', 'equip_huyue_armor', 'equip_huyue_belt', 'equip_huyue_necklace', 'equip_huyue_ring', 'equip_wangzhe_weapon', 'equip_wangzhe_belt', 'equip_wangzhe_necklace', 'equip_drum_lv70'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.28 }]
  },
  'monster_huyue_wushi': {
    baseDropChance: 0.25,
    goldMin: 2300, goldMax: 3800,
    qualityWeights: { normal: 10, uncommon: 15, rare: 25, epic: 22, legendary: 18, mythic: 10 },
    items: ['equip_huyue_shoes', 'equip_huyue_bracelet', 'equip_huyue_necklace', 'equip_huyue_ring', 'equip_wangzhe_ring', 'equip_wangzhe_shoes', 'equip_talisman_lv70'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.28 }]
  },
  'boss_huyue_mo': {
    baseDropChance: 0.94,
    goldMin: 120000, goldMax: 200000,
    qualityWeights: { normal: 0, uncommon: 0, rare: 10, epic: 25, legendary: 35, mythic: 30 },
    items: ['equip_huyue_helmet', 'equip_huyue_armor', 'equip_huyue_belt', 'equip_huyue_shoes', 'equip_huyue_bracelet', 'equip_huyue_necklace', 'equip_huyue_ring', 'equip_wangzhe_weapon', 'equip_wangzhe_helmet', 'equip_wangzhe_armor', 'equip_wangzhe_belt', 'equip_wangzhe_shoes', 'equip_wangzhe_bracelet', 'equip_wangzhe_necklace', 'equip_wangzhe_ring', 'equip_tianlong_helmet', 'equip_tianlong_armor', 'equip_tianlong_weapon', 'equip_hat_lv70', 'equip_medal_lv70', 'equip_drum_lv70', 'equip_talisman_lv70'],
    materialDrops: [{ id: 'lucky_stone', chance: 1.0, min: 12, max: 20 }, { id: 'blessing_gem', chance: 1.0, min: 6, max: 12 }, { id: 'super_oil_item', chance: 0.30 }, { id: 'skill_book_page', chance: 1, min: 15, max: 25 }]
  },

  // ==================== 狐月秘境 ====================
  'monster_huyue_jinwei': {
    baseDropChance: 0.18,
    goldMin: 2200, goldMax: 3800,
    qualityWeights: { normal: 15, uncommon: 22, rare: 28, epic: 22, legendary: 10, mythic: 3 },
    items: ['equip_huyue_helmet', 'equip_huyue_armor', 'equip_huyue_ring', 'equip_tianlong_helmet', 'equip_tianlong_armor', 'equip_wangzhe_helmet', 'equip_hat_lv70', 'equip_drum_lv70'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.32 }, { id: 'blessing_gem', chance: 0.20 }, { id: 'skill_book_page', chance: 0.44, min: 4, max: 7 }]
  },
  'monster_huyue_xianhu': {
    baseDropChance: 0.18,
    goldMin: 2500, goldMax: 4500,
    qualityWeights: { normal: 12, uncommon: 20, rare: 28, epic: 24, legendary: 12, mythic: 4 },
    items: ['equip_huyue_belt', 'equip_huyue_shoes', 'equip_huyue_bracelet', 'equip_huyue_necklace', 'equip_tianlong_belt', 'equip_tianlong_shoes', 'equip_wangzhe_bracelet', 'equip_medal_lv70', 'equip_talisman_lv70'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.32 }, { id: 'blessing_gem', chance: 0.20 }, { id: 'skill_book_page', chance: 0.44, min: 4, max: 7 }]
  },
  'monster_huyue_tianhu': {
    baseDropChance: 0.25,
    goldMin: 2400, goldMax: 4000,
    qualityWeights: { normal: 10, uncommon: 15, rare: 25, epic: 22, legendary: 18, mythic: 10 },
    items: ['equip_huyue_helmet', 'equip_huyue_armor', 'equip_huyue_belt', 'equip_huyue_necklace', 'equip_huyue_ring', 'equip_tianlong_weapon', 'equip_tianlong_bracelet', 'equip_tianlong_necklace', 'equip_wangzhe_weapon', 'equip_hat_lv70'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.28 }]
  },
  'monster_huyue_xiuluo': {
    baseDropChance: 0.25,
    goldMin: 2600, goldMax: 4600,
    qualityWeights: { normal: 10, uncommon: 15, rare: 25, epic: 22, legendary: 18, mythic: 10 },
    items: ['equip_huyue_shoes', 'equip_huyue_bracelet', 'equip_huyue_necklace', 'equip_huyue_ring', 'equip_tianlong_ring', 'equip_tianlong_shoes', 'equip_wangzhe_necklace', 'equip_wangzhe_ring', 'equip_drum_lv70', 'equip_talisman_lv70'],
    materialDrops: [{ id: 'lucky_stone', chance: 0.05 }, { id: 'skill_book_page', chance: 0.28 }]
  },
  'boss_huyue_tianzhu': {
    baseDropChance: 0.95,
    goldMin: 180000, goldMax: 350000,
    qualityWeights: { normal: 0, uncommon: 0, rare: 5, epic: 20, legendary: 35, mythic: 40 },
    items: ['equip_huyue_helmet', 'equip_huyue_armor', 'equip_huyue_belt', 'equip_huyue_shoes', 'equip_huyue_bracelet', 'equip_huyue_necklace', 'equip_huyue_ring', 'equip_tianlong_weapon', 'equip_tianlong_helmet', 'equip_tianlong_armor', 'equip_tianlong_belt', 'equip_tianlong_shoes', 'equip_tianlong_bracelet', 'equip_tianlong_necklace', 'equip_tianlong_ring', 'equip_wangzhe_weapon', 'equip_wangzhe_helmet', 'equip_wangzhe_armor', 'equip_wangzhe_belt', 'equip_wangzhe_shoes', 'equip_wangzhe_bracelet', 'equip_wangzhe_necklace', 'equip_wangzhe_ring', 'equip_hat_lv70', 'equip_medal_lv70', 'equip_drum_lv70', 'equip_talisman_lv70'],
    materialDrops: [{ id: 'lucky_stone', chance: 1.0, min: 15, max: 25 }, { id: 'blessing_gem', chance: 1.0, min: 8, max: 15 }, { id: 'super_oil_item', chance: 0.40 }, { id: 'skill_book_page', chance: 1, min: 18, max: 30 }]
  }
};

export function getDropConfig(monsterId) {
  return DROP_CONFIG[monsterId] || null;
}

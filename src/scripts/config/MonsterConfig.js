export const MONSTER_CONFIG = {

  // ==================== 比奇郊外 (Lv1~10) ====================
  'monster_ji': {
    configId: 'monster_ji', name: '鸡', level: 1, mapId: 'map_biqi', isBoss: false,
    hp: 30, attack: 9, defense: 1, attackSpeed: 2.0,
    expReward: 8, goldMin: 2, goldMax: 6
  },
  'monster_lu': {
    configId: 'monster_lu', name: '鹿', level: 2, mapId: 'map_biqi', isBoss: false,
    hp: 50, attack: 15, defense: 2, attackSpeed: 2.0,
    expReward: 10, goldMin: 3, goldMax: 8
  },
  'monster_caocaoren': {
    configId: 'monster_caocaoren', name: '稻草人', level: 3, mapId: 'map_biqi', isBoss: false,
    hp: 80, attack: 23, defense: 4, attackSpeed: 1.8,
    expReward: 15, goldMin: 5, goldMax: 10
  },
  'boss_caocaoren_wang': {
    configId: 'boss_caocaoren_wang', name: '稻草人王', level: 5, mapId: 'map_biqi', isBoss: true,
    hp: 500, attack: 66, defense: 10, attackSpeed: 2.5,
    expReward: 200, goldMin: 60, goldMax: 150,
    respawnMinutes: 5,
    firstKillBonus: { exp: 500, gold: 200 }
  },

  // ==================== 盟重郊外 (Lv5~15) ====================
  'monster_yang': {
    configId: 'monster_yang', name: '羊', level: 5, mapId: 'map_mengzhong', isBoss: false,
    hp: 120, attack: 38, defense: 7, attackSpeed: 1.8,
    expReward: 30, goldMin: 10, goldMax: 22
  },
  'monster_lang': {
    configId: 'monster_lang', name: '狼', level: 7, mapId: 'map_mengzhong', isBoss: false,
    hp: 180, attack: 53, defense: 10, attackSpeed: 1.6,
    expReward: 45, goldMin: 15, goldMax: 30
  },
  'boss_banshouren': {
    configId: 'boss_banshouren', name: '半兽人头领', level: 10, mapId: 'map_mengzhong', isBoss: true,
    hp: 1500, attack: 165, defense: 35, attackSpeed: 2.5,
    expReward: 700, goldMin: 250, goldMax: 500,
    respawnMinutes: 8,
    firstKillBonus: { exp: 1500, gold: 600 }
  },

  // ==================== 石墓阵 (Lv10~20) ====================
  'monster_hei_yezhu': {
    configId: 'monster_hei_yezhu', name: '黑野猪', level: 10, mapId: 'map_shimu', isBoss: false,
    hp: 300, attack: 83, defense: 18, attackSpeed: 1.6,
    expReward: 70, goldMin: 25, goldMax: 55
  },
  'monster_hong_yezhu': {
    configId: 'monster_hong_yezhu', name: '红野猪', level: 12, mapId: 'map_shimu', isBoss: false,
    hp: 350, attack: 98, defense: 22, attackSpeed: 1.5,
    expReward: 90, goldMin: 30, goldMax: 60
  },
  'boss_bai_yezhu': {
    configId: 'boss_bai_yezhu', name: '白野猪', level: 15, mapId: 'map_shimu', isBoss: true,
    hp: 3000, attack: 330, defense: 80, attackSpeed: 2.2,
    expReward: 1500, goldMin: 500, goldMax: 1100,
    respawnMinutes: 15,
    firstKillBonus: { exp: 3000, gold: 1500 }
  },

  // ==================== 封魔谷 (Lv15~25) ====================
  'monster_hongmo_zhiwei': {
    configId: 'monster_hongmo_zhiwei', name: '红魔蜘蛛', level: 15, mapId: 'map_fengmo', isBoss: false,
    hp: 480, attack: 120, defense: 30, attackSpeed: 1.5,
    expReward: 120, goldMin: 45, goldMax: 80
  },
  'monster_xieshe': {
    configId: 'monster_xieshe', name: '邪蛇', level: 17, mapId: 'map_fengmo', isBoss: false,
    hp: 550, attack: 135, defense: 35, attackSpeed: 1.4,
    expReward: 140, goldMin: 55, goldMax: 90
  },
  'boss_xiedu_she': {
    configId: 'boss_xiedu_she', name: '邪毒蛇', level: 20, mapId: 'map_fengmo', isBoss: true,
    hp: 5500, attack: 462, defense: 120, attackSpeed: 2.0,
    expReward: 2800, goldMin: 1000, goldMax: 1600,
    respawnMinutes: 20,
    firstKillBonus: { exp: 6000, gold: 3000 }
  },

  // ==================== 祖玛寺庙 1-4层 (Lv20~26) ====================
  'monster_zuma_gong': {
    configId: 'monster_zuma_gong', name: '祖玛弓箭手', level: 20, mapId: 'map_zuma_1to4', isBoss: false,
    hp: 750, attack: 165, defense: 45, attackSpeed: 1.5,
    expReward: 180, goldMin: 60, goldMax: 140
  },
  'monster_zuma_weishi': {
    configId: 'monster_zuma_weishi', name: '祖玛卫士', level: 22, mapId: 'map_zuma_1to4', isBoss: false,
    hp: 850, attack: 195, defense: 55, attackSpeed: 1.4,
    expReward: 220, goldMin: 75, goldMax: 150
  },
  'boss_zuma_diaoxiang': {
    configId: 'boss_zuma_diaoxiang', name: '祖玛雕像', level: 25, mapId: 'map_zuma_1to4', isBoss: true,
    hp: 10000, attack: 660, defense: 200, attackSpeed: 2.0,
    expReward: 5000, goldMin: 1500, goldMax: 3500,
    respawnMinutes: 30,
    firstKillBonus: { exp: 10000, gold: 5000 }
  },

  // ==================== 祖玛寺庙 5-7层 (Lv25~32) ====================
  'monster_zuma_hufa': {
    configId: 'monster_zuma_hufa', name: '祖玛护法', level: 25, mapId: 'map_zuma_5to7', isBoss: false,
    hp: 1100, attack: 240, defense: 70, attackSpeed: 1.4,
    expReward: 280, goldMin: 100, goldMax: 200
  },
  'monster_qie_e': {
    configId: 'monster_qie_e', name: '楔蛾', level: 27, mapId: 'map_zuma_5to7', isBoss: false,
    hp: 1300, attack: 270, defense: 80, attackSpeed: 1.3,
    expReward: 330, goldMin: 120, goldMax: 220
  },
  'boss_zuma_jiaozhu': {
    configId: 'boss_zuma_jiaozhu', name: '祖玛教主', level: 30, mapId: 'map_zuma_5to7', isBoss: true,
    hp: 18000, attack: 924, defense: 280, attackSpeed: 2.0,
    expReward: 8000, goldMin: 3500, goldMax: 5500,
    respawnMinutes: 35,
    firstKillBonus: { exp: 16000, gold: 8000 }
  },

  // ==================== 赤月峡谷 (Lv30~42) ====================
  'monster_yueling_zhizhu': {
    configId: 'monster_yueling_zhizhu', name: '月灵蜘蛛', level: 30, mapId: 'map_chiyue', isBoss: false,
    hp: 1800, attack: 345, defense: 110, attackSpeed: 1.4,
    expReward: 450, goldMin: 150, goldMax: 350
  },
  'monster_chiyue_shi': {
    configId: 'monster_chiyue_shi', name: '赤月恶灵', level: 33, mapId: 'map_chiyue', isBoss: false,
    hp: 2200, attack: 405, defense: 130, attackSpeed: 1.3,
    expReward: 550, goldMin: 180, goldMax: 380
  },
  'boss_shuangtou_xuemo': {
    configId: 'boss_shuangtou_xuemo', name: '双头血魔', level: 35, mapId: 'map_chiyue', isBoss: true,
    hp: 25000, attack: 1155, defense: 350, attackSpeed: 2.0,
    expReward: 12000, goldMin: 4500, goldMax: 9000,
    respawnMinutes: 40,
    firstKillBonus: { exp: 25000, gold: 12000 }
  },
  'boss_shuangtou_jingang': {
    configId: 'boss_shuangtou_jingang', name: '双头金刚', level: 37, mapId: 'map_chiyue', isBoss: true,
    hp: 28000, attack: 1238, defense: 380, attackSpeed: 2.2,
    expReward: 14000, goldMin: 5000, goldMax: 10000,
    respawnMinutes: 42,
    firstKillBonus: { exp: 28000, gold: 14000 }
  },
  'boss_chiyue_emo': {
    configId: 'boss_chiyue_emo', name: '赤月恶魔', level: 40, mapId: 'map_chiyue', isBoss: true,
    hp: 35000, attack: 1403, defense: 420, attackSpeed: 2.5,
    expReward: 18000, goldMin: 6000, goldMax: 12000,
    respawnMinutes: 50,
    firstKillBonus: { exp: 40000, gold: 20000 }
  },

  // ==================== 困惑殿堂 (Lv40~46) ====================
  'monster_hunhuan_shi': {
    configId: 'monster_hunhuan_shi', name: '魂幻石人', level: 40, mapId: 'map_hunhuan', isBoss: false,
    hp: 4000, attack: 570, defense: 180, attackSpeed: 1.3,
    expReward: 850, goldMin: 350, goldMax: 550
  },
  'monster_hunhuan_zhanzhe': {
    configId: 'monster_hunhuan_zhanzhe', name: '魂幻战者', level: 42, mapId: 'map_hunhuan', isBoss: false,
    hp: 4800, attack: 630, defense: 210, attackSpeed: 1.2,
    expReward: 950, goldMin: 400, goldMax: 600
  },
  'boss_hunhuan_zhiwang': {
    configId: 'boss_hunhuan_zhiwang', name: '困惑之王', level: 45, mapId: 'map_hunhuan', isBoss: true,
    hp: 55000, attack: 2145, defense: 650, attackSpeed: 2.0,
    expReward: 28000, goldMin: 12000, goldMax: 18000,
    respawnMinutes: 50,
    firstKillBonus: { exp: 56000, gold: 28000 }
  },

  // ==================== 地狱烈焰 (Lv40~46) ====================
  'monster_diyu_zhanshi': {
    configId: 'monster_diyu_zhanshi', name: '地狱战士', level: 40, mapId: 'map_diyu', isBoss: false,
    hp: 4200, attack: 585, defense: 190, attackSpeed: 1.3,
    expReward: 860, goldMin: 360, goldMax: 560
  },
  'monster_diyu_gong': {
    configId: 'monster_diyu_gong', name: '地狱弓箭手', level: 42, mapId: 'map_diyu', isBoss: false,
    hp: 4600, attack: 615, defense: 200, attackSpeed: 1.2,
    expReward: 940, goldMin: 380, goldMax: 580
  },
  'boss_diyu_huoshe': {
    configId: 'boss_diyu_huoshe', name: '地狱火蛇', level: 45, mapId: 'map_diyu', isBoss: true,
    hp: 58000, attack: 2228, defense: 670, attackSpeed: 2.0,
    expReward: 30000, goldMin: 13000, goldMax: 19000,
    respawnMinutes: 50,
    firstKillBonus: { exp: 60000, gold: 30000 }
  },

  // ==================== 魔龙岭 (Lv45~52) ====================
  'monster_molong_shi': {
    configId: 'monster_molong_shi', name: '魔龙石卫', level: 45, mapId: 'map_molong_ling', isBoss: false,
    hp: 5500, attack: 720, defense: 240, attackSpeed: 1.3,
    expReward: 1100, goldMin: 450, goldMax: 700
  },
  'monster_molong_lishi': {
    configId: 'monster_molong_lishi', name: '魔龙力士', level: 48, mapId: 'map_molong_ling', isBoss: false,
    hp: 6500, attack: 810, defense: 270, attackSpeed: 1.2,
    expReward: 1300, goldMin: 550, goldMax: 800
  },
  'boss_molong_teshi': {
    configId: 'boss_molong_teshi', name: '魔龙特使', level: 50, mapId: 'map_molong_ling', isBoss: true,
    hp: 75000, attack: 2640, defense: 800, attackSpeed: 2.0,
    expReward: 38000, goldMin: 17000, goldMax: 24000,
    respawnMinutes: 55,
    firstKillBonus: { exp: 76000, gold: 38000 }
  },

  // ==================== 魔龙血域 (Lv50~58) ====================
  'monster_molong_xiwei': {
    configId: 'monster_molong_xiwei', name: '魔龙侍卫', level: 50, mapId: 'map_molong_xueyu', isBoss: false,
    hp: 7500, attack: 870, defense: 290, attackSpeed: 1.2,
    expReward: 1400, goldMin: 500, goldMax: 900
  },
  'monster_molong_zhanjiang': {
    configId: 'monster_molong_zhanjiang', name: '魔龙战将', level: 53, mapId: 'map_molong_xueyu', isBoss: false,
    hp: 8500, attack: 930, defense: 310, attackSpeed: 1.1,
    expReward: 1600, goldMin: 600, goldMax: 1000
  },
  'boss_molong_jiaozhu': {
    configId: 'boss_molong_jiaozhu', name: '魔龙教主', level: 55, mapId: 'map_molong_xueyu', isBoss: true,
    hp: 100000, attack: 3300, defense: 1000, attackSpeed: 2.0,
    expReward: 50000, goldMin: 18000, goldMax: 32000,
    respawnMinutes: 60,
    firstKillBonus: { exp: 100000, gold: 50000 }
  },

  // ==================== 雷炎洞穴 (Lv55~63) ====================
  'monster_leiyan_shi': {
    configId: 'monster_leiyan_shi', name: '雷炎石人', level: 55, mapId: 'map_leiyandong', isBoss: false,
    hp: 14000, attack: 1320, defense: 430, attackSpeed: 1.2,
    expReward: 2300, goldMin: 800, goldMax: 1500
  },
  'monster_leiyan_wu': {
    configId: 'monster_leiyan_wu', name: '雷炎巫', level: 58, mapId: 'map_leiyandong', isBoss: false,
    hp: 16000, attack: 1380, defense: 470, attackSpeed: 1.1,
    expReward: 2700, goldMin: 1000, goldMax: 1700
  },
  'boss_leiyan_mo': {
    configId: 'boss_leiyan_mo', name: '雷炎魔王', level: 60, mapId: 'map_leiyandong', isBoss: true,
    hp: 200000, attack: 4950, defense: 1500, attackSpeed: 2.0,
    expReward: 100000, goldMin: 35000, goldMax: 65000,
    respawnMinutes: 90,
    firstKillBonus: { exp: 200000, gold: 100000 }
  },

  // ==================== 卧龙山庄 (Lv60~67) ====================
  'monster_wolong_shi': {
    configId: 'monster_wolong_shi', name: '卧龙侍卫', level: 60, mapId: 'map_wolong', isBoss: false,
    hp: 28000, attack: 1875, defense: 620, attackSpeed: 1.1,
    expReward: 3800, goldMin: 1400, goldMax: 2400
  },
  'monster_wolong_cike': {
    configId: 'monster_wolong_cike', name: '卧龙刺客', level: 63, mapId: 'map_wolong', isBoss: false,
    hp: 32000, attack: 2025, defense: 680, attackSpeed: 1.0,
    expReward: 4200, goldMin: 1600, goldMax: 2800
  },
  'boss_wolong_zhuangzhu': {
    configId: 'boss_wolong_zhuangzhu', name: '卧龙庄主', level: 65, mapId: 'map_wolong', isBoss: true,
    hp: 500000, attack: 8250, defense: 2500, attackSpeed: 2.0,
    expReward: 250000, goldMin: 80000, goldMax: 170000,
    respawnMinutes: 120,
    firstKillBonus: { exp: 500000, gold: 250000 }
  },

  // ==================== 狐月山 (Lv63~70) ====================
  'monster_huyue_hu': {
    configId: 'monster_huyue_hu', name: '狐月妖狐', level: 63, mapId: 'map_huyue', isBoss: false,
    hp: 38000, attack: 2175, defense: 720, attackSpeed: 1.1,
    expReward: 4500, goldMin: 1700, goldMax: 3000
  },
  'monster_huyue_yaohu': {
    configId: 'monster_huyue_yaohu', name: '狐月妖', level: 65, mapId: 'map_huyue', isBoss: false,
    hp: 42000, attack: 2325, defense: 780, attackSpeed: 1.0,
    expReward: 5000, goldMin: 2000, goldMax: 3200
  },
  'boss_huyue_mo': {
    configId: 'boss_huyue_mo', name: '狐月魔王', level: 67, mapId: 'map_huyue', isBoss: true,
    hp: 650000, attack: 9900, defense: 3000, attackSpeed: 2.0,
    expReward: 350000, goldMin: 120000, goldMax: 200000,
    respawnMinutes: 150,
    firstKillBonus: { exp: 700000, gold: 350000 }
  },

  // ==================== 狐月秘境 (Lv70) ====================
  'monster_huyue_jinwei': {
    configId: 'monster_huyue_jinwei', name: '狐月禁卫', level: 68, mapId: 'map_huyue_mimi', isBoss: false,
    hp: 55000, attack: 2775, defense: 950, attackSpeed: 1.0,
    expReward: 5500, goldMin: 2200, goldMax: 3800
  },
  'monster_huyue_xianhu': {
    configId: 'monster_huyue_xianhu', name: '狐月仙狐', level: 70, mapId: 'map_huyue_mimi', isBoss: false,
    hp: 65000, attack: 3150, defense: 1050, attackSpeed: 0.9,
    expReward: 6500, goldMin: 2500, goldMax: 4500
  },
  'boss_huyue_tianzhu': {
    configId: 'boss_huyue_tianzhu', name: '狐月天珠', level: 70, mapId: 'map_huyue_mimi', isBoss: true,
    hp: 1000000, attack: 13200, defense: 4000, attackSpeed: 2.0,
    expReward: 500000, goldMin: 180000, goldMax: 350000,
    respawnMinutes: 180,
    firstKillBonus: { exp: 1000000, gold: 500000 }
  },
  'monster_xiezi': {
    configId: 'monster_xiezi', name: '蝎子', level: 4, mapId: 'map_biqi', isBoss: false,
    hp: 100, attack: 30, defense: 5, attackSpeed: 1.7,
    expReward: 20, goldMin: 7, goldMax: 14
  },
  'monster_banshouren': {
    configId: 'monster_banshouren', name: '半兽人', level: 6, mapId: 'map_biqi', isBoss: false,
    hp: 160, attack: 48, defense: 8, attackSpeed: 1.6,
    expReward: 35, goldMin: 12, goldMax: 20
  },
  'monster_wugong': {
    configId: 'monster_wugong', name: '蜈蚣', level: 8, mapId: 'map_mengzhong', isBoss: false,
    hp: 220, attack: 63, defense: 12, attackSpeed: 1.5,
    expReward: 55, goldMin: 18, goldMax: 35
  },
  'monster_kulou': {
    configId: 'monster_kulou', name: '骷髅战士', level: 10, mapId: 'map_mengzhong', isBoss: false,
    hp: 280, attack: 78, defense: 15, attackSpeed: 1.5,
    expReward: 65, goldMin: 22, goldMax: 42
  },
  'monster_shimu_shiwei': {
    configId: 'monster_shimu_shiwei', name: '石墓尸卫', level: 13, mapId: 'map_shimu', isBoss: false,
    hp: 400, attack: 113, defense: 25, attackSpeed: 1.5,
    expReward: 100, goldMin: 35, goldMax: 65
  },
  'monster_shimu_wugong': {
    configId: 'monster_shimu_wugong', name: '石墓蜈蚣', level: 15, mapId: 'map_shimu', isBoss: false,
    hp: 460, attack: 132, defense: 28, attackSpeed: 1.4,
    expReward: 115, goldMin: 40, goldMax: 72
  },
  'monster_fengmo_shiguai': {
    configId: 'monster_fengmo_shiguai', name: '封魔石怪', level: 19, mapId: 'map_fengmo', isBoss: false,
    hp: 600, attack: 162, defense: 40, attackSpeed: 1.4,
    expReward: 160, goldMin: 60, goldMax: 100
  },
  'monster_chulong': {
    configId: 'monster_chulong', name: '触龙神', level: 22, mapId: 'map_fengmo', isBoss: false,
    hp: 720, attack: 192, defense: 48, attackSpeed: 1.3,
    expReward: 200, goldMin: 70, goldMax: 120
  },
  'monster_zuma_diaoxiangbing': {
    configId: 'monster_zuma_diaoxiangbing', name: '祖玛雕像兵', level: 23, mapId: 'map_zuma_1to4', isBoss: false,
    hp: 900, attack: 215, defense: 58, attackSpeed: 1.4,
    expReward: 240, goldMin: 80, goldMax: 155
  },
  'monster_jiaoying': {
    configId: 'monster_jiaoying', name: '角蝇', level: 25, mapId: 'map_zuma_1to4', isBoss: false,
    hp: 1000, attack: 237, defense: 65, attackSpeed: 1.3,
    expReward: 260, goldMin: 90, goldMax: 170
  },
  'monster_zuma_xianfeng': {
    configId: 'monster_zuma_xianfeng', name: '祖玛先锋', level: 28, mapId: 'map_zuma_5to7', isBoss: false,
    hp: 1400, attack: 293, defense: 85, attackSpeed: 1.3,
    expReward: 350, goldMin: 130, goldMax: 230
  },
  'monster_xuejuren': {
    configId: 'monster_xuejuren', name: '血巨人', level: 30, mapId: 'map_zuma_5to7', isBoss: false,
    hp: 1600, attack: 327, defense: 95, attackSpeed: 1.2,
    expReward: 400, goldMin: 145, goldMax: 260
  },
  'monster_chiyue_qishi': {
    configId: 'monster_chiyue_qishi', name: '赤月骑士', level: 35, mapId: 'map_chiyue', isBoss: false,
    hp: 2500, attack: 465, defense: 145, attackSpeed: 1.3,
    expReward: 600, goldMin: 200, goldMax: 400
  },
  'monster_cuimo': {
    configId: 'monster_cuimo', name: '粹魔', level: 38, mapId: 'map_chiyue', isBoss: false,
    hp: 3200, attack: 540, defense: 165, attackSpeed: 1.2,
    expReward: 720, goldMin: 280, goldMax: 460
  },
  'monster_hunhuan_cike': {
    configId: 'monster_hunhuan_cike', name: '魂幻刺客', level: 43, mapId: 'map_hunhuan', isBoss: false,
    hp: 5200, attack: 675, defense: 220, attackSpeed: 1.2,
    expReward: 1000, goldMin: 420, goldMax: 620
  },
  'monster_kunhuo_zhi_ling': {
    configId: 'monster_kunhuo_zhi_ling', name: '困惑之灵', level: 45, mapId: 'map_hunhuan', isBoss: false,
    hp: 5800, attack: 743, defense: 245, attackSpeed: 1.1,
    expReward: 1080, goldMin: 440, goldMax: 660
  },
  'monster_diyu_fashi': {
    configId: 'monster_diyu_fashi', name: '地狱法师', level: 43, mapId: 'map_diyu', isBoss: false,
    hp: 5000, attack: 698, defense: 215, attackSpeed: 1.2,
    expReward: 980, goldMin: 400, goldMax: 600
  },
  'monster_yanmo_wei': {
    configId: 'monster_yanmo_wei', name: '炎魔卫', level: 45, mapId: 'map_diyu', isBoss: false,
    hp: 5600, attack: 765, defense: 240, attackSpeed: 1.1,
    expReward: 1060, goldMin: 430, goldMax: 650
  },
  'monster_molong_gong': {
    configId: 'monster_molong_gong', name: '魔龙弓手', level: 47, mapId: 'map_molong_ling', isBoss: false,
    hp: 6000, attack: 840, defense: 255, attackSpeed: 1.2,
    expReward: 1200, goldMin: 500, goldMax: 750
  },
  'monster_molong_daobing': {
    configId: 'monster_molong_daobing', name: '魔龙刀兵', level: 50, mapId: 'map_molong_ling', isBoss: false,
    hp: 7000, attack: 930, defense: 280, attackSpeed: 1.1,
    expReward: 1350, goldMin: 560, goldMax: 820
  },
  'monster_molong_fashi': {
    configId: 'monster_molong_fashi', name: '魔龙法师', level: 52, mapId: 'map_molong_xueyu', isBoss: false,
    hp: 8000, attack: 960, defense: 300, attackSpeed: 1.2,
    expReward: 1500, goldMin: 580, goldMax: 950
  },
  'monster_molong_jianshi': {
    configId: 'monster_molong_jianshi', name: '魔龙箭手', level: 55, mapId: 'map_molong_xueyu', isBoss: false,
    hp: 9200, attack: 1050, defense: 325, attackSpeed: 1.1,
    expReward: 1650, goldMin: 640, goldMax: 1050
  },
  'monster_leiyan_zhanbing': {
    configId: 'monster_leiyan_zhanbing', name: '雷炎战兵', level: 57, mapId: 'map_leiyandong', isBoss: false,
    hp: 15000, attack: 1425, defense: 450, attackSpeed: 1.1,
    expReward: 2500, goldMin: 900, goldMax: 1600
  },
  'monster_leiyan_xiezi': {
    configId: 'monster_leiyan_xiezi', name: '雷炎蝎子', level: 60, mapId: 'map_leiyandong', isBoss: false,
    hp: 18000, attack: 1575, defense: 500, attackSpeed: 1,
    expReward: 2900, goldMin: 1100, goldMax: 1800
  },
  'monster_wolong_gong': {
    configId: 'monster_wolong_gong', name: '卧龙弓手', level: 62, mapId: 'map_wolong', isBoss: false,
    hp: 30000, attack: 1950, defense: 650, attackSpeed: 1,
    expReward: 4000, goldMin: 1500, goldMax: 2600
  },
  'monster_wolong_wushi': {
    configId: 'monster_wolong_wushi', name: '卧龙武士', level: 65, mapId: 'map_wolong', isBoss: false,
    hp: 35000, attack: 2130, defense: 700, attackSpeed: 1,
    expReward: 4500, goldMin: 1700, goldMax: 3000
  },
  'monster_huyue_yaojiang': {
    configId: 'monster_huyue_yaojiang', name: '狐月妖将', level: 66, mapId: 'map_huyue', isBoss: false,
    hp: 44000, attack: 2430, defense: 800, attackSpeed: 1,
    expReward: 5200, goldMin: 2100, goldMax: 3400
  },
  'monster_huyue_wushi': {
    configId: 'monster_huyue_wushi', name: '狐月巫师', level: 68, mapId: 'map_huyue', isBoss: false,
    hp: 50000, attack: 2625, defense: 860, attackSpeed: 0.9,
    expReward: 5800, goldMin: 2300, goldMax: 3800
  },
  'monster_huyue_tianhu': {
    configId: 'monster_huyue_tianhu', name: '狐月天狐', level: 69, mapId: 'map_huyue_mimi', isBoss: false,
    hp: 58000, attack: 2925, defense: 980, attackSpeed: 0.9,
    expReward: 6000, goldMin: 2400, goldMax: 4000
  },
  'monster_huyue_xiuluo': {
    configId: 'monster_huyue_xiuluo', name: '狐月修罗', level: 70, mapId: 'map_huyue_mimi', isBoss: false,
    hp: 68000, attack: 3375, defense: 1080, attackSpeed: 0.9,
    expReward: 6800, goldMin: 2600, goldMax: 4600
  },
};
export function getMonsterById(id) {
  return MONSTER_CONFIG[id] || null;
}

export function getMonstersByMap(mapId) {
  return Object.values(MONSTER_CONFIG).filter(m => m.mapId === mapId && !m.isBoss);
}

export function getBossesByMap(mapId) {
  return Object.values(MONSTER_CONFIG).filter(m => m.mapId === mapId && m.isBoss);
}

export const MAP_CONFIG = {
  'map_biqi': {
    id: 'map_biqi', name: '比奇郊外', zone: '新手区',
    unlockLevel: 1, recommendLevel: [1, 10],
    expPerMinute: 60, goldPerMinute: 30,
    monsters: ['monster_ji', 'monster_lu', 'monster_caocaoren', 'monster_xiezi', 'monster_banshouren'],
    bosses: ['boss_caocaoren_wang'],
    unlockCondition: null,
    dropSets: []
  },
  'map_mengzhong': {
    id: 'map_mengzhong', name: '盟重郊外', zone: '新手区',
    unlockLevel: 5, recommendLevel: [5, 15],
    expPerMinute: 120, goldPerMinute: 60,
    monsters: ['monster_yang', 'monster_lang', 'monster_wugong', 'monster_kulou'],
    bosses: ['boss_banshouren'],
    unlockCondition: { type: 'level', value: 5 },
    dropSets: []
  },
  'map_shimu': {
    id: 'map_shimu', name: '石墓阵', zone: '新手进阶',
    unlockLevel: 10, recommendLevel: [10, 20],
    expPerMinute: 180, goldPerMinute: 85,
    monsters: ['monster_hei_yezhu', 'monster_hong_yezhu', 'monster_shimu_shiwei', 'monster_shimu_wugong'],
    bosses: ['boss_bai_yezhu'],
    unlockCondition: { type: 'level', value: 10 },
    dropSets: ['set_zuma']
  },
  'map_fengmo': {
    id: 'map_fengmo', name: '封魔谷', zone: '新手进阶',
    unlockLevel: 15, recommendLevel: [15, 25],
    expPerMinute: 300, goldPerMinute: 140,
    monsters: ['monster_hongmo_zhiwei', 'monster_xieshe', 'monster_fengmo_shiguai', 'monster_chulong'],
    bosses: ['boss_xiedu_she'],
    unlockCondition: { type: 'level', value: 15 },
    dropSets: ['set_zuma']
  },
  'map_zuma_1to4': {
    id: 'map_zuma_1to4', name: '祖玛寺庙(1-4层)', zone: '中级区域',
    unlockLevel: 20, recommendLevel: [20, 26],
    expPerMinute: 450, goldPerMinute: 200,
    monsters: ['monster_zuma_gong', 'monster_zuma_weishi', 'monster_zuma_diaoxiangbing', 'monster_jiaoying'],
    bosses: ['boss_zuma_diaoxiang'],
    unlockCondition: { type: 'level', value: 20 },
    dropSets: ['set_zuma']
  },
  'map_zuma_5to7': {
    id: 'map_zuma_5to7', name: '祖玛寺庙(5-7层)', zone: '中级区域',
    unlockLevel: 25, recommendLevel: [25, 32],
    expPerMinute: 700, goldPerMinute: 320,
    monsters: ['monster_zuma_hufa', 'monster_qie_e', 'monster_zuma_xianfeng', 'monster_xuejuren'],
    bosses: ['boss_zuma_jiaozhu'],
    unlockCondition: { type: 'level', value: 25 },
    dropSets: ['set_zuma']
  },
  'map_chiyue': {
    id: 'map_chiyue', name: '赤月峡谷', zone: '中级区域',
    unlockLevel: 30, recommendLevel: [30, 42],
    expPerMinute: 1200, goldPerMinute: 560,
    monsters: ['monster_yueling_zhizhu', 'monster_chiyue_shi', 'monster_chiyue_qishi', 'monster_cuimo'],
    bosses: ['boss_shuangtou_xuemo', 'boss_shuangtou_jingang', 'boss_chiyue_emo'],
    unlockCondition: { type: 'level', value: 30 },
    dropSets: ['set_shengzhan', 'set_fashen', 'set_tianzun']
  },
  'map_hunhuan': {
    id: 'map_hunhuan', name: '困惑殿堂', zone: '高级区域',
    unlockLevel: 40, recommendLevel: [40, 46],
    expPerMinute: 1800, goldPerMinute: 850,
    monsters: ['monster_hunhuan_shi', 'monster_hunhuan_zhanzhe', 'monster_hunhuan_cike', 'monster_kunhuo_zhi_ling'],
    bosses: ['boss_hunhuan_zhiwang'],
    unlockCondition: { type: 'level', value: 40 },
    dropSets: ['set_shengzhan', 'set_fashen', 'set_tianzun']
  },
  'map_diyu': {
    id: 'map_diyu', name: '地狱烈焰', zone: '高级区域',
    unlockLevel: 40, recommendLevel: [40, 46],
    expPerMinute: 1800, goldPerMinute: 850,
    monsters: ['monster_diyu_zhanshi', 'monster_diyu_gong', 'monster_diyu_fashi', 'monster_yanmo_wei'],
    bosses: ['boss_diyu_huoshe'],
    unlockCondition: { type: 'level', value: 40 },
    dropSets: ['set_shengzhan', 'set_fashen', 'set_tianzun']
  },
  'map_molong_ling': {
    id: 'map_molong_ling', name: '魔龙岭', zone: '高级区域',
    unlockLevel: 45, recommendLevel: [45, 52],
    expPerMinute: 2800, goldPerMinute: 1200,
    monsters: ['monster_molong_shi', 'monster_molong_lishi', 'monster_molong_gong', 'monster_molong_daobing'],
    bosses: ['boss_molong_teshi'],
    unlockCondition: { type: 'level', value: 45 },
    dropSets: ['set_molong']
  },
  'map_molong_xueyu': {
    id: 'map_molong_xueyu', name: '魔龙血域', zone: '精英区域',
    unlockLevel: 50, recommendLevel: [50, 58],
    expPerMinute: 4200, goldPerMinute: 1800,
    monsters: ['monster_molong_xiwei', 'monster_molong_zhanjiang', 'monster_molong_fashi', 'monster_molong_jianshi'],
    bosses: ['boss_molong_jiaozhu'],
    unlockCondition: { type: 'level', value: 50 },
    dropSets: ['set_molong']
  },
  'map_leiyandong': {
    id: 'map_leiyandong', name: '雷炎洞穴', zone: '精英区域',
    unlockLevel: 55, recommendLevel: [55, 63],
    expPerMinute: 6500, goldPerMinute: 2800,
    monsters: ['monster_leiyan_shi', 'monster_leiyan_wu', 'monster_leiyan_zhanbing', 'monster_leiyan_xiezi'],
    bosses: ['boss_leiyan_mo'],
    unlockCondition: { type: 'level', value: 55 },
    dropSets: ['set_leiyan']
  },
  'map_wolong': {
    id: 'map_wolong', name: '卧龙山庄', zone: '终极区域',
    unlockLevel: 60, recommendLevel: [60, 67],
    expPerMinute: 9500, goldPerMinute: 4000,
    monsters: ['monster_wolong_shi', 'monster_wolong_cike', 'monster_wolong_gong', 'monster_wolong_wushi'],
    bosses: ['boss_wolong_zhuangzhu'],
    unlockCondition: { type: 'level', value: 60 },
    dropSets: ['set_wolong']
  },
  'map_huyue': {
    id: 'map_huyue', name: '狐月山', zone: '终极区域',
    unlockLevel: 63, recommendLevel: [63, 70],
    expPerMinute: 13000, goldPerMinute: 5500,
    monsters: ['monster_huyue_hu', 'monster_huyue_yaohu', 'monster_huyue_yaojiang', 'monster_huyue_wushi'],
    bosses: ['boss_huyue_mo'],
    unlockCondition: { type: 'level', value: 63 },
    dropSets: ['set_huyue']
  },
  'map_huyue_mimi': {
    id: 'map_huyue_mimi', name: '狐月秘境', zone: '终极秘境',
    unlockLevel: 70, recommendLevel: [70, 70],
    expPerMinute: 20000, goldPerMinute: 9000,
    monsters: ['monster_huyue_jinwei', 'monster_huyue_xianhu', 'monster_huyue_tianhu', 'monster_huyue_xiuluo'],
    bosses: ['boss_huyue_tianzhu'],
    unlockCondition: { type: 'level', value: 70 },
    dropSets: ['set_huyue']
  },
  'map_tucheng': {
    id: 'map_tucheng', name: '盟重土城', zone: '安全区',
    unlockLevel: 1, recommendLevel: [1, 70],
    expPerMinute: 0, goldPerMinute: 0,
    monsters: [],
    bosses: [],
    unlockCondition: null,
    dropSets: [],
    isSafeZone: true
  }
};

export const MAP_ORDER = [
  'map_tucheng', 'map_biqi', 'map_mengzhong', 'map_shimu', 'map_fengmo',
  'map_zuma_1to4', 'map_zuma_5to7', 'map_chiyue',
  'map_hunhuan', 'map_diyu', 'map_molong_ling',
  'map_molong_xueyu', 'map_leiyandong', 'map_wolong',
  'map_huyue', 'map_huyue_mimi'
];

export function getMapById(mapId) {
  return MAP_CONFIG[mapId] || null;
}

export function getMapsByZone(zone) {
  return Object.values(MAP_CONFIG).filter(m => m.zone === zone);
}

export const POTION_TYPES = {
  hp_small:   { id: 'hp_small',  name: '小回春丹', type: 'hp', value: 50,   buyPrice: 20,   sellPrice: 5,   unlockLevel: 1,  icon: '🧪' },
  hp_medium:  { id: 'hp_medium', name: '中回春丹', type: 'hp', value: 200,  buyPrice: 80,   sellPrice: 20,  unlockLevel: 10, icon: '🧪' },
  hp_large:   { id: 'hp_large',  name: '大回春丹', type: 'hp', value: 800,  buyPrice: 300,  sellPrice: 75,  unlockLevel: 25, icon: '🧪' },
  hp_super:   { id: 'hp_super',  name: '极品金创药', type: 'hp', value: 3000, buyPrice: 1000, sellPrice: 250, unlockLevel: 45, icon: '💊' },

  mp_small:   { id: 'mp_small',  name: '小魔力药', type: 'mp', value: 30,   buyPrice: 15,   sellPrice: 4,   unlockLevel: 1,  icon: '💧' },
  mp_medium:  { id: 'mp_medium', name: '中魔力药', type: 'mp', value: 120,  buyPrice: 60,   sellPrice: 15,  unlockLevel: 10, icon: '💧' },
  mp_large:   { id: 'mp_large',  name: '大魔力药', type: 'mp', value: 500,  buyPrice: 220,  sellPrice: 55,  unlockLevel: 25, icon: '💧' },
  mp_super:   { id: 'mp_super',  name: '极品蓝灵药', type: 'mp', value: 2000, buyPrice: 800,  sellPrice: 200, unlockLevel: 45, icon: '🔮' },
};

export const AUTO_POTION_DEFAULTS = {
  hpEnabled: true,
  hpThreshold: 0.4,
  hpPotionId: 'hp_small',
  mpEnabled: false,
  mpThreshold: 0.3,
  mpPotionId: 'mp_small',
};

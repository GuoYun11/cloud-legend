export const ZODIAC_ANIMAL_CONFIG = [
  { animalId:1, name:'鼠', element:'水', statType:'critRate', baseValue:{low:0.005,mid:0.007,high:0.010,elite:0.014,immortal:0.019,legendary:0.025}, growthPerLevel:{low:0.0005,mid:0.0007,high:0.001,elite:0.0014,immortal:0.0019,legendary:0.0025}, desc:'提升暴击率', icon:'🐭' },
  { animalId:2, name:'牛', element:'土', statType:'maxHp', baseValue:{low:50,mid:70,high:100,elite:140,immortal:190,legendary:250}, growthPerLevel:{low:5,mid:7,high:10,elite:14,immortal:19,legendary:25}, desc:'提升最大生命值', icon:'🐮' },
  { animalId:3, name:'虎', element:'木', statType:'attack', baseValue:{low:10,mid:14,high:20,elite:28,immortal:38,legendary:50}, growthPerLevel:{low:1,mid:1.4,high:2,elite:2.8,immortal:3.8,legendary:5}, desc:'提升物理攻击', icon:'🐯' },
  { animalId:4, name:'兔', element:'木', statType:'dodgeRate', baseValue:{low:0.005,mid:0.007,high:0.010,elite:0.014,immortal:0.019,legendary:0.025}, growthPerLevel:{low:0.0005,mid:0.0007,high:0.001,elite:0.0014,immortal:0.0019,legendary:0.0025}, desc:'提升闪避率', icon:'🐰' },
  { animalId:5, name:'龙', element:'土', statType:'allStatsPercent', baseValue:{low:0.010,mid:0.014,high:0.020,elite:0.028,immortal:0.038,legendary:0.050}, growthPerLevel:{low:0.001,mid:0.0014,high:0.002,elite:0.0028,immortal:0.0038,legendary:0.005}, desc:'提升全属性%', icon:'🐲' },
  { animalId:6, name:'蛇', element:'火', statType:'critDamage', baseValue:{low:0.03,mid:0.042,high:0.060,elite:0.084,immortal:0.114,legendary:0.150}, growthPerLevel:{low:0.003,mid:0.0042,high:0.006,elite:0.0084,immortal:0.0114,legendary:0.015}, desc:'提升暴击伤害', icon:'🐍' },
  { animalId:7, name:'马', element:'火', statType:'attackSpeed', baseValue:{low:0.010,mid:0.014,high:0.020,elite:0.028,immortal:0.038,legendary:0.050}, growthPerLevel:{low:0.001,mid:0.0014,high:0.002,elite:0.0028,immortal:0.0038,legendary:0.005}, desc:'提升攻击速度', icon:'🐴' },
  { animalId:8, name:'羊', element:'土', statType:'defense', baseValue:{low:8,mid:11,high:16,elite:22,immortal:30,legendary:40}, growthPerLevel:{low:0.8,mid:1.1,high:1.6,elite:2.2,immortal:3.0,legendary:4.0}, desc:'提升物理防御', icon:'🐏' },
  { animalId:9, name:'猴', element:'金', statType:'expBonus', baseValue:{low:0.020,mid:0.028,high:0.040,elite:0.056,immortal:0.076,legendary:0.100}, growthPerLevel:{low:0.002,mid:0.0028,high:0.004,elite:0.0056,immortal:0.0076,legendary:0.01}, desc:'提升经验获取', icon:'🐒' },
  { animalId:10, name:'鸡', element:'金', statType:'goldBonus', baseValue:{low:0.030,mid:0.042,high:0.060,elite:0.084,immortal:0.114,legendary:0.150}, growthPerLevel:{low:0.003,mid:0.0042,high:0.006,elite:0.0084,immortal:0.0114,legendary:0.015}, desc:'提升金币获取', icon:'🐔' },
  { animalId:11, name:'狗', element:'土', statType:'hpRegen', baseValue:{low:1,mid:1.4,high:2,elite:2.8,immortal:3.8,legendary:5}, growthPerLevel:{low:0.1,mid:0.14,high:0.2,elite:0.28,immortal:0.38,legendary:0.5}, desc:'提升生命恢复', icon:'🐶' },
  { animalId:12, name:'猪', element:'水', statType:'magicFind', baseValue:{low:0.030,mid:0.042,high:0.060,elite:0.084,immortal:0.114,legendary:0.150}, growthPerLevel:{low:0.003,mid:0.0042,high:0.006,elite:0.0084,immortal:0.0114,legendary:0.015}, desc:'提升掉宝率', icon:'🐷' }
];

export const ZODIAC_QUALITY_CONFIG = {
  none: { name:'未获得', color:'#666', multiplier:0 },
  low: { name:'下品', color:'#9ca3af', multiplier:1.0 },
  mid: { name:'中品', color:'#22c55e', multiplier:1.3 },
  high: { name:'上品', color:'#3b82f6', multiplier:1.7 },
  elite: { name:'极品', color:'#a855f7', multiplier:2.2 },
  immortal: { name:'仙品', color:'#f59e0b', multiplier:2.8 },
  legendary: { name:'传奇', color:'#ef4444', multiplier:3.5 }
};

export const ZODIAC_SET_BONUS = [
  { count:3, name:'三合之力', bonus:{allStatsPercent:0.05}, desc:'全属性+5%' },
  { count:6, name:'六合圆满', bonus:{allStatsPercent:0.10,expBonus:0.10}, desc:'全属性+10%，经验+10%' },
  { count:9, name:'九宫守护', bonus:{allStatsPercent:0.15,expBonus:0.15,goldBonus:0.10}, desc:'全属性+15%，经验+15%，金币+10%' },
  { count:12, name:'十二生肖·天地同寿', bonus:{allStatsPercent:0.25,expBonus:0.25,goldBonus:0.20,critRate:0.05,dodgeRate:0.05}, desc:'全属性+25%，经验+25%，金币+20%，暴击+5%，闪避+5%' }
];

export const ZODIAC_DROP_QUALITY_WEIGHTS = {
  low:  { low: 78, mid: 18, high: 4, elite: 0, immortal: 0, legendary: 0 },
  mid:  { low: 50, mid: 35, high: 12, elite: 3, immortal: 0, legendary: 0 },
  high: { low: 25, mid: 38, high: 25, elite: 9, immortal: 2.5, legendary: 0.5 },
  elite:{ low: 12, mid: 28, high: 32, elite: 18, immortal: 7, legendary: 3 },
  top:  { low: 5,  mid: 18, high: 30, elite: 26, immortal: 14, legendary: 7 }
};

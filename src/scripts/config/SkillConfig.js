export const SKILL_UPGRADE_COSTS = [
  { targetLevel: 2, bookPages: 5,   gold: 500 },
  { targetLevel: 3, bookPages: 15,  gold: 2000 },
  { targetLevel: 4, bookPages: 40,  gold: 8000 },
  { targetLevel: 5, bookPages: 100, gold: 30000 },
];

export function getScaledValue(base, perLevel, skillLevel) {
  return base + perLevel * (skillLevel - 1);
}

export const WARRIOR_SKILLS = [
  {
    id: 'warrior_gongsha', job: 'warrior', name: '攻杀剑术', type: 'active',
    unlockLevel: 1, maxLevel: 5, trigger: 'on_attack',
    cooldownMs: 4000, manaCost: 0, priority: 20,
    effect: { type: 'damage', multiplier: 1.4 },
    levelScaling: { multiplierPerLevel: 0.17 },
    logText: '⚔️攻杀剑术触发！', color: '#ff6b35'
  },
  {
    id: 'warrior_liehuo', job: 'warrior', name: '烈火剑法', type: 'active',
    unlockLevel: 14, maxLevel: 5, trigger: 'on_boss_target',
    cooldownMs: 28000, manaCost: 20, priority: 90,
    effect: { type: 'damage', multiplier: 2.2 },
    levelScaling: { multiplierPerLevel: 0.26 },
    logText: '🔥烈火剑法！一刀破万血！', color: '#ff6b35'
  },
  {
    id: 'warrior_zhuri', job: 'warrior', name: '逐日剑法', type: 'active',
    unlockLevel: 35, maxLevel: 5, trigger: 'on_attack',
    cooldownMs: 52000, manaCost: 45, priority: 70,
    effect: { type: 'damage', multiplier: 1.8 },
    levelScaling: { multiplierPerLevel: 0.22 },
    logText: '⚡逐日剑法！横扫千军！', color: '#ff6b35'
  },
  {
    id: 'warrior_shield', job: 'warrior', name: '护体神盾', type: 'passive',
    unlockLevel: 50, maxLevel: 5, trigger: 'always', priority: 100,
    effect: { type: 'damage_reduction', value: 0.08 },
    levelScaling: { valuePerLevel: 0.02 },
    logText: '🛡️护体神盾生效', color: '#ff6b35'
  }
];

export const MAGE_SKILLS = [
  {
    id: 'mage_fireball', job: 'mage', name: '火球术', type: 'active',
    unlockLevel: 1, maxLevel: 5, trigger: 'on_attack',
    cooldownMs: 2500, manaCost: 8, priority: 25,
    effect: { type: 'damage', multiplier: 1.25 },
    levelScaling: { multiplierPerLevel: 0.15 },
    logText: '🔥火球术！灼烧敌人！', color: '#7c3aed'
  },
  {
    id: 'mage_shield', job: 'mage', name: '魔法盾', type: 'passive',
    unlockLevel: 12, maxLevel: 5, trigger: 'always', priority: 100,
    effect: { type: 'shield', value: 0.20, mpCostRatio: 1.5 },
    levelScaling: { valuePerLevel: 0.04 },
    logText: '🛡️魔法盾生效', color: '#7c3aed'
  },
  {
    id: 'mage_bingpaoxiao', job: 'mage', name: '冰咆哮', type: 'active',
    unlockLevel: 24, maxLevel: 5, trigger: 'on_attack',
    cooldownMs: 18000, manaCost: 28, priority: 80,
    effect: { type: 'damage', multiplier: 1.55 },
    levelScaling: { multiplierPerLevel: 0.19 },
    logText: '❄️冰咆哮！冰封万物！', color: '#7c3aed'
  },
  {
    id: 'mage_liuxing', job: 'mage', name: '流星火雨', type: 'active',
    unlockLevel: 35, maxLevel: 5, trigger: 'on_attack',
    cooldownMs: 75000, manaCost: 60, priority: 85,
    effect: { type: 'damage', multiplier: 2.0 },
    levelScaling: { multiplierPerLevel: 0.24 },
    logText: '☄️流星火雨！全屏清怪！', color: '#7c3aed'
  },
  {
    id: 'mage_arcane', job: 'mage', name: '奥术精通', type: 'passive',
    unlockLevel: 50, maxLevel: 5, trigger: 'always', priority: 100,
    effect: { type: 'spell_boost', value: 0.06 },
    levelScaling: { valuePerLevel: 0.02 },
    logText: '✨奥术精通激活', color: '#7c3aed'
  }
];

export const TAOIST_SKILLS = [
  {
    id: 'taoist_fire_talisman', job: 'taoist', name: '灵魂火符', type: 'active',
    unlockLevel: 1, maxLevel: 5, trigger: 'on_attack',
    cooldownMs: 3000, manaCost: 6, priority: 30,
    effect: { type: 'damage', multiplier: 1.3 },
    levelScaling: { multiplierPerLevel: 0.16 },
    logText: '🔥灵魂火符！焚灭邪魔！', color: '#10b981'
  },
  {
    id: 'taoist_poison', job: 'taoist', name: '施毒术', type: 'active',
    unlockLevel: 12, maxLevel: 5, trigger: 'on_attack',
    cooldownMs: 10000, manaCost: 10, priority: 40,
    effect: { type: 'dot', value: 0.25, durationMs: 5000, maxStacks: 2 },
    levelScaling: { valuePerLevel: 0.05 },
    logText: '☠️施毒术！毒雾弥漫！', color: '#10b981'
  },
  {
    id: 'taoist_skull', job: 'taoist', name: '召唤骷髅', type: 'summon',
    unlockLevel: 20, maxLevel: 5, trigger: 'on_map_enter',
    cooldownMs: 0, manaCost: 20, priority: 60,
    effect: { type: 'summon', summonId: 'summon_skull', inheritRatio: 0.60 },
    levelScaling: { inheritPerLevel: 0.08 },
    logText: '💀召唤骷髅！助战玛法！', color: '#10b981'
  },
  {
    id: 'taoist_beast', job: 'taoist', name: '召唤神兽', type: 'summon',
    unlockLevel: 35, maxLevel: 5, trigger: 'on_summon_dead',
    cooldownMs: 60000, manaCost: 40, priority: 75,
    effect: { type: 'summon', summonId: 'summon_beast', inheritRatio: 1.80 },
    levelScaling: { inheritPerLevel: 0.20 },
    logText: '🐉召唤神兽！战力拉满！', color: '#10b981'
  },
  {
    id: 'taoist_wuji', job: 'taoist', name: '无极真气', type: 'active',
    unlockLevel: 50, maxLevel: 5, trigger: 'on_boss_target',
    cooldownMs: 45000, manaCost: 35, priority: 92,
    effect: { type: 'buff', value: 0.25, durationMs: 12000 },
    levelScaling: { valuePerLevel: 0.05 },
    logText: '☯️无极真气！道法暴涨！', color: '#10b981'
  }
];

const ALL_SKILLS_MAP = {};
[...WARRIOR_SKILLS, ...MAGE_SKILLS, ...TAOIST_SKILLS].forEach(s => { ALL_SKILLS_MAP[s.id] = s; });

export function getSkillDef(skillId) { return ALL_SKILLS_MAP[skillId] || null; }

export function getJobSkills(job) {
  if (job === 'warrior') return WARRIOR_SKILLS;
  if (job === 'mage') return MAGE_SKILLS;
  if (job === 'taoist') return TAOIST_SKILLS;
  return [];
}

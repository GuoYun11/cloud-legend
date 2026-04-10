export const JOB_CONFIG = {
  warrior: {
    name: '战士',
    description: '近战物理输出，高血量高防御',
    baseStats: {
      maxHp: 160, maxMp: 50, attack: 10, magicAttack: 0,
      defense: 5, magicDefense: 3, critRate: 0.05, critDamage: 1.5,
      dodgeRate: 0.03, attackSpeed: 1.0, hpRegen: 3, mpRegen: 1,
      expBonus: 0, goldBonus: 0, magicFind: 0, damageReduction: 0
    },
    growth: {
      hpPerLevel: 35, mpPerLevel: 4, attackPerLevel: 3,
      magicAttackPerLevel: 0, defensePerLevel: 2, magicDefensePerLevel: 1
    }
  },
  mage: {
    name: '法师',
    description: '远程魔法输出，高爆发低防御',
    baseStats: {
      maxHp: 80, maxMp: 130, attack: 3, magicAttack: 12,
      defense: 2, magicDefense: 5, critRate: 0.08, critDamage: 1.5,
      dodgeRate: 0.05, attackSpeed: 0.67, hpRegen: 1, mpRegen: 4,
      expBonus: 0, goldBonus: 0, magicFind: 0, damageReduction: 0
    },
    growth: {
      hpPerLevel: 12, mpPerLevel: 20, attackPerLevel: 1,
      magicAttackPerLevel: 4, defensePerLevel: 1, magicDefensePerLevel: 2
    }
  },
  taoist: {
    name: '道士',
    description: '均衡发展，施毒召唤',
    baseStats: {
      maxHp: 120, maxMp: 90, attack: 6, magicAttack: 8,
      defense: 3, magicDefense: 4, critRate: 0.05, critDamage: 1.5,
      dodgeRate: 0.05, attackSpeed: 0.8, hpRegen: 2, mpRegen: 3,
      expBonus: 0, goldBonus: 0, magicFind: 0, damageReduction: 0
    },
    growth: {
      hpPerLevel: 22, mpPerLevel: 12, attackPerLevel: 2,
      magicAttackPerLevel: 2, defensePerLevel: 1.5, magicDefensePerLevel: 1.5
    }
  }
};

export const LEVEL_CONFIG = { maxLevel: 70 };

export function getExpToLevel(level) {
  if (level <= 1) return 0;
  if (level <= 30) return Math.floor(100 * Math.pow(level, 1.6));
  if (level <= 50) return Math.floor(100 * Math.pow(level, 1.8));
  return Math.floor(100 * Math.pow(level, 2.0));
}

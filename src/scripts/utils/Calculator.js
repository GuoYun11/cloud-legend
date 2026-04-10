export function calcDamage(attackerAttack, defenderDefense) {
  return Math.max(attackerAttack * 0.3, attackerAttack - defenderDefense);
}

export function calcCritDamage(damage, critDamage) {
  return damage * critDamage;
}

export function calcVariance(damage) {
  const variance = 0.9 + Math.random() * 0.2;
  return Math.floor(damage * variance);
}

export function calcExpToLevel(level) {
  if (level <= 30) return Math.floor(100 * Math.pow(level, 1.6));
  if (level <= 50) return Math.floor(100 * Math.pow(level, 1.8));
  return Math.floor(100 * Math.pow(level, 2.0));
}

export function calcEnhanceCost(level) {
  return Math.floor(200 * Math.pow(1.6, level));
}

export function calcMonsterGold(mapLevel) {
  return Math.floor(8 * Math.pow(1.12, mapLevel));
}

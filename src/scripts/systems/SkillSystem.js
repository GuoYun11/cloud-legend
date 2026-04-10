import EventBus, { EVENTS } from '../utils/EventBus.js';
import { getJobSkills, getSkillDef, getScaledValue, SKILL_UPGRADE_COSTS } from '../config/SkillConfig.js';

let _playerRef = null;
let _economyRef = null;
let _materialRef = null;
let _job = null;
let _playerLevel = 1;
let _skillLevels = {};
let _cooldowns = {};
let _summonState = null;
let _dotState = {};
let _activeBuffs = {};
let _magicShieldActive = false;

function init(savedSkills, job, playerLevel, refs = {}) {
  _job = job;
  _playerLevel = playerLevel || 1;
  _playerRef = refs.playerRef || null;
  _economyRef = refs.economyRef || null;
  _materialRef = refs.materialRef || null;
  _skillLevels = {};
  _cooldowns = {};
  _summonState = null;
  _dotState = {};
  _activeBuffs = {};
  _magicShieldActive = false;

  if (savedSkills && savedSkills.skillLevels) {
    Object.assign(_skillLevels, savedSkills.skillLevels);
  }

  _refreshUnlocks();
}

function setLevel(lv) {
  const oldLevel = _playerLevel;
  _playerLevel = lv;
  if (lv > oldLevel) _refreshUnlocks();
}

function _refreshUnlocks() {
  const skills = getJobSkills(_job);
  let newlyUnlocked = false;
  for (const sk of skills) {
    if (_playerLevel >= sk.unlockLevel && _skillLevels[sk.id] === undefined) {
      _skillLevels[sk.id] = 1;
      newlyUnlocked = true;
      EventBus.emit(EVENTS.SKILL_UNLOCKED, { skillId: sk.id, name: sk.name, level: 1 });
    }
  }
  if (newlyUnlocked) {
    EventBus.emit(EVENTS.SKILL_CHANGED, { skillLevels: { ..._skillLevels } });
  }
}

function upgradeSkill(skillId) {
  const def = getSkillDef(skillId);
  if (!def || def.job !== _job) return { success: false, reason: '技能不存在' };

  const currentLv = _skillLevels[skillId];
  if (currentLv === undefined) return { success: false, reason: '技能未解锁' };
  if (currentLv >= def.maxLevel) return { success: false, reason: '已达最高等级' };

  const targetLv = currentLv + 1;
  const costEntry = SKILL_UPGRADE_COSTS.find(c => c.targetLevel === targetLv);
  if (!costEntry) return { success: false, reason: '无升级配置' };

  const gold = _economyRef?.getGold?.() ?? 0;
  if (gold < costEntry.gold) return { success: false, reason: `金币不足 (需${costEntry.gold})` };

  const mats = _materialRef?.getMaterials?.() ?? {};
  const pages = mats.skill_book_page || 0;
  if (pages < costEntry.bookPages) return { success: false, reason: `技能书页不足 (需${costEntry.bookPages})` };

  _economyRef.spendGold(costEntry.gold, 'skill_upgrade');
  _materialRef.addMaterial('skill_book_page', -costEntry.bookPages);
  _skillLevels[skillId] = targetLv;

  EventBus.emit(EVENTS.SKILL_UPGRADED, { skillId, name: def.name, level: targetLv });
  EventBus.emit(EVENTS.SKILL_CHANGED, { skillLevels: { ..._skillLevels } });

  return { success: true, skillId, newLevel: targetLv };
}

function getUpgradeCost(skillId) {
  const currentLv = _skillLevels[skillId];
  if (currentLv === undefined) return null;
  const def = getSkillDef(skillId);
  if (!def || currentLv >= def.maxLevel) return null;
  return SKILL_UPGRADE_COSTS.find(c => c.targetLevel === currentLv + 1) || null;
}

function getUnlockedSkills() {
  const skills = getJobSkills(_job);
  return skills.filter(sk => _skillLevels[sk.id] !== undefined).map(sk => ({
    ...sk,
    currentLevel: _skillLevels[sk.id] || 1
  }));
}

function getAllSkillDefs() {
  return getJobSkills(_job);
}

function _isOnCooldown(skillId) {
  const cdEnd = _cooldowns[skillId] || 0;
  return Date.now() < cdEnd;
}

function _setCooldown(skillId, ms) {
  _cooldowns[skillId] = Date.now() + ms;
}

function _hasMp(amount) {
  if (!_playerRef) return false;
  const stats = _playerRef.getStats();
  return (stats.currentMp || 0) >= amount;
}

function _consumeMp(amount) {
  if (!_playerRef || amount <= 0) return;
  const stats = _playerRef.getStats();
  const newMp = Math.max(0, (stats.currentMp || 0) - amount);
  if (_playerRef.setMp) _playerRef.setMp(newMp);
}

function _cleanupExpiredBuffs() {
  const now = Date.now();
  for (const [buffId, buff] of Object.entries(_activeBuffs)) {
    if (!buff || now >= buff.expiresAt) {
      delete _activeBuffs[buffId];
    }
  }
}

function _getEffectiveAttackValue(stats) {
  const mods = getPassiveModifiers(stats || {});
  let atkVal = Math.max(stats?.attack || 0, stats?.magicAttack || 0);
  if (mods.spellBoost > 0) atkVal = Math.floor(atkVal * (1 + mods.spellBoost));
  return atkVal;
}

function processOnAttack(stats, monster) {
  const skills = getJobSkills(_job);
  const results = [];
  const now = Date.now();

  const attackSkills = skills
    .filter(sk => sk.trigger === 'on_attack' && _skillLevels[sk.id] !== undefined && !_isOnCooldown(sk.id))
    .sort((a, b) => b.priority - a.priority);

  for (const sk of attackSkills) {
    const lv = _skillLevels[sk.id];
    const manaCost = sk.manaCost || 0;
    if (manaCost > 0 && !_hasMp(manaCost)) continue;

    if (sk.effect.type === 'damage') {
      const multiplier = getScaledValue(sk.effect.multiplier, sk.levelScaling?.multiplierPerLevel || 0, lv);
      if (manaCost > 0) _consumeMp(manaCost);
      _setCooldown(sk.id, sk.cooldownMs || 0);

      const atkVal = _getEffectiveAttackValue(stats);
      const dmg = Math.floor(atkVal * multiplier * (0.85 + Math.random() * 0.30));
      results.push({ skillId: sk.id, type: 'damage', damage: dmg, logText: sk.logText, color: sk.color });
      EventBus.emit(EVENTS.SKILL_TRIGGERED, { skillId: sk.id, type: 'damage', damage: dmg });
    }

    if (sk.effect.type === 'dot') {
      const dotVal = getScaledValue(sk.effect.value, sk.levelScaling?.valuePerLevel || 0, lv);
      if (manaCost > 0) _consumeMp(manaCost);
      _setCooldown(sk.id, sk.cooldownMs || 0);

      const atkVal = _getEffectiveAttackValue(stats);
      const currentStacks = (_dotState[monster.instanceId]?.stacks || 0);
      const maxStacks = sk.effect.maxStacks || 1;
      if (currentStacks < maxStacks) {
        _dotState[monster.instanceId] = {
          stacks: currentStacks + 1,
          dpsRatio: dotVal,
          baseAtk: atkVal,
          expiresAt: now + (sk.effect.durationMs || 5000),
          skillId: sk.id
        };
      }
      results.push({ skillId: sk.id, type: 'dot_apply', logText: sk.logText, color: sk.color, stacks: currentStacks + 1 });
      EventBus.emit(EVENTS.SKILL_TRIGGERED, { skillId: sk.id, type: 'dot_apply' });
    }
  }

  return results;
}

function processOnBossTarget(stats, monster) {
  if (!monster.isBoss) return [];
  const skills = getJobSkills(_job);
  const results = [];
  const now = Date.now();

  const bossSkills = skills
    .filter(sk => sk.trigger === 'on_boss_target' && _skillLevels[sk.id] !== undefined && !_isOnCooldown(sk.id))
    .sort((a, b) => b.priority - a.priority);

  for (const sk of bossSkills) {
    const lv = _skillLevels[sk.id];
    const manaCost = sk.manaCost || 0;
    if (manaCost > 0 && !_hasMp(manaCost)) continue;

    if (sk.effect.type === 'damage') {
      const multiplier = getScaledValue(sk.effect.multiplier, sk.levelScaling?.multiplierPerLevel || 0, lv);
      if (manaCost > 0) _consumeMp(manaCost);
      _setCooldown(sk.id, sk.cooldownMs || 0);
      const atkVal = _getEffectiveAttackValue(stats);
      const dmg = Math.floor(atkVal * multiplier * (0.85 + Math.random() * 0.30));
      results.push({ skillId: sk.id, type: 'damage', damage: dmg, logText: sk.logText, color: sk.color });
      EventBus.emit(EVENTS.SKILL_TRIGGERED, { skillId: sk.id, type: 'damage', damage: dmg });
    }

    if (sk.effect.type === 'buff') {
      const boostValue = getScaledValue(sk.effect.value, sk.levelScaling?.valuePerLevel || 0, lv);
      if (manaCost > 0) _consumeMp(manaCost);
      _setCooldown(sk.id, sk.cooldownMs || 0);
      _activeBuffs[sk.id] = {
        skillId: sk.id,
        value: boostValue,
        expiresAt: now + (sk.effect.durationMs || 0)
      };
      results.push({
        skillId: sk.id,
        type: 'buff',
        value: boostValue,
        durationMs: sk.effect.durationMs || 0,
        logText: sk.logText,
        color: sk.color
      });
      EventBus.emit(EVENTS.SKILL_TRIGGERED, { skillId: sk.id, type: 'buff', value: boostValue });
    }
  }

  return results;
}

function processOnLowHp(stats) {
  const hpRatio = (stats.currentHp || 0) / (stats.maxHp || 1);
  if (hpRatio > 0.4) return [];

  const skills = getJobSkills(_job);
  const results = [];

  const healSkills = skills
    .filter(sk => sk.trigger === 'on_low_hp' && _skillLevels[sk.id] !== undefined && !_isOnCooldown(sk.id))
    .sort((a, b) => b.priority - a.priority);

  for (const sk of healSkills) {
    const lv = _skillLevels[sk.id];
    const manaCost = sk.manaCost || 0;
    if (manaCost > 0 && !_hasMp(manaCost)) continue;

    if (sk.effect.type === 'heal') {
      const healRatio = getScaledValue(sk.effect.healRatio, sk.levelScaling?.healRatioPerLevel || 0, lv);
      const flatHeal = getScaledValue(sk.effect.flatHeal, sk.levelScaling?.flatHealPerLevel || 0, lv);
      if (manaCost > 0) _consumeMp(manaCost);
      _setCooldown(sk.id, sk.cooldownMs || 0);

      const healAmount = Math.floor((stats.maxHp || 1) * healRatio + flatHeal);
      const newHp = Math.min(stats.maxHp, (stats.currentHp || 0) + healAmount);
      if (_playerRef?.setHp) _playerRef.setHp(newHp);
      results.push({ skillId: sk.id, type: 'heal', amount: healAmount, logText: sk.logText, color: sk.color });
      EventBus.emit(EVENTS.SKILL_TRIGGERED, { skillId: sk.id, type: 'heal', amount: healAmount });
    }
  }

  return results;
}

function getPassiveModifiers(stats) {
  const mods = { damageReduction: 0, spellBoost: 0 };
  const skills = getJobSkills(_job);

  _cleanupExpiredBuffs();

  for (const sk of skills) {
    if (sk.trigger !== 'always' || _skillLevels[sk.id] === undefined) continue;
    const lv = _skillLevels[sk.id];

    if (sk.effect.type === 'damage_reduction') {
      mods.damageReduction += getScaledValue(sk.effect.value, sk.levelScaling?.valuePerLevel || 0, lv);
    }
    if (sk.effect.type === 'spell_boost') {
      mods.spellBoost += getScaledValue(sk.effect.value, sk.levelScaling?.valuePerLevel || 0, lv);
    }
    if (sk.effect.type === 'shield') {
      const absorbRatio = getScaledValue(sk.effect.value, sk.levelScaling?.valuePerLevel || 0, lv);
      mods.magicShieldRatio = absorbRatio;
      mods.magicShieldMpCostRatio = sk.effect.mpCostRatio || 1.5;
    }
  }

  for (const buff of Object.values(_activeBuffs)) {
    if (!buff) continue;
    mods.spellBoost += buff.value || 0;
  }

  return mods;
}

function processMagicShield(incomingDamage, stats) {
  const mods = getPassiveModifiers(stats);
  if (!mods.magicShieldRatio || mods.magicShieldRatio <= 0) {
    return { finalDamage: incomingDamage, mpUsed: 0, shieldActive: false };
  }

  const currentMp = stats.currentMp || 0;
  if (currentMp <= 0) {
    if (_magicShieldActive) {
      _magicShieldActive = false;
      EventBus.emit(EVENTS.SKILL_TRIGGERED, { skillId: 'mage_shield', type: 'shield_break' });
    }
    return { finalDamage: incomingDamage, mpUsed: 0, shieldActive: false };
  }

  _magicShieldActive = true;
  const absorbed = Math.floor(incomingDamage * mods.magicShieldRatio);
  const mpCost = Math.floor(absorbed * mods.magicShieldMpCostRatio);
  const actualMpUsed = Math.min(mpCost, currentMp);
  const actualAbsorbed = mpCost > 0 ? Math.floor(absorbed * (actualMpUsed / mpCost)) : 0;

  _consumeMp(actualMpUsed);

  const finalDamage = Math.max(1, incomingDamage - actualAbsorbed);

  if (actualMpUsed >= currentMp) {
    _magicShieldActive = false;
    EventBus.emit(EVENTS.SKILL_TRIGGERED, { skillId: 'mage_shield', type: 'shield_break' });
  }

  return { finalDamage, mpUsed: actualMpUsed, shieldActive: _magicShieldActive, absorbed: actualAbsorbed };
}

function processDotTick(monster) {
  if (!monster) return 0;
  const dot = _dotState[monster.instanceId];
  if (!dot) return 0;
  if (Date.now() > dot.expiresAt) {
    delete _dotState[monster.instanceId];
    return 0;
  }
  const dmg = Math.floor(dot.baseAtk * dot.dpsRatio * dot.stacks * 0.2);
  return Math.max(1, dmg);
}

function getSummonDamage(stats) {
  if (!_summonState) return 0;
  const mods = getPassiveModifiers(stats || {});
  const attack = _summonState.attack * (1 + (mods.spellBoost || 0));
  return Math.floor(attack * (0.8 + Math.random() * 0.4));
}

function trySpawnSummon(stats) {
  const skills = getJobSkills(_job);
  const summonSkills = skills
    .filter(sk => sk.type === 'summon' && _skillLevels[sk.id] !== undefined)
    .sort((a, b) => b.priority - a.priority);

  for (const sk of summonSkills) {
    if (_isOnCooldown(sk.id)) continue;
    const lv = _skillLevels[sk.id];
    const manaCost = sk.manaCost || 0;
    if (manaCost > 0 && !_hasMp(manaCost)) continue;

    const inheritRatio = getScaledValue(sk.effect.inheritRatio, sk.levelScaling?.inheritPerLevel || 0, lv);
    if (manaCost > 0) _consumeMp(manaCost);
    if (sk.cooldownMs > 0) _setCooldown(sk.id, sk.cooldownMs);

    const baseAtk = Math.max(stats.attack || 0, stats.magicAttack || 0);
    _summonState = {
      skillId: sk.id,
      name: sk.name,
      attack: Math.floor(baseAtk * inheritRatio),
      level: lv
    };

    EventBus.emit(EVENTS.SKILL_TRIGGERED, { skillId: sk.id, type: 'summon', name: sk.name });
    return { summoned: true, name: sk.name, logText: sk.logText, color: sk.color };
  }
  return null;
}

function hasSummon() {
  return _summonState !== null;
}

function clearSummon() {
  _summonState = null;
}

function clearDots() {
  _dotState = {};
}

function getData() {
  return { skillLevels: { ..._skillLevels } };
}

function getSkillLevel(skillId) {
  return _skillLevels[skillId] || 0;
}

export default {
  init, setLevel, upgradeSkill, getUpgradeCost, getUnlockedSkills, getAllSkillDefs,
  processOnAttack, processOnBossTarget, processOnLowHp, getPassiveModifiers,
  processMagicShield, processDotTick, getSummonDamage, trySpawnSummon,
  hasSummon, clearSummon, clearDots, getData, getSkillLevel
};

export {
  init, setLevel, upgradeSkill, getUpgradeCost, getUnlockedSkills, getAllSkillDefs,
  processOnAttack, processOnBossTarget, processOnLowHp, getPassiveModifiers,
  processMagicShield, processDotTick, getSummonDamage, trySpawnSummon,
  hasSummon, clearSummon, clearDots, getData, getSkillLevel
};

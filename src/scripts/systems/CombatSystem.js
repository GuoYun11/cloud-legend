import EventBus, { EVENTS } from '../utils/EventBus.js';
import { MAP_CONFIG } from '../config/MapConfig.js';
import { MONSTER_CONFIG } from '../config/MonsterConfig.js';
import { DROP_CONFIG } from '../config/DropConfig.js';
import { MATERIAL_CONFIG, EQUIP_BASES } from '../config/EquipmentConfig.js';
import { ZODIAC_ANIMAL_CONFIG, ZODIAC_DROP_QUALITY_WEIGHTS } from '../config/ZodiacConfig.js';
import { randomInt, chance, weightedRandom, uuid } from '../utils/Random.js';
import * as SkillSystem from './SkillSystem.js';
import * as ZodiacSystem from './ZodiacSystem.js';
import * as PotionSystem from './PotionSystem.js';

const MAX_LOG = 20;
const DEF_K_OFFENSE = 500;
const DEF_K_DEFENSE = 200;
const MONSTER_HP_MULT = 2.0;

function _monsterScaling(level, isBoss) {
  const l = Math.max(0, level - 8);
  const hpMult = isBoss
    ? Math.max(0.12, 1.0 - l * 0.015)
    : Math.max(0.18, 1.0 - l * 0.014);
  const defMult = Math.max(0.35, 1.0 - l * 0.010);
  return { hpMult: hpMult * MONSTER_HP_MULT, defMult };
}

let _playerRef = null;
let _tickTimer = null;
let _combatState = null;
let _addMaterialFn = null;
let _skillSystemReady = false;

function _defaultState() {
  return {
    playerId: null,
    mapId: null,
    isActive: false,
    currentMonster: null,
    lastAttackTime: 0,
    lastMonsterAttackTime: 0,
    lastRegenTime: 0,
    battleLog: [],
    sessionStats: { startTime: 0, kills: 0, bossKills: 0, expGained: 0, goldGained: 0, itemsDropped: 0 },
    isDead: false,
    reviveAt: 0,
    deathStreak: 0,
    weakStacks: 0,
    weakExpiresAt: 0,
    previousMapId: null,
    autoRevive: false
  };
}

function init(playerRef, opts = {}) {
  _playerRef = playerRef;
  _combatState = _defaultState();
  if (opts.addMaterial) _addMaterialFn = opts.addMaterial;
  _skillSystemReady = opts.skillSystemReady !== false;
}

function startCombat(mapId) {
  const map = MAP_CONFIG[mapId];
  if (!map || !_playerRef) return false;
  if (map.isSafeZone) {
    const prevMapId = _combatState?.mapId || null;
    stopCombat();
    _combatState = _defaultState();
    _combatState.mapId = mapId;
    _combatState.previousMapId = prevMapId;
    _combatState.isActive = false;
    addLog('system', `进入安全区：${map.name}，战斗已暂停`, 0, false, false);
    return true;
  }

  const prevMapId = _combatState?.mapId || null;
  stopCombat();
  _combatState = _defaultState();
  _combatState.playerId = _playerRef.getId ? _playerRef.getId() : 'player';
  _combatState.mapId = mapId;
  _combatState.previousMapId = prevMapId;
  _combatState.isActive = true;
  _combatState.sessionStats.startTime = Date.now();

  const now = Date.now();
  _combatState.lastAttackTime = now;
  _combatState.lastMonsterAttackTime = now;
  _combatState.lastRegenTime = now;
  _combatState.currentMonster = spawnMonster(mapId);

  if (_skillSystemReady) {
    const stats = _playerRef.getStats();
    const summonResult = SkillSystem.trySpawnSummon(stats);
    if (summonResult && summonResult.summoned) {
      addLog('skill', summonResult.logText, 0, false, false);
    }
  }

  _tickTimer = setInterval(tick, 1000);
  return true;
}

function stopCombat() {
  _combatState.isActive = false;
  if (_tickTimer) {
    clearInterval(_tickTimer);
    _tickTimer = null;
  }
}

const REVIVE_WAIT_MS = 5000;
const WEAK_DURATION_MS = 30000;
const WEAK_PENALTY_PER_STACK = 0.10;
const MAX_WEAK_STACKS = 3;
const SAFE_RETREAT_DEATHS = 3;

function tick() {
  if (!_combatState.isActive || !_playerRef) return;

  const now = Date.now();

  if (_combatState.weakStacks > 0 && now >= _combatState.weakExpiresAt) {
    _combatState.weakStacks = 0;
    _combatState.weakExpiresAt = 0;
    addLog('buff', '虚弱状态已消退', 0, false, false);
    EventBus.emit(EVENTS.COMBAT_LOG, { type: 'weak_expired' });
  }

  if (_combatState.isDead) {
    if (_combatState.autoRevive && now >= _combatState.reviveAt) {
      _doRevive('auto');
    }
    return;
  }

  if (!_combatState.currentMonster) {
    _combatState.currentMonster = spawnMonster(_combatState.mapId);
    _combatState.lastAttackTime = now;
    _combatState.lastMonsterAttackTime = now;
    return;
  }

  const rawStats = _playerRef.getStats();
  const stats = _applyWeakDebuff(rawStats);
  const monster = _combatState.currentMonster;

  const playerInterval = 1000 / (stats.attackSpeed || 1);
  if (now - _combatState.lastAttackTime >= playerInterval) {
    _doPlayerAttack(stats, monster);
    _combatState.lastAttackTime = now;
  }

  if (_skillSystemReady && monster.currentHp > 0) {
    const dotDmg = SkillSystem.processDotTick(monster);
    if (dotDmg > 0) {
      monster.currentHp = Math.max(0, monster.currentHp - dotDmg);
      addLog('skill', `☠️毒伤 ${dotDmg}`, dotDmg, false, false);
    }
    if (SkillSystem.hasSummon() && monster.currentHp > 0) {
      const summonDmg = SkillSystem.getSummonDamage(stats);
      if (summonDmg > 0) {
        monster.currentHp = Math.max(0, monster.currentHp - summonDmg);
        addLog('skill', `💀召唤物造成${summonDmg}点伤害`, summonDmg, false, false);
      }
    }
  }

  if (monster.currentHp <= 0) {
    onMonsterDead(monster);
    return;
  }

  const monsterInterval = monster.attackSpeed * 1000;
  if (now - _combatState.lastMonsterAttackTime >= monsterInterval) {
    _doMonsterAttack(monster, stats);
    _combatState.lastMonsterAttackTime = now;
  }

  const currentStats = _playerRef.getStats();
  if (currentStats.currentHp <= 0) {
    onPlayerDead();
    return;
  }

  if (now - _combatState.lastRegenTime >= 5000) {
    _doRegen(currentStats);
    _combatState.lastRegenTime = now;
  }
}

function _applyWeakDebuff(stats) {
  if (_combatState.weakStacks <= 0) return stats;
  const penalty = 1 - (_combatState.weakStacks * WEAK_PENALTY_PER_STACK);
  return {
    ...stats,
    attack: Math.floor((stats.attack || 0) * penalty),
    magicAttack: Math.floor((stats.magicAttack || 0) * penalty),
    defense: Math.floor((stats.defense || 0) * penalty),
    magicDefense: Math.floor((stats.magicDefense || 0) * penalty),
    maxHp: Math.floor((stats.maxHp || 100) * penalty),
    maxMp: Math.floor((stats.maxMp || 50) * penalty),
  };
}

function _doPlayerAttack(stats, monster) {
  if (chance(monster.dodgeRate || 0)) {
    addLog('miss', `${monster.name}闪避了攻击`, 0, false, true);
    EventBus.emit(EVENTS.COMBAT_LOG, { type: 'miss', target: monster.name });
    return;
  }

  const passiveMods = _skillSystemReady ? SkillSystem.getPassiveModifiers(stats) : {};
  const spellBoost = passiveMods.spellBoost || 0;

  let atkStat = Math.max(stats.attack || 0, stats.magicAttack || 0);
  if (spellBoost > 0) atkStat = Math.floor(atkStat * (1 + spellBoost));

  const monDefReduction = monster.defense / (monster.defense + DEF_K_OFFENSE);
  const maxDmg = Math.max(atkStat * 0.1, atkStat * (1 - monDefReduction));
  const LUCKY_FULL_CAP = 9;
  const luckyNet = Math.min(stats.lucky || 0, LUCKY_FULL_CAP);
  const minRatio = 0.7 + (luckyNet / LUCKY_FULL_CAP) * 0.3;
  const variance = 1.0 - minRatio;
  let baseDamage = maxDmg * (minRatio + Math.random() * variance);

  let isCrit = false;
  if (chance(stats.critRate || 0.05)) {
    baseDamage *= (stats.critDamage || 1.5);
    isCrit = true;
  }

  const finalDamage = Math.max(1, Math.floor(baseDamage));
  monster.currentHp = Math.max(0, monster.currentHp - finalDamage);

  addLog('player_attack', `对${monster.name}造成${finalDamage}点伤害`, finalDamage, isCrit, false);
  EventBus.emit(EVENTS.COMBAT_DAMAGE, {
    source: 'player', target: monster.configId, damage: finalDamage,
    isCrit, remainHp: monster.currentHp, maxHp: monster.maxHp
  });

  if (_skillSystemReady && monster.currentHp > 0) {
    const skillResults = SkillSystem.processOnAttack(stats, monster);
    for (const sr of skillResults) {
      if (sr.type === 'damage' && sr.damage > 0) {
        monster.currentHp = Math.max(0, monster.currentHp - sr.damage);
        addLog('skill', `${sr.logText} 造成${sr.damage}点伤害`, sr.damage, false, false);
      } else if (sr.type === 'dot_apply') {
        addLog('skill', `${sr.logText}`, 0, false, false);
      }
    }

    const bossResults = SkillSystem.processOnBossTarget(stats, monster);
    for (const sr of bossResults) {
      if (sr.type === 'damage' && sr.damage > 0) {
        monster.currentHp = Math.max(0, monster.currentHp - sr.damage);
        addLog('skill', `${sr.logText} 造成${sr.damage}点伤害`, sr.damage, false, false);
      } else if (sr.type === 'buff') {
        addLog('skill', `${sr.logText} ${Math.floor((sr.value || 0) * 100)}%增伤，持续${Math.floor((sr.durationMs || 0) / 1000)}秒`, 0, false, false);
      }
    }
  }
}

function _doMonsterAttack(monster, stats) {
  if (chance(stats.dodgeRate || 0.03)) {
    addLog('dodge', `闪避了${monster.name}的攻击`, 0, false, true);
    EventBus.emit(EVENTS.COMBAT_LOG, { type: 'dodge', source: monster.name });
    return;
  }

  const plrDefReduction = (stats.defense || 0) / ((stats.defense || 0) + DEF_K_DEFENSE);
  let baseDamage = Math.max(monster.attack * 0.1, monster.attack * (1 - plrDefReduction));
  baseDamage = baseDamage * (0.9 + Math.random() * 0.2);

  const passiveMods = _skillSystemReady ? SkillSystem.getPassiveModifiers(stats) : {};
  const skillReduction = passiveMods.damageReduction || 0;
  const totalReduction = (stats.damageReduction || 0) + skillReduction;
  baseDamage *= (1 - totalReduction);

  let finalDamage = Math.max(1, Math.floor(baseDamage));

  if (_skillSystemReady && passiveMods.magicShieldRatio > 0) {
    const shieldResult = SkillSystem.processMagicShield(finalDamage, stats);
    if (shieldResult.absorbed > 0) {
      addLog('skill', `🛡️魔法盾吸收${shieldResult.absorbed}伤害，消耗${shieldResult.mpUsed}MP`, shieldResult.absorbed, false, false);
    }
    if (!shieldResult.shieldActive && shieldResult.mpUsed > 0) {
      addLog('skill', '⚠️ MP耗尽，魔法盾失效！', 0, false, false);
    }
    finalDamage = shieldResult.finalDamage;
  }

  const newHp = Math.max(0, (stats.currentHp || 0) - finalDamage);

  if (_playerRef.setHp) _playerRef.setHp(newHp);
  EventBus.emit(EVENTS.PLAYER_HP_CHANGED, { currentHp: newHp, maxHp: stats.maxHp, damage: finalDamage });
  addLog('monster_attack', `${monster.name}对你造成${finalDamage}点伤害`, finalDamage, false, false);

  if (_skillSystemReady) {
    const freshStats = _playerRef.getStats();
    const healResults = SkillSystem.processOnLowHp(freshStats);
    for (const sr of healResults) {
      if (sr.type === 'heal') {
        addLog('skill', `${sr.logText} 恢复${sr.amount}HP`, sr.amount, false, false);
      }
    }
  }
}

function _doRegen(stats) {
  const hpRegen = stats.hpRegen || 1;
  const mpRegen = stats.mpRegen || 1;
  const currentHp = stats.currentHp || 0;
  const currentMp = stats.currentMp || 0;
  const maxHp = stats.maxHp || 100;
  const maxMp = stats.maxMp || 50;

  if (currentHp < maxHp) {
    const newHp = Math.min(maxHp, currentHp + hpRegen);
    if (_playerRef.setHp) _playerRef.setHp(newHp);
    EventBus.emit(EVENTS.PLAYER_HP_CHANGED, { currentHp: newHp, maxHp, heal: hpRegen });
  }

  if (currentMp < maxMp) {
    const newMp = Math.min(maxMp, currentMp + mpRegen);
    if (_playerRef.setMp) _playerRef.setMp(newMp);
  }
}

const BOSS_SPAWN_RATE = 0.08;

function spawnMonster(mapId) {
  const map = MAP_CONFIG[mapId];
  if (!map || !map.monsters || map.monsters.length === 0) return null;

  if (map.bosses && map.bosses.length > 0 && chance(BOSS_SPAWN_RATE)) {
    const bossId = map.bosses[randomInt(0, map.bosses.length - 1)];
    const boss = _spawnBoss(bossId);
    if (boss) {
      addLog('system', `🔥 ${boss.name} 出现了！`, 0, false, false);
      return boss;
    }
  }

  const monsterId = map.monsters[randomInt(0, map.monsters.length - 1)];
  const cfg = MONSTER_CONFIG[monsterId];
  if (!cfg) return null;

  const s = _monsterScaling(cfg.level, false);
  const scaledHp = Math.max(10, Math.floor(cfg.hp * s.hpMult));
  return {
    instanceId: uuid(),
    configId: cfg.configId,
    name: cfg.name,
    level: cfg.level,
    isBoss: false,
    maxHp: scaledHp,
    currentHp: scaledHp,
    attack: cfg.attack,
    defense: Math.max(1, Math.floor(cfg.defense * s.defMult)),
    attackSpeed: cfg.attackSpeed,
    expReward: cfg.expReward,
    goldMin: cfg.goldMin,
    goldMax: cfg.goldMax
  };
}

function _spawnBoss(bossId) {
  const cfg = MONSTER_CONFIG[bossId];
  if (!cfg || !cfg.isBoss) return null;

  const s = _monsterScaling(cfg.level, true);
  const scaledHp = Math.max(50, Math.floor(cfg.hp * s.hpMult));
  return {
    instanceId: uuid(),
    configId: cfg.configId,
    name: cfg.name,
    level: cfg.level,
    isBoss: true,
    maxHp: scaledHp,
    currentHp: scaledHp,
    attack: cfg.attack,
    defense: Math.max(1, Math.floor(cfg.defense * s.defMult)),
    attackSpeed: cfg.attackSpeed,
    expReward: cfg.expReward,
    goldMin: cfg.goldMin,
    goldMax: cfg.goldMax,
    respawnMinutes: cfg.respawnMinutes,
    firstKillBonus: cfg.firstKillBonus
  };
}

function onMonsterDead(monster) {
  const stats = _playerRef.getStats();
  const expBonus = stats.expBonus || 0;
  const goldBonus = stats.goldBonus || 0;

  const baseExp = monster.expReward || 0;
  const finalExp = Math.floor(baseExp * (1 + expBonus));
  if (_playerRef.addExp) _playerRef.addExp(finalExp);
  _combatState.sessionStats.expGained += finalExp;
  EventBus.emit(EVENTS.PLAYER_EXP_GAINED, { exp: finalExp, source: monster.name });

  const baseGold = randomInt(monster.goldMin || 0, monster.goldMax || 0);
  const finalGold = Math.floor(baseGold * (1 + goldBonus));
  if (_playerRef.addGold) _playerRef.addGold(finalGold);
  _combatState.sessionStats.goldGained += finalGold;
  EventBus.emit(EVENTS.GOLD_CHANGED, { amount: finalGold, source: monster.name });

  const { equipDrops, matDrops } = _rollDrops(monster, stats);
  if (equipDrops.length > 0) {
    _combatState.sessionStats.itemsDropped += equipDrops.length;
    for (const drop of equipDrops) {
      EventBus.emit(EVENTS.COMBAT_ITEM_DROP, { item: drop, source: monster.name });
    }
  }
  if (matDrops.length > 0) {
    for (const md of matDrops) {
      addLog('drop', `获得 ${md.icon}${md.name} ×${md.count}`, 0, false, false);
    }
  }

  if (monster.isBoss) {
    _combatState.sessionStats.bossKills++;
    EventBus.emit(EVENTS.BOSS_KILLED, { bossId: monster.configId, drops: equipDrops });

    if (monster.firstKillBonus) {
      const bonus = monster.firstKillBonus;
      if (bonus.exp && _playerRef.addExp) {
        _playerRef.addExp(bonus.exp);
        _combatState.sessionStats.expGained += bonus.exp;
        addLog('bonus', `BOSS首杀奖励：${bonus.exp}经验`, bonus.exp, false, false);
      }
      if (bonus.gold && _playerRef.addGold) {
        _playerRef.addGold(bonus.gold);
        _combatState.sessionStats.goldGained += bonus.gold;
        addLog('bonus', `BOSS首杀奖励：${bonus.gold}金币`, bonus.gold, false, false);
      }
    }
  }

  _combatState.sessionStats.kills++;
  addLog('kill', `击杀了${monster.name}，获得${finalExp}经验和${finalGold}金币`, finalExp, false, false);
  EventBus.emit(EVENTS.COMBAT_MONSTER_DEAD, { monster: monster.configId, exp: finalExp, gold: finalGold, drops: equipDrops });

  if (_skillSystemReady) SkillSystem.clearDots();
  _combatState.currentMonster = null;
}

const DROP_RATE_MULTIPLIER = 2.5;

function _rollDrops(monster, stats) {
  const dropCfg = DROP_CONFIG[monster.configId];
  if (!dropCfg) return { equipDrops: [], matDrops: [] };

  const magicFind = stats.magicFind || 0;
  const matDrops = [];

  if (dropCfg.materialDrops) {
    for (const md of dropCfg.materialDrops) {
      if ((md.id === 'lucky_stone' || md.id === 'super_oil_item') && !(monster.isBoss && (monster.level || 0) >= 35)) continue;
      let mdChance = md.id === 'skill_book_page' ? md.chance * 0.35 : md.chance;
      if (chance(mdChance * (1 + magicFind * 0.5))) {
        const count = md.min && md.max ? randomInt(md.min, md.max) : 1;
        if (_addMaterialFn) _addMaterialFn(md.id, count);
        const mc = MATERIAL_CONFIG[md.id];
        matDrops.push({ id: md.id, count, name: mc?.name || md.id, icon: mc?.icon || '' });
      }
    }
  }

  _rollPotionDrop(monster, matDrops);
  _rollZodiacDrop(monster);

  const baseChance = monster.isBoss ? dropCfg.baseDropChance : dropCfg.baseDropChance * DROP_RATE_MULTIPLIER;
  const dropChance = Math.min(1, baseChance * (1 + magicFind));

  if (!chance(dropChance)) return { equipDrops: [], matDrops };

  const quality = weightedRandom(dropCfg.qualityWeights);
  const allItems = dropCfg.items;
  if (!allItems || allItems.length === 0) return { equipDrops: [], matDrops };

  const playerLevel = _playerRef?.getLevel?.() || 1;
  const maxEquipLevel = playerLevel + 8;
  const filtered = allItems.filter(id => {
    const key = id.replace(/^equip_/, '');
    const base = EQUIP_BASES[key] || EQUIP_BASES[id];
    return !base || base.requiredLevel <= maxEquipLevel;
  });
  const items = filtered.length > 0 ? filtered : allItems;

  const FOUR_SLOT_PASS_RATE = 0.30;
  const MAX_REROLL = 3;
  let itemId = items[randomInt(0, items.length - 1)];
  for (let r = 0; r < MAX_REROLL; r++) {
    if (!_isFourSlotItem(itemId) || chance(FOUR_SLOT_PASS_RATE)) break;
    itemId = items[randomInt(0, items.length - 1)];
  }
  return { equipDrops: [{ configId: itemId, quality, sourceMonster: monster.configId, dropTime: Date.now() }], matDrops };
}

function _isFourSlotItem(configId) {
  return /hat_lv|medal_lv|drum_lv|talisman_lv/.test(configId);
}

function _rollPotionDrop(monster, matDrops) {
  const monLevel = monster.level || 1;
  const potionChance = monster.isBoss ? 0.30 : 0.05;
  if (!chance(potionChance)) return;

  let pool;
  if (monLevel >= 45) pool = ['hp_super', 'mp_super', 'hp_large', 'mp_large'];
  else if (monLevel >= 25) pool = ['hp_large', 'mp_large', 'hp_medium', 'mp_medium'];
  else if (monLevel >= 10) pool = ['hp_medium', 'mp_medium', 'hp_small', 'mp_small'];
  else pool = ['hp_small', 'mp_small'];

  const potionId = pool[randomInt(0, pool.length - 1)];
  const count = monster.isBoss ? randomInt(2, 5) : randomInt(1, 2);
  PotionSystem.addPotion(potionId, count);

  const POTION_NAMES = {
    hp_small: '小回春丹', hp_medium: '中回春丹', hp_large: '大回春丹', hp_super: '极品金创药',
    mp_small: '小魔力药', mp_medium: '中魔力药', mp_large: '大魔力药', mp_super: '极品蓝灵药'
  };
  const POTION_ICONS = { hp_small: '🧪', hp_medium: '🧪', hp_large: '🧪', hp_super: '💊', mp_small: '💧', mp_medium: '💧', mp_large: '💧', mp_super: '🔮' };
  matDrops.push({ id: potionId, count, name: POTION_NAMES[potionId] || potionId, icon: POTION_ICONS[potionId] || '' });
}

function _rollZodiacDrop(monster) {
  const monLevel = monster.level || 1;
  const zodiacChance = monster.isBoss ? 0.12 : 0.015;
  if (!chance(zodiacChance)) return;

  let tier;
  if (monLevel >= 65) tier = 'top';
  else if (monLevel >= 50) tier = 'elite';
  else if (monLevel >= 35) tier = 'high';
  else if (monLevel >= 20) tier = 'mid';
  else tier = 'low';

  const weights = ZODIAC_DROP_QUALITY_WEIGHTS[tier];
  const quality = weightedRandom(weights);
  if (!quality || quality === 'none') return;

  const animalCfg = ZODIAC_ANIMAL_CONFIG[randomInt(0, ZODIAC_ANIMAL_CONFIG.length - 1)];
  const result = ZodiacSystem.addZodiac(animalCfg.animalId, quality);
  if (result.success) {
    const qName = { low: '下品', mid: '中品', high: '上品', elite: '极品', immortal: '仙品', legendary: '传奇' }[quality] || quality;
    addLog('drop', `获得生肖 ${animalCfg.icon}${animalCfg.name}（${qName}）`, 0, false, false);
  }
}

function onPlayerDead() {
  _combatState.isDead = true;
  _combatState.deathStreak++;
  _combatState.currentMonster = null;
  _combatState.reviveAt = Date.now() + REVIVE_WAIT_MS;

  addLog('death', '你已阵亡！', 0, false, false);
  EventBus.emit(EVENTS.PLAYER_DEAD, {
    deathStreak: _combatState.deathStreak,
    reviveAt: _combatState.reviveAt,
    weakStacks: Math.min(_combatState.weakStacks + 1, MAX_WEAK_STACKS),
    mapId: _combatState.mapId
  });
}

function _doRevive(mode) {
  _combatState.isDead = false;

  _combatState.weakStacks = Math.min(_combatState.weakStacks + 1, MAX_WEAK_STACKS);
  _combatState.weakExpiresAt = Date.now() + WEAK_DURATION_MS;

  const stats = _playerRef.getStats();
  let reviveHpPct = 0.5;
  if (mode === 'town') reviveHpPct = 1.0;

  const reviveHp = Math.floor((stats.maxHp || 100) * reviveHpPct);
  const reviveMp = Math.floor((stats.maxMp || 50) * reviveHpPct);
  if (_playerRef.setHp) _playerRef.setHp(reviveHp);
  if (_playerRef.setMp) _playerRef.setMp(reviveMp);

  addLog('revive', `已复活！恢复${reviveHp}HP/${reviveMp}MP`, reviveHp, false, false);
  if (_combatState.weakStacks > 0) {
    const pct = _combatState.weakStacks * WEAK_PENALTY_PER_STACK * 100;
    addLog('debuff', `虚弱×${_combatState.weakStacks}（属性-${pct}%，30秒）`, 0, false, false);
  }

  EventBus.emit(EVENTS.PLAYER_REVIVE, { hp: reviveHp, mp: reviveMp, weakStacks: _combatState.weakStacks, mode });
}

function reviveNow() {
  if (!_combatState.isDead) return { success: false, reason: '未处于阵亡状态' };
  _doRevive('instant');
  return { success: true };
}

function reviveInTown() {
  if (!_combatState.isDead) return { success: false, reason: '未处于阵亡状态' };
  const prevMapId = _combatState.mapId;
  _combatState.mapId = 'map_tucheng';
  _combatState.deathStreak = 0;
  _combatState.currentMonster = null;
  _doRevive('town');
  addLog('system', '已回到盟重土城安全区', 0, false, false);
  EventBus.emit(EVENTS.MAP_SWITCHED, { mapId: 'map_tucheng', reason: 'town_revive', prevMapId });
  return { success: true, mapId: 'map_tucheng' };
}

function setAutoRevive(enabled) {
  if (_combatState) _combatState.autoRevive = enabled;
}

function getDeathInfo() {
  return {
    isDead: _combatState?.isDead || false,
    reviveAt: _combatState?.reviveAt || 0,
    deathStreak: _combatState?.deathStreak || 0,
    weakStacks: _combatState?.weakStacks || 0,
    weakExpiresAt: _combatState?.weakExpiresAt || 0,
    autoRevive: _combatState?.autoRevive || false
  };
}

function challengeBoss(bossId) {
  if (!_combatState.isActive) return false;
  const cfg = MONSTER_CONFIG[bossId];
  if (!cfg || !cfg.isBoss) return false;

  const boss = _spawnBoss(bossId);
  if (!boss) return false;

  _combatState.currentMonster = boss;
  const now = Date.now();
  _combatState.lastAttackTime = now;
  _combatState.lastMonsterAttackTime = now;

  addLog('boss', `开始挑战BOSS：${boss.name}`, 0, false, false);
  return true;
}

function getState() {
  if (!_combatState) return null;
  return {
    isActive: _combatState.isActive,
    mapId: _combatState.mapId,
    currentMonster: _combatState.currentMonster ? {
      configId: _combatState.currentMonster.configId,
      name: _combatState.currentMonster.name,
      level: _combatState.currentMonster.level,
      isBoss: _combatState.currentMonster.isBoss,
      currentHp: _combatState.currentMonster.currentHp,
      maxHp: _combatState.currentMonster.maxHp
    } : null,
    sessionStats: { ..._combatState.sessionStats },
    isDead: _combatState.isDead,
    reviveAt: _combatState.reviveAt,
    deathStreak: _combatState.deathStreak,
    weakStacks: _combatState.weakStacks,
    weakExpiresAt: _combatState.weakExpiresAt
  };
}

function getBattleLog() {
  return _combatState ? [..._combatState.battleLog] : [];
}

function addLog(type, text, value, isCrit, isMiss) {
  if (!_combatState) return;
  const entry = { id: uuid(), type, text, value: value || 0, isCrit: !!isCrit, isMiss: !!isMiss, time: Date.now() };
  _combatState.battleLog.push(entry);
  if (_combatState.battleLog.length > MAX_LOG) {
    _combatState.battleLog.shift();
  }
  EventBus.emit(EVENTS.COMBAT_LOG, entry);
}

export default { init, startCombat, stopCombat, tick, spawnMonster, onMonsterDead, onPlayerDead, challengeBoss, getState, getBattleLog, addLog, reviveNow, reviveInTown, setAutoRevive, getDeathInfo };
export { init, startCombat, stopCombat, tick, spawnMonster, onMonsterDead, onPlayerDead, challengeBoss, getState, getBattleLog, addLog, reviveNow, reviveInTown, setAutoRevive, getDeathInfo };

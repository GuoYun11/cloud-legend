const EventBus = {
  _listeners: {},

  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
    return () => this.off(event, callback);
  },

  off(event, callback) {
    const list = this._listeners[event];
    if (!list) return;
    const idx = list.indexOf(callback);
    if (idx !== -1) list.splice(idx, 1);
  },

  emit(event, data) {
    const list = this._listeners[event];
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      list[i](data);
    }
  }
};

export const EVENTS = {
  PLAYER_LEVEL_UP: 'player:level_up',
  PLAYER_EXP_GAINED: 'player:exp_gained',
  PLAYER_HP_CHANGED: 'player:hp_changed',
  PLAYER_DEAD: 'player:dead',
  PLAYER_REVIVE: 'player:revive',
  STATS_CHANGED: 'player:stats_changed',
  COMBAT_DAMAGE: 'combat:damage',
  COMBAT_MONSTER_DEAD: 'combat:monster_dead',
  COMBAT_ITEM_DROP: 'combat:item_drop',
  COMBAT_LOG: 'combat:log',
  BOSS_KILLED: 'combat:boss_killed',
  EQUIP_CHANGED: 'equip:changed',
  EQUIP_ENHANCED: 'equip:enhanced',
  MAP_SWITCHED: 'map:switched',
  MAP_UNLOCKED: 'map:unlocked',
  BOSS_AVAILABLE: 'map:boss_available',
  ZODIAC_UPGRADED: 'zodiac:upgraded',
  ZODIAC_SET_BONUS: 'zodiac:set_bonus',
  GOLD_CHANGED: 'economy:gold_changed',
  INVENTORY_CHANGED: 'inventory:changed',
  POTION_CHANGED: 'potion:changed',
  SKILL_UNLOCKED: 'skill:unlocked',
  SKILL_UPGRADED: 'skill:upgraded',
  SKILL_TRIGGERED: 'skill:triggered',
  SKILL_CHANGED: 'skill:changed',
  GAME_SAVED: 'save:saved',
  OFFLINE_REWARD: 'save:offline_reward'
};

export default EventBus;

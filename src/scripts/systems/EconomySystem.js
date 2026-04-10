import EventBus, { EVENTS } from '../utils/EventBus.js';

const SELL_QUALITY_MULTIPLIER = {
  normal: 1, uncommon: 1.5, rare: 2.5, epic: 5, legendary: 10, mythic: 20
};

const MAX_TRANSACTIONS = 50;

let wallet = null;

export function init(savedData) {
  wallet = savedData
    ? {
        gold: savedData.gold || 0,
        totalEarned: savedData.totalEarned || 0,
        totalSpent: savedData.totalSpent || 0,
        transactions: savedData.transactions ? [...savedData.transactions] : []
      }
    : { gold: 0, totalEarned: 0, totalSpent: 0, transactions: [] };
}

function recordTransaction(type, amount, source) {
  wallet.transactions.push({ type, amount, source, time: Date.now() });
  if (wallet.transactions.length > MAX_TRANSACTIONS) {
    wallet.transactions = wallet.transactions.slice(-MAX_TRANSACTIONS);
  }
}

export function addGold(amount, source = '') {
  amount = Math.floor(amount);
  if (amount <= 0) return;
  wallet.gold += amount;
  wallet.totalEarned += amount;
  recordTransaction('earn', amount, source);
  EventBus.emit(EVENTS.GOLD_CHANGED, { gold: wallet.gold, change: amount, source });
}

export function spendGold(amount, source = '') {
  amount = Math.floor(amount);
  if (amount <= 0 || wallet.gold < amount) return false;
  wallet.gold -= amount;
  wallet.totalSpent += amount;
  recordTransaction('spend', amount, source);
  EventBus.emit(EVENTS.GOLD_CHANGED, { gold: wallet.gold, change: -amount, source });
  return true;
}

export function getGold() {
  return wallet.gold;
}

export function getWallet() {
  return wallet;
}

export function sellItem(item) {
  const multiplier = SELL_QUALITY_MULTIPLIER[item.quality] || 1;
  const price = Math.floor((item.itemLevel || 1) * 8 * multiplier);
  addGold(price, `出售${item.name || '装备'}`);
  return price;
}

export function getData() {
  return {
    gold: wallet.gold,
    totalEarned: wallet.totalEarned,
    totalSpent: wallet.totalSpent,
    transactions: [...wallet.transactions]
  };
}

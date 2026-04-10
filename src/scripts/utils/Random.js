export function random() {
  return Math.random();
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

export function chance(probability) {
  return Math.random() < probability;
}

export function weightedRandom(weights) {
  const entries = Object.entries(weights);
  let total = 0;
  for (let i = 0; i < entries.length; i++) total += entries[i][1];
  let roll = Math.random() * total;
  for (let i = 0; i < entries.length; i++) {
    roll -= entries[i][1];
    if (roll <= 0) return entries[i][0];
  }
  return entries[entries.length - 1][0];
}

let _idCounter = 0;
export function uuid() {
  return Date.now().toString(36) + '_' + (++_idCounter).toString(36) + '_' + Math.random().toString(36).slice(2, 6);
}

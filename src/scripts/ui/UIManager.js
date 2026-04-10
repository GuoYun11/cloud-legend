import EventBus, { EVENTS } from '../utils/EventBus.js';
import { formatNumber, formatTime } from '../utils/Formatter.js';
import { show as showToastEl, init as initToast } from './components/Toast.js';

const pages = {};
let currentPage = null;

export function registerPage(name, pageModule) {
  pages[name] = pageModule;
}

export function showPage(name) {
  if (currentPage && pages[currentPage]) {
    const el = document.getElementById('page-' + currentPage);
    if (el) el.classList.remove('active');
    if (pages[currentPage].onHide) pages[currentPage].onHide();
  }

  currentPage = name;
  const el = document.getElementById('page-' + name);
  if (el) el.classList.add('active');
  if (pages[name] && pages[name].onShow) pages[name].onShow();

  updateNavHighlight(name);
}

export function getCurrentPage() {
  return currentPage;
}

export function updateNavHighlight(name) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === name);
  });
}

export function showCharacterCreate() {
  document.getElementById('create-screen').style.display = 'flex';
  document.getElementById('game-screen').style.display = 'none';
}

export function hideCharacterCreate() {
  document.getElementById('create-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'flex';
}

export function showOfflineReward(data) {
  const modal = document.getElementById('offline-modal');
  if (!modal) return;

  modal.querySelector('.offline-exp').textContent = formatNumber(data.exp);
  modal.querySelector('.offline-gold').textContent = formatNumber(data.gold);
  modal.querySelector('.offline-time').textContent = formatTime(data.minutes * 60);
  modal.querySelector('.offline-items').textContent =
    data.items ? data.items.length + '件' : '0件';

  modal.style.display = 'flex';

  const closeBtn = modal.querySelector('.offline-close');
  if (closeBtn) {
    closeBtn.onclick = () => { modal.style.display = 'none'; };
  }
}

export function showToast(message, type = 'info', duration = 2000) {
  showToastEl(message, type, duration);
}

export function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
  });
}

export function init() {
  initToast();
  initNav();

  EventBus.on(EVENTS.OFFLINE_REWARD, data => showOfflineReward(data));
}

export default {
  registerPage,
  showPage,
  getCurrentPage,
  showCharacterCreate,
  hideCharacterCreate,
  showOfflineReward,
  showToast,
  initNav,
  init
};

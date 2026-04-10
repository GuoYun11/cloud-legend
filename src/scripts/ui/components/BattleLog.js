const ENTRY_COLORS = {
  player_attack: '#e8e8e8',
  monster_attack: '#ff5050',
  kill:           '#ffd700',
  level_up:       '#ffd700',
  item_drop:      '#c23eff',
  miss:           '#888888',
  heal:           '#50d060',
  death:          '#ff3030',
  revive:         '#50d060',
  boss:           '#ff8c00',
  bonus:          '#ffd640'
};

const MAX_ENTRIES = 200;
let logContainer = null;
let entryCount = 0;

export function init(containerEl) {
  logContainer = containerEl;
  if (!logContainer) return;
  Object.assign(logContainer.style, {
    overflowY: 'auto',
    fontSize: '12px',
    lineHeight: '1.6',
    color: '#ccc',
    padding: '4px 6px'
  });
}

export function addEntry(entry) {
  if (!logContainer) return;

  const { type = 'player_attack', text, value, isCrit, isMiss } = entry;
  const color = ENTRY_COLORS[type] || '#ccc';

  const line = document.createElement('div');
  Object.assign(line.style, {
    color,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    padding: '2px 0',
    wordBreak: 'break-all'
  });

  if (type === 'level_up') {
    line.style.fontSize = '14px';
    line.style.fontWeight = 'bold';
    line.style.textShadow = '0 0 6px rgba(255,215,0,0.6)';
  }

  let content = text || '';
  if (value !== undefined && value !== null) {
    const valSpan = document.createElement('span');
    valSpan.style.fontWeight = 'bold';
    if (isCrit) {
      valSpan.style.color = '#ff4040';
      valSpan.style.fontSize = '14px';
      valSpan.textContent = ' ' + value + '!暴击';
    } else if (isMiss) {
      valSpan.style.color = '#888';
      valSpan.textContent = ' MISS';
    } else {
      valSpan.textContent = ' ' + value;
    }
    line.textContent = content;
    line.appendChild(valSpan);
  } else {
    line.textContent = content;
  }

  logContainer.appendChild(line);
  entryCount++;

  if (entryCount > MAX_ENTRIES) {
    const excess = entryCount - MAX_ENTRIES;
    for (let i = 0; i < excess; i++) {
      if (logContainer.firstChild) logContainer.removeChild(logContainer.firstChild);
    }
    entryCount = MAX_ENTRIES;
  }

  logContainer.scrollTop = logContainer.scrollHeight;
}

export function clear() {
  if (!logContainer) return;
  logContainer.innerHTML = '';
  entryCount = 0;
}

export default { init, addEntry, clear };

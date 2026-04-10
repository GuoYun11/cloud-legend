const BAR_COLORS = {
  hp:      { fill: '#d42020', track: '#3a1010' },
  mp:      { fill: '#2070d4', track: '#101a3a' },
  exp:     { fill: '#20b040', track: '#0a2a10' },
  monster: { fill: '#d42020', track: '#3a1010' }
};

export function createHpBar(options = {}) {
  const {
    parentEl,
    type = 'hp',
    width = '100%',
    height = 14,
    showText = true
  } = options;

  const colors = BAR_COLORS[type] || BAR_COLORS.hp;

  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'relative',
    width: typeof width === 'number' ? width + 'px' : width,
    height: height + 'px',
    borderRadius: (height / 2) + 'px',
    background: colors.track,
    border: '1px solid rgba(255,215,0,0.25)',
    overflow: 'hidden',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
  });

  const fill = document.createElement('div');
  Object.assign(fill.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100%',
    width: '100%',
    borderRadius: (height / 2) + 'px',
    background: `linear-gradient(180deg, ${lighten(colors.fill)} 0%, ${colors.fill} 60%, ${darken(colors.fill)} 100%)`,
    transition: 'width 0.3s ease',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)'
  });
  wrapper.appendChild(fill);

  let label = null;
  if (showText) {
    label = document.createElement('span');
    Object.assign(label.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: Math.max(10, height - 4) + 'px',
      fontWeight: 'bold',
      textShadow: '0 1px 2px rgba(0,0,0,0.7)',
      lineHeight: '1',
      pointerEvents: 'none'
    });
    wrapper.appendChild(label);
  }

  if (parentEl) parentEl.appendChild(wrapper);

  function update(current, max) {
    const pct = max > 0 ? Math.min(Math.max(current / max, 0), 1) : 0;
    fill.style.width = (pct * 100) + '%';
    if (label) {
      label.textContent = Math.floor(current) + ' / ' + Math.floor(max);
    }
  }

  update(0, 1);

  return { el: wrapper, update };
}

function lighten(hex) {
  return adjustColor(hex, 40);
}

function darken(hex) {
  return adjustColor(hex, -40);
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

export default { createHpBar };

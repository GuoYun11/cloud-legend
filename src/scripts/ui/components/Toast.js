let container = null;

const TYPE_STYLES = {
  info:    { bg: 'rgba(30,90,180,0.92)',  border: '#3ea8ff' },
  success: { bg: 'rgba(30,120,50,0.92)',  border: '#4fc34f' },
  warning: { bg: 'rgba(160,120,20,0.92)', border: '#ffd640' },
  error:   { bg: 'rgba(160,30,30,0.92)',  border: '#ff4040' },
  drop:    { bg: 'rgba(120,80,10,0.92)',   border: '#ffc800' }
};

export function init() {
  if (container) return;
  container = document.createElement('div');
  container.id = 'toast-container';
  Object.assign(container.style, {
    position: 'fixed',
    top: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '300',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    pointerEvents: 'none',
    maxWidth: '90%'
  });
  document.body.appendChild(container);
}

export function show(message, type = 'info', duration = 2000) {
  if (!container) init();

  const style = TYPE_STYLES[type] || TYPE_STYLES.info;
  const el = document.createElement('div');
  Object.assign(el.style, {
    padding: '8px 20px',
    borderRadius: '6px',
    background: style.bg,
    border: '1px solid ' + style.border,
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
    opacity: '0',
    transform: 'translateY(-12px)',
    transition: 'opacity 0.25s, transform 0.25s',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  });
  el.textContent = message;
  container.appendChild(el);

  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-12px)';
    el.addEventListener('transitionend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 400);
  }, duration);
}

export default { init, show };

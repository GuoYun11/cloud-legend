const NUMBER_UNITS = [
  { threshold: 1e12, suffix: 'T' },
  { threshold: 1e9, suffix: 'B' },
  { threshold: 1e6, suffix: 'M' },
  { threshold: 1e3, suffix: 'k' }
];

export function formatNumber(n) {
  if (n < 1000) return String(Math.floor(n));
  for (const { threshold, suffix } of NUMBER_UNITS) {
    if (n >= threshold) {
      const val = n / threshold;
      return (val >= 100 ? Math.floor(val) : val.toFixed(1).replace(/\.0$/, '')) + suffix;
    }
  }
  return String(Math.floor(n));
}

export function formatTime(seconds) {
  seconds = Math.floor(seconds);
  if (seconds < 60) return `${seconds}秒`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}分${s.toString().padStart(2, '0')}秒`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h}时${rm.toString().padStart(2, '0')}分`;
}

export function formatPercent(n) {
  return Math.round(n * 100) + '%';
}

const QUALITY_MAP = {
  normal: { name: '普通', color: '#b0b0b0' },
  uncommon: { name: '优秀', color: '#4fc34f' },
  rare: { name: '稀有', color: '#3ea8ff' },
  epic: { name: '史诗', color: '#c23eff' },
  legendary: { name: '传说', color: '#ff8c00' },
  mythic: { name: '神话', color: '#ff2a2a' }
};

export function getQualityName(quality) {
  return QUALITY_MAP[quality]?.name ?? quality;
}

export function getQualityColor(quality) {
  return QUALITY_MAP[quality]?.color ?? '#ffffff';
}

const JOB_MAP = {
  warrior: '战士',
  mage: '法师',
  taoist: '道士'
};

export function getJobName(job) {
  return JOB_MAP[job] ?? job;
}

// ===== PodExtract — Frontend logic (Phase 1) =====

const form          = document.getElementById('convert-form');
const urlInput      = document.getElementById('url');
const formatSelect  = document.getElementById('format');
const qualitySelect = document.getElementById('quality');
const convertBtn    = document.getElementById('convert-btn');
const errorMsg      = document.getElementById('error-msg');

const videoCard     = document.getElementById('video-card');
const tagFormat     = document.getElementById('tag-format');
const tagQuality    = document.getElementById('tag-quality');

const progressCard  = document.getElementById('progress-card');
const progressFill  = document.getElementById('progress-fill');
const progressPct   = document.getElementById('progress-percent');
const progressStat  = document.getElementById('progress-status');

const resultCard    = document.getElementById('result-card');
const resultName    = document.getElementById('result-name');
const resultMeta    = document.getElementById('result-meta');
const downloadBtn   = document.getElementById('download-btn');

// ===== Helpers =====
const show = (el) => el.classList.remove('hidden');
const hide = (el) => el.classList.add('hidden');

const isValidYouTube = (url) => {
  try {
    const u = new URL(url);
    return /(^|\.)youtube\.com$/.test(u.hostname) || u.hostname === 'youtu.be';
  } catch {
    return false;
  }
};

const setError = (msg) => { errorMsg.textContent = msg || ''; };

// ===== Live update of tags when selects change =====
function updateTags() {
  tagFormat.textContent  = `Format: ${formatSelect.value.toUpperCase()}`;
  tagQuality.textContent = `Quality: ${qualitySelect.value} kbps`;
}
formatSelect.addEventListener('change', updateTags);
qualitySelect.addEventListener('change', updateTags);

// ===== Fake progress for UI testing (will be replaced by real backend) =====
function simulateProgress(onDone) {
  hide(resultCard);
  show(progressCard);
  let p = 0;
  progressFill.style.width = '0%';
  progressPct.textContent = '0%';
  progressStat.textContent = 'Fetching video info…';

  const tick = setInterval(() => {
    p += Math.random() * 8 + 2;
    if (p >= 100) {
      p = 100;
      clearInterval(tick);
      progressFill.style.width = '100%';
      progressPct.textContent = '100%';
      progressStat.textContent = 'Done!';
      setTimeout(() => {
        hide(progressCard);
        onDone();
      }, 400);
      return;
    }
    progressFill.style.width = p + '%';
    progressPct.textContent = Math.floor(p) + '%';
    progressStat.textContent =
      p < 30 ? 'Extracting audio with yt-dlp…' :
      p < 70 ? 'Converting with FFmpeg…' :
               'Finalizing file…';
  }, 220);
}

// ===== Form submit =====
form.addEventListener('submit', (e) => {
  e.preventDefault();
  setError('');

  const url = urlInput.value.trim();
  if (!url)                       return setError('Please paste a YouTube URL.');
  if (!isValidYouTube(url))       return setError('Please enter a valid YouTube link.');

  // Phase 1: preview + simulated progress
  updateTags();
  show(videoCard);

  convertBtn.disabled = true;
  convertBtn.querySelector('.btn-text').textContent = 'Converting…';

  simulateProgress(() => {
    // Fake result (Phase 1 only)
    const name = 'Podcast Episode.' + formatSelect.value;
    resultName.textContent = name;
    resultMeta.textContent = `${qualitySelect.value} kbps · ${formatSelect.value.toUpperCase()}`;
    downloadBtn.href = '#';

    show(resultCard);

    convertBtn.disabled = false;
    convertBtn.querySelector('.btn-text').textContent = 'Convert to Audio';
  });
});
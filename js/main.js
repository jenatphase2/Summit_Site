/* ═══════════════════════════════════════════════════════════════════
   Camp Summit  |  main.js
   ═══════════════════════════════════════════════════════════════════ */

// ─── Star field canvas ───────────────────────────────────────────────
const canvas = document.getElementById('star-canvas');
const ctx    = canvas.getContext('2d');
let stars    = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  buildStars();
}

function buildStars() {
  stars = [];
  const heroH = window.innerHeight; // concentrate in hero viewport

  // Small background stars — dense
  const small = Math.round((canvas.width * heroH) / 3800);
  for (let i = 0; i < small; i++) {
    stars.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * heroH,
      r:     Math.random() * 0.8 + 0.2,
      base:  Math.random() * 0.35 + 0.08,
      amp:   Math.random() * 0.2 + 0.05,
      speed: Math.random() * 0.012 + 0.003,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Medium stars — scattered
  const med = Math.round((canvas.width * heroH) / 9000);
  for (let i = 0; i < med; i++) {
    stars.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * heroH,
      r:     Math.random() * 1.2 + 0.6,
      base:  Math.random() * 0.45 + 0.2,
      amp:   Math.random() * 0.35 + 0.1,
      speed: Math.random() * 0.018 + 0.006,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Bright accent stars — a few, obvious twinkle
  const bright = Math.round(canvas.width / 120);
  for (let i = 0; i < bright; i++) {
    stars.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * heroH * 0.85,
      r:     Math.random() * 1.4 + 1.0,
      base:  0.55,
      amp:   0.45,
      speed: Math.random() * 0.025 + 0.01,
      phase: Math.random() * Math.PI * 2,
      bright: true,
    });
  }
}

let tick = 0;
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tick++;
  stars.forEach(s => {
    const alpha = Math.min(1, Math.max(0, s.base + Math.sin(tick * s.speed + s.phase) * s.amp));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    if (s.bright) {
      // soft glow for bright stars
      const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
      grd.addColorStop(0, `rgba(255,255,255,${alpha})`);
      grd.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.fillStyle = grd;
      ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
    } else {
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    }
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

resize();
window.addEventListener('resize', resize);
drawStars();

// ─── Active nav link highlight ───────────────────────────────────────
const navLinks = document.querySelectorAll('#top-nav a');

new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35, rootMargin: '-60px 0px -40% 0px' }
).observe(document.getElementById('precamp'));

// ─── Floor map modal ─────────────────────────────────────────────────
const mapModal = document.getElementById('map-modal');
document.querySelectorAll('.open-map').forEach(btn =>
  btn.addEventListener('click', () => mapModal.classList.add('open'))
);
document.getElementById('close-map').addEventListener('click', () => mapModal.classList.remove('open'));
mapModal.addEventListener('click', e => { if (e.target === mapModal) mapModal.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') mapModal.classList.remove('open'); });

['day1', 'day2', 'venues'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    },
    { threshold: 0.2, rootMargin: '-60px 0px -40% 0px' }
  ).observe(el);
});

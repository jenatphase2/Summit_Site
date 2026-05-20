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

// Draw a ✦ 4-pointed star centred at (x, y) with tip radius r
function star4Path(x, y, r) {
  const inner = r * 0.18; // very thin points
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle  = (i * Math.PI / 4) - Math.PI / 2; // start at top
    const radius = i % 2 === 0 ? r : inner;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function buildStars() {
  stars = [];
  const heroH = window.innerHeight;

  // Tiny dot stars — dense background
  const small = Math.round((canvas.width * heroH) / 1200);
  for (let i = 0; i < small; i++) {
    stars.push({
      type:  'dot',
      x:     Math.random() * canvas.width,
      y:     Math.random() * heroH,
      r:     Math.random() * 0.8 + 0.2,
      base:  Math.random() * 0.35 + 0.08,
      amp:   Math.random() * 0.2  + 0.05,
      speed: Math.random() * 0.012 + 0.003,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Medium 4-pointed stars
  const med = Math.round((canvas.width * heroH) / 3000);
  for (let i = 0; i < med; i++) {
    stars.push({
      type:  'star4',
      x:     Math.random() * canvas.width,
      y:     Math.random() * heroH,
      r:     Math.random() * 3 + 2,
      base:  Math.random() * 0.4 + 0.2,
      amp:   Math.random() * 0.35 + 0.15,
      speed: Math.random() * 0.018 + 0.006,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Large bright 4-pointed stars — kept to edges/top to avoid the centered video
  const bright = Math.round(canvas.width / 50);
  for (let i = 0; i < bright; i++) {
    let x, y;
    const zone = Math.random();
    if (zone < 0.4) {
      // top strip — above the video
      x = Math.random() * canvas.width;
      y = Math.random() * heroH * 0.18;
    } else if (zone < 0.7) {
      // left edge
      x = Math.random() * canvas.width * 0.1;
      y = Math.random() * heroH * 0.85;
    } else {
      // right edge
      x = canvas.width * 0.9 + Math.random() * canvas.width * 0.1;
      y = Math.random() * heroH * 0.85;
    }
    stars.push({
      type:  'star4',
      x, y,
      r:     Math.random() * 5 + 4,
      base:  0.5,
      amp:   0.5,
      speed: Math.random() * 0.022 + 0.008,
      phase: Math.random() * Math.PI * 2,
      glow:  true,
    });
  }
}

let tick = 0;
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tick++;
  stars.forEach(s => {
    const alpha = Math.min(1, Math.max(0, s.base + Math.sin(tick * s.speed + s.phase) * s.amp));

    if (s.type === 'dot') {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    } else {
      // optional soft glow behind the point
      if (s.glow) {
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2.5);
        grd.addColorStop(0, `rgba(200,225,255,${alpha * 0.4})`);
        grd.addColorStop(1, `rgba(200,225,255,0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }
      // 4-pointed star shape
      star4Path(s.x, s.y, s.r);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }
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

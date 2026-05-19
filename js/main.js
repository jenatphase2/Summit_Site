/* ═══════════════════════════════════════════════════════════════════
   Camp Summit  |  main.js
   ═══════════════════════════════════════════════════════════════════ */

// ─── Star field canvas ───────────────────────────────────────────────
const canvas = document.getElementById('star-canvas');
const ctx    = canvas.getContext('2d');
let stars    = [];
let raf;

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  buildStars();
}

function buildStars() {
  const density = 7500;
  const count   = Math.round((canvas.width * canvas.height) / density);
  stars = Array.from({ length: count }, () => ({
    x:      Math.random() * canvas.width,
    y:      Math.random() * canvas.height * 0.75,
    r:      Math.random() * 1.4 + 0.2,
    base:   Math.random() * 0.65 + 0.1,
    speed:  Math.random() * 0.018 + 0.004,
    phase:  Math.random() * Math.PI * 2,
  }));
}

let tick = 0;
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tick++;
  stars.forEach(s => {
    const alpha = s.base + Math.sin(tick * s.speed + s.phase) * 0.28;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${Math.min(1, Math.max(0, alpha))})`;
    ctx.fill();
  });
  raf = requestAnimationFrame(drawStars);
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

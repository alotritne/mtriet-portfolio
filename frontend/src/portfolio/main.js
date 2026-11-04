import {
  siAndroid, siCplusplus, siDocker, siExpress, siGit, siGithub,
  siJavascript, siJetpackcompose, siKotlin, siMongodb, siMqtt,
  siMysql, siNodedotjs, siOpenapiinitiative, siOpenjdk, siPrisma,
  siPython, siReact, siTailwindcss, siTypescript, siVite,
} from 'simple-icons';

const root = document.documentElement;
const motionButton = document.getElementById('motion-toggle');
const motionLabel = document.getElementById('motion-label');
const menuButton = document.getElementById('menu-toggle');
const menu = document.getElementById('site-nav');
const progressFill = document.getElementById('progress-fill');
const cursorAura = document.getElementById('cursor-aura');
const heroGraphic = document.getElementById('hero-graphic');
const roleElement = document.getElementById('rotating-role');
const revealElements = [...document.querySelectorAll('[data-reveal]')];

// Official brand SVGs from Simple Icons. Icons stay in the local Vite bundle.
const techIcons = {
  JavaScript: siJavascript, TypeScript: siTypescript, Java: siOpenjdk,
  Kotlin: siKotlin, Python: siPython, 'C++': siCplusplus,
  React: siReact, 'Node.js': siNodedotjs, Express: siExpress,
  Prisma: siPrisma, 'REST API': siOpenapiinitiative, Vite: siVite,
  MySQL: siMysql, MongoDB: siMongodb, Android: siAndroid,
  'Jetpack Compose': siJetpackcompose, MQTT: siMqtt, Git: siGit,
  GitHub: siGithub, 'Docker (cơ bản)': siDocker, Docker: siDocker,
  'Tailwind CSS': siTailwindcss,
};

function techIcon(label) {
  const icon = techIcons[label];
  if (!icon) return null;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('tech-icon');
  // Some brand marks are white or very pale and need a darker fallback on white.
  const color = ['FFFFFF', 'F7DF1E', 'F8F9FA'].includes(icon.hex.toUpperCase()) ? '#243c45' : `#${icon.hex}`;
  svg.style.color = color;
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', icon.path);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  return svg;
}

export function applySkillIcons() {
  document.querySelectorAll('.skill-group > div > span').forEach((chip) => {
    if (chip.querySelector('svg')) return;
    const icon = techIcon(chip.textContent.trim());
    if (icon) {
      chip.classList.add('skill-chip');
      chip.prepend(icon);
    }
  });
}
applySkillIcons();

// One seamless repeat is exactly one measured group wide. Fill enough copies
// to cover even an ultrawide display; resize and font loading recalculate it.
const marqueeShell = document.querySelector('.marquee-shell');
const marqueeTrack = document.getElementById('marquee-track');
const marqueeSet = marqueeTrack.querySelector('.marquee-set');
let marqueeItems = ['Node.js', 'TypeScript', 'Kotlin', 'React', 'MySQL', 'MQTT', 'Docker', 'Python'];
function renderMarqueeItems() {
  marqueeSet.replaceChildren(...marqueeItems.map((name) => {
    const item = document.createElement('span');
    item.className = 'marquee-item';
    const icon = techIcon(name);
    if (icon) item.append(icon);
    item.append(document.createTextNode(name));
    return item;
  }));
}
renderMarqueeItems();

function rebuildMarquee() {
  marqueeTrack.replaceChildren(marqueeSet);
  const setWidth = marqueeSet.getBoundingClientRect().width;
  if (!setWidth) return;
  const copies = Math.max(2, Math.ceil(marqueeShell.clientWidth / setWidth) + 2);
  for (let i = 1; i < copies; i++) {
    marqueeTrack.append(marqueeSet.cloneNode(true));
  }
  marqueeTrack.style.setProperty('--marquee-distance', `-${setWidth}px`);
  marqueeTrack.style.setProperty('--marquee-duration', `${Math.max(12, setWidth / 52).toFixed(2)}s`);
  marqueeTrack.classList.add('is-ready');
}

rebuildMarquee();
export function setMarqueeItems(items) {
  if (!items?.length) return;
  marqueeItems = [...new Set(items)].slice(0, 30);
  renderMarqueeItems();
  rebuildMarquee();
}
document.fonts.ready.then(rebuildMarquee);
new ResizeObserver(rebuildMarquee).observe(marqueeShell);

const MOTION_KEY = 'mtriet-portfolio-motion';
let motionEnabled = true;

try {
  motionEnabled = localStorage.getItem(MOTION_KEY) !== 'off';
} catch {
  // Storage may be blocked. Motion still works with the in-page switch.
}

export function updateMotionLabel() {
  const en = root.lang === 'en';
  motionButton.setAttribute('aria-label', en
    ? (motionEnabled ? 'Disable animations' : 'Enable animations')
    : (motionEnabled ? 'Tắt hiệu ứng chuyển động' : 'Bật hiệu ứng chuyển động'));
  motionLabel.textContent = en
    ? 'Motion: ' + (motionEnabled ? 'On' : 'Off')
    : 'Hiệu ứng: ' + (motionEnabled ? 'Bật' : 'Tắt');
}

function setMotion(enabled, save = false) {
  motionEnabled = enabled;
  root.dataset.motion = enabled ? 'on' : 'off';
  root.classList.toggle('motion-on', enabled);
  motionButton.setAttribute('aria-pressed', String(enabled));
  updateMotionLabel();

  if (!enabled) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
    heroGraphic.style.setProperty('--parallax-x', '0px');
    heroGraphic.style.setProperty('--parallax-y', '0px');
    document.querySelectorAll('.magnetic').forEach((element) => {
      element.style.transform = '';
    });
  }

  if (save) {
    try {
      localStorage.setItem(MOTION_KEY, enabled ? 'on' : 'off');
    } catch {
      // Private browsing can disable localStorage.
    }
  }
}

setMotion(motionEnabled);
motionButton.addEventListener('click', () => setMotion(!motionEnabled, true));

function closeMenu() {
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Mở menu');
}

menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});

document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    const target = href ? document.querySelector(href) : null;
    if (!target) return;

    event.preventDefault();
    closeMenu();
    history.pushState(null, '', href);
    target.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'auto', block: 'start' });
  });
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .07, rootMargin: '0px 0px -30px 0px' });

  revealElements.forEach((element) => {
    if (element.getBoundingClientRect().top < innerHeight - 20 || !motionEnabled) {
      element.classList.add('is-visible');
    } else {
      revealObserver.observe(element);
    }
  });
  root.classList.add('motion-ready');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const current = document.querySelector('.site-nav .is-active');
      current?.classList.remove('is-active');
      document.querySelector(`.site-nav a[href="#${entry.target.id}"]`)?.classList.add('is-active');
    });
  }, { rootMargin: '-25% 0px -55% 0px' });

  document.querySelectorAll('main > section[id]').forEach((section) => navObserver.observe(section));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

let scrolling = false;
function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  const progress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
  progressFill.style.transform = `scaleX(${progress})`;
  scrolling = false;
}

window.addEventListener('scroll', () => {
  if (scrolling) return;
  scrolling = true;
  requestAnimationFrame(updateProgress);
}, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });
updateProgress();

let roles = ['Backend & API', 'Ứng dụng Android', 'Full-stack Web', 'Hệ thống dữ liệu'];
export function setRoles(next, locale) {
  roles = locale === 'vi'
    ? ['Backend & API', 'Ứng dụng Android', 'Full-stack Web', 'Hệ thống dữ liệu']
    : (next?.length ? next : ['Backend & API', 'Android Apps', 'Full-stack Web', 'Data Systems']);
  roleIndex = 0;
  roleElement.textContent = roles[0];
}
let roleIndex = 0;
setInterval(() => {
  if (!motionEnabled || document.hidden) return;
  roleElement.classList.add('is-changing');
  setTimeout(() => {
    if (!motionEnabled) {
      roleElement.classList.remove('is-changing');
      return;
    }
    roleIndex = (roleIndex + 1) % roles.length;
    roleElement.textContent = roles[roleIndex];
    roleElement.classList.remove('is-changing');
  }, 250);
}, 3500);

if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let pointerX = -1000;
  let pointerY = -1000;
  let cursorTicking = false;

  window.addEventListener('pointermove', (event) => {
    if (!motionEnabled) return;
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (!cursorTicking) {
      cursorTicking = true;
      requestAnimationFrame(() => {
        cursorAura.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
        cursorTicking = false;
      });
    }
  }, { passive: true });

  heroGraphic.addEventListener('pointermove', (event) => {
    if (!motionEnabled) return;
    const rect = heroGraphic.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    heroGraphic.style.setProperty('--parallax-x', `${(x * 16).toFixed(1)}px`);
    heroGraphic.style.setProperty('--parallax-y', `${(y * 16).toFixed(1)}px`);
  }, { passive: true });

  heroGraphic.addEventListener('pointerleave', () => {
    heroGraphic.style.setProperty('--parallax-x', '0px');
    heroGraphic.style.setProperty('--parallax-y', '0px');
  });

  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      if (!motionEnabled) return;
      const rect = element.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left - rect.width / 2) * .13;
      const offsetY = (event.clientY - rect.top - rect.height / 2) * .13;
      element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });
}

document.getElementById('year').textContent = new Date().getFullYear();

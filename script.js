/* ════════════════════════════════════════════
   For Mia Trisha — Script
   Petals · Particles · Transitions
   Clock · Music · Scroll · Line reveals
   ════════════════════════════════════════════ */

// ── DOM ─────────────────────────────────────
const openBtn      = document.getElementById('openBtn');
const entryScene   = document.getElementById('entryScene');
const letterScene  = document.getElementById('letterScene');
const bgMusic      = document.getElementById('bgMusic');
const musicBtn     = document.getElementById('musicBtn');
const musicIcon    = document.getElementById('musicIcon');
const letterDate   = document.getElementById('letterDate');

let musicPlaying   = false;

/* ════════════════════════════════════════════
   1. DATE
   ════════════════════════════════════════════ */
const setLetterDate = () => {
  letterDate.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
};

/* ════════════════════════════════════════════
   2. FLOATING PETALS
   ════════════════════════════════════════════ */
const petalColors = [
  'rgba(200,230,217,0.7)',
  'rgba(232,213,240,0.6)',
  'rgba(255,210,210,0.5)',
  'rgba(212,175,122,0.35)',
];

const createPetal = () => {
  const petal = document.createElement('div');
  petal.className = 'petal';

  const size     = Math.random() * 8 + 6;
  const color    = petalColors[Math.floor(Math.random() * petalColors.length)];
  const left     = Math.random() * 100;
  const duration = Math.random() * 8 + 7;
  const delay    = Math.random() * 6;

  Object.assign(petal.style, {
    width:           `${size}px`,
    height:          `${size * 1.4}px`,
    background:      color,
    left:            `${left}vw`,
    top:             '-20px',
    animationDuration: `${duration}s`,
    animationDelay:  `${delay}s`,
  });

  document.body.appendChild(petal);

  // Remove after animation to avoid DOM bloat
  setTimeout(() => petal.remove(), (duration + delay) * 1000);
};

const startPetals = () => {
  // Initial burst
  for (let i = 0; i < 8; i++) createPetal();
  // Ongoing trickle
  setInterval(createPetal, 1800);
};

/* ════════════════════════════════════════════
   3. FLOATING PARTICLES
   ════════════════════════════════════════════ */
const createParticles = () => {
  const count = 12;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size     = Math.random() * 5 + 3;
    const x        = Math.random() * 100;
    const y        = Math.random() * 100;
    const duration = Math.random() * 6 + 5;
    const delay    = Math.random() * 5;

    const colors = [
      'rgba(168,197,181,0.5)',
      'rgba(212,175,122,0.4)',
      'rgba(232,213,240,0.5)',
    ];

    Object.assign(p.style, {
      width:             `${size}px`,
      height:            `${size}px`,
      left:              `${x}vw`,
      top:               `${y}vh`,
      background:        colors[Math.floor(Math.random() * colors.length)],
      animationDuration: `${duration}s`,
      animationDelay:    `${delay}s`,
    });

    document.body.appendChild(p);
  }
};

/* ════════════════════════════════════════════
   4. MUSIC
   ════════════════════════════════════════════ */
const fadeAudioIn = (el, targetVol, ms) => {
  const steps    = 50;
  const interval = ms / steps;
  const inc      = targetVol / steps;
  let   vol      = 0;

  const t = setInterval(() => {
    vol = Math.min(vol + inc, targetVol);
    el.volume = vol;
    if (vol >= targetVol) clearInterval(t);
  }, interval);
};

const startMusic = () => {
  bgMusic.volume = 0;
  bgMusic.play()
    .then(() => {
      musicPlaying = true;
      fadeAudioIn(bgMusic, 0.35, 2500);
      updateMusicUI();
    })
    .catch(() => {
      // Autoplay blocked — user can tap manually
      musicPlaying = false;
    });
};

const updateMusicUI = () => {
  // Replace note icon with animated bars when playing
  if (musicPlaying) {
    musicIcon.style.display = 'none';
    // Add bars if not already there
    if (!musicBtn.querySelector('.music-bars')) {
      const bars = document.createElement('div');
      bars.className = 'music-bars';
      bars.innerHTML = `
        <div class="music-bar"></div>
        <div class="music-bar"></div>
        <div class="music-bar"></div>
        <div class="music-bar"></div>
      `;
      musicBtn.insertBefore(bars, musicBtn.querySelector('.music-label'));
    }
    musicBtn.querySelector('.music-label').textContent = 'playing';
    musicBtn.classList.remove('muted');
  } else {
    musicIcon.style.display = 'inline-block';
    const bars = musicBtn.querySelector('.music-bars');
    if (bars) bars.remove();
    musicBtn.querySelector('.music-label').textContent = 'paused';
    musicBtn.classList.add('muted');
  }
};

const toggleMusic = () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
  } else {
    bgMusic.play();
    musicPlaying = true;
  }
  updateMusicUI();
};

/* ════════════════════════════════════════════
   5. LETTER LINE REVEAL — staggered fade-in
   ════════════════════════════════════════════ */
const revealLines = () => {
  const lines = document.querySelectorAll('.letter-line');

  lines.forEach((line, i) => {
    setTimeout(() => {
      line.classList.add('visible');
    }, 400 + i * 220); // stagger each line
  });
};

/* ════════════════════════════════════════════
   6. SCROLL PROGRESS BAR
   ════════════════════════════════════════════ */
const createScrollBar = () => {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.id = 'scrollProgress';
  document.body.appendChild(bar);
};

const updateScrollProgress = () => {
  const bar      = document.getElementById('scrollProgress');
  const scene    = letterScene;
  const scrolled = scene.scrollTop;
  const total    = scene.scrollHeight - scene.clientHeight;
  const pct      = total > 0 ? (scrolled / total) * 100 : 0;
  if (bar) bar.style.width = `${pct}%`;
};

/* ════════════════════════════════════════════
   7. SCENE TRANSITION
   ════════════════════════════════════════════ */
const openLetter = () => {
  openBtn.disabled = true;

  // Fade out entry
  entryScene.classList.add('fading-out');

  setTimeout(() => {
    // Hide entry
    entryScene.classList.add('hidden');

    // Show letter
    letterScene.classList.remove('hidden');
    letterScene.style.opacity    = '0';
    letterScene.style.transition = 'opacity 800ms ease';

    // Force paint then fade in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        letterScene.style.opacity = '1';
      });
    });

    // Start everything
    startMusic();
    startPetals();
    revealLines();
    createScrollBar();

    // Attach scroll listener to the scene
    letterScene.addEventListener('scroll', updateScrollProgress);

  }, 650);
};

/* ════════════════════════════════════════════
   8. CURSOR SPARKLE — desktop only
   ════════════════════════════════════════════ */
const createSparkle = (x, y) => {
  const spark = document.createElement('div');
  Object.assign(spark.style, {
    position:      'fixed',
    left:          `${x}px`,
    top:           `${y}px`,
    width:         '6px',
    height:        '6px',
    borderRadius:  '50%',
    background:    'rgba(168,197,181,0.8)',
    pointerEvents: 'none',
    zIndex:        '999',
    transform:     'translate(-50%,-50%) scale(1)',
    transition:    'transform 600ms ease, opacity 600ms ease',
    opacity:       '1',
  });

  document.body.appendChild(spark);

  requestAnimationFrame(() => {
    spark.style.transform = 'translate(-50%,-50%) scale(2.5)';
    spark.style.opacity   = '0';
  });

  setTimeout(() => spark.remove(), 650);
};

// Only on non-touch devices
if (window.matchMedia('(hover: hover)').matches) {
  let sparkleThrottle = null;
  document.addEventListener('mousemove', (e) => {
    if (sparkleThrottle) return;
    sparkleThrottle = setTimeout(() => {
      createSparkle(e.clientX, e.clientY);
      sparkleThrottle = null;
    }, 80);
  });
}

/* ════════════════════════════════════════════
   9. EVENT LISTENERS & INIT
   ════════════════════════════════════════════ */
openBtn.addEventListener('click', openLetter);
musicBtn.addEventListener('click', toggleMusic);

document.addEventListener('DOMContentLoaded', () => {
  setLetterDate();
  createParticles();

  // Ensure letter scene is invisible before transition
  letterScene.style.opacity   = '0';
  letterScene.style.transition = 'opacity 800ms ease';
});
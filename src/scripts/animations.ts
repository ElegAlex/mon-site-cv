import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// LENIS SMOOTH SCROLL
// ============================================================
const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ============================================================
// RESPECT prefers-reduced-motion
// ============================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  lenis.destroy();
  document.querySelectorAll('.reveal, .stagger-reveal > *').forEach(el => {
    (el as HTMLElement).style.opacity = '1';
    (el as HTMLElement).style.transform = 'none';
  });
  // Make hero elements visible immediately
  const heroName = document.querySelector('.hero-name');
  if (heroName) heroName.classList.remove('invisible');
  document.querySelectorAll('.hero-subtitle, .hero-org, .hero-badge, .hero-cta').forEach(el => {
    (el as HTMLElement).style.opacity = '1';
  });
} else {
  initAnimations();
}

function initAnimations() {

  // ============================================================
  // ACTE 1 — HERO : Typing effect + countup metrics
  // ============================================================

  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    const text = heroName.textContent || '';
    heroName.textContent = '';
    heroName.classList.remove('invisible');
    const chars = text.split('');
    chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      heroName.appendChild(span);
      gsap.to(span, {
        opacity: 1,
        duration: 0.05,
        delay: 0.5 + i * 0.06,
      });
    });
  }

  gsap.from('.hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 1.5,
    ease: 'power2.out',
  });

  gsap.from('.hero-org', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    delay: 1.8,
    ease: 'power2.out',
  });

  gsap.from('.hero-badge', {
    y: 15,
    opacity: 0,
    duration: 0.4,
    stagger: 0.1,
    delay: 2.1,
    ease: 'power2.out',
  });

  // Countup metrics on scroll
  document.querySelectorAll('.metric-value').forEach(el => {
    const target = parseInt(el.getAttribute('data-value') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: function() {
            el.textContent = prefix + Math.round(this.targets()[0].val).toLocaleString('fr-FR') + suffix;
          }
        });
      }
    });
  });

  gsap.from('.hero-cta', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    delay: 2.5,
    ease: 'power2.out',
  });

  // Portrait duotone fade-in
  gsap.to('.hero-portrait', {
    opacity: 1,
    duration: 2,
    delay: 2,
    ease: 'power2.inOut',
  });

  // Portrait parallax subtil
  gsap.to('.hero-portrait img', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: '#accueil',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // ============================================================
  // ACTE 2 — PROFIL : Section pinnee + highlight progressif
  // ============================================================

  const profileSection = document.querySelector('#profil');
  const profileWords = document.querySelectorAll('.highlight-word');

  if (profileSection && profileWords.length > 0) {
    ScrollTrigger.create({
      trigger: profileSection,
      start: 'top top',
      end: `+=${window.innerHeight * 1.5}`,
      pin: true,
      pinSpacing: true,
    });

    profileWords.forEach((word, i) => {
      gsap.to(word, {
        opacity: 1,
        color: '#2d8f8f',
        scrollTrigger: {
          trigger: profileSection,
          start: `top+=${(i / profileWords.length) * window.innerHeight * 1.2} top`,
          end: `top+=${((i + 1) / profileWords.length) * window.innerHeight * 1.2} top`,
          scrub: true,
        },
      });
    });

    gsap.from('.profile-block', {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.profile-blocks-container',
        start: 'top 80%',
        end: 'top 40%',
        scrub: true,
      },
    });
  }

  // ============================================================
  // ACTE 3 — EXPERIENCES : Horizontal scroll (PINNED)
  // ============================================================

  const expContainer = document.querySelector('#experience');
  const expPanels = document.querySelectorAll('.exp-panel');

  if (expContainer && expPanels.length > 0) {
    const expInner = document.querySelector('.exp-panels-track') as HTMLElement;

    if (expInner) {
      // Only activate horizontal scroll on desktop
      const mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        const totalWidth = expInner.scrollWidth;
        const viewportWidth = window.innerWidth;

        // Timeline : pause initiale (premier panneau reste visible) puis scroll horizontal
        const tl = gsap.timeline();
        tl.to(expInner, { x: 0, duration: 0.03, ease: 'none' })  // 3% de pause
          .to(expInner, { x: -(totalWidth - viewportWidth), duration: 0.97, ease: 'none' });

        ScrollTrigger.create({
          trigger: expContainer,
          pin: true,
          scrub: 1,
          animation: tl,
          snap: { snapTo: 1 / (expPanels.length - 1), duration: { min: 0.3, max: 0.6 }, delay: 0.1 },
          end: () => '+=' + (totalWidth + window.innerWidth),
        });

        // Progress dots + counter
        const dots = document.querySelectorAll('.exp-dot');
        const expCounter = document.querySelector('.exp-counter');
        if (dots.length > 0 || expCounter) {
          ScrollTrigger.create({
            trigger: expContainer,
            start: 'top top',
            end: () => '+=' + (totalWidth + window.innerWidth),
            scrub: true,
            onUpdate: (self) => {
              const activeIndex = Math.round(self.progress * (expPanels.length - 1));
              dots.forEach((d, j) => d.classList.toggle('active', j === activeIndex));
              if (expCounter) expCounter.textContent = String(activeIndex + 1);
            },
          });
        }
      });
    }
  }

  // ============================================================
  // ACTE 4 — PROJETS : Sticky stacking cards
  // ============================================================

  const projectCards = document.querySelectorAll('.project-stack-card');
  projectCards.forEach((card) => {
    gsap.from(card, {
      scale: 0.95,
      opacity: 0.5,
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        end: 'top 50%',
        scrub: true,
      },
    });
  });

  // ============================================================
  // ACTE 5 — FORMATION & COMPETENCES : Bento grid stagger
  // ============================================================

  const bentoItems = document.querySelectorAll('.bento-item');
  if (bentoItems.length > 0) {
    gsap.from(bentoItems, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.bento-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }

  const techTags = document.querySelectorAll('.tech-tag');
  if (techTags.length > 0) {
    gsap.from(techTags, {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      stagger: 0.03,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.tech-tags-container',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }

  // ============================================================
  // ACTE 6 — CONTACT : Reveal final
  // ============================================================

  gsap.from('.contact-title', {
    y: 50,
    opacity: 0,
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 70%',
      end: 'top 40%',
      scrub: true,
    },
  });

  // ============================================================
  // TRANSITIONS DE FOND ENTRE ACTES
  // ============================================================

  const bgTransitions = [
    { trigger: '#accueil',      bg: '#0f1729' },
    { trigger: '#profil',       bg: '#fafbfc' },
    { trigger: '#experience',   bg: '#1a2744' },
    { trigger: '#projets',      bg: '#fafbfc' },
    { trigger: '#competences',  bg: '#f0f4f8' },
    { trigger: '#publications', bg: '#fafbfc' },
    { trigger: '#contact',      bg: '#0f1729' },
  ];

  // Adapt transitions to theme
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    bgTransitions.forEach(t => {
      if (t.bg === '#fafbfc' || t.bg === '#f0f4f8') t.bg = '#0f1729';
    });
  }

  bgTransitions.forEach(({ trigger, bg }) => {
    ScrollTrigger.create({
      trigger,
      start: 'top 60%',
      end: 'top 20%',
      onEnter: () => gsap.to('body', { backgroundColor: bg, duration: 0.6, ease: 'power2.inOut' }),
      onEnterBack: () => gsap.to('body', { backgroundColor: bg, duration: 0.6, ease: 'power2.inOut' }),
    });
  });

  // ============================================================
  // NAVIGATION — Highlight section active
  // ============================================================

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  sections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => updateNav(section.id),
      onEnterBack: () => updateNav(section.id),
    });
  });

  function updateNav(activeId: string) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${activeId}`);
    });
  }

  // ============================================================
  // PROGRESS INDICATOR VERTICAL
  // ============================================================

  const progressBar = document.querySelector('.progress-bar-fill');
  if (progressBar) {
    gsap.to(progressBar, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
  }

  // ============================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href')!);
      if (target) {
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
      }
    });
  });

  // ============================================================
  // MOBILE MENU
  // ============================================================

  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', isOpen);
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fas fa-bars text-lg' : 'fas fa-times text-lg';
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars text-lg';
      });
    });
  }

  // Refresh ScrollTrigger after all animations are set up and fonts loaded
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

// ============================================================
// DRAWER FORMATION
// ============================================================

const drawer = document.getElementById('formation-drawer');
const drawerBackdrop = drawer?.querySelector('.drawer-backdrop');
const drawerPanel = drawer?.querySelector('.drawer-panel');
const drawerContent = drawer?.querySelector('.drawer-content');
const drawerClose = drawer?.querySelector('.drawer-close');

function openDrawer(formationId: string) {
  const formations = (window as any).__formations || [];
  const f = formations.find((item: any) => item.id === formationId);
  if (!f || !drawer || !drawerContent) return;

  // Build DOM instead of innerHTML to avoid UTF-8 encoding issues
  const container = document.createElement('div');

  // Header: icon + year
  const header = document.createElement('div');
  header.className = 'flex items-center gap-3 mb-6';
  const icon = document.createElement('i');
  icon.className = `fas fa-${f.icon} text-amber-400 text-2xl`;
  header.appendChild(icon);
  const yearSpan = document.createElement('span');
  yearSpan.className = 'font-mono text-sm text-teal-400';
  yearSpan.textContent = f.year;
  header.appendChild(yearSpan);
  container.appendChild(header);

  // Title
  const title = document.createElement('h2');
  title.className = 'font-display text-2xl font-bold text-white mb-2';
  title.textContent = f.title;
  container.appendChild(title);

  // Org
  const org = document.createElement('p');
  org.className = 'text-white/50 mb-1';
  org.textContent = f.org;
  container.appendChild(org);

  // Subtitle or spacer
  if (f.subtitle) {
    const sub = document.createElement('p');
    sub.className = 'text-sm text-white/30 mb-6';
    sub.textContent = f.subtitle;
    container.appendChild(sub);
  } else {
    const spacer = document.createElement('div');
    spacer.className = 'mb-6';
    container.appendChild(spacer);
  }

  // "Contenu principal" heading
  const sectionTitle = document.createElement('h3');
  sectionTitle.className = 'font-mono text-xs tracking-widest uppercase text-white/30 mb-4';
  sectionTitle.textContent = 'Contenu principal';
  container.appendChild(sectionTitle);

  // Contents list
  const ul = document.createElement('ul');
  ul.className = 'space-y-2 mb-8';
  f.contents.forEach((c: string) => {
    const li = document.createElement('li');
    li.className = 'flex items-start gap-3 text-white/70 text-sm leading-relaxed';

    const dot = document.createElement('span');
    dot.className = 'font-mono text-teal-400/50 mt-1';
    dot.textContent = '\u00B7';

    const text = document.createElement('span');
    text.textContent = c;

    li.appendChild(dot);
    li.appendChild(text);
    ul.appendChild(li);
  });
  container.appendChild(ul);

  // Memoire section
  if (f.memoire) {
    const memoireSection = document.createElement('div');
    memoireSection.className = 'pt-6 border-t border-white/5';

    const memoireTitle = document.createElement('h3');
    memoireTitle.className = 'font-mono text-xs tracking-widest uppercase text-white/30 mb-3';
    memoireTitle.textContent = 'M\u00E9moire';
    memoireSection.appendChild(memoireTitle);

    const memoireText = document.createElement('p');
    memoireText.className = 'text-sm text-white/60 italic leading-relaxed mb-3';
    memoireText.textContent = '\u00AB ' + f.memoire.title + ' \u00BB';
    memoireSection.appendChild(memoireText);

    if (f.memoire.url) {
      const link = document.createElement('a');
      link.href = f.memoire.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.className = 'inline-flex items-center gap-2 text-sm font-mono text-teal-400 hover:text-teal-300 transition-colors';
      link.innerHTML = 'Lire en ligne <i class="fas fa-external-link-alt text-xs"></i>';
      memoireSection.appendChild(link);
    }

    container.appendChild(memoireSection);
  }

  drawerContent.innerHTML = '';
  drawerContent.appendChild(container);

  // Open
  drawer.classList.add('active');
  drawer.style.pointerEvents = 'auto';
  drawerBackdrop?.classList.replace('bg-black/0', 'bg-black/60');
  drawerPanel?.classList.remove('translate-x-full');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  if (!drawer) return;
  drawerBackdrop?.classList.replace('bg-black/60', 'bg-black/0');
  drawerPanel?.classList.add('translate-x-full');
  drawer.style.pointerEvents = 'none';
  drawer.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.formation-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-formation');
    if (id) openDrawer(id);
  });
});

drawerClose?.addEventListener('click', closeDrawer);
drawerBackdrop?.addEventListener('click', closeDrawer);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer?.classList.contains('active')) {
    closeDrawer();
  }
});

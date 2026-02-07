// src/scripts/navigation.ts — Phase 2 (vertical scroll)
document.addEventListener('DOMContentLoaded', () => {
  // 1. IntersectionObserver — highlight active nav link
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -60% 0px' }
  );

  sections.forEach((section) => observer.observe(section));

  // 2. Mobile menu references (used by smooth scroll + toggle)
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  // 3. Smooth scroll for anchor links
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        mobileMenu?.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // 4. Mobile menu toggle

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // 5. Header shadow on scroll
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 6. Back-to-top button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener(
      'scroll',
      () => {
        backToTop.classList.toggle('visible', window.scrollY > 600);
      },
      { passive: true }
    );
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 7. Contact form (Formspree)
  const contactForm = document.getElementById('contactForm') as HTMLFormElement | null;
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          alert('Merci, votre message a été envoyé !');
          contactForm.reset();
        } else {
          alert("Une erreur s'est produite. Veuillez réessayer.");
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du formulaire:", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    });
  }
});

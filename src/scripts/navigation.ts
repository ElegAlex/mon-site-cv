// Navigation script — migrated from script.js
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.getElementById('main-scroll');
    const dots = document.querySelectorAll('.progress-dot');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-panel');
    const homeButton = document.getElementById('home-button');
    const loader = document.getElementById('loader');
    const body = document.body;
    const numSections = sections.length;

    // --- Utility ---
    function debounce(func: Function, wait = 20, immediate = false) {
        let timeout: ReturnType<typeof setTimeout> | null;
        return function(this: unknown, ...args: unknown[]) {
            const context = this;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // --- Loader ---
    function hideLoader() {
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            body.classList.add('loaded');
        }
    }

    // --- Navigation Logic ---
    const updateActiveIndicator = () => {
        if (!scrollContainer || !sections || sections.length === 0) return;
        const containerWidth = scrollContainer.clientWidth;
        if (containerWidth === 0) return;

        const scrollPosition = scrollContainer.scrollLeft;
        let activeIndex = Math.round(scrollPosition / containerWidth);
        activeIndex = Math.max(0, Math.min(numSections - 1, activeIndex));

        dots.forEach((dot, index) => dot?.classList.toggle('active', index === activeIndex));

        navItems.forEach(item => {
            if (item) {
                const targetIndex = parseInt(item.getAttribute('data-target') || '0');
                item.classList.toggle('active', targetIndex === activeIndex);
                if (targetIndex === activeIndex && window.innerWidth < 768 && item.classList.contains('active') && item.scrollIntoView) {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }
        });

        if (homeButton) {
            homeButton.classList.toggle('visible', activeIndex > 0);
        }
    };

    // --- Touch Handling ---
    let isTouching = false;
    let touchStartX = 0;
    let scrollStartX = 0;
    const touchEndHandler = () => {
        if (!isTouching || !scrollContainer) return;
        isTouching = false;
        scrollContainer.style.scrollSnapType = 'x mandatory';
    };

    if (scrollContainer) {
        scrollContainer.addEventListener('touchstart', (e) => {
            isTouching = true;
            touchStartX = e.touches[0].clientX;
            scrollStartX = scrollContainer.scrollLeft;
            scrollContainer.style.scrollSnapType = 'none';
            scrollContainer.style.scrollBehavior = 'auto';
        }, { passive: true });

        scrollContainer.addEventListener('touchmove', (e) => {
            if (!isTouching) return;
            const touchCurrentX = e.touches[0].clientX;
            const deltaX = touchStartX - touchCurrentX;
            scrollContainer.scrollLeft = scrollStartX + deltaX;
        }, { passive: true });

        scrollContainer.addEventListener('touchend', touchEndHandler);
        scrollContainer.addEventListener('touchcancel', touchEndHandler);
    }

    // --- Event Listeners ---
    dots.forEach(dot => {
        if (dot) {
            dot.addEventListener('click', () => {
                if (!scrollContainer) return;
                const index = parseInt((dot as HTMLElement).getAttribute('data-index') || '0');
                const containerWidth = scrollContainer.clientWidth;
                scrollContainer.scrollTo({ left: index * containerWidth, behavior: 'smooth' });
            });
        }
    });

    navItems.forEach(item => {
        if (item) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                if (!scrollContainer) return;
                const index = parseInt(item.getAttribute('data-target') || '0');
                scrollContainer.scrollTo({ left: index * scrollContainer.clientWidth, behavior: 'smooth' });
            });
        }
    });

    if (homeButton) {
        homeButton.addEventListener('click', () => {
            if (!scrollContainer) return;
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        });
    }

    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', debounce(updateActiveIndicator, 50));
    }
    window.addEventListener('resize', debounce(updateActiveIndicator, 100));

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm') as HTMLFormElement | null;
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    alert('Merci, votre message a été envoyé !');
                    contactForm.reset();
                } else {
                    alert("Une erreur s'est produite. Veuillez réessayer.");
                }
            } catch (error) {
                console.error('Erreur lors de l\'envoi du formulaire:', error);
                alert("Une erreur s'est produite. Veuillez réessayer.");
            }
        });
    }

    // --- Init ---
    window.onload = () => {
        hideLoader();
        setTimeout(() => {
            if (scrollContainer) {
                const currentHash = window.location.hash.substring(1);
                let initialScroll = 0;
                if (currentHash) {
                    const targetElement = document.getElementById(currentHash);
                    if (targetElement?.classList.contains('section-panel')) {
                        const panelIndex = Array.from(sections).indexOf(targetElement);
                        if (panelIndex !== -1) {
                            initialScroll = panelIndex * scrollContainer.clientWidth;
                        }
                    }
                }
                scrollContainer.scrollTo({ left: initialScroll, behavior: 'auto' });
            }
            updateActiveIndicator();
            if (scrollContainer) scrollContainer.style.scrollBehavior = 'smooth';
        }, 50);
    };
});

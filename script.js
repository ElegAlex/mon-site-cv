// JavaScript (script.js) - Version V13.3 (Identique V10/V11/V12)
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.getElementById('main-scroll');
    const dots = document.querySelectorAll('.progress-dot');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-panel');
    const homeButton = document.getElementById('home-button');
    const loader = document.getElementById('loader');
    const body = document.body;
    const numSections = sections.length;

    // --- Fonctions Utilitaires ---
    function debounce(func, wait = 20, immediate = false) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // --- Gestion du Loader ---
    function hideLoader() {
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            // Optionnel: supprimer le loader du DOM après la transition pour libérer des ressources
            // setTimeout(() => loader.remove(), 500);
            body.classList.add('loaded'); // Permet d'autres styles/animations post-chargement si besoin
        }
    }

    // --- Logique Principale de Navigation ---
    const updateActiveIndicator = () => {
        // Vérifications robustes
        if (!scrollContainer || !sections || sections.length === 0) return;
        const containerWidth = scrollContainer.clientWidth;
        if (containerWidth === 0) return; // Évite la division par zéro

        const scrollPosition = scrollContainer.scrollLeft;
        // Utilise round pour un meilleur snapping visuel aux indicateurs
        let activeIndex = Math.round(scrollPosition / containerWidth);
        // S'assurer que l'index reste dans les limites valides
        activeIndex = Math.max(0, Math.min(numSections - 1, activeIndex));

        // Met à jour les points de progression (dots)
        dots.forEach((dot, index) => dot?.classList.toggle('active', index === activeIndex));

        // Met à jour les éléments de la navigation flottante
        navItems.forEach(item => {
            if (item) {
                 const targetIndex = parseInt(item.getAttribute('data-target'));
                 item.classList.toggle('active', targetIndex === activeIndex);
                 // Fait défiler l'élément de nav actif en vue sur mobile
                 if (targetIndex === activeIndex && window.innerWidth < 768 && item.classList.contains('active') && item.scrollIntoView) {
                     item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                 }
            }
        });

        // Gère la visibilité du bouton Accueil
        if (homeButton) {
            homeButton.classList.toggle('visible', activeIndex > 0);
        }
    };

    // --- Gestion Tactile pour le Scroll Horizontal ---
    let isTouching = false;
    let touchStartX = 0;
    let scrollStartX = 0;
    const touchEndHandler = () => {
        if (!isTouching || !scrollContainer) return;
        isTouching = false;
        // Réactive le snap CSS après le drag manuel
        scrollContainer.style.scrollSnapType = 'x mandatory';
        // Le snap CSS devrait déclencher un événement 'scroll' qui mettra à jour les indicateurs
        // Si ce n'est pas fiable, on peut forcer une mise à jour après un court délai
        // setTimeout(updateActiveIndicator, 150);
    };

    if (scrollContainer) {
        scrollContainer.addEventListener('touchstart', (e) => {
            isTouching = true;
            touchStartX = e.touches[0].clientX;
            scrollStartX = scrollContainer.scrollLeft;
            // Désactive temporairement le snap et le smooth scroll pendant le drag
            scrollContainer.style.scrollSnapType = 'none';
            scrollContainer.style.scrollBehavior = 'auto';
        }, { passive: true });

        scrollContainer.addEventListener('touchmove', (e) => {
            if (!isTouching) return;
            const touchCurrentX = e.touches[0].clientX;
            const deltaX = touchStartX - touchCurrentX; // Calculer le déplacement
            scrollContainer.scrollLeft = scrollStartX + deltaX; // Appliquer le scroll
            // Pas besoin de mettre à jour les indicateurs ici, ça ralentirait
        }, { passive: true });

        scrollContainer.addEventListener('touchend', touchEndHandler);
        scrollContainer.addEventListener('touchcancel', touchEndHandler); // Gérer aussi l'annulation
    }

    // --- Écouteurs d'événements pour la Navigation ---
    // Clic sur les points de progression
    dots.forEach(dot => {
        if(dot) {
            dot.addEventListener('click', () => {
                if (!scrollContainer) return;
                const index = parseInt(dot.getAttribute('data-index'));
                const containerWidth = scrollContainer.clientWidth;
                scrollContainer.scrollTo({ left: index * containerWidth, behavior: 'smooth' });
            });
        }
    });

    // Clic sur les items de la navigation flottante
    navItems.forEach(item => {
        if(item) {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // Empêche le comportement de lien par défaut
                if (!scrollContainer) return;
                const index = parseInt(item.getAttribute('data-target'));
                const containerWidth = scrollContainer.clientWidth;
                scrollContainer.scrollTo({ left: index * scrollContainer.clientWidth, behavior: 'smooth' });
            });
        }
    });

    // Clic sur le bouton Retour Accueil
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            if (!scrollContainer) return;
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        });
    }

    // Mise à jour des indicateurs lors du scroll (avec debounce)
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', debounce(updateActiveIndicator, 50));
    }

    // Mise à jour des indicateurs lors du redimensionnement de la fenêtre
    window.addEventListener('resize', debounce(updateActiveIndicator, 100));

    // Gestion 'hover' tactile pour flip-card via HTML ontouchstart="this.classList.toggle('hover');"
    // Si cette méthode pose problème (ex: scroll difficile sur la carte),
    // on pourrait la remplacer par un listener JS plus sophistiqué ici,
    // mais pour le moment, on garde la solution HTML simple.

    // --- Soumission du Formulaire de Contact (Simulation) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Empêche l'envoi réel du formulaire
            const nameInput = document.getElementById('name');
            const name = nameInput?.value.trim() || 'Visiteur'; // Utiliser trim()

            // !!! Remplacer cette alerte par la logique d'envoi réelle (ex: via Netlify Forms, Formspree) !!!
            alert(`Merci ${name}, votre message a été reçu ! (Ceci est une simulation)`);

            contactForm.reset(); // Vide le formulaire après la simulation
        });
    }

    // --- Initialisation au Chargement ---
    window.onload = () => {
         hideLoader(); // Cacher le loader
         // Léger délai pour s'assurer que tout est rendu avant de calculer la position
         setTimeout(() => {
            if (scrollContainer) {
                // Gérer le cas où l'URL contient un hash (#) pour aller à une section spécifique
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
                 // Positionner sans animation au chargement
                 scrollContainer.scrollTo({ left: initialScroll, behavior: 'auto' });
            }
             // Mettre à jour les indicateurs une fois positionné
             updateActiveIndicator();
             // Réactiver le smooth scroll pour les interactions futures
             if (scrollContainer) scrollContainer.style.scrollBehavior = 'smooth';
         }, 50); // Délai très court
    };

}); // Fin DOMContentLoaded

# CV en Ligne Interactif - Alexandre Berge

![Aperçu du Site](screenshot.png)
*(Capture d'écran réelle du site)*

Ce dépôt contient le code source du CV en ligne interactif d'Alexandre Berge, conçu comme une vitrine moderne et élégante de son parcours professionnel, de ses compétences et de ses formations. Le site utilise une navigation horizontale par sections (panneaux) et intègre des éléments interactifs pour une expérience utilisateur engageante et "ultra qualitative".

**➡ [Voir la Démo Live](https://mon-site-cv.netlify.app/)**

---

## ✨ Fonctionnalités Principales

*   **Navigation Horizontale Intuitive :** Défilement fluide entre les sections via la molette, le toucher ou la navigation dédiée.
*   **Design Élégant & Moderne :** Palette de couleurs sobre, typographie soignée, utilisation de l'espace blanc et d'effets visuels subtils (ombres, dégradés, transitions).
*   **Sections Complètes :**
    *   **Accueil :** Présentation impactante avec photo, titre, coordonnées et liens clés (LinkedIn, Portfolio, CV PDF).
    *   **Profil :** Synthèse du positionnement professionnel, mise en avant des compétences socles et des principes directeurs.
    *   **Expériences :** Timeline verticale repensée pour une lisibilité optimale des postes, missions et réalisations clés.
    *   **Formation & Certification :** Cartes interactives (flip cards) présentant les diplômes et la certification ITIL avec détails au verso (contenu, mémoires).
    *   **Compétences :** Cartes interactives (flip cards) organisées par grandes catégories (Stratégie, Management, Technique, Savoir-être) avec détails et technologies maîtrisées.
    *   **Centres d'Intérêt :** Section visuellement attractive mettant en avant les passions extra-professionnelles avec images de fond et effets.
    *   **Contact :** Formulaire fonctionnel (via service externe) et coordonnées claires sur fond contrasté.
*   **Interactivité :** Effets de survol (hovers), flip cards, animations d'entrée subtiles pour dynamiser la présentation.
*   **Responsivité :** Adaptation de la mise en page pour une consultation optimale sur différents appareils (ordinateur, tablette, mobile).
*   **Optimisation :** Code structuré, CSS optimisé, utilisation de dépendances via CDN pour la performance.

---

## 🛠️ Technologies Utilisées

*   **HTML5 :** Structure sémantique du contenu.
*   **CSS3 :**
    *   **Tailwind CSS (via CDN) :** Utilisé principalement pour la structure de base, le système de grille responsive et les utilitaires rapides.
    *   **CSS Personnalisé (`style.css`) :** Styles spécifiques, design avancé, animations, transitions, variables CSS pour la charte graphique, et surcharge/complément de Tailwind.
*   **JavaScript (Vanilla) :**
    *   Gestion de la navigation horizontale (scroll, dots, barre flottante).
    *   Gestion du bouton "Retour Accueil".
    *   Gestion de l'interaction tactile pour les flip cards (`ontouchstart`).
    *   Gestion du loader initial.
    *   *Logique de simulation* pour le formulaire de contact (à remplacer par une solution réelle).
*   **Font Awesome (via CDN) :** Bibliothèque d'icônes.
*   **Google Fonts :** Polices Montserrat et Playfair Display.

---

## 📂 Structure du Projet

```
/mon-site-cv/
|
|-- index.html              # Fichier HTML principal contenant toute la structure
|-- photo_alex.png          # Votre photo de profil (placée à la racine)
|-- style.css               # Fichier CSS contenant tous les styles personnalisés
|-- script.js               # Fichier JavaScript pour l'interactivité
|-- README.md               # Ce fichier
|
|-- /assets/                # Dossier pour les ressources statiques
    |-- cv-alexandre-berge.pdf     # Votre CV au format PDF
    |-- memoire-msic-alexandre-berge.pdf # Votre mémoire MSIC (si applicable)
    |-- interest-leather-texture.jpg # Image d'arrière-plan pour intérêt Maroquinerie (exemple)
    |-- interest-abstract-art.jpg  # Image d'arrière-plan pour intérêt Art (exemple)
    |-- interest-tech-pattern.jpg  # Image d'arrière-plan pour intérêt Tech (exemple)
    |-- ... (autres images ou ressources si nécessaire) ...
```

---

## 🚀 Démarrage Rapide (Local)

1.  **Clonez ou téléchargez ce dépôt :**
    ```bash
    git clone https://votre-url-de-depot.git nom-du-dossier
    cd nom-du-dossier
    ```
    Ou téléchargez le ZIP et décompressez-le.
2.  **Ouvrez `index.html` dans votre navigateur web.**

*Note :* Pour une expérience optimale, notamment si des scripts ou des ressources externes sont chargés, il est recommandé d'utiliser une extension de serveur local (comme "Live Server" dans VS Code) plutôt que d'ouvrir le fichier directement via `file://`.

---

## ☁️ Déploiement

Ce site est **statique** et peut être déployé facilement sur de nombreuses plateformes :

1.  **Netlify (Recommandé) :**
    *   Connectez votre dépôt Git (GitHub, GitLab, Bitbucket) ou glissez-déposez le dossier du projet.
    *   Configuration automatique généralement suffisante.
    *   Profitez de Netlify Forms pour le formulaire de contact (voir section suivante).
    *   Mises à jour automatiques via `git push`.
2.  **Vercel :**
    *   Processus similaire à Netlify (connexion Git ou upload). Excellente performance.
3.  **GitHub Pages :**
    *   Activez via les paramètres de votre dépôt GitHub. Simple et gratuit.
4.  **Cloudflare Pages :**
    *   Alternative performante avec intégration Git.

Consultez la documentation de la plateforme choisie pour les détails spécifiques.

---

## ✉️ Gestion du Formulaire de Contact

**Important :** Le script `script.js` envoie les données du formulaire avec `fetch()` vers l'URL définie dans `action` et affiche simplement une alerte de succès ou d'erreur. Pour recevoir réellement les messages :

1.  **Choisissez un service de backend pour formulaire (ou votre propre serveur) :**
    *   **Netlify Forms :** Si hébergé sur Netlify, ajoutez simplement l'attribut `netlify` (ou `data-netlify="true"`) à votre balise `<form>` dans `index.html`. Assurez-vous que tous les champs (`input`, `textarea`) ont un attribut `name`. C'est la solution la plus simple si vous utilisez Netlify.
    *   **Formspree.io / FormSubmit.co :** Créez un compte, obtenez une URL d'endpoint et remplacez `action="..."` dans votre balise `<form>` par cette URL. N'oubliez pas d'ajouter `method="POST"`.
    *   Toute autre API personnelle : indiquez l'URL de votre backend.
    *   Remplacez l'exemple `https://formspree.io/f/your-form-id` par le lien fourni. Sur OVH, utilisez un service externe ou votre propre serveur pour traiter le formulaire.
2.  **(Optionnel mais recommandé si vous n'utilisez PAS Netlify Forms) Supprimez/Commentez le Listener JavaScript :** Si vous utilisez un service externe comme Formspree, commentez ou supprimez le bloc `contactForm.addEventListener('submit', ...)` dans `script.js` pour laisser le navigateur gérer la soumission standard vers l'URL `action`.

---

## 🎨 Personnalisation

Pour adapter ce site à votre propre profil :

1.  **Contenu Textuel :** Modifiez directement le texte dans `index.html` pour toutes les sections (titres, descriptions, expériences, formations, etc.).
2.  **Photo de Profil :** Remplacez le fichier `photo_alex.png` par votre propre photo, en gardant **exactement le même nom de fichier**.
3.  **CV PDF :** Placez votre CV au format PDF dans le dossier `assets/` et assurez-vous que le nom du fichier correspond à celui utilisé dans le lien de téléchargement (`href="assets/cv-alexandre-berge.pdf"`) dans `index.html`. Modifiez également l'attribut `download` si souhaité.
4.  **Mémoire PDF (MSIC) :** Placez votre mémoire dans `assets/` et mettez à jour le lien (`href` et `download`) dans la carte de formation MSIC dans `index.html`.
5.  **Images "Intérêts" :** Remplacez les images d'exemple (`assets/interest-....jpg`) par les vôtres. Mettez à jour les URLs dans `style.css` au niveau des classes `.interest--maroquinerie .interest-bg-image`, `.interest--art .interest-bg-image`, etc.
6.  **Liens Externes :** Mettez à jour les URLs pour LinkedIn, Elegartex, Elegartech et tout autre lien externe dans `index.html`.
7.  **Styles :** Modifiez les couleurs, polices, espacements et autres aspects visuels en ajustant les variables CSS et les règles dans `style.css`.

---

## 🤝 Contribution

Ce projet est un CV personnel. Les suggestions d'amélioration sont les bienvenues via les "Issues" du dépôt (si applicable).

---

## 📜 Licence

Ce projet est distribué sous la licence MIT. Voir le fichier `LICENSE` pour plus de détails (si vous en ajoutez un).

---

## 📞 Contact

Alexandre Berge
*   [LinkedIn](https://www.linkedin.com/in/bergealexandre)
*   [contact@alexandre-berge.fr](mailto:contact@alexandre-berge.fr)

# PLAN D'EXÉCUTION — Refonte site CV alexandre-berge.fr

## VUE D'ENSEMBLE

Refonte du site CV/portfolio en 4 phases exécutables séquentiellement avec Claude Code. Chaque phase est un prompt autonome. Tu lances la phase N, tu valides, puis tu passes à N+1.

```
Phase 1 → Fondation Astro + Tailwind v4 + GitHub Pages    (scaffold + migration)
Phase 2 → Scroll vertical + nouveau design + navigation    (UX + layout)
Phase 3 → Portfolio projets + SEO + blogs RSS              (contenu + data)
Phase 4 → Dark mode + animations + polish final            (finitions)
```

### Prérequis

```bash
# Sur ta machine, avant de lancer Claude Code :
node --version    # >= 22.x
npm --version     # >= 10.x
```

---

# PHASE 1 — Fondation Astro + Tailwind v4 + Deploy GitHub Pages

## Prompt Claude Code :

````markdown
# MIGRATION SITE CV VERS ASTRO + TAILWIND V4

## PERSONA

Tu es un développeur frontend expert Astro + Tailwind CSS v4. Tu migres un site CV statique vanilla HTML/CSS/JS vers Astro pour un déploiement GitHub Pages.

## CONTEXTE

Le repo `mon-site-cv` contient actuellement un site statique (index.html + style.css + script.js) avec :
- Tailwind CSS via CDN (anti-pattern production : ~294KB de CSS mort)
- 7 sections de CV avec navigation horizontale (sera changé en Phase 2)
- Flip cards interactives (JS vanilla)
- Google Fonts (Montserrat + Playfair Display)
- Font Awesome via CDN
- Déployé sur GitHub Pages depuis le repo ElegAlex/mon-site-cv

Le site live est https://alexandre-berge.fr

## OBJECTIF

Scaffolder un projet Astro, migrer le contenu existant, configurer Tailwind v4 en build, et déployer sur GitHub Pages via GitHub Actions. **On ne change PAS le design à cette étape** — on fait une migration iso-fonctionnelle.

## ÉTAPES

### 1. Scaffold Astro

```bash
# Dans le répertoire parent du repo existant
npm create astro@latest mon-site-cv-v2 -- --template minimal --no-install --no-git
cd mon-site-cv-v2
npm install
```

### 2. Installer Tailwind v4 pour Astro

```bash
npx astro add tailwindcss
# OU manuellement :
npm install @tailwindcss/vite
```

Configurer `astro.config.mjs` :

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://alexandre-berge.fr',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Créer `src/styles/global.css` :

```css
@import "tailwindcss";

/* Importer Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');

/* Variables CSS existantes - COPIER INTÉGRALEMENT depuis style.css */
@theme {
  --color-primary-accent: #0BC5EA;
  --color-primary-accent-darker: #0A9CBF;
  --color-primary-dark: #131823;
  --color-primary-medium: #1A202C;
  --color-primary-light: #2D3748;
  --color-background-light: #F8F9FA;
  --color-background-section: #FFFFFF;
  /* ... reporter toutes les variables existantes ... */
}

/* COPIER le reste de style.css ici, en retirant les déclarations :root 
   qui sont remplacées par @theme ci-dessus */
```

### 3. Créer la structure de composants

```
src/
├── layouts/
│   └── BaseLayout.astro      # <html>, <head>, nav, footer communs
├── components/
│   ├── Hero.astro             # Section accueil
│   ├── Profile.astro          # Section profil exécutif
│   ├── Experience.astro       # Section expériences (timeline)
│   ├── Formation.astro        # Section formation & certif
│   ├── Skills.astro           # Section compétences
│   ├── Projects.astro         # Section publications/projets (ex-intérêts)
│   ├── Contact.astro          # Section contact
│   ├── Navigation.astro       # Floating nav + dots
│   └── FlipCard.astro         # Composant flip card réutilisable
├── styles/
│   └── global.css             # Styles Tailwind + custom
├── scripts/
│   └── navigation.ts          # JS de navigation (ex script.js)
└── pages/
    └── index.astro            # Page principale assemblant les composants
```

### 4. Migrer le contenu

Pour **chaque section** de l'index.html actuel :
1. Extraire le HTML de la section
2. Créer le composant Astro correspondant (c'est juste du HTML avec un frontmatter `---`)
3. Importer dans `src/pages/index.astro`

Exemple pour `Hero.astro` :

```astro
---
// src/components/Hero.astro
// Pas de props pour l'instant, contenu statique
---

<section id="accueil" class="section-panel hero-section">
  <!-- COPIER le contenu HTML de la section hero depuis index.html -->
  <!-- Remplacer les chemins d'images : photo_alex.png → /images/photo_alex.png -->
</section>
```

Pour `src/pages/index.astro` :

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import Profile from '../components/Profile.astro';
import Experience from '../components/Experience.astro';
import Formation from '../components/Formation.astro';
import Skills from '../components/Skills.astro';
import Projects from '../components/Projects.astro';
import Contact from '../components/Contact.astro';
---

<BaseLayout>
  <div class="horizontal-scroll" id="main-scroll">
    <Hero />
    <Profile />
    <Experience />
    <Formation />
    <Skills />
    <Projects />
    <Contact />
  </div>
</BaseLayout>
```

### 5. Migrer les assets statiques

```bash
# Créer le dossier public pour les assets statiques
mkdir -p public/images public/assets

# Copier depuis l'ancien repo :
# photo_alex.png → public/images/photo_alex.png
# screenshot.png → public/images/screenshot.png
# assets/cv-alexandre-berge.pdf → public/assets/cv-alexandre-berge.pdf
# assets/interest-*.jpg → public/images/interest-*.jpg
```

Mettre à jour tous les chemins dans les composants :
- `photo_alex.png` → `/images/photo_alex.png`
- `assets/cv-*.pdf` → `/assets/cv-alexandre-berge.pdf`
- `assets/interest-*.jpg` → `/images/interest-*.jpg`

### 6. Migrer le JavaScript

Créer `src/scripts/navigation.ts` avec le contenu de `script.js` existant (renommer en .ts mais le code JS vanilla fonctionne tel quel en TypeScript).

L'importer dans `BaseLayout.astro` :

```astro
<script src="../scripts/navigation.ts"></script>
```

### 7. Configurer Font Awesome

Deux options :
- **Option A (simple)** : garder le CDN dans `BaseLayout.astro` `<head>`
- **Option B (perf)** : `npm install @fortawesome/fontawesome-free` et importer en CSS

Pour la Phase 1, garder l'Option A.

### 8. Configurer GitHub Pages

Installer l'adapter :

```bash
npx astro add sitemap
```

Mettre à jour `astro.config.mjs` :

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://alexandre-berge.fr',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Créer `public/CNAME` :

```
alexandre-berge.fr
```

### 9. Test local

```bash
npm run dev
# Ouvrir http://localhost:4321
# Vérifier que TOUTES les 7 sections s'affichent correctement
# Vérifier la navigation horizontale (sera changée en Phase 2)
# Vérifier les flip cards
# Vérifier les liens (PDF, LinkedIn, blogs)
```

### 10. Build de production

```bash
npm run build
npx serve dist/
# Vérifier le résultat build
# Lancer Lighthouse sur le build local
```

## RÉSULTAT ATTENDU

| Critère | Attendu |
|---------|---------|
| `npm run dev` démarre sans erreur | ✅ |
| 7 sections affichées identiquement à l'original | ✅ |
| Navigation horizontale fonctionnelle | ✅ |
| Flip cards interactives | ✅ |
| Aucun `<script src="https://cdn.tailwindcss.com">` dans le HTML | ✅ |
| CSS buildé < 15KB (vs ~294KB CDN) | ✅ |
| `npm run build` produit un dossier `dist/` | ✅ |
| Fichier `.github/workflows/deploy.yml` présent | ✅ |
| Fichier `public/CNAME` avec `alexandre-berge.fr` | ✅ |
| `sitemap.xml` généré dans `dist/` | ✅ |

## COMMIT

```bash
git init
git add .
git commit -m "feat: migration Astro + Tailwind v4 build

- Scaffold Astro avec Tailwind CSS v4 (Vite plugin)
- Migration iso-fonctionnelle des 7 sections en composants Astro
- Suppression CDN Tailwind (~294KB → <15KB CSS purgé)
- GitHub Actions workflow pour deploy GitHub Pages
- Sitemap auto-généré
- Structure composants : Hero, Profile, Experience, Formation, Skills, Projects, Contact"
```

## CE QU'IL NE FAUT PAS TOUCHER À CETTE PHASE

- Ne PAS changer le layout horizontal (Phase 2)
- Ne PAS changer le design visuel
- Ne PAS remplacer les flip cards (Phase 2)
- Ne PAS ajouter de dark mode (Phase 4)
- Ne PAS modifier le contenu textuel (déjà mis à jour dans le sprint précédent)
````

---

# PHASE 2 — Scroll vertical + Nouveau design + Navigation repensée

## Prompt Claude Code :

````markdown
# REFONTE UX : SCROLL VERTICAL + LAYOUT MODERNE

## PERSONA

Tu es un designer/développeur frontend expert en UX portfolio et Astro. Tu transformes un site CV à scroll horizontal en un site vertical moderne avec un design de personal branding pour un directeur IT secteur santé.

## CONTEXTE

Le site CV d'Alexandre Berge (Responsable Département Informatique, CPAM 92) a été migré vers Astro + Tailwind v4 en Phase 1. Il utilise encore la navigation horizontale héritée de l'ancien site vanilla.

**Problème UX identifié** : la recherche NNGroup montre que seulement 1% des utilisateurs interagissent avec du contenu caché derrière un scroll horizontal. Sur desktop, c'est contre-intuitif (pas de scroll wheel horizontal sur la plupart des souris).

**Audiences cibles** :
1. Recruteurs/chasseurs de têtes (scan rapide < 10s)
2. Pairs IT / DSI (profondeur technique)
3. Organisateurs de conférences (bio + thèmes)

## OBJECTIF

1. Passer en scroll vertical avec sections pleine largeur
2. Remplacer les flip cards par des cartes expandables accessibles
3. Adopter un design bento-grid modulaire pour le profil
4. Navigation sticky responsive
5. Animations scroll-driven CSS-only (reveal progressif)

## ÉTAPES

### 1. Nouvelle palette et typographie

Remplacer la palette actuelle par une palette "trust + tech" :

```css
@theme {
  /* Palette principale */
  --color-navy: #1a2744;
  --color-navy-light: #243352;
  --color-teal: #2d8f8f;
  --color-teal-light: #3ab5b5;
  --color-amber: #d4a953;
  --color-amber-light: #e8c778;
  
  /* Surfaces */
  --color-surface: #fafbfc;
  --color-surface-card: #ffffff;
  --color-surface-dark: #0f1729;
  
  /* Textes */
  --color-text-primary: #1a2744;
  --color-text-secondary: #5a6b82;
  --color-text-inverse: #f0f4f8;
  --color-text-muted: #8b9bb4;
  
  /* Bordures */
  --color-border: #e2e8f0;
  --color-border-accent: rgba(45, 143, 143, 0.2);
}
```

Typographie — remplacer Montserrat/Playfair par :
- **Headings** : `Bricolage Grotesque` (Google Fonts, variable, distinctive sans-serif)
- **Body** : `DM Sans` (Google Fonts, clean, excellent readability)
- **Accents/monospace** : `JetBrains Mono` (pour les badges tech, métriques)

### 2. Layout vertical — modifier BaseLayout.astro

Supprimer le container `horizontal-scroll` et le remplacer par un flux vertical normal :

```astro
<!-- BaseLayout.astro -->
<main id="main-content">
  <slot />
</main>
```

Chaque section :
```css
.section {
  min-height: 100vh; /* OU auto selon le contenu */
  padding: 6rem 2rem;
  scroll-margin-top: 5rem; /* Pour la nav sticky */
}

@media (min-width: 1024px) {
  .section {
    padding: 8rem 4rem;
  }
}
```

### 3. Navigation sticky

Remplacer les progress dots + floating nav par une navigation sticky top :

```astro
<!-- src/components/Navigation.astro -->
<header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 transition-all">
  <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
    <a href="#accueil" class="font-bold text-lg text-navy">A.B</a>
    <div class="hidden md:flex items-center gap-1">
      <a href="#profil" class="nav-link">Profil</a>
      <a href="#experience" class="nav-link">Expériences</a>
      <a href="#formation" class="nav-link">Formations</a>
      <a href="#competences" class="nav-link">Compétences</a>
      <a href="#projets" class="nav-link">Projets</a>
      <a href="#contact" class="nav-link">Contact</a>
    </div>
    <a href="/assets/cv-alexandre-berge.pdf" download class="download-btn">
      <i class="fas fa-file-pdf"></i> CV PDF
    </a>
    <!-- Menu burger mobile -->
    <button class="md:hidden" id="mobile-menu-toggle" aria-label="Menu">
      <i class="fas fa-bars text-xl"></i>
    </button>
  </nav>
</header>
```

Ajouter le highlight de la section active via IntersectionObserver dans le script de navigation.

### 4. Hero section vertical

```astro
<section id="accueil" class="relative min-h-screen flex items-center bg-navy overflow-hidden">
  <!-- Background effects (conserver les décos existantes) -->
  <div class="max-w-6xl mx-auto px-6 grid lg:grid-cols-5 gap-12 items-center">
    
    <!-- Texte : 3 colonnes -->
    <div class="lg:col-span-3 space-y-6">
      <h1 class="font-display text-5xl lg:text-6xl text-white">
        Alexandre Berge
      </h1>
      <p class="text-teal text-xl font-medium">
        Responsable Département Informatique
      </p>
      <p class="text-text-muted text-lg">
        CPAM des Hauts-de-Seine · Secteur Santé & Protection Sociale
      </p>
      
      <!-- Badges -->
      <div class="flex flex-wrap gap-2">
        <span class="badge">Master MSIC Paris 1</span>
        <span class="badge">ITIL 4 Foundation</span>
        <span class="badge">45 collaborateurs</span>
      </div>
      
      <!-- Métriques en bento mini-grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div class="metric-card">
          <span class="font-mono text-3xl font-bold text-teal">17+</span>
          <span class="text-sm text-text-muted">ans Management</span>
        </div>
        <!-- ... 3 autres métriques ... -->
      </div>
      
      <!-- CTAs -->
      <div class="flex items-center gap-4 mt-6">
        <!-- Liens sociaux + Download CV -->
      </div>
    </div>
    
    <!-- Photo : 2 colonnes -->
    <div class="lg:col-span-2 flex justify-center">
      <!-- Photo avec cadre stylisé -->
    </div>
  </div>
</section>
```

### 5. Remplacer les flip cards par des cartes expandables

Créer un composant `ExpandableCard.astro` :

```astro
---
interface Props {
  title: string;
  icon: string;
  variant?: 'light' | 'dark';
}
const { title, icon, variant = 'light' } = Astro.props;
---

<div class="expandable-card group" data-expanded="false">
  <button 
    class="card-header w-full text-left flex items-center justify-between p-6 cursor-pointer"
    aria-expanded="false"
    onclick="this.parentElement.dataset.expanded = this.parentElement.dataset.expanded === 'true' ? 'false' : 'true'; this.setAttribute('aria-expanded', this.parentElement.dataset.expanded);"
  >
    <div class="flex items-center gap-4">
      <i class={`fas ${icon} text-2xl text-teal`}></i>
      <h3 class="text-lg font-semibold">{title}</h3>
    </div>
    <i class="fas fa-chevron-down transition-transform group-data-[expanded=true]:rotate-180"></i>
  </button>
  <div class="card-body overflow-hidden transition-all max-h-0 group-data-[expanded=true]:max-h-[500px]">
    <div class="px-6 pb-6">
      <slot />
    </div>
  </div>
</div>
```

Remplacer les flip cards dans Formation, Compétences, et Publications par ce composant.

### 6. Animations scroll-driven CSS

Ajouter dans global.css :

```css
/* Reveal au scroll — CSS natif (Chrome 115+, Firefox, Safari 26+) */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeSlideUp 0.6s ease forwards;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}

@keyframes fadeSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fallback pour navigateurs sans support */
@supports not (animation-timeline: view()) {
  .reveal {
    opacity: 1;
    transform: none;
  }
}
```

Ajouter `class="reveal"` sur les éléments clés de chaque section.

### 7. Refactoring script de navigation

Réécrire `navigation.ts` pour le scroll vertical :

```typescript
// src/scripts/navigation.ts
document.addEventListener('DOMContentLoaded', () => {
  // 1. IntersectionObserver pour highlight nav active
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', 
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -60% 0px' });
  
  sections.forEach(section => observer.observe(section));
  
  // 2. Smooth scroll pour les liens ancre
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href')!);
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  // 3. Menu mobile toggle
  const toggle = document.getElementById('mobile-menu-toggle');
  // ... implémentation mobile menu ...
  
  // 4. Hide loader
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }
});
```

## RÉSULTAT ATTENDU

| Critère | Attendu |
|---------|---------|
| Scroll vertical fluide | ✅ |
| Navigation sticky avec highlight section active | ✅ |
| Plus aucune flip card (remplacées par expandable cards) | ✅ |
| Menu mobile fonctionnel | ✅ |
| Animations reveal au scroll (CSS-only) | ✅ |
| Nouvelle palette navy/teal/amber | ✅ |
| Nouvelle typographie (Bricolage Grotesque + DM Sans) | ✅ |
| Lighthouse Performance > 90 | ✅ |
| Accessibilité : pas de contenu caché non accessible | ✅ |

## COMMIT

```bash
git add .
git commit -m "feat: refonte UX vertical scroll + design moderne

- Navigation horizontale → verticale avec sections full-width
- Navigation sticky avec IntersectionObserver highlight
- Flip cards → expandable cards accessibles (ARIA)
- Nouvelle palette navy/teal/amber
- Typographie : Bricolage Grotesque + DM Sans + JetBrains Mono
- Animations scroll-driven CSS (+ fallback)
- Menu mobile responsive
- Suppression de l'ancien script de navigation horizontale"
```
````

---

# PHASE 3 — Portfolio Projets + SEO + Flux RSS Blogs

## Prompt Claude Code :

````markdown
# SECTION PORTFOLIO + SEO + INTÉGRATION BLOGS

## PERSONA

Tu es un développeur Astro expert en data fetching build-time, SEO technique, et présentation de projets open source.

## CONTEXTE

Site CV Astro d'Alexandre Berge. En Phase 2, on a un site vertical moderne. Il faut maintenant :
1. Transformer la section "Publications & Projets Personnels" en vrai portfolio avec case studies
2. Intégrer les flux RSS des blogs externes (elegartech.fr, communs-numeriques.fr)
3. Optimiser le SEO (JSON-LD, OG images, performances)

### Projets à showcaser

**Orchestr-A** (https://github.com/ElegAlex/Orchestr-A)
- Description : Application de gestion de projets et ressources humaines pour collectivités territoriales
- Stack : NestJS 11 + Next.js 16 (App Router) + PostgreSQL + Redis, monorepo Turborepo
- Rôle : Architecte et développeur principal
- Status : En développement actif

**OPSTRACKER** (https://github.com/ElegAlex/OPSTRACKER)
- Description : Application de suivi d'opérations IT et monitoring helpdesk
- Stack : Symfony (PHP) + PostgreSQL + Redis + Docker
- Rôle : Créateur et développeur principal
- 221 commits, développement actif
- Status : En production interne

**DepotDoc** (https://www.depotdoc.fr)
- Description : Plateforme de dépôt de documents dématérialisés pour le réseau Assurance Maladie
- Stack : Symfony
- Impact : 360k utilisations/an, 30% adoption réseau national, -50% flux papier
- Rôle : Créateur
- Status : En production nationale

### Blogs externes
- https://www.elegartech.fr — Blog tech (open source, IA, transformation digitale)
- https://communs-numeriques.fr — Blog recherche (communs numériques, administration)

## OBJECTIF

1. Créer une section Portfolio avec 3 project cards + pages case study dédiées
2. Fetcher les stats GitHub au build time pour Orchestr-A et OPSTRACKER
3. Intégrer les derniers articles des 2 blogs via RSS au build time
4. Ajouter JSON-LD Person schema + sitemap + OG metadata optimisée

## ÉTAPES

### 1. Section Portfolio — Layout featured + grid

```astro
<!-- src/components/Projects.astro -->
<section id="projets" class="section bg-surface">
  <div class="max-w-6xl mx-auto">
    <h2 class="section-heading">Projets & Publications</h2>
    <p class="section-intro">Applications développées, contributions open source et veille technologique.</p>
    
    <!-- Featured Project : DepotDoc (impact national) -->
    <div class="featured-project mb-12">
      <!-- Grande carte hero avec métriques 360k/30%/-50% -->
      <!-- Lien vers depotdoc.fr -->
    </div>
    
    <!-- Grid projets GitHub -->
    <div class="grid md:grid-cols-2 gap-6 mb-12">
      <!-- Orchestr-A card avec stats GitHub dynamiques -->
      <!-- OPSTRACKER card avec stats GitHub dynamiques -->
    </div>
    
    <!-- Section Blog feeds -->
    <h3 class="text-xl font-semibold mb-6">Dernières publications</h3>
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Elegartech : 3 derniers articles -->
      <!-- Communs Numériques : 3 derniers articles -->
    </div>
  </div>
</section>
```

### 2. Fetch GitHub stats au build time

Créer `src/lib/github.ts` :

```typescript
interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  pushed_at: string;
  html_url: string;
  topics: string[];
}

export async function getRepoStats(owner: string, repo: string): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Optionnel : ajouter un token pour éviter le rate limit
        // 'Authorization': `Bearer ${import.meta.env.GITHUB_TOKEN}`,
      },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
```

Utiliser dans le composant :

```astro
---
import { getRepoStats } from '../lib/github';

const orchestrA = await getRepoStats('ElegAlex', 'Orchestr-A');
const opsTracker = await getRepoStats('ElegAlex', 'OPSTRACKER');
---

<!-- Les stats sont rendues en HTML statique au build, ZERO JS client -->
```

### 3. Fetch RSS blogs au build time

Installer le parser RSS :

```bash
npm install rss-parser
```

Créer `src/lib/rss.ts` :

```typescript
import Parser from 'rss-parser';

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
}

export async function getLatestPosts(feedUrl: string, count: number = 3): Promise<BlogPost[]> {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(feedUrl);
    return feed.items.slice(0, count).map(item => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      contentSnippet: item.contentSnippet?.substring(0, 150) || '',
    }));
  } catch (error) {
    console.warn(`RSS fetch failed for ${feedUrl}:`, error);
    return [];
  }
}
```

**Note** : si les blogs n'ont pas de flux RSS accessible, créer un fallback avec des données statiques dans un fichier `src/data/blog-posts.json`.

### 4. JSON-LD Person Schema

Ajouter dans `BaseLayout.astro` `<head>` :

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Alexandre Berge",
  "jobTitle": "Responsable Département Informatique",
  "worksFor": {
    "@type": "Organization",
    "name": "CPAM des Hauts-de-Seine"
  },
  "url": "https://alexandre-berge.fr",
  "sameAs": [
    "https://www.linkedin.com/in/bergealexandre",
    "https://www.elegartech.fr",
    "https://communs-numeriques.fr",
    "https://github.com/ElegAlex"
  ],
  "knowsAbout": [
    "Digital Transformation",
    "IT Management", 
    "ITIL",
    "Digital Commons",
    "Open Source",
    "Health Information Systems"
  ],
  "alumniOf": [
    {
      "@type": "CollegeOrUniversity",
      "name": "Université Paris 1 Panthéon-Sorbonne"
    }
  ]
}
</script>
```

### 5. Open Graph image

Créer une image OG statique 1200x630px dans `public/images/og-image.png` :
- Fond navy (#1a2744)
- Photo d'Alexandre à gauche
- Texte : "Alexandre Berge — Responsable Département Informatique"
- Sous-texte : "17+ ans IT · 45 collaborateurs · CPAM 92"
- URL : alexandre-berge.fr

Mettre à jour les meta tags OG dans `BaseLayout.astro` :

```html
<meta property="og:image" content="https://alexandre-berge.fr/images/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### 6. Optimisation images

```bash
npm install sharp
```

Utiliser le composant `<Image>` natif d'Astro pour les images :

```astro
---
import { Image } from 'astro:assets';
import photoAlex from '../assets/photo_alex.png';
---

<Image 
  src={photoAlex} 
  alt="Alexandre Berge" 
  width={320} 
  height={320}
  format="webp"
  quality={80}
/>
```

Astro génère automatiquement des versions WebP/AVIF optimisées au build.

## RÉSULTAT ATTENDU

| Critère | Attendu |
|---------|---------|
| 3 projets affichés avec descriptions et liens | ✅ |
| Stats GitHub (stars, forks, dernier push) affichées | ✅ |
| Articles de blog récents affichés (ou fallback statique) | ✅ |
| JSON-LD Person schema valide (test schema.org validator) | ✅ |
| Image OG 1200x630 dans public/ | ✅ |
| Images converties WebP via <Image> Astro | ✅ |
| sitemap.xml inclut toutes les pages | ✅ |
| Lighthouse SEO = 100 | ✅ |

## COMMIT

```bash
git add .
git commit -m "feat: section Portfolio + SEO technique + blogs RSS

- Section Projets : DepotDoc (featured), Orchestr-A, OPSTRACKER avec case studies
- Fetch GitHub stats au build time (stars, forks, languages)
- Intégration RSS elegartech.fr + communs-numeriques.fr
- JSON-LD Person schema
- OG image 1200x630
- Images optimisées WebP via Astro Image
- Sitemap complet"
```
````

---

# PHASE 4 — Dark Mode + Animations + Polish Final

## Prompt Claude Code :

````markdown
# DARK MODE + ANIMATIONS + FINITIONS

## PERSONA

Tu es un développeur frontend expert en thèmes CSS, animations, et polish UX. Tu finalises un site portfolio Astro pour un directeur IT.

## CONTEXTE

Site CV Astro d'Alexandre Berge — Phases 1-3 complètes. Le site est vertical, moderne, avec du contenu portfolio et du SEO. Il reste les finitions : dark mode, animations avancées, et le polish général.

## OBJECTIF

1. Dark mode avec toggle + détection préférence système
2. Animations de polish (staggered reveals, hover states raffinés)
3. Touches "tech" subtiles (monospace pour les métriques, terminal accents)
4. Lighthouse 100/100 sur les 4 catégories
5. robots.txt et derniers ajustements SEO

## ÉTAPES

### 1. Dark mode — CSS custom properties

Étendre les variables dans global.css :

```css
:root {
  color-scheme: light dark;
  /* Variables light — déjà définies en Phase 2 */
}

[data-theme="dark"] {
  --color-surface: #0f1729;
  --color-surface-card: #1a2744;
  --color-text-primary: #e2e8f0;
  --color-text-secondary: #94a3b8;
  --color-text-inverse: #1a2744;
  --color-border: #2d3a50;
  --color-border-accent: rgba(45, 143, 143, 0.3);
  /* NE PAS utiliser #000000 pur — toujours des gris doux */
}
```

### 2. Toggle dark mode

Créer `src/components/ThemeToggle.astro` :

```astro
<button 
  id="theme-toggle" 
  aria-label="Basculer thème clair/sombre"
  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
>
  <i class="fas fa-moon" id="theme-icon-dark"></i>
  <i class="fas fa-sun hidden" id="theme-icon-light"></i>
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Charger la préférence sauvegardée OU la préférence système
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  html.setAttribute('data-theme', theme);
  updateIcons(theme);
  
  toggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcons(next);
  });
  
  function updateIcons(t: string) {
    document.getElementById('theme-icon-dark')?.classList.toggle('hidden', t === 'dark');
    document.getElementById('theme-icon-light')?.classList.toggle('hidden', t === 'light');
  }
</script>
```

Placer le toggle dans la Navigation, côté droit.

**Important** : ajouter un script inline dans `<head>` pour éviter le flash :

```html
<script is:inline>
  const t = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', t);
</script>
```

### 3. Accents "tech" subtils

- Utiliser `font-mono` (JetBrains Mono) pour les métriques chiffrées (17+, 45, 1400, 250+)
- Ajouter un préfixe `$` ou `>` décoratif devant les titres de section en CSS :

```css
.section-heading::before {
  content: '>';
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-teal);
  margin-right: 0.5rem;
  opacity: 0.6;
}
```

- Badges tech avec style code inline :

```css
.tech-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  background: var(--color-navy-light);
  color: var(--color-teal-light);
  border-radius: 4px;
  border: 1px solid var(--color-border);
}
```

### 4. Staggered reveal animations

```css
.stagger-reveal > * {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeSlideUp 0.5s ease forwards;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}

.stagger-reveal > *:nth-child(1) { animation-delay: 0ms; }
.stagger-reveal > *:nth-child(2) { animation-delay: 80ms; }
.stagger-reveal > *:nth-child(3) { animation-delay: 160ms; }
.stagger-reveal > *:nth-child(4) { animation-delay: 240ms; }
.stagger-reveal > *:nth-child(5) { animation-delay: 320ms; }
.stagger-reveal > *:nth-child(6) { animation-delay: 400ms; }
```

### 5. robots.txt + derniers SEO

Créer `public/robots.txt` :

```
User-agent: *
Allow: /
Sitemap: https://alexandre-berge.fr/sitemap-index.xml
```

### 6. Lighthouse audit final

```bash
npm run build
npx serve dist/ -p 4000

# Dans un autre terminal :
npx lighthouse http://localhost:4000 --output html --output-path ./lighthouse-report.html
```

Objectif : 100/100 sur Performance, Accessibility, Best Practices, SEO.

Corrections typiques pour atteindre 100 :
- `<html lang="fr">` ← vérifier
- Tous les `<img>` ont un `alt`
- Contraste suffisant pour tous les textes (vérifier dark mode aussi)
- Pas de render-blocking resources
- `fetchpriority="high"` sur l'image hero
- `loading="lazy"` sur les images sous le fold

## RÉSULTAT ATTENDU

| Critère | Attendu |
|---------|---------|
| Dark mode toggle fonctionnel | ✅ |
| Détection préférence système | ✅ |
| Pas de flash au chargement (script inline head) | ✅ |
| Persistance du choix dans localStorage | ✅ |
| Métriques en font-mono (JetBrains Mono) | ✅ |
| Animations staggered au scroll | ✅ |
| robots.txt présent | ✅ |
| Lighthouse 100/100 (ou > 95 minimum) | ✅ |
| Accessibilité : contrastes OK en light ET dark | ✅ |

## COMMIT

```bash
git add .
git commit -m "feat: dark mode + animations + polish final

- Dark mode avec toggle, préférence système, persistance localStorage
- Script anti-flash inline dans <head>
- Accents tech : JetBrains Mono pour métriques, > préfixes, tech-tags
- Animations staggered reveal CSS scroll-driven
- robots.txt
- Lighthouse audit : objectif 100/100"

git push origin main
```
````

---

# RÉSUMÉ DU WORKFLOW

```
┌──────────────────────────────────────────────────────────────┐
│  Phase 1 : Migration Astro + Tailwind v4 + GitHub Pages     │
│  → Prompt 1 → Claude Code exécute → Tu valides le build     │
│  → git push → GitHub Actions déploie                         │
├──────────────────────────────────────────────────────────────┤
│  Phase 2 : Scroll vertical + Design + Navigation             │
│  → Prompt 2 → Claude Code exécute → Tu valides le rendu     │
│  → git push → Auto-deploy                                    │
├──────────────────────────────────────────────────────────────┤
│  Phase 3 : Portfolio + SEO + RSS Blogs                       │
│  → Prompt 3 → Claude Code exécute → Tu valides les données  │
│  → git push → Auto-deploy                                    │
├──────────────────────────────────────────────────────────────┤
│  Phase 4 : Dark mode + Animations + Polish                   │
│  → Prompt 4 → Claude Code exécute → Lighthouse 100           │
│  → git push → Auto-deploy → 🎉 TERMINÉ                      │
└──────────────────────────────────────────────────────────────┘
```

### Temps estimé par phase

|Phase|Estimation Claude Code|Ta validation|
|---|---|---|
|Phase 1|~20-30 min|~15 min test|
|Phase 2|~30-45 min|~20 min review UX|
|Phase 3|~20-30 min|~15 min contenu|
|Phase 4|~20-30 min|~15 min Lighthouse|
|**Total**|**~1h30-2h15**|**~1h review**|

### En cas de problème entre phases

Si Claude Code rencontre une erreur :

1. Copie le **message d'erreur complet**
2. Reviens ici avec le contexte
3. Je te génère un **prompt de fix ciblé**
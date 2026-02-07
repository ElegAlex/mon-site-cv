# GUIDE PRATIQUE — Exécuter la refonte avec Claude Code

## Principe

Le fichier `PLAN-REFONTE-CV-SITE.md` contient **4 prompts autonomes** (Phases 1 à 4). Tu les exécutes **un par un**, dans l'ordre, en copiant chaque bloc de prompt dans Claude Code.

```
Phase 1 : Scaffold Astro + Tailwind v4 + GitHub Pages
Phase 2 : Scroll vertical + design + navigation
Phase 3 : Portfolio projets + SEO + blogs RSS
Phase 4 : Dark mode + animations + polish
```

---

## Workflow concret

### Étape 0 — Préparer le repo

```bash
# Cloner ton repo actuel
git clone git@github.com:ElegAlex/mon-site-cv.git
cd mon-site-cv

# Créer une branche de refonte
git checkout -b refonte-astro

# Vérifier les prérequis
node --version    # >= 22.x
npm --version     # >= 10.x
```

### Étape 1 — Lancer Claude Code sur la Phase 1

```bash
# Depuis le répertoire du repo
claude
```

Puis dans le terminal Claude Code, colle **uniquement le prompt de la Phase 1** (le bloc entre les ` ```` ` dans le plan, de "# MIGRATION SITE CV VERS ASTRO + TAILWIND V4" jusqu'au ```` ` de fermeture).

Claude Code va :

1. Scaffolder le projet Astro
2. Installer Tailwind v4
3. Migrer les composants
4. Créer le workflow GitHub Actions

### Étape 2 — Valider avant de continuer

```bash
# Vérifier que ça tourne
npm run dev
# Ouvrir http://localhost:4321

# Si OK, committer
git add .
git commit -m "feat: migration Astro + Tailwind v4"
```

**Si erreur** → copie le message d'erreur dans Claude Code, il corrigera.

### Étape 3 — Enchaîner les phases

Répète le même processus pour chaque phase :

1. Copie le prompt de la Phase N dans Claude Code
2. Laisse-le exécuter
3. Teste (`npm run dev`)
4. Commit + push

### Étape 4 — Déployer

```bash
# Pousser la branche
git push origin refonte-astro

# Créer une PR ou merger directement
git checkout main
git merge refonte-astro
git push origin main

# GitHub Actions déploie automatiquement sur GitHub Pages
```

---

## Astuce : le fichier CLAUDE.md

Pour que Claude Code ait toujours le contexte, crée un fichier `.claude/CLAUDE.md` à la racine du repo :

```markdown
# Contexte Projet

## Site CV/Portfolio — alexandre-berge.fr

Site personnel d'Alexandre Berge, Responsable Département Informatique
à la CPAM des Hauts-de-Seine (Nanterre).

Stack : Astro + Tailwind CSS v4 + GitHub Pages
Design : Scroll vertical, palette navy/teal/amber
Typographie : Bricolage Grotesque (titres) + DM Sans (corps) + JetBrains Mono (code)

## Audiences
1. Recruteurs (scan rapide)
2. Pairs IT / DSI (profondeur technique)
3. Organisateurs de conférences

## Projets showcasés
- DepotDoc (depotdoc.fr) — 360k utilisations/an, 30% réseau national
- Orchestr-A (GitHub) — Gestion projets collectivités, NestJS + Next.js
- OPSTRACKER (GitHub) — Monitoring helpdesk, Symfony + PostgreSQL

## Blogs externes
- elegartech.fr — Veille tech, open source, IA
- communs-numeriques.fr — Communs numériques, recherche

## Règles
- Pas de CDN Tailwind — build Vite uniquement
- Accessibilité : ARIA, contrastes, clavier
- Lighthouse cible : 100/100
- Langue : FR (html lang="fr")
```

Ce fichier sera lu automatiquement par Claude Code à chaque session, lui évitant de repartir de zéro.

---

## FAQ

**Q : Et si Claude Code plante en plein milieu d'une phase ?** → Relance-le dans le même répertoire. Il verra l'état du code et pourra reprendre.

**Q : Je peux sauter des phases ?** → Non. Phase 1 est la fondation (Astro). Les phases suivantes en dépendent.

**Q : Combien de temps par phase ?** → Phase 1 : ~30min | Phase 2 : ~45min | Phase 3 : ~30min | Phase 4 : ~30min

**Q : Mon site actuel continuera de marcher pendant la migration ?** → Oui, tu travailles sur une branche `refonte-astro`. Le site live ne change pas tant que tu ne merges pas sur `main`.
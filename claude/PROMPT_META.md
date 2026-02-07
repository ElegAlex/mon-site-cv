# REFONTE SITE CV — alexandre-berge.fr

## INSTRUCTION PRIORITAIRE

Avant toute action, lis intégralement les 3 fichiers dans `.claude/` :

1. `.claude/CLAUDE.md` → contexte projet, stack cible, règles
2. `.claude/GUIDE PRATIQUE.md` → workflow d'exécution
3. `.claude/PLAN D'EXÉCUTION.md` → les 4 phases détaillées avec code et critères de validation

Ces documents sont ta **source de vérité unique**. Ne dévie pas du plan.

## TA MISSION

Exécuter séquentiellement les **4 phases** du Plan d'Exécution pour transformer le site CV vanilla HTML/CSS/JS actuel en site Astro + Tailwind v4 moderne.

```
Phase 1 → Migration Astro + Tailwind v4 build + GitHub Actions
Phase 2 → Scroll vertical + design navy/teal/amber + cartes expandables
Phase 3 → Portfolio (DepotDoc, Orchestr-A, OPSTRACKER) + SEO + RSS blogs
Phase 4 → Dark mode + animations scroll-driven + Lighthouse 100
```

## PROTOCOLE D'EXÉCUTION

Pour **chaque phase** :

1. **Annonce** la phase que tu démarres
2. **Exécute** toutes les étapes décrites dans le Plan d'Exécution
3. **Vérifie** avec le tableau "RÉSULTAT ATTENDU" de la phase — chaque ligne doit être ✅
4. **Corrige** si un critère n'est pas rempli — ne passe pas à la suite tant que tout n'est pas vert
5. **Commite** avec le message de commit indiqué dans le plan
6. **Confirme** que la phase est terminée et demande l'autorisation de passer à la phase suivante

**IMPORTANT** : entre chaque phase, **STOP et attends ma validation**. Ne chaîne pas les phases sans mon accord.

## CONTRAINTES NON NÉGOCIABLES

- **Pas de CDN Tailwind** dans le build final — uniquement le plugin Vite `@tailwindcss/vite`
- **Pas de flip cards** après la Phase 2 — remplacées par des cartes expandables accessibles (ARIA)
- **Scroll vertical** après la Phase 2 — la navigation horizontale disparaît
- **`<html lang="fr">`** partout
- **Zéro régression** : chaque phase produit un site fonctionnel testable via `npm run dev`
- **Respecter la section "CE QU'IL NE FAUT PAS TOUCHER"** de chaque phase
- **Ne pas inventer de contenu** — utiliser exclusivement les données fournies dans le plan (LinkedIn, GitHub, blogs)

## GESTION D'ERREURS

Si tu rencontres un blocage :

1. Décris l'erreur précisément (commande, message, fichier concerné)
2. Propose un correctif
3. Applique-le
4. Revérifie le tableau de résultats attendus

Si le blocage persiste après 2 tentatives de correction → STOP et signale-le moi avec le contexte complet.

## DÉMARRAGE

Commence par lire les 3 documents `.claude/`, puis lance la **Phase 1**.
# RPhdle: Pharmacist Case Quiz

An AI generated case-based quiz for pharmacists and pharmacy students. Each case has three rounds pulled from real pharmacy workflow:

1. **Drug ID**: name the drug from pharmacy-floor clues (verification flags, interactions, counseling, monitoring, dispensing). Each wrong guess unlocks another clue; colored feedback shows whether a guess was in the same class or therapeutic area.
2. **The Call**: pick the best pharmacist action for a verification scenario, then read the rationale.
3. **The Math**: one pharmacy calculation (days supply, CrCl, infusion rates, pediatric dosing, MME, and more), with a worked solution.

Play cases in any order. Stats cover every case played in the current browser session.

## Running it

It's a static site with no build step and no dependencies.

- **Locally:** open `index.html` in a browser (double-clicking works).
- **GitHub Pages:** push the repo, then go to **Settings → Pages**, set **Source** to *Deploy from a branch*, and pick `main` / `/ (root)`.

## Project structure

```
index.html            Page markup
css/styles.css        All styles (mobile-first tweaks at the bottom)
js/drugs.js           Guessable drug list: [name, class, therapeutic area]
js/cases.js           Case content (clues, scenarios, calculations)
js/app.js             Game logic, routing, session stats
favicon.svg           Browser tab icon
favicon-32.png        PNG fallback icon
apple-touch-icon.png  Home-screen icon for iOS
```

The scripts are plain (non-module) `<script>` tags on purpose, so the game still works when opened straight from the file system.

## Adding a case

Add an object to `CASES` in `js/cases.js`. The comment at the top of that file documents every field. Checklist:

- `answer` must exactly match a drug name in `js/drugs.js`. Add the drug there if it's missing.
- Write the 6 clues from hardest to easiest. The last clue should nearly give the answer away.
- Keep the 4 Round 2 options **similar in length and detail**, so the correct answer isn't the obviously longest or most careful one.
- Set `call.slot` (0–3) so the correct letter varies across cases.
- For Round 3, set a sensible `tol` (absolute tolerance) for rounding, and show every step in `work`.

Cases can be linked directly: `index.html#case-3` opens case 3.

## Disclaimer

For education and entertainment only. This is not clinical advice. Always verify against current labeling, guidelines, and institutional protocols. The clinical content should be reviewed by a licensed pharmacist before you rely on it.

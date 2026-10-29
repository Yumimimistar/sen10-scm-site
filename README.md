# SEN10 · Software Configuration Management site

Static site (HTML/CSS/JS) built from the SEN10 SCM lecture deck, deployed to GitHub Pages by GitHub Actions. Lint and Jest tests must both pass before anything is deployed.

## Pipeline

```
push to main ──► lint (ESLint) ──► test (Jest) ──► package (dist/) ──► deploy (Pages)
                    │                  │
                    └─ fail? everything after it is skipped
```

| Job | What it does |
|---|---|
| `lint` | `npm ci`, then `npm run lint` (ESLint on `js/` and `tests/`) |
| `test` | Runs after `lint`. `npm test` runs the Jest suite |
| `build` | Needs `lint` and `test`. Copies `index.html`, `css/`, `js/` into `dist/` |
| `deploy` | Publishes the artifact to GitHub Pages |

## The on-load function

`js/stamp.js` adds a **configuration baseline stamp**. When the page loads, `main.js` calls `ConfigStamp.stampPage()`, which writes this page's own configuration ID (using the PP.CC.RRR.VVV.TT.FF naming model from the lecture) and the load time into the footer:

```
Baseline SC.PH.002.001.WB.HT · loaded 2026-10-29 14:05 UTC
```

The helpers are pure functions, so Jest tests them in Node (`tests/stamp.test.js`, 7 tests).

## Demonstrate a failing test, then a passing test

1. In `js/stamp.js`, change `].join(".");` to `].join("-");` (line 27).
2. Commit and push. `JS lint` passes, `Jest tests` fails (expected `SC.PH.002.001.WB.HT`, received `SC-PH-002-001-WB-HT`), and `Package site` and `Publish` are skipped.
3. Change it back to `].join(".");`, commit and push. All jobs pass and the site redeploys.

Run locally: `npm install`, then `npm run lint` and `npm test`.

## Files

| Path | Purpose |
|---|---|
| `index.html`, `css/style.css`, `js/main.js` | The site |
| `js/stamp.js` | On-load baseline stamp function |
| `tests/stamp.test.js` | Jest tests |
| `eslint.config.mjs` | Lint rules |
| `.github/workflows/deploy.yml` | CI/CD workflow |
| `PROMPTS.md` | LLM prompts used (for submission) |

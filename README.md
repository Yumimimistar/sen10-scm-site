# SEN10 · Software Configuration Management site

Static site (HTML/CSS/JS) built from the SEN10 SCM lecture deck, deployed to GitHub Pages by GitHub Actions.

## Pipeline

```
push to main ──► lint (ESLint) ──► package (dist/) ──► deploy (GitHub Pages)
                    │
                    └─ fails? deploy is skipped
```

| Job | What it does |
|---|---|
| `lint` | `npm ci`, then `npm run lint` (ESLint, rule `semi: always` and others) |
| `build` | Copies `index.html`, `css/`, `js/` into `dist/` and uploads it as the Pages artifact |
| `deploy` | Publishes the artifact. Runs only if `build` (and so `lint`) passed |

## Test the lint gate

1. In `js/main.js`, delete the semicolon at the end of `return document.getElementById(id);` (line 85).
2. Commit and push. The `lint` job fails with `Missing semicolon  semi` and `build`/`deploy` are skipped.
3. Put the semicolon back, push again. All three jobs pass and the site redeploys.

Run it locally first: `npm install` then `npm run lint`.

## Files

| Path | Purpose |
|---|---|
| `index.html`, `css/style.css`, `js/main.js` | The site |
| `eslint.config.mjs` | Lint rules |
| `.github/workflows/deploy.yml` | CI/CD workflow |
| `PROMPTS.md` | LLM prompts used (for submission) |

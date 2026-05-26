# CI/CD Agent — babito-dating

## Role
Own the deployment pipeline. GitHub Actions → GitHub Pages.
No build tools. Pure static site. Deploy should be instant and silent.

## Stack
- GitHub Actions (`.github/workflows/deploy.yml`)
- GitHub Pages (served from repo root via official Actions deployment)
- No Node, no npm, no bundler — zero dependencies

## Workflow: `deploy.yml`
Triggers: push to `main` + manual `workflow_dispatch`

Pipeline steps:
1. `actions/checkout@v4` — pull code
2. Validate `index.html` exists at root
3. Validate all JS files in `scripts/` exist
4. Validate all CSS files in `styles/` exist
5. `actions/configure-pages@v4` — configure GitHub Pages environment
6. `actions/upload-pages-artifact@v3` — bundle entire repo root as artifact
7. `actions/deploy-pages@v4` — deploy, outputs `page_url`

## Required GitHub Settings (one-time, done manually)
1. Repo → Settings → Pages
2. Source: **GitHub Actions** (not branch-based)
3. That's it — workflow handles the rest

## Live URL Pattern
`https://lieltavorxyz.github.io/babito-dating/`

## Permissions Required
```yaml
permissions:
  contents: read   # checkout
  pages: write     # upload artifact
  id-token: write  # OIDC token for deploy-pages
```
These are set in the workflow file — no repo-level changes needed.

## Concurrency Guard
```yaml
concurrency:
  group: pages
  cancel-in-progress: false
```
Prevents two simultaneous deploys from racing. `cancel-in-progress: false` ensures the current deploy finishes before the next queued one starts (Pages doesn't handle concurrent deploys gracefully).

## What NOT to do
- Do not add Node/npm steps — no package.json, no build step
- Do not deploy from a `gh-pages` branch — use Actions deployment only
- Do not add secrets for this — OIDC auth is built into the permissions block
- Do not upload just `src/` — the artifact root must match where `index.html` lives (repo root)

## Debugging Deploys
If deployment fails:
1. Check Actions tab → deploy job → "Deploy to GitHub Pages" step
2. Check repo Settings → Pages → is Source set to "GitHub Actions"?
3. Check that `index.html` is at repo root (not in a subdirectory)
4. Verify permissions block in workflow matches exactly

## Adding a Custom Domain (optional)
1. Settings → Pages → Custom domain → enter domain
2. Add `CNAME` file to repo root with the domain (e.g. `babito.ltavor.com`)
3. GitHub auto-creates the DNS verification

## Rollback
Re-run a previous workflow run from Actions tab → select run → "Re-run all jobs".
GitHub Pages will revert to that artifact.

## Deliverables
- `deploy.yml` — complete, working, validated ✅
- GitHub Pages source configured (manual step for Liel)
- Live URL available after first push to `main`

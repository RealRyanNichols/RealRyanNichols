# Moving The Lead Flow Pro into its own repo

Built inside `realryannichols/realryannichols` due to tool-scope constraints. Move any time.

## Option A — quick copy (no git history)

```bash
cp -R theleadflowpro ../theleadflowpro-new
cd ../theleadflowpro-new
rm -rf .git
git init
git add .
git commit -m "initial commit"
# Create empty repo 'theleadflowpro' on GitHub
git remote add origin git@github.com:<you>/theleadflowpro.git
git branch -M main
git push -u origin main
```

## Option B — keep git history (git subtree)

```bash
git subtree split --prefix=theleadflowpro -b theleadflowpro-split
git push git@github.com:<you>/theleadflowpro.git theleadflowpro-split:main
```

## After

- Import the new repo in Vercel (see `docs/deploy.md`)
- Copy env vars
- Optionally delete `theleadflowpro/` from this repo

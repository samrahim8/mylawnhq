# Push your code to the GitHub repo

Run these commands from your project folder.

## If you DON'T have a .git folder in your project yet:

```bash
git init
git remote add origin https://github.com/mylawnhq/mylawnhq.git
git add .
git commit -m "initial codebase"
git branch -M main
git push -u origin main --force
```

## If you already HAVE a .git folder (from Netlify setup):

```bash
git remote set-url origin https://github.com/mylawnhq/mylawnhq.git
git add .
git commit -m "initial codebase"
git push -u origin main --force
```

## If you get an authentication error:

```bash
brew install gh
gh auth login
```

Then re-run the push command.

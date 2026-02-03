#!/bin/bash

echo "Pushing your code to the GitHub repo..."

if [ -d ".git" ]; then
  git remote set-url origin https://github.com/mylawnhq/mylawnhq.git 2>/dev/null || git remote add origin https://github.com/mylawnhq/mylawnhq.git
else
  git init
  git remote add origin https://github.com/mylawnhq/mylawnhq.git
fi

git add .
git commit -m "initial codebase"
git branch -M main
git push -u origin main --force

echo ""
echo "Done! Code has been pushed to https://github.com/mylawnhq/mylawnhq"

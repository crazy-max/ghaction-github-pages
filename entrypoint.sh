#!/bin/sh
set -e

if [ -z "$INPUT_TARGET_BRANCH" ]; then
  echo "⛔️ Target branch not defined"
  exit 1
fi
if [ ! -d "$INPUT_BUILD_DIR" ]; then
  echo "⛔️ Build dir does not exist"
  exit 1
fi

echo "🏃 Deploying $INPUT_BUILD_DIR directory to $INPUT_TARGET_BRANCH branch"
cd "$INPUT_BUILD_DIR"

git init
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git add .
git commit --allow-empty -m 'Deploy to GitHub pages'
git push --force --quiet https://${GITHUB_PAT:-"x-access-token:$GITHUB_TOKEN"}@github.com/${GITHUB_REPOSITORY}.git master:${INPUT_TARGET_BRANCH}
rm -rf .git

cd "$GITHUB_WORKSPACE"
echo "🎉 Content of $INPUT_BUILD_DIR has been deployed to GitHub Pages."

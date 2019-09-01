#!/bin/sh
set -e

TARGET_BRANCH=$1
BUILD_DIR=$2

if [ -z "$TARGET_BRANCH" ]; then
  echo "⛔️ Target branch not defined"
  exit 1
fi
if [ ! -d "$BUILD_DIR" ]; then
  echo "⛔️ Build dir does not exist"
  exit 1
fi

echo "🏃 Deploying $BUILD_DIR directory to $TARGET_BRANCH branch"
cd "$BUILD_DIR"

git init
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git add .
git commit --allow-empty -m 'Deploy to GitHub pages'
git push --force --quiet https://${GITHUB_PAT:-"x-access-token:$GITHUB_TOKEN"}@github.com/${GITHUB_REPOSITORY}.git master:$TARGET_BRANCH
rm -rf .git

cd "$GITHUB_WORKSPACE"
echo "🎉 Content of $BUILD_DIR has been deployed to GitHub Pages."

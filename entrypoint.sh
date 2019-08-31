#!/bin/sh
set -e

BUILD_DIR=$1
if [ ! -d "$BUILD_DIR" ]; then
  echo "⛔️ Build dir does not exist"
  exit 1
fi
echo "cd $BUILD_DIR"
cd "$BUILD_DIR"

REPO="https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
OWNER="$(echo $GITHUB_REPOSITORY | cut -d'/' -f 1)"
REPONAME="$(echo $GITHUB_REPOSITORY | cut -d'/' -f 2)"
PAGES_REPO="${OWNER}.github.io"

if [[ "$REPONAME" == "$PAGES_REPO" ]]; then
  TARGET_BRANCH="master"
else
  TARGET_BRANCH="gh-pages"
fi

: "${REMOTE_BRANCH:=$TARGET_BRANCH}"

git init
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"

if [ -z "$(git status --porcelain)" ]; then
  echo "⚠️ Nothing to publish"
  exit 0
fi

git remote rm origin || true
git remote add origin "${REPO}"
git add .
git commit --allow-empty -m 'Deploy to GitHub pages'
git push --force --quiet "$REPO" $REMOTE_BRANCH
rm -rf .git

cd "$GITHUB_WORKSPACE"
echo "🎉 Content of $BUILD_DIR has been deployed to GitHub Pages."

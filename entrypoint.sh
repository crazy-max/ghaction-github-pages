#!/bin/sh
set -e

REPO=${INPUT_REPO:-$GITHUB_REPOSITORY}

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
git push --force --quiet "https://${GITHUB_PAT:-"x-access-token:$GITHUB_TOKEN"}@github.com/${REPO}.git" "master:${INPUT_TARGET_BRANCH}"
rm -rf .git

# Tried https://developer.github.com/v3/repos/pages/#request-a-page-build
# but not working: { "message": "Resource not accessible by integration", "documentation_url": "https://developer.github.com/v3/repos/pages/#request-a-page-build" }
# curl -XPOST -H"Authorization: token ${GITHUB_TOKEN}" -H"Accept: application/vnd.github.mister-fantastic-preview+json" https://api.github.com/repos/${GITHUB_REPOSITORY}/pages/builds

cd "$GITHUB_WORKSPACE"
echo "🎉 Content of $INPUT_BUILD_DIR has been deployed to GitHub Pages."

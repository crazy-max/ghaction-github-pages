FROM alpine/git:latest

# https://help.github.com/en/articles/metadata-syntax-for-github-actions#about-yaml-syntax-for-github-actions
LABEL version="0.1.0" \
  repository="https://github.com/crazy-max/ghaction-github-pages" \
  homepage="https://github.com/crazy-max/ghaction-github-pages" \
  maintainer="CrazyMax" \
  "com.github.actions.name"="GitHub Pages" \
  "com.github.actions.description"="GitHub Action for deploying GitHub Pages" \
  "com.github.actions.icon"="package" \
  "com.github.actions.color"="green"

COPY entrypoint.sh LICENSE README.md /
ENTRYPOINT [ "/entrypoint.sh" ]

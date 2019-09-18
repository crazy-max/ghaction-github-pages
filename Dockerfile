FROM alpine:latest

ARG VERSION

# https://help.github.com/en/articles/metadata-syntax-for-github-actions#about-yaml-syntax-for-github-actions
LABEL version="$VERSION" \
  repository="https://github.com/crazy-max/ghaction-github-pages" \
  homepage="https://github.com/crazy-max/ghaction-github-pages" \
  maintainer="CrazyMax" \
  "com.github.actions.name"="GitHub Pages" \
  "com.github.actions.description"="GitHub Action for deploying GitHub Pages" \
  "com.github.actions.icon"="upload-cloud" \
  "com.github.actions.color"="green"

RUN apk --update --no-cache add \
    curl \
    git \
  && rm -rf /var/cache/apk/* /tmp/*

COPY LICENSE README.md /
ADD entrypoint.sh /
ENTRYPOINT [ "/entrypoint.sh" ]

[![GitHub release](https://img.shields.io/github/release/crazy-max/ghaction-github-pages.svg?style=flat-square)](https://github.com/crazy-max/ghaction-github-pages/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-github--pages-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/github-pages)
[![Test workflow](https://github.com/crazy-max/ghaction-github-pages/workflows/test/badge.svg)](https://github.com/crazy-max/ghaction-github-pages/actions)
[![Support me on Patreon](https://img.shields.io/badge/donate-patreon-f96854.svg?logo=patreon&style=flat-square)](https://www.patreon.com/crazymax) 
[![Paypal Donate](https://img.shields.io/badge/donate-paypal-00457c.svg?logo=paypal&style=flat-square)](https://www.paypal.me/crazyws)

## ✨ About

A GitHub Action for deploying GitHub Pages

> **:warning: Note:** To use this action, you must have access to the [GitHub Actions](https://github.com/features/actions) feature. GitHub Actions are currently only available in public beta. You can [apply for the GitHub Actions beta here](https://github.com/features/actions/signup/).

## 🚀 Usage

Below is a simple snippet to deploy to GitHub Pages. A [live example](https://github.com/crazy-max/ghaction-github-pages/actions) is also available for this repository.

```yaml
name: website

on: push

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      -
        name: Checkout
        uses: actions/checkout@v1
      -
        name: Build
        run: |
          mkdir public
          cat > public/index.html <<EOL
          <!doctype html>
          <html>
            <head>
              <title>GitHub Pages deployed!</title>
            </head>
            <body>
              <p>GitHub Pages with <strong>${{ github.sha }}</strong> commit ID has been deployed through <a href="https://github.com/marketplace/actions/github-pages">GitHub Pages action</a> successfully.</p>
            </body>
          </html>
          EOL
      -
        name: Deploy
        if: success()
        uses: crazy-max/ghaction-github-pages@v1
        with:
          target_branch: gh-pages
          build_dir: public
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 💅 Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name            | Type    | Description                                                                                        |
|-----------------|---------|----------------------------------------------------------------------------------------------------|
| `repo`          | String  | GitHub repository where assets will be deployed (default current). Eg: portapps/portapps.github.io |
| `target_branch` | String  | Git branch where assets will be deployed (default `gh-pages`)                                      |
| `build_dir`     | String  | Build directory to deploy                                                                          |

### environment variables

Following environment variables can be used as `step.env` keys

| Name           | Description                          |
|----------------|--------------------------------------|
| `GITHUB_TOKEN` | GITHUB_TOKEN as provided by `secrets`|
| `GITHUB_PAT`   | [Personal Access Token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) (see Limitation section below)|

## :warning: Limitation

Currently, `GITHUB_TOKEN` does not suffice to trigger a page build on a **public repository** (propagate content to the GitHub content-delivery network). You must therefore create a custom [Personal Access Token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) and use it through the `GITHUB_PAT` environment variable:

```yaml
- name: Deploy
  if: success()
  uses: crazy-max/ghaction-github-pages@v1
  with:
    target_branch: gh-pages
    build_dir: public
  env:
    GITHUB_PAT: ${{ secrets.GITHUB_PAT }}
```

## 🤝 How can I help ?

All kinds of contributions are welcome :raised_hands:!<br />
The most basic way to show your support is to star :star2: the project, or to raise issues :speech_balloon:<br />
But we're not gonna lie to each other, I'd rather you buy me a beer or two :beers:!

[![Support me on Patreon](.res/patreon.png)](https://www.patreon.com/crazymax) 
[![Paypal Donate](.res/paypal.png)](https://www.paypal.me/crazyws)

## 📝 License

MIT. See `LICENSE` for more details.

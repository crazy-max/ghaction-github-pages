[![Support me on Patreon](https://img.shields.io/badge/donate-patreon-f96854.svg?logo=patreon&style=flat-square)](https://www.patreon.com/crazymax) 
[![Paypal Donate](https://img.shields.io/badge/donate-paypal-00457c.svg?logo=paypal&style=flat-square)](https://www.paypal.me/crazyws)

## ✨ About

A GitHub Action for deploying GitHub Pages

> **:warning: Note:** To use this action, you must have access to the [GitHub Actions](https://github.com/features/actions) feature. GitHub Actions are currently only available in public beta. You can [apply for the GitHub Actions beta here](https://github.com/features/actions/signup/).

## 🚀 Usage

Below is a simple to deploy to GitHub Pages:

```yaml
name: website

on: push

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      -
        name: Checkout
        uses: actions/checkout@master
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
              <p>GitHub Pages with <strong>${{ github.sha }}</strong> commit ID has been deployed through <a href="">GitHub Pages action</a> successfully.</p>
            </body>
          </html>
          EOL
      -
        name: Deploy
        if: success()
        uses: crazy-max/ghaction-github-pages@master
        with:
          target_branch: gh-pages
          build_dir: public
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 💅 Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name            | Type    | Description                                                     |
|-----------------|---------|-----------------------------------------------------------------|
| `target_branch` | String  | Git branch where assets will be deployed (default `gh-pages`)   |
| `build_dir`     | String  | Path to build directory to deploy                               |

### environment variables

The following are *required* as `step.env` keys

| Name           | Description                          |
|----------------|--------------------------------------|
| `GITHUB_TOKEN` | GITHUB_TOKEN as provided by `secrets`|

## 🤝 How can I help ?

All kinds of contributions are welcome :raised_hands:!<br />
The most basic way to show your support is to star :star2: the project, or to raise issues :speech_balloon:<br />
But we're not gonna lie to each other, I'd rather you buy me a beer or two :beers:!

[![Support me on Patreon](.res/patreon.png)](https://www.patreon.com/crazymax) 
[![Paypal Donate](.res/paypal-donate.png)](https://www.paypal.me/crazyws)

## 📝 License

MIT. See `LICENSE` for more details.

[![GitHub release](https://img.shields.io/github/release/crazy-max/ghaction-github-pages.svg?style=flat-square)](https://github.com/crazy-max/ghaction-github-pages/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-github--pages-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/github-pages)
[![Test workflow](https://github.com/crazy-max/ghaction-github-pages/workflows/test/badge.svg)](https://github.com/crazy-max/ghaction-github-pages/actions)
[![Become a sponsor](https://img.shields.io/badge/sponsor-crazy--max-181717.svg?logo=github&style=flat-square)](https://github.com/sponsors/crazy-max)
[![Paypal Donate](https://img.shields.io/badge/donate-paypal-00457c.svg?logo=paypal&style=flat-square)](https://www.paypal.me/crazyws)

## About

A GitHub Action to deploy to GitHub Pages

If you are interested, [check out](https://git.io/Je09Y) my other :octocat: GitHub Actions!

## Usage

Below is a simple snippet to deploy to GitHub Pages. A [test workflow](https://github.com/crazy-max/ghaction-github-pages/actions?query=workflow%3Atest) is also available for this repository and [deploys to GitHub pages](https://crazy-max.github.io/ghaction-github-pages/).

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

## Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name                 | Type    | Description                                                                 |
|----------------------|---------|-----------------------------------------------------------------------------|
| `repo`               | String  | GitHub repository where assets will be deployed (default current)           |
| `target_branch`      | String  | Git branch where assets will be deployed (default `gh-pages`)               |
| `keep_history`       | Bool    | Create incremental commit instead of doing push force (default `false`)     |
| `allow_empty_commit` | Bool    | Allow an empty commit to be created (default `true`)                        |
| `build_dir`          | String  | Build directory to deploy (**required**)                                    |
| `committer_name`     | String  | Commit author's name  (default [GITHUB_ACTOR](https://help.github.com/en/github/automating-your-workflow-with-github-actions/using-environment-variables#default-environment-variables) or `github-actions`) |
| `committer_email`    | String  | Commit author's email (default `<committer_name>@users.noreply.github.com`) |
| `commit_message`     | String  | Commit message (default `Deploy to GitHub pages`)                           |
| `fqdn`               | String  | Write the given domain name to the CNAME file                               |

### environment variables

Following environment variables can be used as `step.env` keys

| Name           | Description                           |
|----------------|---------------------------------------|
| `GITHUB_TOKEN` | [GITHUB_TOKEN](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token) as provided by `secrets` |

## How can I help?

All kinds of contributions are welcome :raised_hands:! The most basic way to show your support is to star :star2: the project, or to raise issues :speech_balloon: You can also support this project by [**becoming a sponsor on GitHub**](https://github.com/sponsors/crazy-max) :clap: or by making a [Paypal donation](https://www.paypal.me/crazyws) to ensure this journey continues indefinitely! :rocket:

Thanks again for your support, it is much appreciated! :pray:

## License

MIT. See `LICENSE` for more details.

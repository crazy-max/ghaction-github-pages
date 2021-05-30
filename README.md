[![GitHub release](https://img.shields.io/github/release/crazy-max/ghaction-github-pages.svg?style=flat-square)](https://github.com/crazy-max/ghaction-github-pages/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-github--pages-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/github-pages)
[![CI workflow](https://img.shields.io/github/workflow/status/crazy-max/ghaction-github-pages/ci?label=ci&logo=github&style=flat-square)](https://github.com/crazy-max/ghaction-github-pages/actions?workflow=ci)
[![Become a sponsor](https://img.shields.io/badge/sponsor-crazy--max-181717.svg?logo=github&style=flat-square)](https://github.com/sponsors/crazy-max)
[![Paypal Donate](https://img.shields.io/badge/donate-paypal-00457c.svg?logo=paypal&style=flat-square)](https://www.paypal.me/crazyws)

## About

A GitHub Action to deploy to GitHub Pages

If you are interested, [check out](https://git.io/Je09Y) my other :octocat: GitHub Actions!

![GitHub Pages](.github/ghaction-github-pages.png)

___

* [Usage](#usage)
  * [Workflow](#workflow)
  * [Sign commits](#sign-commits)
  * [Check availability of GitHub Pages](#check-availability-of-github-pages)
* [Customizing](#customizing)
  * [inputs](#inputs)
  * [environment variables](#environment-variables)
* [Keep up-to-date with GitHub Dependabot](#keep-up-to-date-with-github-dependabot)
* [How can I help?](#how-can-i-help)
* [License](#license)

## Usage

### Workflow

Below is a simple snippet to deploy to GitHub Pages with a dummy HTML page.

A [workflow](https://github.com/crazy-max/ghaction-github-pages/actions?query=workflow%3Aci) is also available for
this repository and deploys [everyday to GitHub pages](https://crazy-max.github.io/ghaction-github-pages/).

```yaml
name: website

on: push

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      -
        name: Checkout
        uses: actions/checkout@v2
      -
        name: Gen dummy page
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
        name: Deploy to GitHub Pages
        if: success()
        uses: crazy-max/ghaction-github-pages@v2
        with:
          target_branch: gh-pages
          build_dir: public
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Sign commits

You can use the [Import GPG](https://github.com/crazy-max/ghaction-import-gpg) GitHub Action along with this one to
sign commits:

```yaml
      -
        name: Import GPG key
        uses: crazy-max/ghaction-import-gpg@v3
        with:
          gpg-private-key: ${{ secrets.GPG_PRIVATE_KEY }}
          passphrase: ${{ secrets.PASSPHRASE }}
          git-user-signingkey: true
          git-commit-gpgsign: true
      -
        name: Deploy to GitHub Pages
        if: success()
        uses: crazy-max/ghaction-github-pages@v2
        with:
          target_branch: gh-pages
          build_dir: public
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Check availability of GitHub Pages

You can use the [GitHub Status](https://github.com/crazy-max/ghaction-github-status) Action along with this one to
check availability of GitHub Pages before deploying:

```yaml
      -
        name: Check GitHub Pages status
        uses: crazy-max/ghaction-github-status@v2
        with:
          pages_threshold: major_outage
      -
        name: Deploy to GitHub Pages
        if: success()
        uses: crazy-max/ghaction-github-pages@v2
        with:
          target_branch: gh-pages
          build_dir: public
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name                 | Type    | Description                                                                    |
|----------------------|---------|--------------------------------------------------------------------------------|
| `domain`             | String  | Git domain (default `github.com`)                                              |
| `repo`               | String  | GitHub repository where assets will be deployed (default `$GITHUB_REPOSITORY`) |
| `target_branch`      | String  | Git branch where assets will be deployed (default `gh-pages`)                  |
| `keep_history`       | Bool    | Create incremental commit instead of doing push force (default `false`)        |
| `allow_empty_commit` | Bool    | Allow an empty commit to be created (default `true`)                           |
| `build_dir`          | String  | Build directory to deploy (**required**)                                       |
| `committer`          | String  | Committer name and email address as `Display Name <joe@foo.bar>` (defaults to the GitHub Actions bot user) |
| `author`             | String  | Author name and email address as `Display Name <joe@foo.bar>` (defaults to the GitHub Actions bot user) |
| `commit_message`     | String  | Commit message (default `Deploy to GitHub pages`)                              |
| `fqdn`               | String  | Write the given domain name to the CNAME file                                  |
| `jekyll`             | Bool    | Allow Jekyll to build your site (default `true`)                               |
| `dry_run`            | Bool    | If enabled, nothing will be pushed (default `false`)                           |
| `verbose`            | Bool    | Enable verbose output (default `false`)                                        |

### environment variables

Following environment variables can be used as `step.env` keys

| Name           | Description                           |
|----------------|---------------------------------------|
| `GITHUB_TOKEN` | [GITHUB_TOKEN](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token) as provided by `secrets` |
| `GH_PAT`       | Use a [Personal Access Token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) if you want to deploy to another repo |

## Keep up-to-date with GitHub Dependabot

Since [Dependabot](https://docs.github.com/en/github/administering-a-repository/keeping-your-actions-up-to-date-with-github-dependabot)
has [native GitHub Actions support](https://docs.github.com/en/github/administering-a-repository/configuration-options-for-dependency-updates#package-ecosystem),
to enable it on your GitHub repo all you need to do is add the `.github/dependabot.yml` file:

```yaml
version: 2
updates:
  # Maintain dependencies for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "daily"
```

## How can I help?

All kinds of contributions are welcome :raised_hands:! The most basic way to show your support is to star :star2:
the project, or to raise issues :speech_balloon: You can also support this project by
[**becoming a sponsor on GitHub**](https://github.com/sponsors/crazy-max) :clap: or by making a
[Paypal donation](https://www.paypal.me/crazyws) to ensure this journey continues indefinitely! :rocket:

Thanks again for your support, it is much appreciated! :pray:

## License

MIT. See `LICENSE` for more details.

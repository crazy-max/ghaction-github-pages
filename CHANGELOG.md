# Changelog

## 2.4.1 (2021/05/13)

* Verbose output

## 2.4.0 (2021/05/13)

* Add `dry-run` input (#144)
* Refactor logging output
* Bump fs-extra from 9.1.0 to 10.0.0 (#139)
* Bump @actions/core from 1.2.6 to 1.2.7 (#137)
* Enhance workflow (#136)

## 2.3.0 (2021/03/16)

* Bring back copySync (#135)
* Container based developer flow (#134)
* Add `domain` input (#133)

## 2.2.0 (2020/11/12)

* Use native copy (#129)
* Warning message on unresolved symlinks
* Show diff

## 2.1.3 (2020/10/01)

* Fix CVE-2020-15228

## 2.1.2 (2020/08/06)

* Dereference symlinks (#121)

## 2.1.1 (2020/07/19)

* Fix cloning repo log

## 2.1.0 (2020/06/25)

* Add jekyll input option (#116)

## 2.0.1 (2020/05/24)

* Check availability of GitHub Pages through [GitHub Status](https://github.com/crazy-max/ghaction-github-status) Action
* Update deps

## 2.0.0 (2020/05/11)

* Add ability to sign commits through [Import GPG](https://github.com/crazy-max/ghaction-import-gpg) GitHub Action
* Add `author` input
* Fix default committer and author for GitHub Actions bot
* More synthetic output 
* Replace `GITHUB_PAT` env var with `GH_PAT` (#53)
* Replace `committer_name` and `committer_email` inputs with `committer`

## 1.5.3 (2020/05/11)

* Mark `GITHUB_PAT`, `committer_name` and `committer_email` inputs as deprecated

## 1.5.2 (2020/05/09)

* Update CI workflow
* Cleanup local paths from extra fields
* Fix action yml

## 1.5.1 (2020/05/04)

* Keep PAT if you want to deploy to another repo
* Remove limitation notice

## 1.5.0 (2020/05/03)

* Personal Access Token is not required anymore to trigger a page build on a public repository (#1)
* Update deps

## 1.4.1 (2020/04/26)

* `GITHUB_TOKEN` documentation link (#90)
* Update deps

## 1.4.0 (2020/04/09)

* Use ncc and clean workflows
* Update deps

## 1.3.0 (2020/02/11)

* Check no changes (#62)
* Update deps

## 1.2.5 (2019/11/26)

* Fix fqdn CNAME writeFileSync (#32)

## 1.2.4 (2019/11/19)

* Fix keep history (#27)

## 1.2.3 (2019/11/19)

* Trim token (#25)

## 1.2.2 (2019/11/16)

* Fix inputs

## 1.2.1 (2019/11/15)

* Typo

## 1.2.0 (2019/11/15)

* Add `keep_history`: Create incremental commit instead of doing push force (#2)
* Add `allow_empty_commit`: Allow an empty commit to be created
* Add `fqdn`: Write the given domain name to the CNAME file
* Log latest changes
* Fix committer name/email inputs

## 1.1.0 (2019/11/14)

* Add customization for commit message, committer name/email (#9)
* Update deps

## 1.0.1 (2019/10/11)

* Spelling

## 1.0.0 (2019/10/11)

* Switch to TypeScript Action (#3)

## 0.5.0 (2019/10/03)

* Add `repo` input

## 0.4.0 (2019/09/03)

* Use inputs as env

## 0.3.0 (2019/09/02)

* Push Docker image to DockerHub

## 0.2.0 (2019/09/01)

* [Fix limitation](https://github.com/crazy-max/ghaction-github-pages#warning-limitation) using Personal Access Token

## 0.1.1 (2019/09/01)

* Fix refs

## 0.1.0 (2019/08/31)

* Initial version

# NPM Package linting

[![Build](https://github.com/ext/npm-pkg-lint/workflows/Build/badge.svg)](https://github.com/ext/npm-pkg-lint/actions?query=workflow%3ABuild)
[![Coverage Status](https://coveralls.io/repos/github/ext/npm-pkg-lint/badge.svg?branch=master)](https://coveralls.io/github/ext/npm-pkg-lint?branch=master)

Opinionated linter for NPM package tarball and `package.json` metadata.

> npx npm-pkg-lint

Core principles:

- Technically valid according to specification is not always the best, a stricter subset makes tooling easier and less vague.
- Native features are better than third-party code.
- Fewer and smaller dependencies are better than many and large dependencies.

## Usage

> npx npm-pkg-lint [--tarball my-pkg-1.2.3.tgz} [--pkgfile package.json]

Use `--help` to see full usage help.

Use `--tarball` and `--pkgfile` to specify custom locations.
Default is to find `package.json` from current directory tree and derive tarball filename from the `name` and `version` field.

If `--tarball` is used `package.json` is extracted from the tarball.

To read from stdin use `--tarball -`.
This can be used to quickly examine packages from https://www.npmjs.com/:

> curl -s \$(npm view lodash dist.tarball) | npx npm-pkg-lint -t -

## Disallowed files

Disallows certain files from being included in the package tarball.

**Why?** They serve no purpose for the end user and makes the download larger and unpacking takes more time (which for a single package might be insignificant but with thousands of dependencies can cause delays)

- Test coverage and reports
- Unittests
- Lint configs (eslint, prettier, html-validate, etc)
- Webpack configs (webpack.config.js)
- CI-related files (github actions, gitlab pipelines, etc)
- Typescript configs (tsconfig)
- Editor-related files

## Missing files

Requires files specified in `package.json` to be present.

**Why?** These files are required for the end user to use the package.

Verifies the presence of files specified in:

- `main`
- `browser`
- `module`
- `jsnext:main`,
- `typings`
- `bin`
- `man`

## Disallowed dependencies

Disallows certain packages from being included as `dependencies` (use `devDependencies` or `peerDependencies` instead).

**Why?** These packages are meant to be used to build, lint or test the package and serve no purpose for the end user and will greatly increase the size of the dependency tree.

Examples of disallowed packages:

- `eslint` (including plugins and configurations)
- `typescript` (precompile with declarations instead)
- `grunt` (end user does not need to perform tasks inside your package)

By default `@types/*` is disallowed but this can be disabled with `--allow-types-dependencies`.

## Shebang

Require all binaries to have UNIX-style shebang at the beginning of the file.
Normally this is `#/usr/bin/env node`.

**Why?** Binaries must have a shebang at the beginning of the file to be executable for end users.

## `package.json` fields

Verifies the fields in `package.json` and ensures all fields are properly set.

**Why?** While many fields strictly are optional they help end users find the package and source code, where and how to report bugs and how the package can be used.

Verifies the following fields:

- `description` - present and non-empty
- `keywords` - present and non-empty
- `homepage` - present, non-empty and well-formed
- `bugs` - present, non-empty, and well-formed
- `license` - present and non-empty
- `author` - present and non-empty
- `repository` - present, non-empty and well-formed

It also enforces all urls to be `https`, even the repository url.
While `git` is technically valid most users cannot clone the repository anonomously.
Shortcuts are not permitted either because it saves basically nothing, makes tooling more difficult to write and wont work for smaller hosting services.

## Unsupported node versions

Requires `engines.node` to be up-to-date and only supporting LTS and active versions.

**Why?** Newer versions contains more builtin functions and features replacing the need for polyfills and many one-liner packages.

As an example `mkdirp` can be replaced with `fs.mkdir(p, { recursive: true })` starting with Node 10.

While stable Linux distributions (e.g. Debian stable) and enterprise environment might not use the most recent versions they often try to stay away from EOL versions.
Users stuck at older versions will not be able to update to the latest set of node packages but if you are using an environment with unsupported versions you are unlikely to want to update node packages.
It is also very likely that the package doesn't actually run on such old version anyway because of a missing feature or a dependency requiring a later version.

# NPM Package linting

Performs sanity checks on a package tarball and `package.json`.

> npx npm-pkg-lint

## Usage

> npx npm-pkg-lint [--tarball my-pkg-1.2.3.tgz} [--pkgfile package.json]

Use `--tarball` and `--pkgfile` to specify custom locations.
Default is to find `package.json` from current directory tree and derive tarball filename from the `name` and `version` field.

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

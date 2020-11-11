# NPM Package linting

Performs sanity checks on a package tarball and `package.json`.

> npx npm-pkg-lint -t my-pkg-1.2.3.tgz -p package.json

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

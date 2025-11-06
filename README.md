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

```
usage: index.js [-h] [-v] [-t TARBALL] [-p PKGFILE] [--cache CACHE]
                [--allow-dependency DEPENDENCY] [--allow-types-dependencies]
                [--ignore-missing-fields]

Opiniated linter for NPM package tarball and package.json metadata

optional arguments:
  -h, --help            show this help message and exit
  -v, --version         show program's version number and exit
  -t TARBALL, --tarball TARBALL
                        specify tarball location
  -p PKGFILE, --pkgfile PKGFILE
                        specify package.json location
  --cache CACHE         specify cache directory
  --allow-dependency DEPENDENCY
                        explicitly allow given dependency (can be given
                        multiple times or as a comma-separated list)
  --allow-types-dependencies
                        allow production dependencies to `@types/*`
  --ignore-missing-fields
                        ignore errors for missing fields (but still checks for
                        empty and valid)
  --ignore-node-version [MAJOR]
                        ignore error for outdated node version (restricted to MAJOR version if given)
```

Use `--tarball` and `--pkgfile` to specify custom locations.
Default is to find `package.json` from current directory tree and derive tarball filename from the `name` and `version` field.

If `--tarball` is used `package.json` is extracted from the tarball.

To read from stdin use `--tarball -`.
This can be used to quickly examine packages from https://www.npmjs.com/:

> curl -s \$(npm view lodash dist.tarball) | npx npm-pkg-lint -t -

## Github Action

This tool can be used directly with Github Actions:

```yaml
- name: Checkout
  uses: actions/checkout@v4
- name: Setup Node.js
  uses: actions/setup-node@v4
- name: npm-pkg-lint
  uses: ext/npm-pkg-lint@master
```

> [!IMPORTANT]
> You need to have `npm-pkg-lint` installed as a dependency in `package.json`.
> This ensures you have control over which version of the tool is actually running.

| Input&nbsp;parameter | Default   | Description                                                                                |
| -------------------- | --------- | ------------------------------------------------------------------------------------------ |
| allow-dependencies   | `-`       | Comma-separated list of dependencies to explicitly allow even if they would yield an error |
| build                | `"build"` | Build command (executed with `npm run`). Set to `false` to disable build.                  |
| folders              | `"."`     | Space-separated list of folder to run in.                                                  |
| ignore-node-version  | -         | Ignore error for outdated node version (see --ignore-node-version CLI argument)            |
| npm-pack             | `true`    | When enabled `npm pack` is run automatically                                               |

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

- `exports` (wildcard patterns are ignored)
- `main`
- `browser`
- `module`
- `jsnext:main`,
- `types`
- `typings`
- `bin`
- `man`

## TypeScript `types` in `exports`

Requires `types` to be the first condition in `exports`.

**Why?** For TypeScript to properly detect `types` it need to come before `require` or `import`, else it will fall back to detecting by filename.

## TypeScript `types` matching `exports`

Requires `types` to match `exports`.

**Why?** To avoid issues with newer TS versions resolving with `exports` if present rather than the older `types` field.

## Disallowed dependencies

Disallows certain packages from being included as `dependencies` (use `devDependencies` or `peerDependencies` instead).

**Why?** These packages are meant to be used to build, lint or test the package and serve no purpose for the end user and will greatly increase the size of the dependency tree.

Examples of disallowed packages:

- `eslint` (including plugins and configurations)
- `typescript` (precompile with declarations instead)
- `grunt` (end user does not need to perform tasks inside your package)

By default `@types/*` is disallowed but this can be disabled with `--allow-types-dependencies`.

If needed, `--allow-dependency` can be used to ignore one or more dependencies.

### ESLint

If your `package.json` contains the `"eslint"` keyword the ESLint packages can be included as dependencies, e.g. if you publish a sharable config including a plugin you must include `"eslint"` as a keyword.

**OK**:

```json
{
  "name": "eslint-config-myfancyconfig",
  "version": "1.0.0",
  "keywords": ["eslint"],
  "dependencies": {
    "eslint-plugin-myfancyplugin": "^1.2.0"
  }
}
```

**Fail**:

```json
{
  "name": "eslint-config-myfancyconfig",
  "version": "1.0.0",
  "dependencies": {
    "eslint-plugin-myfancyplugin": "^1.2.0"
  }
}
```

### Jest

If your `package.json` contains the `"jest"` keyword the Jest packages can be included as dependencies, e.g. if you publish a sharable config including a plugin you must include `"jest"` as a keyword.

**OK**:

```json
{
  "name": "awesome-jest-config",
  "version": "1.0.0",
  "keywords": ["jest"],
  "dependencies": {
    "babel-jest": "^29.0.0"
  }
}
```

**Fail**:

```json
{
  "name": "eslint-config-myfancyconfig",
  "version": "1.0.0",
  "dependencies": {
    "babel-jest": "^29.0.0"
  }
}
```

### Prettier

If your `package.json` contains the `"prettier"` keyword the Prettier packages can be included as dependencies, e.g. if you publish a sharable config including a plugin you must include `"prettier"` as a keyword.

**OK**:

```json
{
  "name": "prettier-config-myfancyconfig",
  "version": "1.0.0",
  "keywords": ["prettier"],
  "dependencies": {
    "prettier-plugin-myfancyplugin": "^1.2.0"
  }
}
```

**Fail**:

```json
{
  "name": "prettier-config-myfancyconfig",
  "version": "1.0.0",
  "dependencies": {
    "prettier-plugin-myfancyplugin": "^1.2.0"
  }
}
```

## Obsolete dependencies

Disallows certain packages from being included as `dependencies`, `devDependencies` or `peerDependencies` entirely.
These dependencies have native replacements supported by all supported NodeJS versions.

**Why?** Obsolete packages have native replacements and thus only clutter the dependency graphs thus increasing the time to install, the size on disk and produces noise with tools analyzing `package-lock.json`.

Examples of obsolete packages:

- `mkdirp` - `fs#mkdir` supports the `recursive` flag since NodeJS v10.
- `stable` - `Array#sort` is stable since NodeJS v12.

## Deprecated dependencies

Disallows deprecated packages from being included as `dependencies`, `devDependencies` or `peerDependencies` entirely.
These dependences are explicitly marked as deprecated by the package author.

**Why?** Deprecated packages should be removed or replaced with alternatives as they are often unmaintained and might contain security vulnerabilities.

Examples of obsolete packages:

- `mkdirp` - `fs#mkdir` supports the `recursive` flag since NodeJS v10.
- `stable` - `Array#sort` is stable since NodeJS v12.

If needed, `--allow-dependency` can be used to ignore one or more dependencies.

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

When the `--ignore-missing-fields` option is used the fields can be omitted (but still need to be valid if present).

## Unsupported node versions

Requires `engines.node` to be up-to-date and only supporting LTS and active versions.

**Why?** Newer versions contains more builtin functions and features replacing the need for polyfills and many one-liner packages.

As an example `mkdirp` can be replaced with `fs.mkdir(p, { recursive: true })` starting with Node 10.

While stable Linux distributions (e.g. Debian stable) and enterprise environment might not use the most recent versions they often try to stay away from EOL versions.
Users stuck at older versions will not be able to update to the latest set of node packages but if you are using an environment with unsupported versions you are unlikely to want to update node packages.
It is also very likely that the package doesn't actually run on such old version anyway because of a missing feature or a dependency requiring a later version.

This rule can be ignored with `--ignore-node-version`.

## Verify engine constraints

Requires `engines.node` to be satisfied by all transitive dependencies.

**Why?** It is a common error forget to verify transitive dependencies when setting constraints on node version.

If `package.json` declares constraint such as:

```json
{
  "dependencies": {
    "my-dependency": "1.2.3"
  },
  "engines": {
    "node": ">= 8"
  }
}
```

but the `my-dependency` constraint requires NodeJS 12 or later this rule yields an error as NodeJS 8 will not satisfy that constraint.

## `@types/node` and engine constraints

Requires `engines.node` lowest major version to equal `@types/node` major version.

**Why?** If you use the wrong major version of `@types/node` you might write code with is unsupported by the versions claimed to be supported by `engines.node` or you might be missing out on newer features that could be used.

Final compatibility should be tested with a version matrix but having `@types/node` at the correct version can give the developer early assistance.

The following `package.json`:

```json
{
  "devDependencies": {
    "@types/node": "^14.17.16"
  },
  "engines": {
    "node": ">= 12"
  }
}
```

will yield an error becase `node` v12 is not the same as `@types/node` v14.

## `@tsconfig/node*` and engine constraints

Requires `engines.node` lowest major version to match the `@tsconfig/node*` base package.

**Why?** If you use the wrong `@tsconfig/node*` base package you might be targeting and outputing code that will be unsupported by the versions claimed to be supported by `engines.node` or you are outputting inefficient code which isn't taking advantage of newer features that could be used.

Final compatibility should be tested with a version matrix but having `@tsconfig/node*` at the correct version can give the developer early assistance.

The following `package.json`:

```json
{
  "devDependencies": {
    "@tsconfig/node14": "^14.1.2"
  },
  "engines": {
    "node": ">= 12"
  }
}
```

will yield an error becase `@tsconfig/node14` is for NodeJS v14 but the `engines.node` constraints the version to v12.

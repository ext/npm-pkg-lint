# npm-pkg-lint changelog

## [1.1.0](https://github.com/ext/npm-pkg-lint/compare/v1.0.3...v1.1.0) (2020-11-14)

### Features

- `--pkgfile` and `--tarball` are now optional ([8b501eb](https://github.com/ext/npm-pkg-lint/commit/8b501eb9901ddfb9777dcba66ad7b8c16a067cf2))
- validate package fields ([db27fe5](https://github.com/ext/npm-pkg-lint/commit/db27fe5381f28b1f413a32b4dd4437a9cd3ebb34))
- validates presence of files referenced in package.json ([f30798e](https://github.com/ext/npm-pkg-lint/commit/f30798e6644dce2b6c65e1f3e935202020e3a7ed))
- verify presence of shebang ([d4e835f](https://github.com/ext/npm-pkg-lint/commit/d4e835f4f406855bdebe858171209685728ae2dc))

### Bug Fixes

- handle scoped packages ([dbcc1b6](https://github.com/ext/npm-pkg-lint/commit/dbcc1b69d1c2fcee8645947bc2fbc1231453a4dc))
- skip outputting result when there are no errors ([f64d172](https://github.com/ext/npm-pkg-lint/commit/f64d172cf14a855afea3efe1a1fc301e61f4eb44))

### [1.0.3](https://github.com/ext/npm-pkg-lint/compare/v1.0.2...v1.0.3) (2020-11-11)

### Bug Fixes

- add missing file ([0964b40](https://github.com/ext/npm-pkg-lint/commit/0964b40a7313add135672092d52d116589a919b7))

### [1.0.2](https://github.com/ext/npm-pkg-lint/compare/v1.0.1...v1.0.2) (2020-11-11)

### Bug Fixes

- shebang ([576f428](https://github.com/ext/npm-pkg-lint/commit/576f428987a90359f472ea03a410d3c1a44c3c25))

### [1.0.1](https://github.com/ext/npm-pkg-lint/compare/v1.0.0...v1.0.1) (2020-11-11)

### Bug Fixes

- compile package before release ([a33e5ce](https://github.com/ext/npm-pkg-lint/commit/a33e5ce4e2abf84440b3137abfb07cbb02cc9fa2))

## 1.0.0 (2020-11-11)

### Features

- initial version ([f0b3de7](https://github.com/ext/npm-pkg-lint/commit/f0b3de7e2e6947959f2956c27086903f0b46dc5e))

### Bug Fixes

- exit with error code on any error ([77c0f6a](https://github.com/ext/npm-pkg-lint/commit/77c0f6a12b5e68069f63a662859bcd40488f53ac))

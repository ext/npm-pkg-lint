# npm-pkg-lint changelog

## [1.6.0](https://github.com/ext/npm-pkg-lint/compare/v1.5.0...v1.6.0) (2022-02-16)

### Features

- bundle all dependencies ([d6026eb](https://github.com/ext/npm-pkg-lint/commit/d6026eb2b6e9f93319f5297d6b2ba743a2f92199))

## [1.5.0](https://github.com/ext/npm-pkg-lint/compare/v1.4.0...v1.5.0) (2021-09-21)

### Features

- new rule `types-node-matching-engine` ([c9fda99](https://github.com/ext/npm-pkg-lint/commit/c9fda99a6d219d8b435066027fbefb1b165e4d7a))

### Dependency upgrades

- **deps:** update dependency @html-validate/stylish to v2 ([1c68c80](https://github.com/ext/npm-pkg-lint/commit/1c68c8023019e107360f5ecb3a60848a5b82037e))

## [1.4.0](https://github.com/ext/npm-pkg-lint/compare/v1.3.0...v1.4.0) (2021-06-05)

### Features

- bump node release table (node 10 now returns an error) ([6c38aad](https://github.com/ext/npm-pkg-lint/commit/6c38aadf28e32ef494cc1321a3bbc718537f232d))
- verify engine constrains ([535906f](https://github.com/ext/npm-pkg-lint/commit/535906f5ec85b0f3136eb350f167e4d157ac2407))

## [1.3.0](https://github.com/ext/npm-pkg-lint/compare/v1.2.0...v1.3.0) (2020-11-21)

### Features

- check for unsupported node versions ([c788c00](https://github.com/ext/npm-pkg-lint/commit/c788c008f90b7af56106ce99eaecfe289b976c39))

## [1.2.0](https://github.com/ext/npm-pkg-lint/compare/v1.1.0...v1.2.0) (2020-11-17)

### Features

- add `--allow-types-dependencies` to allow `@types/*` ([087facc](https://github.com/ext/npm-pkg-lint/commit/087faccdbc70dab3ca8a02e4bd72f4b389cdcb08))
- disallow packages as dependencies ([9088173](https://github.com/ext/npm-pkg-lint/commit/90881737559365b0d442bdc8b54d35874222e1be))
- support ignoring missing fields ([fb688e5](https://github.com/ext/npm-pkg-lint/commit/fb688e5426a4a864492b23ebcd60055987d49cf3))
- support reading `package.json` directly from tarball ([bfbf3fc](https://github.com/ext/npm-pkg-lint/commit/bfbf3fcc66a0b6313dfa080be268bc5f713777c8))
- support reading tarball from stdin ([85981c4](https://github.com/ext/npm-pkg-lint/commit/85981c4ccebef86e0f692156fbbf6267febdb32d))

### Bug Fixes

- `browser` field may contain `false` ([9957100](https://github.com/ext/npm-pkg-lint/commit/9957100d734b38d675dde6022e39f6d1684206de))
- disallow `*.(spec|test).d.ts` ([e6c2b88](https://github.com/ext/npm-pkg-lint/commit/e6c2b88bb791af55787240dc79a403387d03d5d5))
- handle large `package.json` files ([e1bb35e](https://github.com/ext/npm-pkg-lint/commit/e1bb35e181913b4398f1edf04761a5531bc0b059))
- handle leading `./` in filenames ([371114c](https://github.com/ext/npm-pkg-lint/commit/371114ccfcadcc9c5f22f3f9dca800c36b1f7a7d))
- handle packages not using `package/` as root ([b376852](https://github.com/ext/npm-pkg-lint/commit/b376852fa7cd0deb8d9e9d270e5ca7266d11be9b))
- handle packages with index.js but trailing slash ([8cb0fb4](https://github.com/ext/npm-pkg-lint/commit/8cb0fb45cddbaed552d6eef7d1731b439f225b3b))
- handle resolving files without `.js` extension ([0555d38](https://github.com/ext/npm-pkg-lint/commit/0555d38e84bc5528e68780ce8f3a3b68ce2d58bb))
- handle when `main` points to directory with `index.js` ([368f2a6](https://github.com/ext/npm-pkg-lint/commit/368f2a61f992769d3f8b4218ca3a3081c2f12e9a))
- regenerate package name when using stdin ([15487e4](https://github.com/ext/npm-pkg-lint/commit/15487e4d4eec88c948f5a4441bb5899025d5a938))
- tweak allowed files and dependencies ([f50be59](https://github.com/ext/npm-pkg-lint/commit/f50be59c88f8e6898288dfcb524384833557f70f))

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

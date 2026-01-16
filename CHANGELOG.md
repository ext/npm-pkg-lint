# npm-pkg-lint changelog

## 4.3.2 (2026-01-16)

### Bug Fixes

- **deps:** update dependency tar to v7.5.3 [security] ([7d981f5](https://github.com/ext/npm-pkg-lint/commit/7d981f5074ce101efa644da2ca48502963716788))

## 4.3.1 (2025-11-15)

### Bug Fixes

- `shadowed-types` now handles nested conditions ([6fa1db7](https://github.com/ext/npm-pkg-lint/commit/6fa1db7a7e1c2962731fb951738afc7b6f2b77cd))

## 4.3.0 (2025-11-07)

### Features

- new rule `conflicting-types-typings` ([becb6d2](https://github.com/ext/npm-pkg-lint/commit/becb6d26b358a0c0b6f04c6debfb58fb3f3e97d7))
- new rule `prefer-types` ([bc86483](https://github.com/ext/npm-pkg-lint/commit/bc86483219732d69dffa5b9dabaac1a2c2b6fb63))
- new rule `shadowed-types` ([b9d828d](https://github.com/ext/npm-pkg-lint/commit/b9d828db91b448c7f1deebdcb9dcd678585ba8c5))

### Bug Fixes

- **deps:** update dependency tar to v7.5.2 [security] ([c6dbc9b](https://github.com/ext/npm-pkg-lint/commit/c6dbc9bd6df9395905a61f1a479fdeb4b0498def))
- validate pkg.types in addition to pkg.typings ([7f0d4d7](https://github.com/ext/npm-pkg-lint/commit/7f0d4d7dda10455683e68aa3892ee2009efadf72))

## 4.2.0 (2025-10-24)

### Features

- **deps:** update dependency nano-spawn to v2 ([3e7c339](https://github.com/ext/npm-pkg-lint/commit/3e7c339a6cd928f92de6159414593fc6d5c4d079))

### Bug Fixes

- **deps:** update dependency @humanwhocodes/momoa to v3.3.10 ([1abf3d5](https://github.com/ext/npm-pkg-lint/commit/1abf3d50d9afb55fcec5b6ad81e85a3d798a3519))
- disallow `__fixtures__` ([9bedf7e](https://github.com/ext/npm-pkg-lint/commit/9bedf7e357f93b46f28061a880d194a91b8c55c4))
- disallow yarn.lock ([7595cef](https://github.com/ext/npm-pkg-lint/commit/7595cef02d184fd6ab55c1dbe86416d1b9346cac))

## 4.1.2 (2025-10-10)

### Bug Fixes

- **deps:** update dependency semver to v7.7.3 ([2ac4576](https://github.com/ext/npm-pkg-lint/commit/2ac457648401bcf1d81631f87524e65dcc991f78))

## 4.1.1 (2025-09-26)

### Bug Fixes

- **deps:** update dependency tar to v7.4.4 ([9593490](https://github.com/ext/npm-pkg-lint/commit/959349018cd3aeca9fdc82a0e30a01d715974c28))
- **deps:** update dependency tar to v7.5.1 ([e4ee291](https://github.com/ext/npm-pkg-lint/commit/e4ee29189259354350dfb2517025683e90eeffcf))

## 4.1.0 (2025-09-19)

### Features

- **deps:** update dependency find-up to v8 ([ef00c41](https://github.com/ext/npm-pkg-lint/commit/ef00c41a7608db9ea7d9668a4410d2aa161bbf16))

## 4.0.5 (2025-09-12)

### Bug Fixes

- **deps:** update dependency nano-spawn to v1.0.3 ([90da224](https://github.com/ext/npm-pkg-lint/commit/90da224fb43f6a04ed21bdd0c9b332e3f65fe582))

## 4.0.4 (2025-08-30)

### Bug Fixes

- allow typescript-eslint i keywords contain eslint ([745b0ad](https://github.com/ext/npm-pkg-lint/commit/745b0ad07a7692c2ea8cdc73e6e73223e120513f))

## 4.0.3 (2025-08-15)

### Bug Fixes

- **deps:** update dependency @humanwhocodes/momoa to v3.3.9 ([7c1c120](https://github.com/ext/npm-pkg-lint/commit/7c1c120d50477a2a370a27f1e399a614751da28c))
- **deps:** update dependency tmp to v0.2.5 ([04c5538](https://github.com/ext/npm-pkg-lint/commit/04c553841e6c1613d33173bca04956eb15ad0c9d))

## 4.0.2 (2025-08-08)

### Bug Fixes

- **deps:** update dependency tmp to v0.2.4 [security] ([d10a199](https://github.com/ext/npm-pkg-lint/commit/d10a199ced27b00021b4cd83ff7834f09b4ab61b))

## 4.0.1 (2025-06-27)

### Bug Fixes

- **deps:** update dependency @html-validate/stylish to v4.3.0 ([db4c0bc](https://github.com/ext/npm-pkg-lint/commit/db4c0bc2c5ad5800c4934bc3224b4ce3aa909735))

## 4.0.0 (2025-05-25)

### ⚠ BREAKING CHANGES

- NodeJS v20 or later is required

### Features

- add github action ([de14fce](https://github.com/ext/npm-pkg-lint/commit/de14fce0cff29d500de0fb3873a37a89e88fbf5b))
- **deps:** update dependency nano-spawn to v1 ([ee1e960](https://github.com/ext/npm-pkg-lint/commit/ee1e960f1b41080c392b20fea2670c8b32168029))
- require nodejs v20 or later ([ce8786c](https://github.com/ext/npm-pkg-lint/commit/ce8786c10d29fc56386f2e5ba7183dbad615a86c))
- **rules:** require node v20 as node v18 is eol ([515e8c4](https://github.com/ext/npm-pkg-lint/commit/515e8c4b82d6db28f7d09ae7639be0ae91c490ab))

## 3.10.12 (2025-05-16)

### Bug Fixes

- **deps:** update dependency nano-spawn to v0.2.1 ([b7cd2c6](https://github.com/ext/npm-pkg-lint/commit/b7cd2c6ac485834dfba27f907dee4d6a14e0cc83))
- **deps:** update dependency semver to v7.7.2 ([0240088](https://github.com/ext/npm-pkg-lint/commit/0240088c38028ba81567235e6f87c37b8d75ae1d))

## 3.10.11 (2025-03-03)

### Bug Fixes

- handle file: prefix for npm dependencies ([a8b5381](https://github.com/ext/npm-pkg-lint/commit/a8b53814dcf8637294008de3b40dad3893576c33))

## 3.10.10 (2025-02-28)

### Bug Fixes

- **deps:** update dependency @humanwhocodes/momoa to v3.3.7 ([29f1d6f](https://github.com/ext/npm-pkg-lint/commit/29f1d6f3b03c115626612885f0797ea95e2988f7))
- **deps:** update dependency @humanwhocodes/momoa to v3.3.8 ([d873c26](https://github.com/ext/npm-pkg-lint/commit/d873c2657f89a731a5c89b641f7363489d099515))

## 3.10.9 (2025-02-07)

### Bug Fixes

- **deps:** update dependency semver to v7.7.1 ([3c12ec9](https://github.com/ext/npm-pkg-lint/commit/3c12ec974349397678ff3c59fc27f33f8d51c3bc))

## 3.10.8 (2025-01-31)

### Bug Fixes

- **deps:** update dependency semver to v7.7.0 ([3e31f12](https://github.com/ext/npm-pkg-lint/commit/3e31f12e9b13cada947f35ebbf121083431168f2))

## 3.10.7 (2025-01-10)

### Bug Fixes

- **deps:** update dependency @humanwhocodes/momoa to v3.3.6 ([67c00d3](https://github.com/ext/npm-pkg-lint/commit/67c00d3d499d65eb7980e7d30c4d522f823428da))

## 3.10.6 (2024-12-13)

### Bug Fixes

- **deps:** update dependency @humanwhocodes/momoa to v3.3.5 ([6a40429](https://github.com/ext/npm-pkg-lint/commit/6a404293dbdf2d616c5297977bd23c43362ff2c9))

## 3.10.5 (2024-12-06)

### Bug Fixes

- **deps:** update dependency @humanwhocodes/momoa to v3.3.4 ([83ca8ad](https://github.com/ext/npm-pkg-lint/commit/83ca8ad218b566b8fca532719d61e7438ec97f87))

## 3.10.4 (2024-11-29)

### Bug Fixes

- remove extra quotes from aliased disallowed dependency ([553711c](https://github.com/ext/npm-pkg-lint/commit/553711ce662e84e0a4055b0db3f5743e2cb9f869))

## 3.10.3 (2024-11-24)

### Bug Fixes

- better handling of recursive dependencies ([cb020d0](https://github.com/ext/npm-pkg-lint/commit/cb020d09310f0f4b0034a351cf4187ae78f81957))

## 3.10.2 (2024-11-15)

### Bug Fixes

- **deps:** update dependency @humanwhocodes/momoa to v3.3.3 ([54f1735](https://github.com/ext/npm-pkg-lint/commit/54f173558b01ddeb3c6a627112a4cb8d3445eac5))

## 3.10.1 (2024-11-08)

### Bug Fixes

- **deps:** update dependency @humanwhocodes/momoa to v3.3.2 ([27d9acd](https://github.com/ext/npm-pkg-lint/commit/27d9acdd43e4ad49e40637525be915658ae43a46))

## 3.10.0 (2024-11-04)

### Features

- **deps:** replace execa with nano-spawn ([a118361](https://github.com/ext/npm-pkg-lint/commit/a118361e11667558dc13e6ab7cafc0be41dd57b2))

## 3.9.3 (2024-11-01)

### Bug Fixes

- **deps:** update dependency @humanwhocodes/momoa to v3.3.1 ([049bf42](https://github.com/ext/npm-pkg-lint/commit/049bf42761badecf98f056b1e945eeefeb6e5fbd))

## 3.9.2 (2024-10-18)

### Bug Fixes

- **deps:** update dependency @humanwhocodes/momoa to v3.3.0 ([494dd14](https://github.com/ext/npm-pkg-lint/commit/494dd14e594283c97d6aae6759f775d944a47f05))

## 3.9.1 (2024-10-11)

### Bug Fixes

- **deps:** update dependency @humanwhocodes/momoa to v3.2.2 ([82e19de](https://github.com/ext/npm-pkg-lint/commit/82e19de75cec393ccc1ead69c52cbf391b250717))

## 3.9.0 (2024-09-21)

### Features

- disallow @tsconfig/ packages as non-devdependency ([3334ab1](https://github.com/ext/npm-pkg-lint/commit/3334ab1af13ba54ab18aa216c6b8507dd78706ac))
- match @tsconfig/node\* and engines.node versions ([cf5d931](https://github.com/ext/npm-pkg-lint/commit/cf5d9313b63b602a0c5145ef93fb6ea3006560d0))

## 3.8.0 (2024-09-12)

### Features

- show proper line and column in package.json ([b094ac2](https://github.com/ext/npm-pkg-lint/commit/b094ac20743b80ad6f191c49c1d8b73a845df3f5))

### Bug Fixes

- sort messages by line/column ([dca57bb](https://github.com/ext/npm-pkg-lint/commit/dca57bb180446c4c0457c236381d1430b2a32240))

## 3.7.2 (2024-09-12)

### Bug Fixes

- use full absolute path to files in output ([9b3990a](https://github.com/ext/npm-pkg-lint/commit/9b3990a92b1173e627ef9cf40ab98fd49d1f7f09))

## 3.7.1 (2024-09-07)

### Bug Fixes

- fix regression error with unpublished packages ([3477283](https://github.com/ext/npm-pkg-lint/commit/347728372fa160d2a004b3476d9835db9faaff3b))

## 3.7.0 (2024-09-07)

### Features

- allow `--allow-dependency` to suppress errors about deprecated packages ([1c666a7](https://github.com/ext/npm-pkg-lint/commit/1c666a76181a150c82b294cb211d13bfe3c1e08e))

### Bug Fixes

- dont yield warnings about unpublished devdependencies ([713aa32](https://github.com/ext/npm-pkg-lint/commit/713aa3261f69c421cfc20e41f44b8687f685111f))

## 3.6.8 (2024-08-23)

### Bug Fixes

- **deps:** update dependency execa to v9.3.1 ([740e2bc](https://github.com/ext/npm-pkg-lint/commit/740e2bc239be2d47105919c8348c4ea8c2a728d1))

## 3.6.7 (2024-08-02)

### Bug Fixes

- **deps:** update dependency tar to v7.4.2 ([64a62d7](https://github.com/ext/npm-pkg-lint/commit/64a62d7cca1616352c8382d965b9967163bb249b))
- **deps:** update dependency tar to v7.4.3 ([f8f6e09](https://github.com/ext/npm-pkg-lint/commit/f8f6e095872ddbaf57998f29e391c620f32a587c))

## 3.6.6 (2024-07-26)

### Bug Fixes

- **deps:** update dependency tar to v7.4.1 ([c645cb5](https://github.com/ext/npm-pkg-lint/commit/c645cb530d9b0e3b1d1d9081700ae5a081e686c4))

## 3.6.5 (2024-07-19)

### Bug Fixes

- **deps:** update dependency semver to v7.6.3 ([86d4cc0](https://github.com/ext/npm-pkg-lint/commit/86d4cc00ebd400cf7e320c554c7efe4d006a9c5a))

## 3.6.4 (2024-06-28)

### Bug Fixes

- **deps:** update dependency execa to v9.2.0 ([49067c7](https://github.com/ext/npm-pkg-lint/commit/49067c7386a0a8b0c3cc7837e404d8786ba304e0))
- **deps:** update dependency execa to v9.3.0 ([5f34c36](https://github.com/ext/npm-pkg-lint/commit/5f34c361345f19dade68289d179c55783e3e04a1))

## 3.6.3 (2024-06-21)

### Bug Fixes

- **deps:** update dependency tar to v7.4.0 ([c88b6df](https://github.com/ext/npm-pkg-lint/commit/c88b6dfdc06c261d06afe0cd3eb3f13c99375473))

## 3.6.2 (2024-06-07)

### Bug Fixes

- **deps:** update dependency tar to v7.2.0 ([00641e1](https://github.com/ext/npm-pkg-lint/commit/00641e1d4fd8f779db7d5cdc67d1f8154948c55a))

## 3.6.1 (2024-05-24)

### Bug Fixes

- querystring marked as obsolete ([b9e048e](https://github.com/ext/npm-pkg-lint/commit/b9e048eb567c6990754789ff570e0293e900bf96))

## 3.6.0 (2024-05-19)

### Features

- add `--ignore-node-version` to disable `outdated-engines` node version error ([4f12e8a](https://github.com/ext/npm-pkg-lint/commit/4f12e8a0fa5fcf497ae06ecd0c392137b9b50a38))
- **deps:** update dependency execa to v9 ([dbd310b](https://github.com/ext/npm-pkg-lint/commit/dbd310ba8e2bae21d4aa42eb4694dfa0a476ef44))

## 3.5.3 (2024-05-17)

### Bug Fixes

- **deps:** update dependency semver to v7.6.2 ([0aa25fd](https://github.com/ext/npm-pkg-lint/commit/0aa25fd255d51a7ee7c3eabfb878a146fc5dce5d))

## 3.5.2 (2024-05-10)

### Bug Fixes

- **deps:** update dependency semver to v7.6.1 ([85110d2](https://github.com/ext/npm-pkg-lint/commit/85110d26167c9a656c887c080ae972fb9aa749ae))
- **deps:** update dependency tar to v7.1.0 ([6fcf3d5](https://github.com/ext/npm-pkg-lint/commit/6fcf3d58ed7653481116bbab197afec8ddee8d21))

## 3.5.1 (2024-04-19)

### Bug Fixes

- **deps:** update dependency tar to v7.0.1 ([a8ef125](https://github.com/ext/npm-pkg-lint/commit/a8ef12546f96d5a1ec948394160338b954f84471))

## 3.5.0 (2024-04-14)

### Features

- **deps:** update dependency tar to v7 ([5560094](https://github.com/ext/npm-pkg-lint/commit/55600945f8b0f5600ae2c5c7810ef15886c2a79d))

## 3.4.1 (2024-04-12)

### Bug Fixes

- handle when direct dependency is unpublished ([1cace31](https://github.com/ext/npm-pkg-lint/commit/1cace31b378227d496c10e49828f1ae0036e268b))

## 3.4.0 (2024-04-07)

### Features

- add `--allow-dependency` to ignore disallowed dependency ([0603db9](https://github.com/ext/npm-pkg-lint/commit/0603db9c89b45665a4bfa8d80c4c09f0c5a30744))

## 3.3.1 (2024-04-06)

### Bug Fixes

- handle `npm:` prefix in dependencies ([c828d32](https://github.com/ext/npm-pkg-lint/commit/c828d322253433663bf49cd2e754a9817aa4c946))

## 3.3.0 (2024-04-05)

### Features

- support `--cache` to set custom cache directory ([15c1cdd](https://github.com/ext/npm-pkg-lint/commit/15c1cdd375ed1bef73bf6544f11e53b1ffebd0f0))

## 3.2.3 (2024-03-29)

### Bug Fixes

- **deps:** update dependency tar to v6.2.1 ([d57d4f1](https://github.com/ext/npm-pkg-lint/commit/d57d4f1eb7df01eb0697a79325c974f627d7c452))

## 3.2.2 (2024-03-08)

### Bug Fixes

- **deps:** update dependency tmp to v0.2.3 ([6d0a9ee](https://github.com/ext/npm-pkg-lint/commit/6d0a9ee8e4b45ea84fb10ad77f021023bb9a72a1))

## 3.2.1 (2024-03-01)

### Bug Fixes

- **deps:** update dependency tmp to v0.2.2 ([93391d8](https://github.com/ext/npm-pkg-lint/commit/93391d84eb4e1cda4f3f7490d5eedc4816c91c07))

## 3.2.0 (2024-02-28)

### Features

- allow jest dependencies when using jest keyword ([f9b7c9d](https://github.com/ext/npm-pkg-lint/commit/f9b7c9df59b07211162a208fe294bf292aba0bb7))

## [3.1.0](https://github.com/ext/npm-pkg-lint/compare/v3.0.1...v3.1.0) (2024-02-10)

### Features

- **deps:** update dependency find-up to v7 ([4c8826e](https://github.com/ext/npm-pkg-lint/commit/4c8826eb029f05cc8825d9dfaf876c6e5e11b843))

### Bug Fixes

- handle unpublished packages/versions ([52a5bc4](https://github.com/ext/npm-pkg-lint/commit/52a5bc44fef240023fc3aa579d0504c3ec186e66))

## [3.0.1](https://github.com/ext/npm-pkg-lint/compare/v3.0.0...v3.0.1) (2024-02-09)

### Bug Fixes

- **deps:** update dependency semver to v7.6.0 ([6c308ec](https://github.com/ext/npm-pkg-lint/commit/6c308ec30f83430362e8eda5704da4e13ef00e48))

## [3.0.0](https://github.com/ext/npm-pkg-lint/compare/v2.1.0...v3.0.0) (2023-12-28)

### ⚠ BREAKING CHANGES

- **deps:** require nodejs 18 or later

### Features

- add a few more disallowed dependencies ([d386a79](https://github.com/ext/npm-pkg-lint/commit/d386a79b387735908077238b1b5f69651c079f97))
- **deps:** require nodejs 18 or later ([e24fbb1](https://github.com/ext/npm-pkg-lint/commit/e24fbb13443a8a98405c886fea7f7995a2edff2a))
- new rule `deprecated-dependencies` ([423072e](https://github.com/ext/npm-pkg-lint/commit/423072e0d74e02e72344d75ee1de72cb72bbc5db))
- new rule `obsolete-dependencies` ([e17e283](https://github.com/ext/npm-pkg-lint/commit/e17e2838d3068a1dcdb74b566266782aa405ada9))
- stricter validation of repository field ([7df0e54](https://github.com/ext/npm-pkg-lint/commit/7df0e54383f6c43a9d850150c4bcf911b20c631a))
- update active nodejs versions ([a57b4c7](https://github.com/ext/npm-pkg-lint/commit/a57b4c71247cd70aa6759f0af29ca89ba5a6b661))

### Bug Fixes

- detect eslint flat config as disallowed files ([811acaf](https://github.com/ext/npm-pkg-lint/commit/811acaf37d9f9f21b0a41cfe074c6dade750a6ad))
- disallow ava, c8, hereby and playwright configuration in tarball ([e942a67](https://github.com/ext/npm-pkg-lint/commit/e942a67707a6068c88d5013ce1e8f759ca85b58b))
- engine constraints verify the lowest version allowed by range ([1a6fed5](https://github.com/ext/npm-pkg-lint/commit/1a6fed5ceb3fdbbc99fa1c4b6fa80f8d8d9e610c))
- handle when @types/node is declared as latest ([1214065](https://github.com/ext/npm-pkg-lint/commit/12140655caab805ce03c68e8e39e0c632b267e35))
- look for `.cjs` and `.mjs` when looking for "rc files" ([42a237f](https://github.com/ext/npm-pkg-lint/commit/42a237f115f2f4c529f730fe1e1c9434ee72d314))

## [2.1.0](https://github.com/ext/npm-pkg-lint/compare/v2.0.3...v2.1.0) (2023-11-23)

### Features

- persistent cache for npm package data ([ddc2083](https://github.com/ext/npm-pkg-lint/commit/ddc2083461ac5c4538e13313419e1fab951c06a3))

## [2.0.3](https://github.com/ext/npm-pkg-lint/compare/v2.0.2...v2.0.3) (2023-09-15)

### Dependency upgrades

- **deps:** update dependency tar to v6.2.0 ([0151497](https://github.com/ext/npm-pkg-lint/commit/0151497f3e429de0070a75d6fca116ba9862e519))

## [2.0.2](https://github.com/ext/npm-pkg-lint/compare/v2.0.1...v2.0.2) (2023-08-23)

### Dependency upgrades

- **deps:** update dependency execa to v8 ([0ce6c1f](https://github.com/ext/npm-pkg-lint/commit/0ce6c1f12c6ef6a55117e1d8a88eb4fb896c22b3))

## [2.0.1](https://github.com/ext/npm-pkg-lint/compare/v2.0.0...v2.0.1) (2023-08-15)

### Dependency upgrades

- **deps:** update dependency @html-validate/stylish to v4.2.0 ([96fee79](https://github.com/ext/npm-pkg-lint/commit/96fee7962136016ebc99616c68453a967deb1b82))

## [2.0.0](https://github.com/ext/npm-pkg-lint/compare/v1.14.1...v2.0.0) (2023-07-28)

### ⚠ BREAKING CHANGES

- require nodejs 16 or later

### Features

- require nodejs 16 or later ([b038f51](https://github.com/ext/npm-pkg-lint/commit/b038f51af1eddc2be33712cb516f586a8bc46cab))

### Bug Fixes

- warn about node versions < 16 ([db74b48](https://github.com/ext/npm-pkg-lint/commit/db74b4834187eb0b15e9476f09713e5920973623))

### Dependency upgrades

- **deps:** update dependency @html-validate/stylish to v4.0.1 ([2227039](https://github.com/ext/npm-pkg-lint/commit/2227039b6955ecbea1bf435375f36221b7bbf01f))
- **deps:** update dependency @html-validate/stylish to v4.1.0 ([baa7473](https://github.com/ext/npm-pkg-lint/commit/baa7473664bc0c1508bae82bcdf06456ebb49c31))
- **deps:** update dependency execa to v7.2.0 ([4fb750d](https://github.com/ext/npm-pkg-lint/commit/4fb750dfbade81fbf4c8ff046beaaa6987bbd699))
- **deps:** update dependency semver to v7.5.1 ([535ac47](https://github.com/ext/npm-pkg-lint/commit/535ac4745d677f54817f0d2229d9084083d8b876))
- **deps:** update dependency semver to v7.5.2 ([4cf73e5](https://github.com/ext/npm-pkg-lint/commit/4cf73e559228c34db1cad86c628a0e69203ae611))
- **deps:** update dependency semver to v7.5.3 ([e91f05c](https://github.com/ext/npm-pkg-lint/commit/e91f05caa2b0b8ef56c55744ccb48f87cf6751e7))
- **deps:** update dependency semver to v7.5.4 ([d123287](https://github.com/ext/npm-pkg-lint/commit/d1232879c9455adea046f66c86b73c0b7abe882b))
- **deps:** update dependency tar to v6.1.14 ([4e26a31](https://github.com/ext/npm-pkg-lint/commit/4e26a31ab6dd873fd7444a2817470d49747dc18a))
- **deps:** update dependency tar to v6.1.15 ([f87b2c6](https://github.com/ext/npm-pkg-lint/commit/f87b2c6bfb59b32f6ac677fc12ea4cc1a679044e))

## [1.14.1](https://github.com/ext/npm-pkg-lint/compare/v1.14.0...v1.14.1) (2023-05-04)

### Bug Fixes

- npm package fix ([63933f9](https://github.com/ext/npm-pkg-lint/commit/63933f9d2873cf071825aaa97d17bdda66165c95))

## [1.14.0](https://github.com/ext/npm-pkg-lint/compare/v1.13.0...v1.14.0) (2023-05-02)

### Features

- ensure typescript `types` comes first in `exports` ([1e76b9b](https://github.com/ext/npm-pkg-lint/commit/1e76b9b413cc4d743daac00056f4847054bc147f))

## [1.13.0](https://github.com/ext/npm-pkg-lint/compare/v1.12.0...v1.13.0) (2023-04-30)

### Features

- migrate to esm ([51b4f90](https://github.com/ext/npm-pkg-lint/commit/51b4f9097747ea9ff36541c93a1e711c76a298eb))

### Dependency upgrades

- **deps:** update dependency @html-validate/stylish to v4 ([23c0be0](https://github.com/ext/npm-pkg-lint/commit/23c0be008cd39afff42199916f01804ae46b8d8f))
- **deps:** update dependency execa to v7 ([f63c699](https://github.com/ext/npm-pkg-lint/commit/f63c699589d1dce00b6d0b3da945389cef569b80))
- **deps:** update dependency find-up to v6 ([a2b6d5c](https://github.com/ext/npm-pkg-lint/commit/a2b6d5c74958ecd30638fbac295d9f02d0d3f839))
- **deps:** update dependency semver to v7.5.0 ([36c11eb](https://github.com/ext/npm-pkg-lint/commit/36c11eb7e155a18c774fdbb9e508c0b6531c1672))

## [1.12.0](https://github.com/ext/npm-pkg-lint/compare/v1.11.2...v1.12.0) (2023-04-13)

### Features

- verify `exports` field in `package.json` ([6a7408f](https://github.com/ext/npm-pkg-lint/commit/6a7408f8813fbec13a9e53ee1f0f2db0068e5681)), closes [#159](https://github.com/ext/npm-pkg-lint/issues/159)

### Dependency upgrades

- **deps:** update dependency semver to v7.4.0 ([0e53246](https://github.com/ext/npm-pkg-lint/commit/0e532463488f556f6232189e621b30e300d10e1b))

## [1.11.2](https://github.com/ext/npm-pkg-lint/compare/v1.11.1...v1.11.2) (2023-01-15)

### Bug Fixes

- dont minify and add sourcemap instead ([bebaafd](https://github.com/ext/npm-pkg-lint/commit/bebaafd233adf25e9a09f9f9a133b99d2f349443))
- ignore @types/node when verifying transitive engine constraints ([d9fed79](https://github.com/ext/npm-pkg-lint/commit/d9fed79944661d03377f33e3863160713490c228))

### Dependency upgrades

- **deps:** update dependency semver to v7.3.8 ([420b1d6](https://github.com/ext/npm-pkg-lint/commit/420b1d68f189d73383f902fc920e3309afddff21))
- **deps:** update dependency tar to v6.1.13 ([f1f0394](https://github.com/ext/npm-pkg-lint/commit/f1f03943e68605c6554b4dd99a187b9434b1929e))

### [1.11.1](https://github.com/ext/npm-pkg-lint/compare/v1.11.0...v1.11.1) (2022-05-25)

### Bug Fixes

- disallow (spec|test).d.ts.map ([8fce5dd](https://github.com/ext/npm-pkg-lint/commit/8fce5dd59b2c9713b171d64b8e0f5b80801b5588))

### Dependency upgrades

- **deps:** update dependency @html-validate/stylish to v3 ([5754f8d](https://github.com/ext/npm-pkg-lint/commit/5754f8dc4f8ee9a5ec178c78fed72fab927bad85))

## [1.11.0](https://github.com/ext/npm-pkg-lint/compare/v1.10.0...v1.11.0) (2022-05-02)

### Features

- mark node 12 as EOL ([5c279f1](https://github.com/ext/npm-pkg-lint/commit/5c279f103cbc94ae9c40d4cb83621e3113c89e49))
- require node 14 ([b46016f](https://github.com/ext/npm-pkg-lint/commit/b46016fdfc043b0c810be827c4705a39df0924a6))

### Dependency upgrades

- **deps:** update dependency semver to v7.3.6 ([a6374dc](https://github.com/ext/npm-pkg-lint/commit/a6374dc14547e6096e7ddef0a80c9d8ad15b65eb))
- **deps:** update dependency semver to v7.3.7 ([2f32363](https://github.com/ext/npm-pkg-lint/commit/2f32363d405337b08d303d6ecb3fb7d9fcba6cec))

## [1.10.0](https://github.com/ext/npm-pkg-lint/compare/v1.9.1...v1.10.0) (2022-03-24)

### Features

- allow prettier packages as dependency if keywords include `"prettier"` ([19ad790](https://github.com/ext/npm-pkg-lint/commit/19ad7909c1129f1aa496e99c0ea7eeee9852c6ad))

### [1.9.1](https://github.com/ext/npm-pkg-lint/compare/v1.9.0...v1.9.1) (2022-03-10)

### Bug Fixes

- disallow Jenkinsfile ([ec9db2e](https://github.com/ext/npm-pkg-lint/commit/ec9db2e3832a8b4b6191546ff1b4cd260df27684))

## [1.9.0](https://github.com/ext/npm-pkg-lint/compare/v1.8.0...v1.9.0) (2022-03-01)

### Features

- allow eslint packages as dependency if keywords include `"eslint"` ([7f582d1](https://github.com/ext/npm-pkg-lint/commit/7f582d1cebee8ddbdc33fb347e0725feda957181))
- disallow scoped eslint packages and formatters ([780bef1](https://github.com/ext/npm-pkg-lint/commit/780bef1fc99f98ed89ee14641c0e1a9bd13cf0c2))

## [1.8.0](https://github.com/ext/npm-pkg-lint/compare/v1.7.0...v1.8.0) (2022-03-01)

### Features

- disallow windows reserved filenames ([c5dd47e](https://github.com/ext/npm-pkg-lint/commit/c5dd47ea7e9a7e67b4bcce09bc7dfc2713e1afd9))

## [1.7.0](https://github.com/ext/npm-pkg-lint/compare/v1.6.0...v1.7.0) (2022-02-20)

### Features

- disallow `*.spec.js.map` files ([f5773d3](https://github.com/ext/npm-pkg-lint/commit/f5773d3ca50324a77cc371121c4ed7052f86d2a4))

### Dependency upgrades

- **deps:** pin dependencies ([664ea7b](https://github.com/ext/npm-pkg-lint/commit/664ea7b274940112e0821a4c8c7a2629f53f8350))
- **deps:** update dependency @html-validate/stylish to v2.0.1 ([ebae0ce](https://github.com/ext/npm-pkg-lint/commit/ebae0ce488adbdc347ba016551186305a3358b68))
- **deps:** update dependency tar to v6.1.11 ([d52d912](https://github.com/ext/npm-pkg-lint/commit/d52d912bb65253f0643b52065ab536dc123a2caa))

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

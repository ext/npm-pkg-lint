import ava from "./ava";
import emacs from "./emacs";
import eslint from "./eslint";
import fimbullinter from "./fimbullinter";
import git from "./git";
import { directory, extension, filename, rcfile } from "./helpers";
import jest from "./jest";
import node from "./node";
import prettier from "./prettier";
import typescript from "./typescript";
import windows from "./windows";

const blacklist: RegExp[] = [
	/* tests in general */
	directory(".nyc_output"),
	directory("coverage"),
	extension(".lcov"),
	extension("[.-]junit.xml"),
	filename(".istanbul.yml"),
	filename("junit.xml"),
	filename("lcov.info"),
	filename(".airtap.yml"),
	rcfile(".c8rc"),
	rcfile(".nycrc"),

	/* tests */
	directory("examples?"),
	directory("perf"),
	directory("tests?"),
	filename("cypress.json"),
	filename("cypress.config.js"),
	filename("cypress.config.cjs"),
	filename("cypress.config.mjs"),
	filename("cypress.config.ts"),
	filename("karma.config.js"),
	filename("mocha.opts"),
	filename("playwright.config.js"),
	filename("playwright.config.cjs"),
	filename("playwright.config.mjs"),
	filename("playwright.config.ts"),
	filename("test.js"),
	filename("testem.json"),
	filename("testem.yml"),
	filename("wallaby.config.js"),
	filename("wallaby.js"),

	/* linting */
	filename(".htmlvalidate.json"),
	filename(".jshintignore"),
	filename(`tslint.json`),
	filename(`tslint.yaml`),
	filename(".jscs.json"),
	rcfile(`.jscsrc`),
	rcfile(`.jshintrc`),

	/* toolchains */
	filename("rollup.config.js"),
	filename("webpack.config.js"),

	/* task runners */
	filename("[gG]runtfile.js"),
	filename("[gG]ulpfile.[jt]s"),
	filename("dangerfile.[jt]s"),
	filename("gulpfile.babel.js"),
	filename("gulpfile.esm.js"),
	filename("Herebyfile.js"),
	filename("Herebyfile.mjs"),

	/* ci */
	/^\.azure-.*$/,
	directory(".circleci"),
	directory(".github"),
	directory(".gitlab"),
	directory(".?zuul.d"),
	filename(".coveralls.yml"),
	filename(".gitlab-ci.yml"),
	filename(".travis.yml"),
	filename(".?zuul.ya?ml"),
	filename("ISSUE_TEMPLATE.md"),
	filename("Jenkinsfile"),
	filename("PULL_REQUEST_TEMPLATE.md"),
	filename("appveyor.yml"),

	/* editor specific files */
	/(^|\/)\.sw[a-p]/ /* vim */,
	directory(".vscode"),
	extension(".sublime-project"),
	extension(".sublime-workspace"),
	filename(".vscodeignore"),
	filename("Session.vim"),
	filename("Sessionx.vim"),
	directory(".idea"),
	filename(".tm_properties") /* textmate */,

	/* OS */
	directory(".AppleDouble"),
	directory(".DS_Store"),
	directory(".LSOverride"),

	/* logs */
	directory("logs"),
	extension(".log"),

	/* runtime */
	directory("pids"),
	extension(".pid"),
	extension(".pid.lock"),
	extension(".seed"),

	/* misc */
	/^[Jj]akefile(\.js)?$/,
	extension(".bak"),
	extension(".swp"),
	extension(".tgz"),
	extension(".tmp"),
	filename(".env"),
	filename(".svgo.yml"),
	filename(".editorconfig"),
	filename(".ext-prepush"),
	filename(".tonic_example.js"),
	filename(".flowconfig"),
	filename(".cardinalrc"),
	filename("bower.json"),
	filename("commitlint.config.js") /* commitlint */,
	filename("composer.json"),
	filename("netlify.toml"),
	filename("release.config.js") /* semantic release */,

	...ava,
	...emacs,
	...eslint,
	...fimbullinter,
	...git,
	...jest,
	...node,
	...prettier,
	...typescript,
	...windows,
];

export default blacklist;

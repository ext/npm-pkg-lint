import emacs from "./emacs";
import eslint from "./eslint";
import fimbullinter from "./fimbullinter";
import git from "./git";
import jest from "./jest";
import node from "./node";
import prettier from "./prettier";
import typescript from "./typescript";
import windows from "./windows";
import { directory, extension, filename, rcfile } from "./helpers";

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
	rcfile(".nycrc"),

	/* tests */
	directory("examples?"),
	directory("perf"),
	directory("tests?"),
	filename("cypress.json"),
	filename("karma.config.js"),
	filename("mocha.opts"),
	filename("protractor.config.js"),
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

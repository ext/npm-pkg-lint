const branches = require("@html-validate/semantic-release-config/lib/branches");
const changelog = require("@html-validate/semantic-release-config/lib/changelog");
const commitAnalyzer = require("@html-validate/semantic-release-config/lib/commit-analyzer");
const exec = require("@html-validate/semantic-release-config/lib/exec");
const git = require("@html-validate/semantic-release-config/lib/git");
const npm = require("@html-validate/semantic-release-config/lib/npm");
const releaseNotesGenerator = require("@html-validate/semantic-release-config/lib/release-notes-generator");

const plugins = [
	["@semantic-release/commit-analyzer", commitAnalyzer],
	["@semantic-release/release-notes-generator", releaseNotesGenerator],
	["@semantic-release/npm", npm],
	["@semantic-release/github", {}],
	["@semantic-release/changelog", changelog],
	["@semantic-release/exec", exec],
	["@semantic-release/git", git],
];

module.exports = { branches, plugins };

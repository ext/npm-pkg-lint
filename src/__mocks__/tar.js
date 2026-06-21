const tar = jest.createMockFromModule("tar");
let mockFilelist;

function list(options) {
	for (const filename of mockFilelist) {
		options.onReadEntry({
			path: filename,
		});
	}
	return Promise.resolve();
}

function __setMockFiles(filelist) {
	/* eslint-disable-next-line unicorn/no-top-level-assignment-in-function -- technical debt, should use explicit state variable */
	mockFilelist = filelist.map((it) => `pkg-root/${it}`);
}

tar.__setMockFiles = __setMockFiles;
tar.list = list;

module.exports = tar;

const tar = jest.createMockFromModule("tar");
let mockFilelist;

function list(options) {
	for (const filename of mockFilelist) {
		options.onentry({
			path: filename,
		});
	}
	return Promise.resolve();
}

function __setMockFiles(filelist) {
	mockFilelist = filelist.map((it) => `pkg-root/${it}`);
}

tar.__setMockFiles = __setMockFiles;
tar.list = list;

module.exports = tar;

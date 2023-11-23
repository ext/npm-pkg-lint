import { isBlacklisted } from "../blacklist";

it.each(["#foo#", ".dir-locals.el", "dir/#foo#", "dir/.dir-locals.el", "dir/foo~", "foo~"])(
	"%s",
	(filePath) => {
		expect.assertions(1);
		expect(isBlacklisted(filePath)).toBeTruthy();
	},
);

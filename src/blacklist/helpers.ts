/* eslint-disable security/detect-non-literal-regexp -- expected to be non-literal */

export function escape(text: string): string {
	return text.replace(/\./, "\\.");
}

export function directory(path: string): RegExp {
	return new RegExp(`(^|/)${path}/`);
}

export function extension(ext: string): RegExp {
	return new RegExp(`${escape(ext)}$`);
}

export function filename(path: string): RegExp {
	return new RegExp(`(^|/)${escape(path)}$`);
}

export function rcfile(base: string): RegExp {
	return new RegExp(`${escape(base)}(\\.(js|cjs|mjs|ts|yaml|yml|json))?$`);
}

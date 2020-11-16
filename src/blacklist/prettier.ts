import { filename, rcfile } from "./helpers";

const regexp: RegExp[] = [filename(".prettierignore"), rcfile(`.prettierrc`)];

export default regexp;

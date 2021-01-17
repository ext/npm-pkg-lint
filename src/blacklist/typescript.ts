import { directory, filename } from "./helpers";

const regexp: RegExp[] = [directory(".tsbuildinfo"), filename("tsconfig.json")];

export default regexp;

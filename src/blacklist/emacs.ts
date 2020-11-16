import { filename } from "./helpers";

const regexp: RegExp[] = [/#.*#$/, /~$/, filename(".dir-locals.el")];

export default regexp;

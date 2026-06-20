export class ValidationError extends Error {
	public validator: string;

	/* eslint-disable-next-line unicorn/custom-error-definition -- technical debt */
	public constructor(validator: string, message: string) {
		super(message);
		this.name = "ValidationError";
		this.validator = validator;
	}
}

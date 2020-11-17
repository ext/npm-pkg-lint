export class ValidationError extends Error {
	public validator: string;

	public constructor(validator: string, message: string) {
		super(message);
		this.validator = validator;
	}
}

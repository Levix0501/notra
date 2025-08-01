export class WrappedResponseError extends Error {
	public readonly message: string;

	constructor(opts: { message?: string }) {
		super(opts.message ?? 'Wrapped Response Error');

		Object.setPrototypeOf(this, WrappedResponseError.prototype);
		this.name = WrappedResponseError.prototype.constructor.name;

		this.message = opts.message ?? 'Wrapped Response Error';
	}
}

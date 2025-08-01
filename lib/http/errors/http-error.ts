export class HttpError extends Error {
	public readonly url: string | undefined;
	public readonly method: string | undefined;
	public readonly statusCode: number;
	public readonly message: string;

	constructor(opts: {
		url?: string;
		method?: string;
		statusCode: number;
		message?: string;
	}) {
		super(opts.message ?? `HTTP Error ${opts.statusCode} `);

		Object.setPrototypeOf(this, HttpError.prototype);
		this.name = HttpError.prototype.constructor.name;

		this.url = opts.url;
		this.method = opts.method;
		this.statusCode = opts.statusCode;
		this.message = opts.message ?? `HTTP Error ${opts.statusCode}`;
	}

	public static fromRequest(request: Request, response: Response) {
		return new HttpError({
			url: response.url,
			method: request.method,
			statusCode: response.status,
			message: response.statusText
		});
	}
}

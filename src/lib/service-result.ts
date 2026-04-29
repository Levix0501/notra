import { NextResponse } from 'next/server';

import { WrappedResponse } from '@/types/common';

/**
 * ServiceResult is a class that represents the result of a service call
 * @template T - The type of the data
 */
export class ServiceResult<T = unknown> {
	success: boolean = false;
	message: string = '';
	data: T;

	constructor(success: boolean, message: string, data: T) {
		this.success = success;
		this.message = message;
		this.data = data;
	}

	static success<T = unknown>(data: T, message: string = '') {
		return new ServiceResult<T>(true, message, data);
	}

	static fail(message: string) {
		return new ServiceResult(false, message, null);
	}

	async nextResponse(init?: ResponseInit): Promise<Response> {
		return NextResponse.json(
			{
				success: this.success,
				message: this.message,
				data: this.data
			},
			init
		);
	}

	toPlainObject(): WrappedResponse<T> {
		return {
			success: this.success,
			message: this.message,
			data: this.data
		};
	}
}

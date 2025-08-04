import { WrappedResponse } from '@/types/common';

import { HttpError } from './errors/http-error';
import { WrappedResponseError } from './errors/wrapped-response-error';
import { RequestConfig } from './types';

export class HttpClient {
	private async request<T = unknown>(path: string, config?: RequestConfig) {
		const normalizedPath = path.startsWith('/') ? path : `/${path}`;

		const request = new Request(normalizedPath, {
			...config,
			headers: {
				...(config?.data instanceof FormData
					? void 0
					: { 'Content-Type': 'application/json' }),
				...config?.headers
			}
		});

		const response = await fetch(request);

		if (!response.ok) {
			const errJson = await response.json();
			const err = HttpError.fromRequest(request, {
				...response,
				url: response.url,
				status: response.status,
				statusText: errJson.errorMessage ?? response.statusText
			});

			throw err;
		}

		const result = (await response.json()) as WrappedResponse<T>;

		if (result.success) {
			return result.data;
		}

		throw new WrappedResponseError({ message: result.message });
	}

	get<T = unknown>(path: string, config?: RequestConfig) {
		return this.request<T>(path, { ...config, method: 'GET' });
	}

	post<T = unknown>(path: string, config?: RequestConfig) {
		return this.request<T>(path, {
			...config,
			method: 'POST',
			body:
				config?.data instanceof FormData
					? config.data
					: JSON.stringify(config?.data)
		});
	}

	put<T = unknown>(path: string, config?: RequestConfig) {
		return this.request<T>(path, {
			...config,
			method: 'PUT',
			body:
				config?.data instanceof FormData
					? config.data
					: JSON.stringify(config?.data)
		});
	}

	delete<T = unknown>(path: string, config?: RequestConfig) {
		return this.request<T>(path, { ...config, method: 'DELETE' });
	}
}

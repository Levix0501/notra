import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

import { HttpError } from './http/errors/http-error';
import { WrappedResponseError } from './http/errors/wrapped-response-error';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Process error and fallback to a handler if the error is not an instance of HttpError or WrappedResponseError
 * @param error - The error to process
 * @param fallbackHandler - The handler to fallback to if the error is not an instance of HttpError or WrappedResponseError
 */
export const processError = (error: unknown, fallbackHandler: () => void) => {
	if (error instanceof HttpError) {
		toast.error(error.message);
	} else if (error instanceof WrappedResponseError) {
		toast.error(error.message);
	} else {
		fallbackHandler();
	}
};

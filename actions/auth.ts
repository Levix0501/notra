'use server';

import { AccountService } from '@/services/account';
import { LoginDto } from '@/types/auth';

export const login = async (loginDto: LoginDto) => {
	const serviceResult = await AccountService.login(loginDto);

	return serviceResult.toPlainObject();
};

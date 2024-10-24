export const responseMessages = {
	MISSING_PARAMETERS: (params: string[]) => `Missing parameters: ${params.join(', ')}`,
	PASSWORD_LENGTH: 'Password must be betwee 6 and 500 character',
	SERVER_ERROR: 'Internal server error',
	USER_NOT_FOUND: 'User not found',
	WRONG_PASSWORD: 'Wrong password',
	UNAUTHORIZED: 'Unauthorized',
	USER_CREATED: 'User created',
	USER_UPDATED: 'User updated',
	USER_DELETED: 'User deleted',
	LOGGED: 'Logged',
	EMAIL_USED: 'Email already used'
};

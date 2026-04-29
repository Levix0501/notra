export const logger = (name: string, message: unknown) => {
	// console.log(`${name}: ${JSON.stringify(message, null, 2)}`);
	console.log(`[${name}]`, message);
};

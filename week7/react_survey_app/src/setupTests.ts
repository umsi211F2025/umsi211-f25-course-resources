// Optional: Suppress React 18 act() warnings for teaching/demo clarity
const originalError = console.error;
console.error = (...args) => {
	if (
		typeof args[0] === 'string' &&
		args[0].includes('The current testing environment is not configured to support act')
	) {
		return;
	}
	originalError(...args);
};

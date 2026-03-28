const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+'

export function generatePassword(length = 16): string {
	const array = new Uint32Array(length)
	crypto.getRandomValues(array)
	return Array.from(array, (val) => CHARSET[val % CHARSET.length]).join('')
}

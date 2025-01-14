export function reverseAndMixEmail(email: string): string {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('El formato del correo no es válido.');
    }
    const reversedEmail = email.split('').reverse().join('');
    const mixAlgorithm = (str: string): string => {
        const indices = [3, 1, 4, 0, 2];
        let result = '';

        for (let i = 0; i < str.length; i++) {
            const index = indices[i % indices.length];
            result += str[(i + index) % str.length];
        }

        return result;
    };
    const mixedEmail = mixAlgorithm(reversedEmail);

    return mixedEmail;
}
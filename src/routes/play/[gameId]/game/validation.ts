import { distance } from 'fastest-levenshtein';

export function validateAnswer(input: string, correct: string): boolean {
	const inputClean = input.trim().toLowerCase();
	const correctClean = correct.trim().toLowerCase();

	const maxAllowedDistance = Math.ceil(correct.length * 0.15); // 15% leniency
	return distance(inputClean, correctClean) <= maxAllowedDistance;
}

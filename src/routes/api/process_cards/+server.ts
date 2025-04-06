import { processFlashcards } from '$lib/sever/llms';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const cardJson = await request.json();
	const cards = await processFlashcards(cardJson);
	return json(cards);
};

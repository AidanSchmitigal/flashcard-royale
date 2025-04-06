import { processFlashcards } from '$lib/sever/llms';
import { getDeckFromQuizlet } from '$lib/sever/quizlet';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const quizlet_url = await request.text();
	const cards = await getDeckFromQuizlet(quizlet_url);
	return json(cards);
};

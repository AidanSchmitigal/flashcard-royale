import { processFlashcards } from "$lib/sever/llms";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const cardsJson = await request.json();
    const processed = await processFlashcards(cardsJson)
    return json(processed);
};

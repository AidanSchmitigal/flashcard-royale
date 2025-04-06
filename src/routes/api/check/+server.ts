import { getCorrect } from "$lib/sever/llms";
import { json, type RequestHandler } from "@sveltejs/kit";

// Probably should get the card id or something
// Or check the db if security matters
export const POST: RequestHandler = async ({ request }) => {
    const json = await request.json();
    const is_correct = getCorrect(json.question, json.answer, json.user)
    return json({ correct: is_correct });
};

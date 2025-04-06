import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { processFlashcards } from '$lib/sever/statsLLM';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();
        const cards = data.cards;
        
        if (!cards || !Array.isArray(cards)) {
            return json({ error: 'Invalid cards data' }, { status: 400 });
        }

        // Process the cards through the LLM
        const processedCards = await processFlashcards(cards);
        
        return json({ 
            success: true,
            processedCards
        });
    } catch (error) {
        console.error('Error processing deck:', error);
        return json({ 
            error: 'Failed to process deck', 
            details: error.message 
        }, { status: 500 });
    }
};

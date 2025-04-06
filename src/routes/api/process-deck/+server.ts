import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { v4 as uuidv4 } from 'uuid';
import { processFlashcards } from '$lib/sever/llms';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();
        const cards = data.cards;
        
        if (!cards || !Array.isArray(cards)) {
            return json({ error: 'Invalid cards data' }, { status: 400 });
        }

        // Process the cards through the LLM
        const processedCardStats = await processFlashcards(cards);
        return json({ 
            success: true,
            x: processedCardStats
        });
        
        // Ensure each card has all the required fields
        const processedCards = processedCardStats.map(card => {
            return {
                term: card.term,
                definition: card.definition,
                id: card.id || uuidv4(), // Use existing ID or generate new one
                base_health: card.base_health || 5,
                base_dmg: card.base_dmg || 10
            };
        });
        
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

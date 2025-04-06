import axios from 'axios';

interface Card {
    cardID: string;
    question: string;
    answer: string;
    base_health: number;
    base_dmg: number;
}

interface LLMResponse {
    isCorrect: boolean;
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}'; // Replace with the actual Gemini LLM API URL
const GEMINI_API_KEY = 'AIzaSyCIgomPMh9mI1CxfknDweyLykZM8db_6vQ'; // Replace with your actual API key

/**
 * Evaluates the user's answer against the card's answer using Gemini's LLM.
 * @param card - The card JSON object containing question and answer details.
 * @param userAnswer - The user's answer to the card's question.
 * @returns A promise that resolves to a boolean indicating if the user's answer is correct.
 */
export async function evaluateAnswer(card: Card, userAnswer: string): Promise<boolean> {
    try {
        const prompt = `
            Question: ${card.question}
            Correct Answer: ${card.answer}
            User's Answer: ${userAnswer}
            Is the user's answer correct? Respond with "true" or "false".
        `;

        const response = await axios.post<LLMResponse>(
            GEMINI_API_URL,
            { prompt },
            {
                headers: {
                    'Authorization': `Bearer ${GEMINI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.isCorrect;
    } catch (error) {
        console.error('Error evaluating answer with Gemini LLM:', error);
        throw new Error('Failed to evaluate the answer.');
    }
}
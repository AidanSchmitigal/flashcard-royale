import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'

// Function to calculate base damage
function calculateBaseDamage(): number {
    return Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10 for base_dmg
}

const API_KEY = process.env.GEMINI_API_KEY!;

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

async function callGemini(prompt: string): Promise<string | null> {
	try {
		const result = await model.generateContent(prompt);
		const response = result.response;
		const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
		return text || null;
	} catch (error: any) {
		console.error("Error calling Gemini API:", error);
		return null;
	}
}

// Function to get difficulty from Gemini
export async function getDifficultyFromGemini(question: string): Promise<number> {
	try {
		const text = await callGemini(`Rank the difficulty of this question on a scale from 1 (easy) to 10 (hard): "${question}"`)

		const parsed = parseInt(text!.match(/\d+/)?.[0] || '1');
		return Math.min(Math.max(parsed, 1), 10);
	} catch (err) {
		console.error('Error fetching difficulty from Gemini:', err);
		return 1;
	}
}

export async function getCorrect(question: string, answer: string, user: string): Promise<boolean> {
	try {
		const text = await callGemini(`Answer true or false is the user was correct about the question: "${question}" with the answer: "${answer}" and the user's answers as ${user}. Answer only one word true or false.`)

		// Lazy
		return text?.toLowerCase() == 'true';
	} catch (err) {
		console.error('Error fetching difficulty from Gemini:', err);
		return false;
	}
}

// Function to process a full deck of flashcards
export async function processFlashcards(inputJson: QuizCard[]): Promise<Card[]> {
    const cards: Card[] = [];

    for (const card of inputJson) {
        const baseHealth = await getDifficultyFromGemini(card.question);
        const baseDamage = calculateBaseDamage();

        const cardObject: Card = {
            question: card.question,
            answer: card.answer,
            baseHealth: baseHealth,
            baseDamage: baseDamage,
        };

        cards.push(cardObject);
    }

    return cards;
}


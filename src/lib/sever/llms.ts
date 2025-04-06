import type { FlashCard } from "$lib/client/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'
import { GEMINI_API_KEY } from '$env/static/private';

// Function to calculate base damage
function calculateBaseDamage(): number {
    return Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10 for base_dmg
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

// AI
function removePartsBeforeAndAfterBrackets(input: string): string {
    const startIndex = input.indexOf('[');
    const endIndex = input.indexOf(']');

    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        return input.substring(startIndex, endIndex + 1);
    }

    // If there's no valid substring between brackets, return an empty string or handle as needed
    return '';
}

async function callGemini(prompt: string): Promise<string | null> {
	try {
		const result = await model.generateContent(prompt);
		const response = result.response;
		const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
		return text || null;
	} catch (error: any) {
		console.error("Error calling Gemini API:", error);
		return process.env;
	}
}

// Function to get difficulty from Gemini
export async function getDifficultyFromGemini(cards: FlashCard[]): Promise<any | null> {
	const questionsAndAnswers = cards.map((card) => { return { question: card.term, answer: card.definition } })
	const promptData = JSON.stringify(questionsAndAnswers)

	try {
		const text = await callGemini(
			`For each of these flash cards give them an attack and defense between 1 and 10 based on the difficulties of the cards in order.
			 Make the attack and defense different add some randomness. MAKE THEM VERY DIFFERENT IN SOME CASES
			 Output using the JSON schema [{reason: string, attack: int, defense: int}, ...]
			 OUTPUT NO OTHER TEXT THAN THE FORMATTED RESPONSE.
			 Flashcards: ${promptData}`)

		return text;
		//return JSON.parse(removePartsBeforeAndAfterBrackets(text));
	} catch (err) {
		console.error('Error fetching difficulty from Gemini:', err);
		return err;
		return cards.map((card) => { return { attack: Math.floor(Math.random() * 11), defense: Math.floor(Math.random() * 11) } });
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
export async function processFlashcards(cards: FlashCard[]): Promise<FlashCard[]> {
	try {
		let difficulties = await getDifficultyFromGemini(cards);
		return difficulties;

		for (let i = 0; i < cards.length; i++) {
			let random_attack = Math.random() * 4 - 2;
			let random_defense = Math.random() * 4 - 2
			cards[i].base_dmg = Math.min(Math.max(Math.round(difficulties[i].attack + random_attack), 0), 10)
			cards[i].base_health = Math.min(Math.max(Math.round(difficulties[i].defense + random_defense), 0), 10)
		}

		return difficulties;
	} catch (err) {
		console.error('Failed to use cards:', err);
		return err;
		//return cards;
	}
}


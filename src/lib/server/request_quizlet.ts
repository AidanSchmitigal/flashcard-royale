import type { Card } from "./card_schema";
import { addDoc, collection, Firestore } from "firebase/firestore";

function gen_url(id: string): string {
    console.log(`https://quizlet.com/webapi/3.4/studiable-item-documents?filters%5BstudiableContainerId%5D=${id}&filters%5BstudiableContainerType%5D=1&perPage=100&page=1`)
    return `https://quizlet.com/webapi/3.4/studiable-item-documents?filters%5BstudiableContainerId%5D=${id}&filters%5BstudiableContainerType%5D=1&perPage=100&page=1`
}

export function parse_url(url: string): string | null {
    const match = url.match(/quizlet\.com\/(\d+)\//);
    if (match && match[1]) {
        return match[1];
    }

    return null;
}

// Would be nice to use Zod Schema
export async function get(id: string): Promise<any | null> {
    try {
        const resp = await fetch(gen_url(id))
        return await resp.json()
    } catch {
        console.log("Failed request quizlet")
        return null
    }
}

export function get_cards(data: any): Card[] {
    const cards: Card[] = [];

    console.log(data)

    for (const item in data.responses[0].models.studiableItem) {
        const question = item[0]
        const answer = item[1]

        cards.push({ question: question, answer: answer })
    }

    return cards
}

export async function upload_cards(cards: Card[], db: Firestore) {
    await addDoc(collection(db, 'quizzes'), cards);
}

import { get, get_cards, parse_url } from "$lib/server/request_quizlet"
import type { RequestEvent } from "@sveltejs/kit"

export async function POST({ request }: RequestEvent) {
    const req = await request.json()

    const parsed = parse_url(req.url)
    get(parsed as string).then((got: any | null) => {
        console.log(got)
        const cards = get_cards(got as any)
    })
}

import { get, get_cards, parse_url } from "$lib/server/request_quizlet"
import type { RequestEvent } from "@sveltejs/kit"

export async function POST({ request }: RequestEvent) {
    const req = await request.json()

    let a = await fetch('https://quizlet.com/webapi/3.4/studiable-item-documents?filters%5BstudiableContainerId%5D=255972996&filters%5BstudiableContainerType%5D=1&perPage=100&page=1')
    let b = await a.text()
    console.log(b)

    const parsed = parse_url(req.url)
    get(parsed as string).then((got: any | null) => {
        const cards = get_cards(got as any)
        console.log(cards[0])
    })
}

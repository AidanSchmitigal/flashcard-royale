import { z } from "zod";

const card_schema = z.object({
    'question': z.string(),
    'answer': z.string(),
})

export type Card = z.infer<typeof card_schema>

import { z } from "zod";

const cards_schema = z.array(z.object({
    'question': z.string(),
    'answer': z.string(),
}))

type Card = z.infer<typeof cards_schema>

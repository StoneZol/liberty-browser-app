import { z } from "zod"

export const ContactSchema = z.object({
    id: z.string(),
    seedHash: z.string(),
    tag: z.string(),
    noiseLength: z.number(),
    description: z.string(),
})

export type Contact = z.infer<typeof ContactSchema>

export const LibertyStoreSchema = z.object({
    data: z.object({
        user: z.enum(['anon']),
        contacts: z.array(ContactSchema)
    })
})
export type LibertyStore = z.infer<typeof LibertyStoreSchema>
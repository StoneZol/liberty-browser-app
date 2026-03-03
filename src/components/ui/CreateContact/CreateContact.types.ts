import z from "zod"

const seedPhraseBase = z.string().min(8, { message: "Seed phrase is required" })

const noiseLengthBase = z.string()
    .regex(/^\d+$/, { message: "Only digits 0-9 are allowed" })
    .refine((value) => {
        const parsed = parseInt(value, 10)
        return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 512
    }, { message: "Max value is 512" })

const iterationsBase = z.string()
    .regex(/^\d+$/, { message: "Only digits 0-9 are allowed" })
    .refine((value) => {
        const parsed = parseInt(value, 10)
        return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 1000000
    }, { message: "Max value is 1000000" })

export const ContactFormSchema = z.object({
    seedPhrase: seedPhraseBase,
    tag: z.string(),
    noiseLength: noiseLengthBase,
    description: z.string(),
    iterations: iterationsBase,
})
export type ContactFormType = z.infer<typeof ContactFormSchema>

export const EditContactFormSchema = z.object({
    seedPhrase: seedPhraseBase.optional().or(z.literal("")),
    tag: z.string(),
    noiseLength: noiseLengthBase,
    description: z.string(),
    iterations: iterationsBase,
})
export type EditContactFormType = z.infer<typeof EditContactFormSchema>
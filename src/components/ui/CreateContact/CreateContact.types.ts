import z from "zod"

export const ContactFormSchema = z.object({
    seedPhrase: z.string().min(8, { message: "Seed phrase is required" }),
    tag: z.string(),
    noiseLength: z.string()
        .regex(/^\d+$/, { message: "Only digits 0-9 are allowed" })
        .refine((value) => {
            const parsed = parseInt(value, 10)
            return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 512
        }, { message: "Max value is 512" }),
    description: z.string(),
})
export type ContactFormType = z.infer<typeof ContactFormSchema>
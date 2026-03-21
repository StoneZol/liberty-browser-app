import { z } from "zod";

const iterationsBase = z.string().refine(
    (value) => {
        const trimmed = value.trim();
        if (trimmed === "") return true;
        if (!/^\d+$/.test(trimmed)) return false;
        const parsed = parseInt(trimmed, 10);
        return !Number.isNaN(parsed) && parsed >= 1 && parsed <= 999_000_000_000;
    },
    { message: "Only digits 0-9; iterations must be between 1 and 999000000000" },
);

export const AuthFormSchema = z.object({
    Iterations: iterationsBase,
    Password: z.string().min(8),
});

export type AuthFormSchemaType = z.infer<typeof AuthFormSchema>;
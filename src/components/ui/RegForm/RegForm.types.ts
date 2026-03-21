import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RegFormProps = {}

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

export const RegFormSchema = z
    .object({
        Iterations: iterationsBase,
        Password: z.string().min(8),
        ConfirmPassword: z.string().min(8),
        AlertPassword: z.string().min(8),
        ConfirmAlertPassword: z.string().min(8),
    })
    .superRefine((data, ctx) => {
        if (data.Password !== data.ConfirmPassword) {
            ctx.addIssue({
                code: 'custom',
                path: ['ConfirmPassword'],
                message: 'Passwords must match',
            });
        }

        if (data.AlertPassword !== data.ConfirmAlertPassword) {
            ctx.addIssue({
                code: 'custom',
                path: ['ConfirmAlertPassword'],
                message: 'Alert passwords must match',
            });
        }
    });

export type RegFormSchemaType = z.infer<typeof RegFormSchema>;
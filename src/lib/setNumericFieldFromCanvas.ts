import type { FieldPath, FieldValues, PathValue, UseFormSetValue } from "react-hook-form";

export function setNumericFieldFromCanvas<
    TFieldValues extends FieldValues,
    TFieldName extends FieldPath<TFieldValues>,
>(
    setValue: UseFormSetValue<TFieldValues>,
    raw: string,
    fieldName: TFieldName,
    limit: number,
): void {
    const digitsOnly = raw.replace(/\D/g, "");

    if (digitsOnly === "") {
        setValue(fieldName, "" as PathValue<TFieldValues, TFieldName>, { shouldValidate: true });
        return;
    }

    let numeric = parseInt(digitsOnly, 10);
    if (numeric > limit) numeric = limit;

    const next = String(numeric);
    setValue(fieldName, next as PathValue<TFieldValues, TFieldName>, { shouldValidate: true });
}

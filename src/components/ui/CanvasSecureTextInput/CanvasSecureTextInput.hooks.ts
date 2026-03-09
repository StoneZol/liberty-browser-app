import * as React from "react";

interface UseCanvasSecureTextInputParams {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    mask?: boolean;
}

interface LineColumnInfo {
    line: number;
    column: number;
    lines: string[];
}

interface UseCanvasSecureTextInputResult {
    caretIndex: number;
    isFocused: boolean;
    showCaret: boolean;
    isPlaceholder: boolean;
    displayText: string;
    handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    handleInput: (textareaValue: string, caretPosition?: number) => string | null;
    handleFocus: () => void;
    handleBlur: () => void;
    getLineColumnFromIndex: (index: number) => LineColumnInfo;
}

const useCanvasSecureTextInput = ({
    value,
    onChange,
    placeholder,
    mask = false,
}: UseCanvasSecureTextInputParams): UseCanvasSecureTextInputResult => {
    const [caretIndex, setCaretIndex] = React.useState(value.length);
    const [isFocused, setIsFocused] = React.useState(false);
    const [showCaret, setShowCaret] = React.useState(true);

    // следим за внешними изменениями value (сброс формы и т.п.)
    React.useEffect(() => {
        if (caretIndex > value.length) {
            setCaretIndex(value.length);
        }
    }, [value.length, caretIndex]);

    // мигание каретки, пока поле в фокусе
    React.useEffect(() => {
        if (!isFocused) {
            setShowCaret(false);
            return;
        }
        setShowCaret(true);
        const id = window.setInterval(() => {
            setShowCaret((prev) => !prev);
        }, 500);
        return () => window.clearInterval(id);
    }, [isFocused]);

    const getLineColumnFromIndex = React.useCallback(
        (index: number): LineColumnInfo => {
            const text = value;
            const lines = text.split("\n");
            let remaining = index;

            for (let i = 0; i < lines.length; i++) {
                const lineLength = lines[i].length;
                if (remaining <= lineLength) {
                    return {
                        line: i,
                        column: remaining,
                        lines,
                    };
                }
                // +1 за символ перевода строки
                remaining -= lineLength + 1;
            }

            const lastLineIndex = Math.max(0, lines.length - 1);
            return {
                line: lastLineIndex,
                column: lines[lastLineIndex]?.length ?? 0,
                lines,
            };
        },
        [value]
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        let next = value;
        let nextCaret = caretIndex;

        if (event.key === "Backspace") {
            if (caretIndex === 0) {
                event.preventDefault();
                return;
            }
            next = value.slice(0, caretIndex - 1) + value.slice(caretIndex);
            nextCaret = caretIndex - 1;
        } else if (event.key === "Delete") {
            if (caretIndex >= value.length) {
                event.preventDefault();
                return;
            }
            next = value.slice(0, caretIndex) + value.slice(caretIndex + 1);
        } else if (event.key === "Enter") {
            next = value.slice(0, caretIndex) + "\n" + value.slice(caretIndex);
            nextCaret = caretIndex + 1;
        } else if (event.key === "ArrowLeft") {
            if (caretIndex > 0) {
                nextCaret = caretIndex - 1;
            }
        } else if (event.key === "ArrowRight") {
            if (caretIndex < value.length) {
                nextCaret = caretIndex + 1;
            }
        } else if (event.key === "Home") {
            const { line, lines } = getLineColumnFromIndex(caretIndex);
            const offsetBeforeLine = lines
                .slice(0, line)
                .reduce((acc, l) => acc + l.length + 1, 0);
            nextCaret = offsetBeforeLine;
        } else if (event.key === "End") {
            const { line, lines } = getLineColumnFromIndex(caretIndex);
            const offsetBeforeLine = lines
                .slice(0, line)
                .reduce((acc, l) => acc + l.length + 1, 0);
            nextCaret = offsetBeforeLine + (lines[line]?.length ?? 0);
        } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            const { line, column, lines } = getLineColumnFromIndex(caretIndex);
            const targetLine =
                event.key === "ArrowUp" ? Math.max(0, line - 1) : Math.min(lines.length - 1, line + 1);

            const offsetBeforeTarget = lines
                .slice(0, targetLine)
                .reduce((acc, l) => acc + l.length + 1, 0);
            const targetColumn = Math.min(column, lines[targetLine]?.length ?? 0);
            nextCaret = offsetBeforeTarget + targetColumn;
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            next = value.slice(0, caretIndex) + event.key + value.slice(caretIndex);
            nextCaret = caretIndex + 1;
        } else {
            // даём пройти системным шорткатам (Ctrl+C и т.п.)
            return;
        }

        if (next !== value) {
            onChange(next);
        }
        setCaretIndex(nextCaret);
        event.preventDefault();
    };

    // обработка Ctrl+V через глобальный paste, пока поле в фокусе
    React.useEffect(() => {
        if (!isFocused) return;

        const handleWindowPaste = (event: ClipboardEvent) => {
            const pasted = event.clipboardData?.getData("text") ?? "";
            if (!pasted) return;

            const next = value.slice(0, caretIndex) + pasted + value.slice(caretIndex);
            const nextCaret = caretIndex + pasted.length;

            if (next !== value) {
                onChange(next);
            }
            setCaretIndex(nextCaret);
            event.preventDefault();
        };

        window.addEventListener("paste", handleWindowPaste);
        return () => {
            window.removeEventListener("paste", handleWindowPaste);
        };
    }, [isFocused, caretIndex, value, onChange]);

    const isPlaceholder = !value && !!placeholder;

    const displayText = mask && value
        ? value.replace(/[^\n]/g, "•")
        : (value || placeholder || "");

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    // обработка input события с мобильных клавиатур
    const handleInput = React.useCallback((textareaValue: string, caretPosition?: number): string | null => {
        // если значение не изменилось, только обновляем позицию каретки
        if (textareaValue === value) {
            if (caretPosition !== undefined && caretPosition !== caretIndex) {
                setCaretIndex(caretPosition);
            }
            return value; // возвращаем текущее значение для синхронизации
        }

        // находим позицию первого различия
        let diffStart = 0;
        while (diffStart < value.length && diffStart < textareaValue.length && value[diffStart] === textareaValue[diffStart]) {
            diffStart++;
        }

        // находим позицию последнего различия с конца
        let diffEndOld = value.length;
        let diffEndNew = textareaValue.length;
        while (diffEndOld > diffStart && diffEndNew > diffStart && value[diffEndOld - 1] === textareaValue[diffEndNew - 1]) {
            diffEndOld--;
            diffEndNew--;
        }

        // вычисляем что было добавлено
        const inserted = textareaValue.slice(diffStart, diffEndNew);

        // новая позиция каретки: используем переданную позицию или вычисляем
        const newCaretIndex = caretPosition !== undefined ? caretPosition : (diffStart + inserted.length);

        // формируем новое значение
        const next = value.slice(0, diffStart) + inserted + value.slice(diffEndOld);

        if (next !== value) {
            onChange(next);
        }
        setCaretIndex(newCaretIndex);

        return next; // возвращаем новое значение для синхронизации textarea
    }, [value, caretIndex, onChange]);

    return {
        caretIndex,
        isFocused,
        showCaret,
        isPlaceholder,
        displayText,
        handleKeyDown,
        handleInput,
        handleFocus,
        handleBlur,
        getLineColumnFromIndex,
    };
};

export default useCanvasSecureTextInput;


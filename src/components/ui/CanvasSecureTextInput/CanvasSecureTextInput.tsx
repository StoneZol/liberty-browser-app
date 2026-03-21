import * as React from "react";
import { Stage, Layer, Rect, Text as KonvaText } from "react-konva";
import SecureCanvasContainer from "../SecureCanvasContainer";
import { useTheme } from "@/hooks/useTheme";
import type { CanvasSecureTextInputProps } from "./CanvasSecureTextInput.types";
import useCanvasSecureTextInput from "./CanvasSecureTextInput.hooks";

const CanvasSecureTextInput: React.FC<CanvasSecureTextInputProps> = ({
    id,
    value,
    onChange,
    className,
    placeholder,
    wrap = "word",
    mask = false,
    minHeight = 120,
    enableOverlay = true,
}) => {
    const isDark = useTheme();
    const hiddenInputRef = React.useRef<HTMLTextAreaElement | null>(null);
    const isSyncingRef = React.useRef(false); // флаг для предотвращения рекурсии при синхронизации

    const {
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
    } = useCanvasSecureTextInput({
        value,
        onChange,
        placeholder,
        mask,
    });

    const FONT_SIZE = 14;
    const LINE_HEIGHT = 1.4;
    const PADDING_X = 8;
    const PADDING_Y = 8;
    const CHAR_WIDTH = 8;

    // синхронизация фокуса: когда контейнер получает фокус → фокусируем textarea
    React.useEffect(() => {
        if (isFocused && hiddenInputRef.current) {
            // используем setTimeout чтобы избежать конфликта с событиями blur/focus
            const timeoutId = setTimeout(() => {
                if (hiddenInputRef.current && document.activeElement !== hiddenInputRef.current) {
                    hiddenInputRef.current.focus();
                    // синхронизируем значение textarea с нашим value (для корректной работы каретки)
                    if (hiddenInputRef.current.value !== value) {
                        isSyncingRef.current = true;
                        hiddenInputRef.current.value = value;
                        hiddenInputRef.current.setSelectionRange(caretIndex, caretIndex);
                        setTimeout(() => {
                            isSyncingRef.current = false;
                        }, 0);
                    }
                }
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [isFocused, value, caretIndex]);

    // обработка фокуса на textarea: если textarea получил фокус → убеждаемся что контейнер тоже в фокусе
    const handleTextareaFocus = () => {
        if (!isFocused) {
            handleFocus();
        }
    };

    // обработка blur на textarea: проверяем, не переходит ли фокус на контейнер
    const handleTextareaBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        // используем setTimeout чтобы дать браузеру время обработать события фокуса
        setTimeout(() => {
            const activeElement = document.activeElement;
            // если фокус все еще на textarea — не теряем фокус
            if (activeElement === hiddenInputRef.current) {
                return;
            }
            // проверяем, не является ли relatedTarget контейнером (через id)
            const relatedTarget = event.relatedTarget as HTMLElement | null;
            if (relatedTarget && relatedTarget.id === id) {
                return;
            }
            // иначе теряем фокус только если он действительно потерян
            if (isFocused && activeElement !== hiddenInputRef.current) {
                handleBlur();
            }
        }, 0);
    };

    // обработка input события (для мобильных клавиатур)
    const handleTextareaInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
        // если мы сами синхронизируем значение, игнорируем событие
        if (isSyncingRef.current) {
            return;
        }

        const textarea = event.currentTarget;
        const textareaValue = textarea.value;

        // сохраняем позицию каретки из textarea (она уже обновлена браузером)
        const newCaretPos = textarea.selectionStart;

        // обрабатываем изменения через наш handleInput, передавая позицию каретки
        // handleInput возвращает новое значение для синхронизации
        const newValue = handleInput(textareaValue, newCaretPos);

        // синхронизируем textarea с обработанным значением после обработки
        // используем requestAnimationFrame чтобы дать браузеру обработать событие
        if (newValue !== null) {
            requestAnimationFrame(() => {
                if (hiddenInputRef.current && hiddenInputRef.current.value !== newValue) {
                    isSyncingRef.current = true;
                    hiddenInputRef.current.value = newValue;
                    // восстанавливаем позицию каретки
                    hiddenInputRef.current.setSelectionRange(newCaretPos, newCaretPos);
                    // сбрасываем флаг после небольшой задержки
                    setTimeout(() => {
                        isSyncingRef.current = false;
                    }, 0);
                }
            });
        }
    };

    return (
        <SecureCanvasContainer
            id={id}
            className={className}
            tabIndex={0}
            onFocus={handleFocus}
            onBlur={(e) => {
                // проверяем, не переходит ли фокус на textarea
                const relatedTarget = e.relatedTarget as HTMLElement | null;
                if (relatedTarget === hiddenInputRef.current) {
                    return;
                }
                handleBlur();
            }}
            minHeight={minHeight}
            showOverlay={enableOverlay}
        >
            {(size) => (
                <>
                    <textarea
                        ref={hiddenInputRef}
                        className="absolute left-0 top-0 h-full w-full opacity-0 pointer-events-none"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        onKeyDown={(event) => handleKeyDown(event as unknown as React.KeyboardEvent<HTMLDivElement>)}
                        onInput={handleTextareaInput}
                        onFocus={handleTextareaFocus}
                        onBlur={handleTextareaBlur}
                    />
                    <Stage width={size.width} height={size.height}>
                        <Layer width={size.width} height={size.height}>
                            <Rect
                                x={0}
                                y={0}
                                width={size.width}
                                height={size.height}
                                fill={isDark ? "rgba(15,15,15,0.8)" : "rgba(255,255,255,0.8)"}
                            />
                            <KonvaText
                                x={8}
                                y={8}
                                width={size.width - 16}
                                text={displayText}
                                fontSize={FONT_SIZE}
                                fontFamily="monospace"
                                fill={
                                    isPlaceholder
                                        ? "rgba(148,163,184,0.8)"
                                        : isDark
                                            ? "white"
                                            : "#000"
                                }
                                lineHeight={LINE_HEIGHT}
                                listening={false}
                                wrap={wrap}
                            />
                            {isFocused && showCaret && (() => {
                                const { line, column } = getLineColumnFromIndex(caretIndex);
                                const caretX = PADDING_X + column * CHAR_WIDTH;
                                const caretY = PADDING_Y + line * FONT_SIZE * LINE_HEIGHT;
                                return (
                                    <Rect
                                        x={caretX}
                                        y={caretY}
                                        width={1}
                                        height={FONT_SIZE}
                                        fill={isDark ? "white" : "#000"}
                                    />
                                );
                            })()}
                        </Layer>
                    </Stage>
                </>
            )}
        </SecureCanvasContainer>
    );
};

export default CanvasSecureTextInput;


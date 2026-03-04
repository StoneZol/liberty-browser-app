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

    const {
        caretIndex,
        isFocused,
        showCaret,
        isPlaceholder,
        displayText,
        handleKeyDown,
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

    return (
        <SecureCanvasContainer
            id={id}
            className={className}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            minHeight={minHeight}
            showOverlay={enableOverlay}
        >
            {(size) => (
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
            )}
        </SecureCanvasContainer>
    );
};

export default CanvasSecureTextInput;


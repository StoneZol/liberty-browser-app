import * as React from "react";
import { Stage, Layer, Rect, Text as KonvaText } from "react-konva";
import SecureCanvasContainer from "../SecureCanvasContainer";
import { useTheme } from "@/hooks/useTheme";

interface CanvasSecureTextInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

const CanvasSecureTextInput: React.FC<CanvasSecureTextInputProps> = ({
    value,
    onChange,
    className,
    placeholder,
}) => {
    const isDark = useTheme();
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        let next = value;

        if (event.key === "Backspace") {
            next = value.slice(0, -1);
        } else if (event.key === "Enter") {
            next = value + "\n";
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            next = value + event.key;
        } else {
            return;
        }

        onChange(next);
        event.preventDefault();
    };

    const displayText = value || placeholder || "";
    const isPlaceholder = !value && !!placeholder;

    return (
        <SecureCanvasContainer
            className={className}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {(size) => (
                <Stage width={size.width} height={size.height}>
                    <Layer>
                        <Rect x={0} y={0} width={size.width} height={size.height} fill={isDark ? "rgba(15,15,15,0.8)" : "rgba(255,255,255,0.8)"} />
                        <KonvaText
                            x={8}
                            y={8}
                            width={size.width - 16}
                            text={displayText}
                            fontSize={14}
                            fontFamily="monospace"
                            fill={isPlaceholder ? "rgba(148,163,184,0.8)" : isDark ? "white" : "#000"}
                            lineHeight={1.4}
                            listening={false}
                        />
                    </Layer>
                </Stage>
            )}
        </SecureCanvasContainer>
    );
};

export default CanvasSecureTextInput;


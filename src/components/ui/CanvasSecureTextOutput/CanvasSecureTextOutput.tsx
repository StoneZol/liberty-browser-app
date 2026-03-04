import * as React from "react";
import { Stage, Layer, Rect, Text as KonvaText } from "react-konva";
import SecureCanvasContainer from "../SecureCanvasContainer";
import { useTheme } from "@/hooks/useTheme";

interface CanvasSecureTextOutputProps {
    id?: string;
    value: string;
    className?: string;
}

const CanvasSecureTextOutput: React.FC<CanvasSecureTextOutputProps> = ({ id, value, className }) => {
    const isDark = useTheme();
    return (
        <SecureCanvasContainer id={id || undefined} className={className}>
            {(size) => (
                <Stage width={size.width} height={size.height}>
                    <Layer>
                        <Rect x={0} y={0} width={size.width} height={size.height} fill={isDark ? "rgba(15,15,15,0.8)" : "rgba(255,255,255,0.8)"} />
                        <KonvaText
                            x={8}
                            y={8}
                            width={size.width - 16}
                            text={value}
                            fontSize={14}
                            fontFamily="monospace"
                            fill={isDark ? "white" : "#000"}
                            lineHeight={1.4}
                            listening={false}
                        />
                    </Layer>
                </Stage>
            )}
        </SecureCanvasContainer>
    );
};

export default CanvasSecureTextOutput;


import * as React from "react";
import { Stage, Layer, Text as KonvaText } from "react-konva";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

interface CanvasContactLabelProps {
    label: string;
    className?: string;
}

const ROW_HEIGHT = 32;

const CanvasContactLabel: React.FC<CanvasContactLabelProps> = ({ label, className }) => {
    const isDark = useTheme();
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = React.useState(0);

    React.useLayoutEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setWidth(rect.width);
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn("relative h-8 w-full flex items-center", className)}
        >
            {width > 0 && (
                <Stage width={width} height={ROW_HEIGHT}>
                    <Layer>
                        <KonvaText
                            x={4}
                            y={ROW_HEIGHT / 2 - 6}
                            width={width - 8}
                            text={label}
                            fontSize={12}
                            fontFamily="monospace"
                            fill={isDark ? "#e5e7eb" : "#000"}
                            listening={false}
                        />
                    </Layer>
                </Stage>
            )}
        </div>
    );
};

export default CanvasContactLabel;


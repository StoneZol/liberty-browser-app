import * as React from "react";
import { Stage, Layer, Rect, Text as KonvaText } from "react-konva";
import { cn } from "@/lib/utils";

interface CanvasSecureTextOutputProps {
    value: string;
    className?: string;
}

const MIN_HEIGHT = 120;

const CanvasSecureTextOutput: React.FC<CanvasSecureTextOutputProps> = ({ value, className }) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [size, setSize] = React.useState({ width: 0, height: MIN_HEIGHT });
    const [spot, setSpot] = React.useState<{ x: number; y: number } | null>(null);
    const radius = 30;

    React.useLayoutEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setSize((prev) => ({
                width: rect.width,
                height: prev.height ?? MIN_HEIGHT,
            }));
        }
    }, []);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setSpot({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    };

    const handleMouseLeave = () => {
        setSpot(null);
    };

    const handleResizeStart = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        const startY = event.clientY;
        const startHeight = size.height || MIN_HEIGHT;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientY - startY;
            const nextHeight = Math.max(MIN_HEIGHT, startHeight + delta);
            setSize((prev) => ({ ...prev, height: nextHeight }));
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp, { once: true });
    };

    const overlayStyle: React.CSSProperties = spot
        ? {
            backgroundImage: `radial-gradient(circle ${radius}px at ${spot.x}px ${spot.y}px, transparent 0, transparent ${radius - 8}px, rgba(0,0,0,1) ${radius - 4}px, rgba(0,0,0,1) 100%)`,
        }
        : {
            backgroundColor: "rgba(0,0,0,1)",
        };

    return (
        <div
            ref={containerRef}
            className={cn("relative min-h-[120px] w-full rounded-md bg-muted", className)}
            style={{ height: size.height || MIN_HEIGHT }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {size.width > 0 && size.height > 0 && (
                <Stage width={size.width} height={size.height}>
                    <Layer>
                        <Rect x={0} y={0} width={size.width} height={size.height} fill={"rgba(15,15,15,0.8)"} />
                        <KonvaText
                            x={8}
                            y={8}
                            width={size.width - 16}
                            text={value}
                            fontSize={14}
                            fontFamily="monospace"
                            fill="white"
                            lineHeight={1.4}
                            listening={false}
                        />
                    </Layer>
                </Stage>
            )}
            <div
                className="pointer-events-none absolute inset-0 rounded-md p-4"
                style={overlayStyle}
            />
            <div
                className="absolute bottom-1 right-1 h-3 w-3 cursor-ns-resize rounded-sm bg-muted-foreground/40"
                onMouseDown={handleResizeStart}
            />
        </div>
    );
};

export default CanvasSecureTextOutput;


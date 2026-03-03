import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

interface SecureCanvasContainerProps {
    children: (size: { width: number; height: number }) => React.ReactNode;
    className?: string;
    minHeight?: number;
    radius?: number;
    enableResize?: boolean;
    tabIndex?: number;
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

const SecureCanvasContainer: React.FC<SecureCanvasContainerProps> = ({
    children,
    className,
    minHeight = 120,
    radius = 40,
    enableResize = true,
    tabIndex,
    onKeyDown,
}) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [size, setSize] = React.useState({ width: 0, height: minHeight });
    const [spot, setSpot] = React.useState<{ x: number; y: number } | null>(null);
    const isDark = useTheme();
    React.useLayoutEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setSize((prev) => ({
                width: rect.width,
                height: prev.height ?? minHeight,
            }));
        }
    }, [minHeight]);

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

    const handleContainerTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        if (event.touches.length === 0) return;

        // блокируем нативный скролл страницы, пока пользователь «ведёт» по канвасу
        event.preventDefault();

        const rect = event.currentTarget.getBoundingClientRect();
        const touch = event.touches[0];
        setSpot({
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        });
    };

    const handleContainerTouchEnd = () => {
        setSpot(null);
    };

    const handleResizeStart = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!enableResize) return;
        event.preventDefault();

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const currentY = moveEvent.clientY;
            const nextHeight = Math.max(minHeight, currentY - rect.top);
            setSize((prev) => ({ ...prev, height: nextHeight }));

            // если низ контейнера уходит за границу вьюпорта — докручиваем страницу вниз
            const bottom = rect.top + nextHeight;
            const viewportHeight = window.innerHeight;
            if (bottom > viewportHeight) {
                const scrollDelta = bottom - viewportHeight;
                window.scrollBy({ top: scrollDelta, behavior: "auto" });
            }
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp, { once: true });
    };

    const handleTouchResizeStart = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!enableResize) return;
        if (event.touches.length === 0) return;

        event.preventDefault();

        const handleTouchMove = (moveEvent: TouchEvent) => {
            if (moveEvent.touches.length === 0) return;

            // не даём браузеру воспринимать этот жест как скролл
            moveEvent.preventDefault();

            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const currentY = moveEvent.touches[0].clientY;
            const nextHeight = Math.max(minHeight, currentY - rect.top);
            setSize((prev) => ({ ...prev, height: nextHeight }));

            // автоскролл вниз, если низ контейнера вышел за вьюпорт
            const bottom = rect.top + nextHeight;
            const viewportHeight = window.innerHeight;
            if (bottom > viewportHeight) {
                const scrollDelta = bottom - viewportHeight;
                window.scrollBy({ top: scrollDelta, behavior: "auto" });
            }
        };

        const handleTouchEnd = () => {
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };

        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleTouchEnd);
    };

    const overlayStyle: React.CSSProperties = spot
        ? {
            backgroundImage: `radial-gradient(circle ${radius}px at ${spot.x}px ${spot.y}px, transparent 0, transparent ${radius - 8}px, ${isDark ? "rgba(0,0,0,1)" : "rgb(230, 230, 230)"} ${radius - 4}px, ${isDark ? "rgba(0,0,0,1)" : "rgb(230, 230, 230)"} 100%)`,
        }
        : {
            backgroundColor: isDark ? "rgba(0,0,0,1)" : "rgb(230, 230, 230)",
        };

    return (
        <div
            ref={containerRef}
            tabIndex={tabIndex}
            className={cn(
                "relative w-full rounded-lg bg-muted overflow-hidden outline",
                className
            )}
            style={{ height: size.height || minHeight, minHeight, touchAction: "none" }}
            onKeyDown={onKeyDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleContainerTouchMove}
            onTouchEnd={handleContainerTouchEnd}
            onTouchCancel={handleContainerTouchEnd}
        >
            {size.width > 0 && size.height > 0 && children(size)}
            <div
                className="pointer-events-none absolute inset-0 rounded-md"
                style={overlayStyle}
            />
            {enableResize && (
                <div
                    className="absolute bottom-1 right-1 h-3 w-3 cursor-ns-resize rounded-sm bg-muted-foreground/80 "
                    onMouseDown={handleResizeStart}
                    onTouchStart={handleTouchResizeStart}
                />
            )}
        </div>
    );
};

export default SecureCanvasContainer;

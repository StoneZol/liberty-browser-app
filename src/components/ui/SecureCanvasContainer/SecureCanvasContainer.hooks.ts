import * as React from "react";
import { useTheme } from "@/hooks/useTheme";
import type { SecureCanvasSize } from "./SecureCanvasContainer.types";

interface UseSecureCanvasContainerParams {
    minHeight: number;
    radius: number;
    enableResize: boolean;
}

interface UseSecureCanvasContainerResult {
    containerRef: React.RefObject<HTMLDivElement | null>;
    size: SecureCanvasSize;
    overlayStyle: React.CSSProperties;
    handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    handleMouseLeave: () => void;
    handleContainerTouchMove: (event: React.TouchEvent<HTMLDivElement>) => void;
    handleContainerTouchEnd: () => void;
    handleResizeStart: (event: React.MouseEvent<HTMLDivElement>) => void;
    handleTouchResizeStart: (event: React.TouchEvent<HTMLDivElement>) => void;
}

const useSecureCanvasContainer = ({
    minHeight,
    radius,
    enableResize,
}: UseSecureCanvasContainerParams): UseSecureCanvasContainerResult => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [size, setSize] = React.useState<SecureCanvasSize>({ width: 0, height: minHeight });
    const [spot, setSpot] = React.useState<{ x: number; y: number } | null>(null);
    const isDark = useTheme();

    React.useLayoutEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        const updateSize = () => {
            const width = node.clientWidth;
            setSize((prev) => ({
                width,
                height: prev.height ?? minHeight,
            }));
        };
        updateSize();

        const rafId =
            typeof window !== "undefined"
                ? window.requestAnimationFrame(() => {
                    updateSize();
                })
                : 0;

        if (typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver(() => {
                updateSize();
            });
            observer.observe(node);

            return () => {
                observer.disconnect();
                if (rafId) {
                    window.cancelAnimationFrame(rafId);
                }
            };
        }

        window.addEventListener("resize", updateSize);
        return () => {
            window.removeEventListener("resize", updateSize);
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }
        };
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

        const handleMouseMoveInner = (moveEvent: MouseEvent) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const currentY = moveEvent.clientY;
            const nextHeight = Math.max(minHeight, currentY - rect.top);
            setSize((prev) => ({ ...prev, height: nextHeight }));

            const bottom = rect.top + nextHeight;
            const viewportHeight = window.innerHeight;
            if (bottom > viewportHeight) {
                const scrollDelta = bottom - viewportHeight;
                window.scrollBy({ top: scrollDelta, behavior: "auto" });
            }
        };

        const handleMouseUpInner = () => {
            window.removeEventListener("mousemove", handleMouseMoveInner);
        };

        window.addEventListener("mousemove", handleMouseMoveInner);
        window.addEventListener("mouseup", handleMouseUpInner, { once: true });
    };

    const handleTouchResizeStart = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!enableResize) return;
        if (event.touches.length === 0) return;

        event.preventDefault();

        const handleTouchMoveInner = (moveEvent: TouchEvent) => {
            if (moveEvent.touches.length === 0) return;

            moveEvent.preventDefault();

            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const currentY = moveEvent.touches[0].clientY;
            const nextHeight = Math.max(minHeight, currentY - rect.top);
            setSize((prev) => ({ ...prev, height: nextHeight }));

            const bottom = rect.top + nextHeight;
            const viewportHeight = window.innerHeight;
            if (bottom > viewportHeight) {
                const scrollDelta = bottom - viewportHeight;
                window.scrollBy({ top: scrollDelta, behavior: "auto" });
            }
        };

        const handleTouchEndInner = () => {
            window.removeEventListener("touchmove", handleTouchMoveInner);
            window.removeEventListener("touchend", handleTouchEndInner);
        };

        window.addEventListener("touchmove", handleTouchMoveInner, { passive: false });
        window.addEventListener("touchend", handleTouchEndInner);
    };

    const overlayStyle: React.CSSProperties = spot
        ? {
            backgroundImage: `radial-gradient(circle ${radius}px at ${spot.x}px ${spot.y}px, transparent 0, transparent ${radius - 8}px, ${isDark ? "rgba(0,0,0,1)" : "rgb(230, 230, 230)"} ${radius - 4}px, ${isDark ? "rgba(0,0,0,1)" : "rgb(230, 230, 230)"} 100%)`,
        }
        : {
            backgroundColor: isDark ? "rgba(0,0,0,1)" : "rgb(230, 230, 230)",
        };

    return {
        containerRef,
        size,
        overlayStyle,
        handleMouseMove,
        handleMouseLeave,
        handleContainerTouchMove,
        handleContainerTouchEnd,
        handleResizeStart,
        handleTouchResizeStart,
    };
};

export default useSecureCanvasContainer;


import * as React from "react";
import { cn } from "@/lib/utils";
import type { SecureCanvasContainerProps } from "./SecureCanvasContainer.types";
import useSecureCanvasContainer from "./SecureCanvasContainer.hooks";

const SecureCanvasContainer: React.FC<SecureCanvasContainerProps> = ({
    id,
    children,
    className,
    minHeight = 120,
    radius = 40,
    enableResize = true,
    showOverlay = true,
    tabIndex,
    onKeyDown,
    onFocus,
    onBlur,
}) => {
    const {
        containerRef,
        size,
        overlayStyle,
        handleMouseMove,
        handleMouseLeave,
        handleContainerTouchMove,
        handleContainerTouchEnd,
        handleResizeStart,
        handleTouchResizeStart,
    } = useSecureCanvasContainer({
        minHeight,
        radius,
        enableResize,
    });

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        const activeElement = document.activeElement as HTMLElement | null;

        if (activeElement && event.currentTarget.contains(activeElement)) {
            return;
        }

        if (event.currentTarget !== document.activeElement) {
            event.currentTarget.focus();
        }
    };

    return (
        <div
            id={id || undefined}
            ref={containerRef}
            tabIndex={tabIndex}
            className={cn(
                "relative w-full rounded-lg bg-muted overflow-hidden",
                className
            )}
            style={{ height: size.height || minHeight, minHeight, touchAction: "none" }}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            onPointerDown={handlePointerDown}
            onMouseMove={showOverlay ? handleMouseMove : undefined}
            onMouseLeave={showOverlay ? handleMouseLeave : undefined}
            onTouchMove={showOverlay ? handleContainerTouchMove : undefined}
            onTouchEnd={showOverlay ? handleContainerTouchEnd : undefined}
            onTouchCancel={showOverlay ? handleContainerTouchEnd : undefined}
        >
            {size.width > 0 && size.height > 0 && children(size)}
            {showOverlay && (
                <div
                    className="pointer-events-none absolute inset-0 rounded-md"
                    style={overlayStyle}
                />
            )}
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


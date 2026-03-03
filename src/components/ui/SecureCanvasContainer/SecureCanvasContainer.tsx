import * as React from "react";
import { cn } from "@/lib/utils";
import type { SecureCanvasContainerProps } from "./SecureCanvasContainer.types";
import useSecureCanvasContainer from "./SecureCanvasContainer.logic";

const SecureCanvasContainer: React.FC<SecureCanvasContainerProps> = ({
    children,
    className,
    minHeight = 120,
    radius = 40,
    enableResize = true,
    tabIndex,
    onKeyDown,
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


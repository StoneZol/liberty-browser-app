import * as React from "react";

export interface SecureCanvasSize {
    width: number;
    height: number;
}

export interface SecureCanvasContainerProps {
    children: (size: SecureCanvasSize) => React.ReactNode;
    className?: string;
    minHeight?: number;
    radius?: number;
    enableResize?: boolean;
    tabIndex?: number;
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}



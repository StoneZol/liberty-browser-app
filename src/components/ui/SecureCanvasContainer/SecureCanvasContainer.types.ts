import * as React from "react";

export interface SecureCanvasSize {
    width: number;
    height: number;
}

export interface SecureCanvasContainerProps {
    id?: string;
    children: (size: SecureCanvasSize) => React.ReactNode;
    className?: string;
    minHeight?: number;
    radius?: number;
    enableResize?: boolean;
    showOverlay?: boolean;
    tabIndex?: number;
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
}



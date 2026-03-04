
export interface CanvasSecureTextInputProps {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    wrap?: "word" | "char" | undefined;
    mask?: boolean;
    minHeight?: number;
    enableOverlay?: boolean;
}


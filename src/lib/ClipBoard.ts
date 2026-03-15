import { toast } from 'sonner';

const copyToClipboard = (text: string, withToast: boolean = true) => {
    try {
        navigator.clipboard.writeText(text);
        if (withToast) {
            toast.success('Copied!');
        }
    } catch {

        if (withToast) {
            toast.error('Failed to copy:(');
        }
    }
};

const pasteFromClipboard = async (withToast: boolean = true) => {
    try {
        const text = await navigator.clipboard.readText();
        if (withToast) {
            toast.success('Pasted!');
        }
        return text;
    } catch {
        if (withToast) {
            toast.error('Failed to paste:(');
        }
        return null;
    }
};

export const clipBoard = {
    copy: copyToClipboard,
    paste: pasteFromClipboard,
}


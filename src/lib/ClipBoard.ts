import { toast } from 'sonner';

const copyToClipboard = (text: string) => {
    try {
        navigator.clipboard.writeText(text);
        toast.success('Copied!');
    } catch (error) {
        console.error(error);
        toast.error('Failed to copy:(');
    }
};

const pasteFromClipboard = async () => {
    try {
        const text = await navigator.clipboard.readText();
        toast.success('Pasted!');
        return text;
    } catch (error) {
        console.error(error);
        toast.error('Failed to paste:(');
        return null;
    }
};

export const clipBoard = {
    copy: copyToClipboard,
    paste: pasteFromClipboard,
}


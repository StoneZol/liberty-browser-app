import { useLibertyCoreStore } from "@/hooks/useLibertyCore";
import { clipBoard } from "@/lib/ClipBoard";
import { useState } from "react";
import type { MessageFormProps } from "./MessageForm.types";

export const useMessageForm = ({ contact }: MessageFormProps) => {
    const { encryptMessage, decryptMessage } = useLibertyCoreStore();

    const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
    const [plain, setPlain] = useState("");
    const [cipher, setCipher] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleModeChange = (value: string) => {
        setMode(value as "encrypt" | "decrypt");
        setPlain("");
        setCipher("");
        setError(null);
    };

    const handlePaste = async () => {
        const text = await clipBoard.paste();
        if (text && mode === "encrypt") {
            setPlain(text);
        }
        if (text && mode === "decrypt") {
            setCipher(text);
        }
    }
    const handleEncrypt = async () => {
        if (!contact) {
            setError("Pick a contact first, anon.");
            return;
        }
        const res = await encryptMessage(contact, plain);
        if (res.success) {
            setCipher(res.result as string);
            clipBoard.copy(res.result as string);
            setError(null);
        } else {
            setError(res.message);
        }
    };

    const handleDecrypt = async () => {
        if (!contact) {
            setError("Pick a contact first, anon.");
            return;
        }

        const text = cipher.trim();
        if (!text) {
            setError("Paste or type encrypted message first.");
            return;
        }

        const res = await decryptMessage(contact, text);
        if (res.success) {
            setPlain(res.result as string);
            setError(null);
        } else {
            setError(res.message);
        }
    };
    return {
        mode,
        plain,
        cipher,
        error,
        handleModeChange,
        handlePaste,
        handleEncrypt,
        handleDecrypt,
        setPlain,
        setCipher,
    }
}
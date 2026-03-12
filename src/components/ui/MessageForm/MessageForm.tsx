import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { Button } from "../button";
import type { MessageFormProps } from "./MessageForm.types";
import { useMessageForm } from "./MessageForm.hooks";
import CanvasSecureTextInput from "../CanvasSecureTextInput";
import CanvasSecureTextOutput from "../CanvasSecureTextOutput/CanvasSecureTextOutput";
import { Label } from "../label";
import { clipBoard } from "@/lib/ClipBoard";

const MessageForm = ({ contactId }: MessageFormProps) => {
    const {
        mode,
        plain,
        cipher,
        error,
        hasContact,
        handleModeChange,
        handlePaste,
        handleEncrypt,
        handleClear,
        handleDecrypt,
        setPlain,
        setCipher,
    } = useMessageForm({ contactId: contactId ?? null });


    return (
        <section className="flex flex-col gap-3 rounded-lg border bg-card p-4">
            <Tabs
                value={mode}
                onValueChange={handleModeChange}
                className="mt-2"
            >
                <TabsList className="mb-2" variant="line">
                    <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
                    <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
                </TabsList>

                <TabsContent value="encrypt" className="flex flex-col gap-3" asChild>
                    <form>
                        <Label htmlFor="plain">Message to encrypt</Label>
                        <CanvasSecureTextInput
                            id="plain"
                            value={plain}
                            onChange={setPlain}
                            placeholder="Plain message goes here…"
                        />
                        <Label htmlFor="cipher">Encrypted message</Label>
                        <CanvasSecureTextOutput id="cipher" value={cipher} />
                        <div className="flex justify-end gap-2">
                            <Button variant="destructive" type='button' size="sm" onClick={handleClear}>
                                Clear
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                size="sm"
                                onClick={handlePaste}
                            >
                                Paste
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                disabled={!plain.trim() || !hasContact}
                                onClick={handleEncrypt}
                            >
                                Encrypt
                            </Button>
                        </div>
                    </form>
                </TabsContent>

                <TabsContent value="decrypt" className="flex flex-col gap-3" asChild>
                    <form>
                        <Label htmlFor="cipher">Message to decrypt</Label>
                        <CanvasSecureTextInput
                            id="cipher"
                            value={cipher}
                            onChange={setCipher}
                            placeholder="Paste encrypted message…"
                        />
                        <Label htmlFor="plain">Decrypted message</Label>
                        <CanvasSecureTextOutput id="plain" value={plain} />
                        <p className="text-xs text-destructive empty:hidden">{error}</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="destructive" type='button' size="sm" onClick={handleClear}>
                                Clear
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                size="sm"
                                onClick={handlePaste}
                            >
                                Paste
                            </Button>
                            <Button variant="outline" type="button" size="sm" onClick={() => clipBoard.copy(plain)}>
                                Copy
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                disabled={!cipher.trim() || !hasContact}
                                onClick={handleDecrypt}
                            >
                                Decrypt
                            </Button>
                        </div>
                    </form>
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default MessageForm;


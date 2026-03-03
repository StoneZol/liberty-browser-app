import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { Button } from "../button";
import type { MessageFormProps } from "./MessageForm.types";
import { useMessageForm } from "./MessageForm.hooks";

const MessageForm = ({ contact }: MessageFormProps) => {


    const { mode, plain, cipher, error, handleModeChange, handlePaste, handleEncrypt, handleDecrypt, setPlain, setCipher } = useMessageForm({ contact });


    return (
        <section className="flex flex-col gap-3 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                    <p className="text-sm font-semibold">Encrypt / decrypt</p>
                    <p className="text-xs text-muted-foreground">
                        Use your selected contact config to wrap or unwrap messages over any transport.
                    </p>
                </div>
            </div>

            <Tabs
                value={mode}
                onValueChange={handleModeChange}
                className="mt-2"
            >
                <TabsList className="mb-2" variant="line">
                    <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
                    <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
                </TabsList>

                <TabsContent value="encrypt" className="flex flex-col gap-3">
                    <textarea
                        placeholder="Plain message goes here…"
                        value={plain}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setPlain(event.target.value)}
                        className="min-h-[120px] rounded-md border bg-background px-3 py-2 text-sm font-normal"
                    />
                    <textarea
                        placeholder="Encrypted message will appear here…"
                        value={cipher}
                        readOnly
                        className="min-h-[120px] rounded-md border bg-muted px-3 py-2 text-xs font-mono"
                    />
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            size="sm"
                            disabled={!plain.trim() || !contact}
                            onClick={handleEncrypt}
                        >
                            Encrypt
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="decrypt" className="flex flex-col gap-3">
                    <textarea
                        placeholder="Paste encrypted message…"
                        value={cipher}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setCipher(event.target.value)}
                        className="min-h-[120px] rounded-md border bg-background px-3 py-2 text-xs font-mono"
                    />
                    <textarea
                        placeholder="Decrypted message will appear here…"
                        value={plain}
                        readOnly
                        className="min-h-[120px] rounded-md border bg-muted px-3 py-2 text-sm"
                    />
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            size="sm"
                            onClick={handlePaste}
                        >
                            Paste
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={!contact}
                            onClick={handleDecrypt}
                        >
                            Decrypt
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default MessageForm;


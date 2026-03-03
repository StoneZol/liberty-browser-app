import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { Button } from "../button";
import type { MessageFormProps } from "./MessageForm.types";
import { useMessageForm } from "./MessageForm.hooks";
import CanvasSecureTextInput from "./CanvasSecureTextInput";
import CanvasSecureTextOutput from "./CanvasSecureTextOutput";

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
                    <CanvasSecureTextInput
                        value={plain}
                        onChange={setPlain}
                        placeholder="Plain message goes here…"
                    />
                    <CanvasSecureTextOutput value={cipher} />
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
                            disabled={!plain.trim() || !contact}
                            onClick={handleEncrypt}
                        >
                            Encrypt
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="decrypt" className="flex flex-col gap-3">
                    <CanvasSecureTextInput
                        value={cipher}
                        onChange={setCipher}
                        placeholder="Paste encrypted message…"
                    />
                    <CanvasSecureTextOutput value={plain} />
                    <p className="text-xs text-muted-foreground">{error}</p>
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


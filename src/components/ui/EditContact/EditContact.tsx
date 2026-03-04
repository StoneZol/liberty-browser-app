import { useState } from "react";
import type { Contact } from "@/lib/types";
import useEditContactHook from "./EditContact.hooks";
import { Label } from "../label";
import { Button } from "../button";
import { AlertDialogComponent } from "../alert-dialog";
import { libertyCore } from "liberty-core";
import { Separator } from "../separator";
import { TemplatePopover } from "../popover";
import CanvasSecureTextInput from "../CanvasSecureTextInput";

interface EditContactProps {
    contact: Contact | null;
    onDone?: () => void;
}

const EditContact = ({ contact, onDone }: EditContactProps) => {
    const {
        form,
        onSubmit,
        onDelete,
        handleNoiseLengthChange,
        handleIterationsChange,
        storedSeedHash,
        checkedSeedHash,
        storedConfigHash,
        previewConfigHash,
    } = useEditContactHook(contact);

    const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);

    if (!contact) {
        return (
            <p className="text-sm text-muted-foreground">
                Pick a contact first, anon.
            </p>
        );
    }

    return (
        <form className="flex flex-col gap-6 p-2 md:p-4">
            {/* Seed phrase section */}
            <section className="flex flex-col gap-3 rounded-lg border bg-card p-4">
                <Label
                    htmlFor="edit-seedPhrase"
                    className="text-xs font-medium uppercase tracking-wide flex items-center justify-between"
                >
                    <span>Seed Phrase (optional)</span>
                    <TemplatePopover
                        trigger={
                            <Button type="button" variant="outline" size="icon" className="h-7 w-7 text-xs">
                                ?
                            </Button>
                        }
                        sideOffset={8}
                    >
                        <div className="space-y-2 text-sm">
                            <p className="font-medium">Seed phrase for this contact</p>
                            <p className="text-muted-foreground">
                                Leave it empty to keep the existing seed; fill it to rotate the seed hash.
                                We never store the phrase as text, only a one‑way hash.
                            </p>
                        </div>
                    </TemplatePopover>
                </Label>
                <CanvasSecureTextInput
                    minHeight={40}
                    value={form.watch("seedPhrase") ?? ""}
                    onChange={(value) => form.setValue("seedPhrase", value, { shouldValidate: true })}
                    mask={true}
                    enableOverlay={false}
                />
                {form.formState.errors.seedPhrase && (
                    <p className="text-xs text-destructive">
                        {form.formState.errors.seedPhrase.message}
                    </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                    Stored seed hash:{" "}
                    {libertyCore.crypto.fingerprint.visual(storedSeedHash)}
                </p>
                {checkedSeedHash && (
                    <p className="text-xs text-muted-foreground">
                        Typed seed hash:{" "}
                        {libertyCore.crypto.fingerprint.visual(checkedSeedHash)}
                    </p>
                )}
            </section>

            {/* Config section */}
            <section className="flex flex-col gap-3 rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold">Contact config</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="edit-tag" className="text-xs font-medium uppercase tracking-wide">
                            Tag*
                        </Label>
                        <CanvasSecureTextInput
                            minHeight={40}
                            value={form.watch("tag") ?? ""}
                            onChange={(value) => form.setValue("tag", value, { shouldValidate: true })}
                            mask={true}
                            enableOverlay={false}
                        />
                        {form.formState.errors.tag && (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.tag.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label
                            htmlFor="edit-iterations"
                            className="text-xs font-medium uppercase tracking-wide"
                        >
                            Iterations* (0–1000000)
                        </Label>
                        <CanvasSecureTextInput
                            minHeight={40}
                            value={form.watch("iterations") ?? ""}
                            onChange={handleIterationsChange}
                            mask={true}
                            enableOverlay={false}
                        />
                        {form.formState.errors.iterations && (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.iterations.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label
                            htmlFor="edit-noiseLength"
                            className="text-xs font-medium uppercase tracking-wide"
                        >
                            Noise Length* (0–512)
                        </Label>
                        <CanvasSecureTextInput
                            minHeight={40}
                            value={form.watch("noiseLength") ?? ""}
                            onChange={handleNoiseLengthChange}
                            mask={true}
                            enableOverlay={false}
                        />
                        {form.formState.errors.noiseLength && (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.noiseLength.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Label
                        htmlFor="edit-description"
                        className="text-xs font-medium uppercase tracking-wide"
                    >
                        Description
                    </Label>
                    <CanvasSecureTextInput
                        minHeight={40}
                        value={form.watch("description") ?? ""}
                        onChange={(value) => form.setValue("description", value, { shouldValidate: true })}
                        mask={true}
                        enableOverlay={false}
                    />
                    {form.formState.errors.description && (
                        <p className="text-xs text-destructive">
                            {form.formState.errors.description.message}
                        </p>
                    )}
                </div>

                <Separator />
                <div className="flex flex-col gap-1 text-xs text-muted-foreground pt-1">
                    <p>
                        Stored config hash:{" "}
                        {libertyCore.crypto.fingerprint.visual(storedConfigHash)}
                    </p>
                    {storedConfigHash !== previewConfigHash && (
                        <p>
                            Current config hash:{" "}
                            {libertyCore.crypto.fingerprint.visual(previewConfigHash)}
                        </p>
                    )}
                </div>
            </section>

            <div className="flex justify-between gap-2 pt-2">
                <AlertDialogComponent
                    title="Delete this contact?"
                    description="This will remove the contact from your local encrypted store."
                    actionText="Delete"
                    cancelText="Cancel"
                    onContinue={() => {
                        onDelete();
                        onDone?.();
                    }}
                >
                    <Button
                        type="button"
                        variant="destructive"
                    >
                        Delete
                    </Button>
                </AlertDialogComponent>
                <AlertDialogComponent
                    open={isSaveConfirmOpen}
                    onOpenChange={setIsSaveConfirmOpen}
                    title="Save changes?"
                    description="We&apos;ll update this contact config in your local encrypted store."
                    actionText="Save"
                    cancelText="Cancel"
                    onContinue={() => {
                        onSubmit();
                        setIsSaveConfirmOpen(false);
                        onDone?.();
                    }}
                >
                    <Button
                        type="button"
                        onClick={form.handleSubmit(() => {
                            setIsSaveConfirmOpen(true);
                        })}
                    >
                        Save
                    </Button>
                </AlertDialogComponent>
            </div>
        </form>
    );
};

export default EditContact;


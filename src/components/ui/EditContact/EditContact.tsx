import { useState } from "react";
import type { Contact } from "@/lib/types";
import useEditContactHook from "./EditContact.hooks";
import { Input } from "../input";
import { Label } from "../label";
import { Button } from "../button";
import { AlertDialogComponent } from "../alert-dialog";
import { libertyCore } from "liberty-core";

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
        <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Label htmlFor="edit-seedPhrase" className="text-xs font-medium uppercase tracking-wide">
                    Seed phrase (optional)
                </Label>
                <Input
                    {...form.register("seedPhrase")}
                    type="password"
                    id="edit-seedPhrase"
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
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                    <Label htmlFor="edit-tag" className="text-xs font-medium uppercase tracking-wide">
                        Tag*
                    </Label>
                    <Input {...form.register("tag")} type="password" id="edit-tag" />
                    {form.formState.errors.tag && (
                        <p className="text-xs text-destructive">
                            {form.formState.errors.tag.message}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="edit-iterations" className="text-xs font-medium uppercase tracking-wide">
                        Iterations* (0–1000000)
                    </Label>
                    <Input
                        {...form.register("iterations")}
                        type="password"
                        id="edit-iterations"
                        inputMode="numeric"
                        onChange={handleIterationsChange}
                    />
                    {form.formState.errors.iterations && (
                        <p className="text-xs text-destructive">
                            {form.formState.errors.iterations.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <Label
                        htmlFor="edit-noiseLength"
                        className="text-xs font-medium uppercase tracking-wide"
                    >
                        Noise Length* (0–512)
                    </Label>
                    <Input
                        {...form.register("noiseLength")}
                        type="password"
                        id="edit-noiseLength"
                        inputMode="numeric"
                        onChange={handleNoiseLengthChange}
                    />
                    {form.formState.errors.noiseLength && (
                        <p className="text-xs text-destructive">
                            {form.formState.errors.noiseLength.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <Label
                    htmlFor="edit-description"
                    className="text-xs font-medium uppercase tracking-wide"
                >
                    Description
                </Label>
                <Input {...form.register("description")} type="password" id="edit-description" />
                {form.formState.errors.description && (
                    <p className="text-xs text-destructive">
                        {form.formState.errors.description.message}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-1 text-xs text-muted-foreground pt-1">
                <p>
                    Stored config hash:{" "}
                    {libertyCore.crypto.fingerprint.visual(storedConfigHash)}
                </p>
                {
                    storedConfigHash !== previewConfigHash && <p>
                        Current config hash:{" "}
                        {libertyCore.crypto.fingerprint.visual(previewConfigHash)}
                    </p>
                }
            </div>

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


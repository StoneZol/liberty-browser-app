import { useState } from "react";
import type { Contact } from "@/lib/types";
import { Button } from "../button";
import { TemplatePopover } from "../popover";
import useContactSelect from "./ContactSelect.hooks";
import CanvasContactLabel from "./CanvasContactLabel";
import CanvasSecureTextInput from "../CanvasSecureTextInput";

interface ContactSelectProps {
    value?: string | null;
    onChange?: (contact: Contact | null) => void;
}

const ContactSelect = ({ value = null, onChange }: ContactSelectProps) => {
    const {
        contacts,
        visibleContacts,
        query,
        setQuery,
        reloadFromStore,
    } = useContactSelect();

    const [open, setOpen] = useState(false);

    const selected =
        contacts.find((c) => c.id === value) ?? null;

    const handleSelect = (contact: Contact | null) => {
        onChange?.(contact);
        setOpen(false);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (nextOpen) {
            reloadFromStore();
        }
    };

    return (
        <TemplatePopover
            open={open}
            trigger={
                <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                >
                    {selected ? (
                        <div className="flex-1 text-left">
                            <CanvasContactLabel
                                label={`[${selected.tag}] ${selected.description || "No description"}`}
                            />
                        </div>
                    ) : (
                        <span className="text-sm text-muted-foreground">
                            Select contact
                        </span>
                    )}
                    <span className="ml-2 text-xs text-muted-foreground">
                        ▼
                    </span>
                </Button>
            }
            sideOffset={8}
            onOpenChange={handleOpenChange}
        >
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto p-2">
                <CanvasSecureTextInput
                    minHeight={40}
                    value={query}
                    onChange={(value) => setQuery(value)}
                    mask={false}
                    enableOverlay={false}
                />
                {visibleContacts.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                        No contacts found. Try a different query or create a new one.
                    </p>
                ) : (
                    visibleContacts.map((contact) => {
                        const isActive = contact.id === selected?.id;
                        const label = `[${contact.tag}] ${contact.description || "No description"}`;
                        return (
                            <button
                                key={contact.id}
                                type="button"
                                className={`flex flex-col items-start gap-0.5 rounded-md px-2 py-0.5 text-left text-sm hover:bg-accent hover:text-accent-foreground ${isActive ? "bg-accent text-accent-foreground" : ""
                                    }`}
                                onClick={() => handleSelect(contact)}
                            >
                                <CanvasContactLabel label={label} />
                            </button>
                        );
                    })
                )}
            </div>
        </TemplatePopover>
    );
};

export default ContactSelect;

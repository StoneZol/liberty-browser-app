import { useState } from "react";
import type { Contact } from "@/lib/types";
import { Button } from "../button";
import { TemplatePopover } from "../popover";
import { Input } from "../input";
import useContactSelect from "./ContactSelect.hooks";

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
                    {selected
                        ? (
                            <span className="text-left">
                                {`[${selected.tag}] ${selected.description || "No description"}`}
                            </span>
                        ) : (
                            <span className="text-sm text-muted-foreground">
                                Select contact
                            </span>
                        )
                    }
                    <span className="ml-2 text-xs text-muted-foreground">
                        ▼
                    </span>
                </Button>
            }
            sideOffset={8}
            onOpenChange={handleOpenChange}
        >
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                <Input
                    placeholder="Search by tag or description…"
                    className="h-8 text-xs"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {visibleContacts.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                        No contacts found. Try a different query or create a new one.
                    </p>
                ) : (
                    visibleContacts.map((contact) => {
                        const isActive = contact.id === selected?.id;
                        return (
                            <button
                                key={contact.id}
                                type="button"
                                className={`flex flex-col items-start gap-0.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground ${isActive ? "bg-accent text-accent-foreground" : ""
                                    }`}
                                onClick={() => handleSelect(contact)}
                            >
                                {`[${contact.tag}] ${contact.description || "No description"}`}
                            </button>
                        );
                    })
                )}
            </div>
        </TemplatePopover>
    );
};

export default ContactSelect;

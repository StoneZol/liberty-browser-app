import { useState } from "react";
import type { Contact } from "@/lib/types";
import { CreateContact } from "../CreateContact";
import { ContactSelect } from "../ContactSelect";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../dialog";
import { Button } from "../button";
import { EditContact } from "../EditContact";


const MainScreen = () => {
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <section className="flex flex-col gap-4 p-4">
            <header className="flex items-center justify-between gap-2">
                <h1 className="text-2xl font-bold">Your contacts</h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Create contact</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Create contact</DialogTitle>
                        </DialogHeader>
                        <CreateContact onDone={() => setIsCreateOpen(false)} />
                    </DialogContent>
                </Dialog>
            </header>

            <div className="rounded-lg border bg-card p-4">
                <p className="mb-2 text-xs text-muted-foreground">
                    Pick which contact config you want to use right now.
                </p>
                <ContactSelect
                    value={selectedContact?.id ?? null}
                    onChange={setSelectedContact}
                />
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="self-start"
                        disabled={!selectedContact}
                        onClick={() => {
                            if (selectedContact) setIsEditOpen(true);
                        }}
                    >
                        Edit selected contact
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit contact</DialogTitle>
                    </DialogHeader>
                    <EditContact
                        contact={selectedContact}
                        onDone={() => setIsEditOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default MainScreen;
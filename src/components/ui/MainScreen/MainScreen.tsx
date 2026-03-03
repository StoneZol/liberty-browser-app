import { useState } from "react";
import type { Contact } from "@/lib/types";
import { CreateContact } from "../CreateContact";
import { ContactSelect } from "../ContactSelect";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../dialog";
import { Button } from "../button";
import { EditContact } from "../EditContact";
import { MessageForm } from "../MessageForm";


const MainScreen = () => {
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <section className="flex flex-col gap-4 p-4">
            <header className="flex items-center justify-between gap-2">
                <h1 className="text-2xl font-bold">Contacts & messages</h1>
            </header>

            <div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground">
                        Pick which contact config you want to use right now.
                    </p>
                    <ContactSelect
                        value={selectedContact?.id ?? null}
                        onChange={setSelectedContact}
                    />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                                Create contact
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm p-2" aria-describedby={undefined}>
                            <DialogHeader className='pt-4 pl-4'>
                                <DialogTitle className='text-start'>Create contact</DialogTitle>
                            </DialogHeader>
                            <CreateContact onDone={() => setIsCreateOpen(false)} />
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={!selectedContact}
                                onClick={() => {
                                    if (selectedContact) setIsEditOpen(true);
                                }}
                            >
                                Edit contact
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm" aria-describedby={undefined}>
                            <DialogHeader>
                                <DialogTitle>Edit contact</DialogTitle>
                            </DialogHeader>
                            <EditContact
                                contact={selectedContact}
                                onDone={() => setIsEditOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <MessageForm contact={selectedContact} />
        </section>
    );
};

export default MainScreen;
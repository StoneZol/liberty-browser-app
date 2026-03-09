import { ContactSelect } from "../ContactSelect";
import { Button } from "../button";
import { MessageForm } from "../MessageForm";
import useScreenStore from "@/stores/screenStore";
import useContactStore from "@/stores/contactStore";

const MainScreen = () => {
    const { setScreen } = useScreenStore();
    const { selectedId, setSelectedId } = useContactStore();

    return (
        <section className="flex flex-col gap-4 p-4">
            <header className="flex items-center justify-between gap-2">
                <h2 className="text-2xl font-bold">Contacts & messages</h2>
            </header>

            <div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <ContactSelect
                        value={selectedId ?? null}
                        onChange={(contactId) => {
                            setSelectedId(contactId ?? null);
                        }}
                    />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                    <Button size="sm" variant="outline" onClick={() => setScreen("create_contact")}>
                        Create contact
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={!selectedId}
                        onClick={() => {
                            if (selectedId) {
                                setSelectedId(selectedId);
                                setScreen("edit_contact");
                            }
                        }}
                    >
                        Edit contact
                    </Button>
                </div>
            </div>

            <MessageForm contactId={selectedId} />
        </section>
    );
};

export default MainScreen;
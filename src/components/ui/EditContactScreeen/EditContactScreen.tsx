import { ArrowLeft } from "lucide-react";
import { EditContact } from "../EditContact";
import { Button } from "../button";
import useScreenStore from "@/stores/screenStore";
import useContactStore from "@/stores/contactStore";
import { useLibertyCoreStore } from "@/hooks/useLibertyCore";

const EditContactScreen = () => {
    const { setScreen } = useScreenStore();
    const { selectedId } = useContactStore();
    const { getStoreData } = useLibertyCoreStore();

    const store = getStoreData();
    const contacts = store.data.contacts;
    const contact = selectedId
        ? contacts.find((c) => c.id === selectedId) ?? null
        : null;

    return (
        <section>
            <h2 className="text-2xl font-bold md:pt-4 md:pl-4 pt-2 pl-2 flex gap-2">
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label="go main screen"
                    onClick={() => setScreen("main")}
                >
                    <ArrowLeft />
                </Button>
                Edit contact
            </h2>
            <EditContact contact={contact} onDone={() => setScreen("main")} />
        </section>
    );
};

export default EditContactScreen;

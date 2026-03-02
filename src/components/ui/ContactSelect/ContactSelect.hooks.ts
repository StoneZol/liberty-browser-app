import { useEffect, useState } from "react";
import type { Contact } from "@/lib/types";
import { useLibertyCoreStore } from "@/hooks/useLibertyCore";
import useContactStore from "@/stores/contactStore";

const useContactSelect = () => {
    const { getStoreData } = useLibertyCoreStore();
    const { refs } = useContactStore();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        // при изменении рефов (id + hash) перечитываем актуальный стор
        const store = getStoreData();
        setContacts(store.data.contacts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refs]);

    const reloadFromStore = () => {
        const store = getStoreData();
        setContacts(store.data.contacts);
        setQuery("");
    };

    const normalizedQuery = query.trim().toLowerCase();
    const visibleContacts = normalizedQuery
        ? contacts.filter((contact) => {
            const tag = contact.tag.toLowerCase();
            const description = contact.description.toLowerCase();
            return (
                tag.includes(normalizedQuery) ||
                description.includes(normalizedQuery)
            );
        })
        : contacts;

    return {
        contacts,
        visibleContacts,
        query,
        setQuery,
        reloadFromStore,
    };
};

export default useContactSelect;


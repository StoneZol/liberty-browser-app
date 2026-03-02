import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLibertyCoreStore } from "@/hooks/useLibertyCore";
import { EditContactFormSchema, type EditContactFormType } from "../CreateContact/CreateContact.types";
import type { Contact } from "@/lib/types";
import useContactStore from "@/stores/contactStore";

const useEditContactHook = (contact: Contact | null) => {
    const { getStoreData, setStoreData, getHash } = useLibertyCoreStore();
    const { upsertRef, removeRef } = useContactStore();

    const form = useForm<EditContactFormType>({
        resolver: zodResolver(EditContactFormSchema),
        defaultValues: contact
            ? {
                seedPhrase: "",
                tag: contact.tag,
                noiseLength: String(contact.noiseLength),
                description: contact.description,
            }
            : {
                seedPhrase: "",
                tag: "",
                noiseLength: "",
                description: "",
            },
    });

    const seedPhrase = form.watch("seedPhrase") ?? "";
    const tagWatch = form.watch("tag") ?? "";
    const noiseLengthWatch = form.watch("noiseLength") ?? "";

    const onSubmit = () => {
        if (!contact) return;
        const storeData = getStoreData();
        const contacts = storeData.data.contacts;

        const rawSeedPhrase = form.getValues("seedPhrase") ?? "";
        const trimmedSeed = rawSeedPhrase.trim();
        const tag = form.getValues("tag");
        const noiseLengthStr = form.getValues("noiseLength");
        const description = form.getValues("description");

        const currentSeedHash = contact.seedHash;
        const shouldUpdateSeed = trimmedSeed.length >= 8;
        const nextSeedHash = shouldUpdateSeed
            ? getHash(trimmedSeed)
            : currentSeedHash;

        const seedHash = nextSeedHash;

        // config hash: only tag + noiseLength
        const config = `${tag}-${noiseLengthStr}`;
        const hash = getHash(config);

        const nextContacts = contacts.map((c) =>
            c.id === contact.id
                ? {
                    ...c,
                    hash,
                    seedHash,
                    tag,
                    noiseLength: parseInt(noiseLengthStr, 10),
                    description,
                }
                : c
        );

        setStoreData({
            ...storeData,
            data: {
                ...storeData.data,
                contacts: nextContacts,
            },
        });

        upsertRef({ id: contact.id, configHash: hash });
    };

    const onDelete = () => {
        if (!contact) return;
        const storeData = getStoreData();
        const contacts = storeData.data.contacts.filter((c) => c.id !== contact.id);

        setStoreData({
            ...storeData,
            data: {
                ...storeData.data,
                contacts,
            },
        });

        removeRef(contact.id);
    };

    const handleNoiseLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const digitsOnly = raw.replace(/\D/g, "");

        if (digitsOnly === "") {
            e.target.value = "";
            form.setValue("noiseLength", "", { shouldValidate: true });
            return;
        }

        let numeric = parseInt(digitsOnly, 10);
        if (numeric > 512) numeric = 512;

        const next = String(numeric);
        e.target.value = next;
        form.setValue("noiseLength", next, { shouldValidate: true });
    };

    const storedSeedHash = contact?.seedHash ?? "";
    const trimmedWatchedSeed = seedPhrase.trim();
    const checkedSeedHash = trimmedWatchedSeed.length >= 8
        ? getHash(trimmedWatchedSeed)
        : "";

    // visual "stored" config hash: упрощённый, считается из исходных значений, которые мы отрисовали в форме
    const storedConfigHash = contact
        ? getHash(`${contact.tag}-${String(contact.noiseLength)}`)
        : "";

    // visual "current" config hash: упрощённый, считается из текущих значений в форме
    const previewConfig = `${tagWatch}-${noiseLengthWatch}`;
    const previewConfigHash = getHash(previewConfig);

    return {
        form,
        onSubmit,
        onDelete,
        handleNoiseLengthChange,
        storedSeedHash,
        checkedSeedHash,
        storedConfigHash,
        previewConfigHash,
    };
};

export default useEditContactHook;


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
                iterations: String(contact.iterations),
            }
            : {
                seedPhrase: "",
                tag: "",
                noiseLength: "",
                description: "",
                iterations: "",
            },
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const seedPhrase = form.watch("seedPhrase") ?? "";
    const tagWatch = form.watch("tag") ?? "";
    const noiseLengthWatch = form.watch("noiseLength") ?? "";
    const iterationsWatch = form.watch("iterations") ?? "";
    const descriptionWatch = form.watch("description") ?? "";

    const seedHash = getHash(seedPhrase);
    const config = `${tagWatch}-${noiseLengthWatch}-${iterationsWatch}`;
    const hash = getHash(config);

    const onSubmit = () => {
        if (!contact) return;
        const storeData = getStoreData();
        const contacts = storeData.data.contacts;


        const currentSeedHash = contact.seedHash;
        const shouldUpdateSeed = seedPhrase.length >= 8;
        const nextSeedHash = shouldUpdateSeed
            ? seedHash
            : currentSeedHash;


        // config hash: only tag + noiseLength
        const config = `${tagWatch}-${noiseLengthWatch}-${iterationsWatch}`;
        const hash = getHash(config);

        const nextContacts = contacts.map((c) =>
            c.id === contact.id
                ? {
                    ...c,
                    hash,
                    seedHash: nextSeedHash,
                    tag: tagWatch,
                    noiseLength: parseInt(noiseLengthWatch, 10),
                    description: descriptionWatch,
                    iterations: parseInt(iterationsWatch, 10),
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

    const setNumericFieldFromCanvas = (
        raw: string,
        fieldName: keyof EditContactFormType,
        limit: number,
    ) => {
        const digitsOnly = raw.replace(/\D/g, "");

        if (digitsOnly === "") {
            form.setValue(fieldName, "" as never, { shouldValidate: true });
            return;
        }

        let numeric = parseInt(digitsOnly, 10);
        if (numeric > limit) numeric = limit;

        const next = String(numeric);
        form.setValue(fieldName, next as never, { shouldValidate: true });
    };

    const handleNoiseLengthChange = (raw: string) => {
        setNumericFieldFromCanvas(raw, "noiseLength", 512);
    };

    const handleIterationsChange = (raw: string) => {
        setNumericFieldFromCanvas(raw, "iterations", 1_000_000);
    };

    const storedSeedHash = contact?.seedHash ?? "";
    const checkedSeedHash = seedPhrase.length >= 8
        ? getHash(seedPhrase)
        : "";

    // visual "stored" config hash: упрощённый, считается из исходных значений, которые мы отрисовали в форме
    const storedConfigHash = contact
        ? getHash(`${String(contact.noiseLength)}-${String(contact.iterations)}`)
        : "";

    // visual "current" config hash: упрощённый, считается из текущих значений в форме
    const previewConfig = `${noiseLengthWatch}-${iterationsWatch}`;
    const previewConfigHash = getHash(previewConfig);

    return {
        form,
        onSubmit,
        onDelete,
        handleNoiseLengthChange,
        handleIterationsChange,
        configObj: {
            seedHash,
            config,
            hash,
            tag: tagWatch,
            noiseLength: parseInt(noiseLengthWatch, 10),
            iterations: parseInt(iterationsWatch, 10),
            description: descriptionWatch,
        },
        storedSeedHash,
        checkedSeedHash,
        storedConfigHash,
        previewConfigHash,
    };
};

export default useEditContactHook;


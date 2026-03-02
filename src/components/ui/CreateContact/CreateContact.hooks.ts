import { useForm } from 'react-hook-form';
import { ContactFormSchema, type ContactFormType } from './CreateContact.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLibertyCoreStore } from '@/hooks/useLibertyCore';
import { v7 as uuidv7 } from 'uuid';
import useContactStore from '@/stores/contactStore';
import type { Contact } from '@/lib/types';

const useCreateContactHook = () => {
    const { getStoreData, setStoreData, getHash } = useLibertyCoreStore()
    const { upsertRef } = useContactStore()

    const form = useForm<ContactFormType>({
        resolver: zodResolver(ContactFormSchema),
        defaultValues: {
            seedPhrase: '',
            tag: '',
            noiseLength: '',
            description: '',
        }
    })

    const onSubmit = () => {
        const storeData = getStoreData()
        const contacts = storeData.data.contacts

        const seedPhrase = form.getValues('seedPhrase')
        const tag = form.getValues('tag')
        const noiseLengthStr = form.getValues('noiseLength')
        const description = form.getValues('description')

        const seedHash = getHash(seedPhrase)

        // config hash: only tag + noiseLength (как в эдите)
        const config = `${tag}-${noiseLengthStr}`
        const hash = getHash(config)

        const newContact: Contact = {
            id: uuidv7(),
            hash,
            seedHash,
            tag,
            noiseLength: parseInt(noiseLengthStr, 10),
            description,
        }

        contacts.push(newContact)
        setStoreData({
            ...storeData,
            data: {
                ...storeData.data,
                contacts: contacts,
            },
        })
        upsertRef({ id: newContact.id, configHash: newContact.hash })
        form.reset()
    }

    const handleNoiseLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value
        const digitsOnly = raw.replace(/\D/g, '')

        if (digitsOnly === '') {
            e.target.value = ''
            form.setValue('noiseLength', '', { shouldValidate: true })
            return
        }

        let numeric = parseInt(digitsOnly, 10)
        if (numeric > 512) numeric = 512

        const next = String(numeric)
        e.target.value = next
        form.setValue('noiseLength', next, { shouldValidate: true })
    }

    return {
        form,
        onSubmit,
        handleNoiseLengthChange,
    }
}

export default useCreateContactHook
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
            iterations: '',
        }
    })

    const storeData = getStoreData()
    const contacts = storeData.data.contacts

    // eslint-disable-next-line react-hooks/incompatible-library
    const seedPhrase = form.watch('seedPhrase')
    const tag = form.watch('tag')
    const noiseLengthStr = form.watch('noiseLength')
    const iterationsStr = form.watch('iterations')
    const description = form.watch('description')

    const seedHash = getHash(seedPhrase)
    const config = `${tag}-${noiseLengthStr}-${iterationsStr}`
    const hash = getHash(config)

    const onSubmit = () => {
        const newContact: Contact = {
            id: uuidv7(),
            hash,
            seedHash,
            tag,
            noiseLength: parseInt(noiseLengthStr, 10),
            iterations: parseInt(iterationsStr, 10),
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ContactFormType, limit: number) => {
        const raw = e.target.value
        const digitsOnly = raw.replace(/\D/g, '')

        if (digitsOnly === '') {
            e.target.value = ''
            form.setValue(fieldName, '', { shouldValidate: true })
            return
        }

        let numeric = parseInt(digitsOnly, 10)
        if (numeric > limit) numeric = limit

        const next = String(numeric)
        e.target.value = next
        form.setValue(fieldName, next, { shouldValidate: true })
    }

    const handleNoiseLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e, 'noiseLength', 512)
    }

    const handleIterationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e, 'iterations', 1_000_000)
    }

    return {
        form,
        onSubmit,
        handleNoiseLengthChange,
        handleIterationsChange,
        configObj: {
            seedHash,
            config,
            hash,
            tag,
            noiseLength: parseInt(noiseLengthStr, 10),
            iterations: parseInt(iterationsStr, 10),
            description,
        }
    }
}

export default useCreateContactHook
import { useForm } from 'react-hook-form';
import { ContactFormSchema, type ContactFormType } from './CreateContact.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLibertyCoreStore } from '@/hooks/useLibertyCore';
import { v7 as uuidv7 } from 'uuid';

const useCreateContactHook = () => {
    const { getStoreData, setStoreData, getHash } = useLibertyCoreStore()
    const form = useForm<ContactFormType>({
        resolver: zodResolver(ContactFormSchema),
        defaultValues: {
            seedPhrase: '',
            tag: '',
            noiseLength: '',
            description: '',
        }
    })
    const seedHash = getHash(form.getValues('seedPhrase'))

    const onSubmit = () => {
        const storeData = getStoreData()
        const contacts = storeData.data.contacts
        const newContact = {
            id: uuidv7(),
            seedHash: seedHash,
            tag: form.getValues('tag'),
            noiseLength: parseInt(form.getValues('noiseLength'), 10),
            description: form.getValues('description'),
        }
        contacts.push(newContact)
        setStoreData({
            ...storeData,
            data: {
                ...storeData.data,
                contacts: contacts,
            },
        })
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
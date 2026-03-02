import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFormSchema, type AuthFormSchemaType } from './AuthForm.types';
import { useForm } from 'react-hook-form';
import useScreenStore from '@/stores/screenStore';
import { useLibertyCoreStore } from '@/hooks/useLibertyCore';

const useAuthFormHook = () => {
    const { deleteAllData, getStoreData, getHash, derivePassword, getResetPassHash } = useLibertyCoreStore()
    const { setScreen } = useScreenStore()
    const handleResetData = () => {
        deleteAllData()
        setScreen('reg')
    }
    const form = useForm({
        resolver: zodResolver(AuthFormSchema),
        defaultValues: {
            Password: '',
        }
    })
    const onSubmit = (data: AuthFormSchemaType) => {
        const passwordHash = getHash(data.Password)
        console.log(passwordHash)
        console.log(getResetPassHash())
        if (passwordHash === getResetPassHash()) {
            deleteAllData()
            window.location.reload()
            return
        }
        derivePassword(passwordHash)
        const storeData = getStoreData()
        if (storeData.data.user === 'anon') {
            setScreen('main')
        }
    }
    return {
        form,
        onSubmit,
        handleResetData
    }
}

export default useAuthFormHook
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFormSchema, type AuthFormSchemaType } from './AuthForm.types';
import { useForm } from 'react-hook-form';
import useScreenStore from '@/stores/screenStore';
import { useLibertyCoreStore } from '@/hooks/useLibertyCore';

const useAuthFormHook = () => {
    const { deleteAllData, getHash, derivePassword, getResetPassHash, checkAuth } = useLibertyCoreStore()
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
        const passwordHash = getHash(data.Password);
        if (passwordHash === getResetPassHash()) {
            deleteAllData();
            window.location.reload();
            return;
        }

        try {
            derivePassword(passwordHash);
            if (checkAuth()) {
                setScreen("main");
            } else {
                form.setError("Password", {
                    type: "manual",
                    message: "Wrong password",
                });
            }
        } catch {
            form.setError("Password", {
                type: "manual",
                message: "Wrong password",
            });
        }
    }
    return {
        form,
        onSubmit,
        handleResetData
    }
}

export default useAuthFormHook
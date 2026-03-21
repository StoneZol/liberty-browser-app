import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFormSchema, type AuthFormSchemaType } from './AuthForm.types';
import { useForm } from 'react-hook-form';
import useScreenStore from '@/stores/screenStore';
import { useLibertyCoreStore } from '@/hooks/useLibertyCore';
import { setNumericFieldFromCanvas } from '@/lib/setNumericFieldFromCanvas';

const DEFAULT_ITERATIONS = 10_000

const resolveIterationsForSubmit = (raw: string) => {
    const trimmed = raw.trim()
    if (trimmed === '') return DEFAULT_ITERATIONS
    return parseInt(trimmed, 10)
}
const useAuthFormHook = () => {
    const { deleteAllData, getHash, derivePassword, getResetPassHash, checkAuth } = useLibertyCoreStore()
    const { setScreen } = useScreenStore()
    const handleResetData = () => {
        deleteAllData()
        setScreen('reg')
    }
    const form = useForm<AuthFormSchemaType>({
        resolver: zodResolver(AuthFormSchema),
        defaultValues: {
            Iterations: '',
            Password: '',
        }
    })
    const handleIterationsChange = (raw: string) => {
        setNumericFieldFromCanvas(form.setValue, raw, 'Iterations', 999_000_000_000);
    };

    const onSubmit = (data: AuthFormSchemaType) => {
        const iterations = resolveIterationsForSubmit(data.Iterations);
        const mainPasswordHash = getHash(data.Password);

        if (mainPasswordHash === getResetPassHash()) {
            deleteAllData();
            window.location.reload();
            return;
        }

        try {
            derivePassword(mainPasswordHash, iterations);
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
        handleResetData,
        handleIterationsChange,
    }
}

export default useAuthFormHook
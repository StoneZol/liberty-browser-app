import { zodResolver } from "@hookform/resolvers/zod"
import { RegFormSchema, type RegFormSchemaType } from "./RegForm.types"
import { useForm } from "react-hook-form"
import { libertyCore } from "liberty-core"
import { ls } from "@/lib/localstorage"
import type { LibertyStore } from "@/lib/types"
import { useLibertyCoreStore } from "@/hooks/useLibertyCore"
import useScreenStore from "@/stores/screenStore"
import { setNumericFieldFromCanvas } from "@/lib/setNumericFieldFromCanvas"

const defaultLibertyStore: LibertyStore = {
    data: {
        user: 'anon',
        contacts: []
    }
}

const DEFAULT_ITERATIONS = 10_000

const resolveIterationsForSubmit = (raw: string) => {
    const trimmed = raw.trim()
    if (trimmed === '') return DEFAULT_ITERATIONS
    return parseInt(trimmed, 10)
}

const useRegFormHook = () => {
    const { getStoreData } = useLibertyCoreStore()
    const { setScreen } = useScreenStore()
    const form = useForm<RegFormSchemaType>({
        resolver: zodResolver(RegFormSchema),
        defaultValues: {
            Iterations: '',
            Password: '',
            ConfirmPassword: '',
            AlertPassword: '',
            ConfirmAlertPassword: '',
        },
    })
    const onSubmit = (data: RegFormSchemaType) => {
        const salt = libertyCore.crypto.generateSalt()
        const mainPasswordHash = libertyCore.crypto.hash(data.Password)
        const resetPassHash = libertyCore.crypto.hash(data.AlertPassword)
        const createpass = libertyCore.crypto.deriveKey(mainPasswordHash, salt, resolveIterationsForSubmit(data.Iterations))
        const encryptedLibertyStore = libertyCore.obj.encrypt({ obj: defaultLibertyStore, key: createpass })
        ls.setData('salt', salt)
        ls.setData('resetPassHash', resetPassHash)
        ls.setData('LibertyStore', encryptedLibertyStore)
        form.reset()
        setScreen('login')
    }

    const onSubmitUpdatePassword = (data: RegFormSchemaType) => {
        const newSalt = libertyCore.crypto.generateSalt()
        const oldData = getStoreData()
        const newMainPasswordHash = libertyCore.crypto.hash(data.Password)
        const newResetPassHash = libertyCore.crypto.hash(data.AlertPassword)
        const newCreatepass = libertyCore.crypto.deriveKey(newMainPasswordHash, newSalt, resolveIterationsForSubmit(data.Iterations))
        const newEncryptedLibertyStore = libertyCore.obj.encrypt({ obj: oldData, key: newCreatepass })
        ls.setData('salt', newSalt)
        ls.setData('resetPassHash', newResetPassHash)
        ls.setData('LibertyStore', newEncryptedLibertyStore)
        form.reset()
        setScreen('login')
    }

    const handleIterationsChange = (raw: string) => {
        setNumericFieldFromCanvas(form.setValue, raw, 'Iterations', 999_000_000_000);
    }

    return {
        form,
        onSubmit,
        onSubmitUpdatePassword,
        handleIterationsChange,
    }
}

export default useRegFormHook
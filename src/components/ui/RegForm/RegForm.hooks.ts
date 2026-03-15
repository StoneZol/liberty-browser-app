import { zodResolver } from "@hookform/resolvers/zod"
import { RegFormSchema, type RegFormSchemaType } from "./RegForm.types"
import { useForm } from "react-hook-form"
import { libertyCore } from "liberty-core"
import { ls } from "@/lib/localstorage"
import type { LibertyStore } from "@/lib/types"
import { useLibertyCoreStore } from "@/hooks/useLibertyCore"
import useScreenStore from "@/stores/screenStore"

const defaultLibertyStore: LibertyStore = {
    data: {
        user: 'anon',
        contacts: []
    }
}


const useRegFormHook = () => {
    const { hasReg, getStoreData } = useLibertyCoreStore()
    const { setScreen } = useScreenStore()
    console.log(hasReg)
    const form = useForm({
        resolver: zodResolver(RegFormSchema),
        defaultValues: {
            Password: '',
            ConfirmPassword: '',
            AlertPassword: '',
            ConfirmAlertPassword: '',
        }
    })
    const onSubmit = (data: RegFormSchemaType) => {
        const salt = libertyCore.crypto.generateSalt()
        const mainPasswordHash = libertyCore.crypto.hash(data.Password)
        const resetPassHash = libertyCore.crypto.hash(data.AlertPassword)
        const createpass = libertyCore.crypto.deriveKey(mainPasswordHash, salt)
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
        const newCreatepass = libertyCore.crypto.deriveKey(newMainPasswordHash, newSalt)
        const newEncryptedLibertyStore = libertyCore.obj.encrypt({ obj: oldData, key: newCreatepass })
        ls.setData('salt', newSalt)
        ls.setData('resetPassHash', newResetPassHash)
        ls.setData('LibertyStore', newEncryptedLibertyStore)
        form.reset()
        setScreen('login')
    }
    return {
        form,
        onSubmit,
        onSubmitUpdatePassword
    }
}

export default useRegFormHook

import { ls } from "@/lib/localstorage"
import type { Contact, LibertyStore } from "@/lib/types"
import usePassStore from "@/stores/passStore"
import { libertyCore, libertyHelpers } from "liberty-core"

export const useLibertyCoreStore = () => {
    const { setPassHash } = usePassStore()
    const hasReg = ls.getData('LibertyStore') !== ''

    const getSalt = () => {
        return ls.getData('salt')
    }

    const getResetPassHash = () => {
        return ls.getData('resetPassHash')
    }

    const derivePassword = (pass: string) => {
        const hashpass = libertyCore.crypto.deriveKey(pass, getSalt())
        setPassHash(hashpass)
        return hashpass
    }

    const deleteAllData = () => {
        ls.removeData('salt')
        ls.removeData('resetPassHash')
        ls.removeData('LibertyStore')
    }

    const getHash = (str: string) => {
        return libertyCore.crypto.hash(str)
    }


    const encryptMessage = (contact: Contact, message: string) => {
        return libertyHelpers.asyncCall(
            libertyCore.message.encrypt,
            {
                message,
                clanPoint: contact.tag,
                key: contact.seedHash,
                noiseLength: contact.noiseLength,
            },
        )
    }

    const decryptMessage = (contact: Contact, cryptoMessage: string) => {
        return libertyHelpers.asyncCall(
            libertyCore.message.decrypt,
            {
                message: cryptoMessage,
                key: contact.seedHash,
                noiseLength: contact.noiseLength,
            },
        )
    }

    const getStoreData = (): LibertyStore => {
        const { passHash } = usePassStore.getState()
        return libertyCore.obj.decrypt({ str: ls.getData('LibertyStore'), key: passHash })
    }

    const setStoreData = <T>(data: T) => {
        const { passHash } = usePassStore.getState()

        const encryptedData = libertyCore.obj.encrypt({ obj: data, key: passHash })
        ls.setData('LibertyStore', encryptedData)
    }

    return {
        hasReg,
        getSalt,
        getResetPassHash,
        derivePassword,
        deleteAllData,
        getHash,
        encryptMessage,
        decryptMessage,
        getStoreData,
        setStoreData,
    }
}
import { useLibertyCoreStore } from '@/hooks/useLibertyCore';
import useScreenStore from '@/stores/screenStore';

const useSettingsScreenHook = () => {
    const { checkAuth, hasReg } = useLibertyCoreStore()
    const { setScreen } = useScreenStore()
    const handleBack = () => {
        console.log(checkAuth())
        if (!hasReg) {
            setScreen('reg')
            return
        }
        if (checkAuth()) {
            setScreen('main')
            return
        } else {
            setScreen('login')
            return
        }
    }

    return {
        handleBack
    }
}

export default useSettingsScreenHook
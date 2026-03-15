import { AuthForm } from '../AuthForm';
import useScreenStore from '@/stores/screenStore';
import { useLibertyCoreStore } from '@/hooks/useLibertyCore';
import { useEffect } from 'react';
import { MainScreen } from '../MainScreen';
import { CreateContactScreen } from '../CreateContactScreen';
import { EditContactScreen } from '../EditContactScreeen';
import { SettingsScreen } from '../SettingsScreen';
import { RegScreen } from '../RegScreen';
const ScreenController = () => {
    const { hasReg } = useLibertyCoreStore()
    const { screen, setScreen } = useScreenStore()
    useEffect(() => {
        if (hasReg) {
            setScreen('login')
        }
    }, [hasReg])
    switch (screen) {
        case 'reg':
            return <RegScreen />
        case 'login':
            return <AuthForm />
        case 'main':
            return <MainScreen />
        case 'create_contact':
            return <CreateContactScreen />
        case 'edit_contact':
            return <EditContactScreen />
        case 'settings':
            return <SettingsScreen />
        default:
            return null
    }
};

export default ScreenController;
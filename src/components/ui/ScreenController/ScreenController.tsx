import { AuthForm } from '../AuthForm';
import RegForm from '../RegForm/RegForm';
import useScreenStore from '@/stores/screenStore';
import { useLibertyCoreStore } from '@/hooks/useLibertyCore';
import { useEffect } from 'react';
import { MainScreen } from '../MainScreen';
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
            return <RegForm />
        case 'login':
            return <AuthForm />
        case 'main':
            return <MainScreen />
        default:
            return null
    }
};

export default ScreenController;
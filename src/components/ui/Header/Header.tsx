import { Settings } from 'lucide-react';
import { Button } from '../button';
import useScreenStore from '@/stores/screenStore';

const Header = () => {
    const { setScreen } = useScreenStore()
    return (
        <header className='w-full h-16 bg-background border-b border-border flex items-center justify-between p-4'>
            <button className='flex items-center gap-2' onClick={() => window.location.reload()}>
                <img src="/liberty48.png" alt="Liberty" className='w-12 h-12' />
                Liberty
            </button>
            <Button variant="outline" size="icon" aria-label="Settings" onClick={() => setScreen('settings')}>
                <Settings />
            </Button>
        </header>
    );
};

export default Header;
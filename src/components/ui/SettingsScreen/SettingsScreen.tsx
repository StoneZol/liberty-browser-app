import { ArrowLeft } from 'lucide-react';
import { Button } from '../button';
import { AnimatedThemeToggler } from '../animated-theme-toggler';
import { ImportData, ExportData } from '../ImpExpData';
import useSettingsScreenHook from './SettingsScreen.hooks';

const SettingsScreen = () => {
    const { handleBack } = useSettingsScreenHook()
    return (
        <section className='flex flex-col gap-4 p-4'>
            <h2 className='text-2xl font-bold flex items-center gap-2'>
                <Button variant="ghost" size="icon" onClick={handleBack}>
                    <ArrowLeft />
                </Button>
                <span>Settings</span>
            </h2>
            {/* <Separator />s */}
            <div className='flex flex-col gap-4 py-4'>
                <div className='flex items-center gap-2'>
                    <AnimatedThemeToggler />
                    <span>- Change Theme</span>
                </div>
                <ExportData />
                <ImportData />
            </div>
        </section>
    );
};

export default SettingsScreen;
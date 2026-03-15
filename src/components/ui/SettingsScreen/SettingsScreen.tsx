import { ArrowLeft, Palette, Download, Lock } from 'lucide-react';
import { Button } from '../button';
import { AnimatedThemeToggler } from '../animated-theme-toggler';
import { ImportData, ExportData } from '../ImpExpData';
import useSettingsScreenHook from './SettingsScreen.hooks';
import RegForm from '../RegForm/RegForm';
import { Separator } from '../separator';

const SettingsScreen = () => {
    const { handleBack, isAuth } = useSettingsScreenHook()
    return (
        <section className='flex flex-col gap-6 p-6 max-w-2xl mx-auto'>
            {/* Header */}
            <div className='flex items-center gap-3'>
                <Button variant="ghost" size="icon" onClick={handleBack} className='shrink-0'>
                    <ArrowLeft className='size-5' />
                </Button>
                <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
            </div>

            <div className='flex flex-col gap-6'>
                {/* Appearance Section */}
                <div className='bg-card border border-border rounded-lg p-6 shadow-sm'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='p-2 bg-muted rounded-md'>
                            <Palette className='size-5 text-muted-foreground' />
                        </div>
                        <h2 className='text-xl font-semibold'>Appearance</h2>
                    </div>
                    <div className='flex items-center justify-between pl-12'>
                        <span className='text-muted-foreground'>Theme</span>
                        <AnimatedThemeToggler className='p-2 hover:bg-accent rounded-md transition-colors' />
                    </div>
                </div>

                {/* Data Management Section */}
                <div className='bg-card border border-border rounded-lg p-6 shadow-sm'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='p-2 bg-muted rounded-md'>
                            <Download className='size-5 text-muted-foreground' />
                        </div>
                        <h2 className='text-xl font-semibold'>Data Management</h2>
                    </div>
                    <div className='flex flex-col gap-3 pl-0 md:pl-12'>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                            <div className='flex flex-col gap-1'>
                                <span className='text-sm font-medium'>Export Data</span>
                                <span className='text-xs text-muted-foreground'>Copy ur data in the clipboard</span>
                            </div>
                            <div className='self-start sm:self-auto'>
                                <ExportData />
                            </div>
                        </div>
                        <Separator />
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                            <div className='flex flex-col gap-1'>
                                <span className='text-sm font-medium'>Import Data</span>
                                <span className='text-xs text-muted-foreground'>Paste data from the clipboard</span>
                            </div>
                            <div className='self-start sm:self-auto'>
                                <ImportData />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                {isAuth && (
                    <div className='bg-card border border-border rounded-lg p-6 shadow-sm'>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='p-2 bg-muted rounded-md'>
                                <Lock className='size-5 text-muted-foreground' />
                            </div>
                            <h2 className='text-xl font-semibold'>Security</h2>
                        </div>
                        <div className='pl-12'>
                            <RegForm isUpdatePassword={true} />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SettingsScreen;
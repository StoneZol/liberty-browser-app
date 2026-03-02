import { AnimatedThemeToggler } from '../animated-theme-toggler';

const Header = () => {
    return (
        <header className='w-full h-16 bg-background border-b border-border flex items-center justify-between p-4'>
            <button className='flex items-center gap-2' onClick={() => window.location.reload()}>
                <img src="/liberty48.png" alt="Liberty" className='w-12 h-12' />
                Liberty
            </button>
            <AnimatedThemeToggler />
        </header>
    );
};

export default Header;
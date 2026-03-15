import { UserPlus } from 'lucide-react';
import RegForm from "../RegForm/RegForm";

export default function RegScreen() {
    return (
        <section className='flex flex-col gap-6 p-6 max-w-2xl mx-auto'>
            {/* Header */}
            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-3'>
                    <div className='p-2 bg-muted rounded-md'>
                        <UserPlus className='size-6 text-muted-foreground' />
                    </div>
                    <h1 className='text-3xl font-bold tracking-tight'>Welcome, Anon!</h1>
                </div>
                <p className='text-muted-foreground pl-12'>We don't care who u r. Create ur secure account.</p>
            </div>

            {/* Registration Form Card */}
            <div className='bg-card border border-border rounded-lg p-6 shadow-sm'>
                <RegForm />
            </div>
        </section>
    )
}
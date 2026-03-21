import { LogIn, RotateCcw } from 'lucide-react';
import { Button } from "../button";
import { Label } from "../label";
import useAuthFormHook from "./AuthForm.hooks";
import { AlertDialogComponent } from './../alert-dialog';
import CanvasSecureTextInput from "../CanvasSecureTextInput";
import { Separator } from '../separator';

const AuthForm = () => {
    const { form, onSubmit, handleResetData, handleIterationsChange } = useAuthFormHook()
    return (
        <section className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-3'>
                    <div className='p-2 bg-muted rounded-md'>
                        <LogIn className='size-6 text-muted-foreground' />
                    </div>
                    <h1 className='text-3xl font-bold tracking-tight'>Welcome back, Anon!</h1>
                </div>
                <p className='text-muted-foreground pl-12'>Enter ur password to continue</p>
            </div>

            {/* Login Form Card */}
            <div className='bg-card border border-border rounded-lg p-6 shadow-sm'>
                <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="iterations">Iterations</Label>
                        <CanvasSecureTextInput
                            minHeight={40}
                            id="iterations"
                            value={form.watch('Iterations')}
                            enableOverlay={false}
                            onChange={handleIterationsChange}
                            mask
                        />
                        {form.formState.errors.Iterations && (
                            <p className='text-sm text-destructive'>{form.formState.errors.Iterations.message}</p>
                        )}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="password">Password</Label>
                        <CanvasSecureTextInput
                            minHeight={40}
                            id="password"
                            value={form.watch('Password')}
                            enableOverlay={false}
                            onChange={(value) => form.setValue('Password', value, { shouldValidate: true })}
                            mask
                        />
                        {form.formState.errors.Password && (
                            <p className='text-sm text-destructive'>{form.formState.errors.Password.message}</p>
                        )}
                    </div>
                    <Button type="submit" className='w-full'>Sign In</Button>
                </form>

                <Separator className='my-4' />

                {/* Reset Data Section */}
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2 text-muted-foreground mb-1'>
                        <RotateCcw className='size-4' />
                        <span className='text-sm font-medium'>Danger Zone</span>
                    </div>
                    <AlertDialogComponent
                        onContinue={handleResetData}
                        title="Delete All Data"
                        description="This action will permanently delete all ur data. Can't be undone. R u sure u want to continue?"
                        actionText="Delete Everything"
                        cancelText="Cancel"
                    >
                        <Button type="button" variant="destructive" className='w-full'>
                            Delete All Data
                        </Button>
                    </AlertDialogComponent>
                </div>
            </div>
        </section>
    );
};

export default AuthForm
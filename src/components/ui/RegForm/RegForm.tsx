// import { Input } from "../input";
import { Label } from "../label";
import { Button } from "../button";
import useRegFormHook from "./RegForm.hooks";
import CanvasSecureTextInput from "../CanvasSecureTextInput";


const RegForm = () => {
    const { form, onSubmit } = useRegFormHook()
    return (
        <section className='flex flex-col gap-4 p-4'>
            <h2 className='text-2xl font-bold'>Yo Anon! We don't care who u r.</h2>
            <form className='flex flex-col gap-4 bg-card p-4 rounded-lg'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='Password'>Password</Label>
                    {/* <Input {...form.register('Password')} type='password' id='Password' /> */}
                    <CanvasSecureTextInput
                        minHeight={40}
                        id="Password"
                        value={form.watch('Password')}
                        onChange={(value) => form.setValue('Password', value, { shouldValidate: true })}
                        mask={true}
                        enableOverlay={false}
                    />
                    {form.formState.errors.Password && <p className='text-red-500'>{form.formState.errors.Password.message}</p>}
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='ConfirmPassword'>Confirm password</Label>
                    {/* <Input {...form.register('ConfirmPassword')} type='password' id='ConfirmPassword' /> */}
                    <CanvasSecureTextInput
                        minHeight={40}
                        id="ConfirmPassword"
                        value={form.watch('ConfirmPassword')}
                        onChange={(value) => form.setValue('ConfirmPassword', value, { shouldValidate: true })}
                        mask={true}
                        enableOverlay={false}
                    />
                    {form.formState.errors.ConfirmPassword && <p className='text-red-500'>{form.formState.errors.ConfirmPassword.message}</p>}
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='AlertPassword'>Alert password</Label>
                    {/* <Input {...form.register('AlertPassword')} type='password' id='AlertPassword' /> */}
                    <CanvasSecureTextInput
                        minHeight={40}
                        id="AlertPassword"
                        value={form.watch('AlertPassword')}
                        onChange={(value) => form.setValue('AlertPassword', value, { shouldValidate: true })}
                        mask={true}
                        enableOverlay={false}
                    />
                    {form.formState.errors.AlertPassword && <p className='text-red-500'>{form.formState.errors.AlertPassword.message}</p>}
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='ConfirmAlertPassword'>Confirm alert password</Label>
                    {/* <Input {...form.register('ConfirmAlertPassword')} type='password' id='ConfirmAlertPassword' /> */}
                    <CanvasSecureTextInput
                        minHeight={40}
                        id="ConfirmAlertPassword"
                        value={form.watch('ConfirmAlertPassword')}
                        onChange={(value) => form.setValue('ConfirmAlertPassword', value, { shouldValidate: true })}
                        mask={true}
                        enableOverlay={false}
                    />
                    {form.formState.errors.ConfirmAlertPassword && <p className='text-red-500'>{form.formState.errors.ConfirmAlertPassword.message}</p>}
                </div>
                <Button type='button' onClick={form.handleSubmit(onSubmit)}>Register</Button>
            </form>
        </section>
    );
};

export default RegForm;
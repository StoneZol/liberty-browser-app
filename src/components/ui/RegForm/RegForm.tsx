// import { Input } from "../input";
import { Label } from "../label";
import { Button } from "../button";
import useRegFormHook from "./RegForm.hooks";
import CanvasSecureTextInput from "../CanvasSecureTextInput";


const RegForm = ({ isUpdatePassword = false }: { isUpdatePassword?: boolean }) => {
    const { form, onSubmit, onSubmitUpdatePassword } = useRegFormHook()

    const onSubmitHandler = isUpdatePassword ? onSubmitUpdatePassword : onSubmit
    return (
        <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <Label htmlFor='Password'>Password</Label>
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
            <Button type='button' onClick={form.handleSubmit(onSubmitHandler)}>{isUpdatePassword ? 'Update password' : 'Register'}</Button>
        </form>
    );
};

export default RegForm;
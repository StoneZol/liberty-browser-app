import { Button } from "../button";
// import { Input } from "../input";
import { Label } from "../label";
import useAuthFormHook from "./AuthForm.hooks";
import { AlertDialogComponent } from './../alert-dialog';
import CanvasSecureTextInput from "../CanvasSecureTextInput";


const AuthForm = () => {
    const { form, onSubmit, handleResetData } = useAuthFormHook()
    return (
        <section className="flex flex-col gap-4 p-4">
            <h2 className="text-2xl font-bold">Welcome back Anon!</h2>
            <form className="flex flex-col gap-4 bg-card p-4 rounded-lg" onSubmit={form.handleSubmit(onSubmit)}>
                <Label htmlFor="password">Password</Label>
                <CanvasSecureTextInput
                    minHeight={40}
                    id="password"
                    value={form.watch('Password')}
                    enableOverlay={false}
                    onChange={(value) => form.setValue('Password', value, { shouldValidate: true })}
                    mask
                />
                <Button type="submit" onClick={form.handleSubmit(onSubmit)}>SignIn</Button>

                <AlertDialogComponent
                    onContinue={handleResetData}
                    title="Reset All Data"
                    description="U have a hard day Anon. Do u want to reset all data and reborn?"
                    actionText="Reborn"
                    cancelText="Cancel"
                >
                    <Button type="button" variant="destructive">ResetAllData</Button>
                </AlertDialogComponent>
            </form>
        </section>
    );
};

export default AuthForm
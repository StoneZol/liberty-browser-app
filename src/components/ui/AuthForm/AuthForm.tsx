import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import useAuthFormHook from "./AuthForm.hooks";
import { AlertDialogComponent } from './../alert-dialog';


const AuthForm = () => {
    const { form, onSubmit, handleResetData } = useAuthFormHook()
    return (
        <section className="flex flex-col gap-4 p-4">
            <h2 className="text-2xl font-bold">Welcome back Anon!</h2>
            <form className="flex flex-col gap-4 bg-card p-4 rounded-lg">
                <Label htmlFor="password">Password</Label>
                <Input type="password" placeholder="Password" id="password" {...form.register('Password')} />
                <Button type="button" onClick={form.handleSubmit(onSubmit)}>SignIn</Button>

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
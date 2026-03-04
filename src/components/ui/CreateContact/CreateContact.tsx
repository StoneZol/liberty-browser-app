
import { Button } from '../button';
import { Label } from '../label';
import { libertyCore } from 'liberty-core';
import useCreateContactHook from './CreateContact.hooks';
import { Separator } from '../separator';
import { TemplatePopover } from '../popover';
import CanvasSecureTextInput from '../CanvasSecureTextInput';

interface CreateContactProps {
    onDone?: () => void;
}

const CreateContact = ({ onDone }: CreateContactProps) => {
    const { form, onSubmit, handleNoiseLengthChange, handleIterationsChange, configObj } = useCreateContactHook()
    return (
        <form className='flex flex-col gap-6 p-2 md:p-4'>
            {/* Seed phrase section */}
            <section className='flex flex-col gap-3 rounded-lg border bg-card p-4'>
                <Label htmlFor='seedPhrase' className='text-xs font-medium uppercase tracking-wide flex items-center justify-between'>
                    <span>Seed Phrase</span>
                    <TemplatePopover
                        trigger={
                            <Button type='button' variant='outline' size='icon' className='h-7 w-7 text-xs'>
                                ?
                            </Button>
                        }
                        sideOffset={8}
                    >
                        <div className='space-y-2 text-sm'>
                            <p className='font-medium'>What is a seed phrase, anon?</p>
                            <p className='text-muted-foreground'>
                                It&apos;s the secret sentence all ur keys are born from. We never save it as text, just a one‑way hash.
                            </p>
                            <p className='text-xs text-muted-foreground'>
                                If the visual hash flips, u typed a different spell. Double‑check before u trust it.
                            </p>
                        </div>
                    </TemplatePopover>
                </Label>
                <CanvasSecureTextInput
                    minHeight={40}
                    value={form.watch('seedPhrase')}
                    onChange={(value) => form.setValue('seedPhrase', value, { shouldValidate: true })}
                    mask={true}
                    enableOverlay={false}
                />
                {form.formState.errors.seedPhrase && (
                    <p className='text-xs text-destructive'>{form.formState.errors.seedPhrase.message}</p>
                )}

                <p className='mt-1 text-xs text-muted-foreground'>
                    Hash: {libertyCore.crypto.fingerprint.visual(configObj.seedHash)}
                </p>
            </section>

            {/* Config section */}
            <section className='flex flex-col gap-3 rounded-lg border bg-card p-4'>
                <div className='flex items-start justify-between gap-2'>
                    <div className='space-y-1'>
                        <p className='text-sm font-semibold'>Contact config</p>
                    </div>

                    <TemplatePopover
                        trigger={
                            <Button type='button' variant='outline' size='icon' className='h-7 w-7 text-xs'>
                                ?
                            </Button>
                        }
                        sideOffset={8}
                    >
                        <div className='space-y-2 text-sm'>
                            <p className='font-medium'>What&apos;s inside the config?</p>
                            <ul className='list-disc pl-4 text-xs text-muted-foreground'>
                                <li>
                                    <span className='font-medium'>Tag</span> — tiny label dropped into the flow. Cool flex, but don&apos;t leak OPSEC, anon.
                                </li>
                                <li>
                                    <span className='font-medium'>Noise length</span> — how much pseudo‑random noise we sprinkle in (0–512).
                                </li>
                                <li>
                                    <span className='font-medium'>Description</span> — free‑form notes for future‑u or ur chumbas.
                                </li>
                            </ul>
                            <p className='text-xs text-muted-foreground'>
                                We hash this whole config so u can see if anything changed behind ur back.
                            </p>
                        </div>
                    </TemplatePopover>
                </div>

                <div className='flex flex-col gap-3'>
                    <div className='flex flex-col gap-3'>
                        <Label htmlFor='tag' className='text-xs font-medium uppercase tracking-wide'>
                            Tag*
                        </Label>
                        <CanvasSecureTextInput
                            minHeight={40}
                            value={form.watch('tag')}
                            onChange={(value) => form.setValue('tag', value, { shouldValidate: true })}
                            mask={true}
                            enableOverlay={false}
                        />
                        {form.formState.errors.tag && (
                            <p className='text-xs text-destructive'>{form.formState.errors.tag.message}</p>
                        )}
                    </div>
                    <div className='flex flex-col gap-3'>
                        <Label htmlFor='iterations' className='text-xs font-medium uppercase tracking-wide'>
                            Iterations* (0–1000000)
                        </Label>
                        <CanvasSecureTextInput
                            minHeight={40}
                            value={form.watch('iterations')}
                            onChange={handleIterationsChange}
                            mask={true}
                            enableOverlay={false}
                        />
                        {form.formState.errors.iterations && (
                            <p className='text-xs text-destructive'>{form.formState.errors.iterations.message}</p>
                        )}
                    </div>

                    <div className='flex flex-col gap-3'>
                        <Label htmlFor='noiseLength' className='text-xs font-medium uppercase tracking-wide'>
                            Noise Length* (0–512)
                        </Label>
                        <CanvasSecureTextInput
                            minHeight={40}
                            value={form.watch('noiseLength')}
                            onChange={handleNoiseLengthChange}
                            mask={true}
                            enableOverlay={false}
                        />
                        {form.formState.errors.noiseLength && (
                            <p className='text-xs text-destructive'>{form.formState.errors.noiseLength.message}</p>
                        )}
                    </div>
                </div>

                <div className='flex flex-col gap-3'>
                    <Label htmlFor='description' className='text-xs font-medium uppercase tracking-wide'>
                        Description
                    </Label>
                    {/* <Input {...form.register('description')} type='password' id='description' /> */}
                    <CanvasSecureTextInput
                        minHeight={40}
                        value={form.watch('description')}
                        onChange={(value) => form.setValue('description', value, { shouldValidate: true })}
                        mask={true}
                        enableOverlay={false}
                    />
                    {form.formState.errors.description && (
                        <p className='text-xs text-destructive'>{form.formState.errors.description.message}</p>
                    )}
                </div>

                <Separator />
                <p className='text-xs text-muted-foreground'>
                    Config hash: {libertyCore.crypto.fingerprint.visual(configObj.hash)}
                </p>
            </section>

            <Button
                type='button'
                className='self-end'
                onClick={form.handleSubmit(() => {
                    onSubmit();
                    onDone?.();
                })}
            >
                Create Contact
            </Button>
        </form>
    );
};

export default CreateContact;
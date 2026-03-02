
import { Input } from '../input';
import { Button } from '../button';
import { Label } from '../label';
import { libertyCore } from 'liberty-core';
import useCreateContactHook from './CreateContact.hooks';
import { Separator } from '../separator';
import { TemplatePopover } from '../popover';

const CreateContact = () => {
    const { form, onSubmit, handleNoiseLengthChange } = useCreateContactHook()
    const seedPhrase = form.watch('seedPhrase')
    const tag = form.watch('tag')
    const noiseLength = form.watch('noiseLength')
    const seedHash = libertyCore.crypto.hash(seedPhrase)
    const config = `${tag}-${noiseLength}`
    const configHash = libertyCore.crypto.hash(config)
    return (
        <form className='flex flex-col gap-6 p-4'>
            {/* Seed phrase section */}
            <section className='flex flex-col gap-3 rounded-lg border bg-card p-4'>
                <div className='flex items-start justify-between gap-2'>
                    <div className='space-y-1'>
                        <p className='text-sm font-semibold'>Seed phrase</p>
                        <p className='text-xs text-muted-foreground'>
                            We never stash your raw seed, anon — only its hash. The funky fingerprint lets you see if you fat‑fingered it.
                        </p>
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
                            <p className='font-medium'>What is a seed phrase, anon?</p>
                            <p className='text-muted-foreground'>
                                It&apos;s the secret sentence all your keys are born from. We never save it as text, just a one‑way hash.
                            </p>
                            <p className='text-xs text-muted-foreground'>
                                If the visual hash flips, you typed a different spell. Double‑check before you trust it.
                            </p>
                        </div>
                    </TemplatePopover>
                </div>

                <Label htmlFor='seedPhrase' className='text-xs font-medium uppercase tracking-wide'>
                    Seed Phrase
                </Label>
                <Input {...form.register('seedPhrase')} type='password' id='seedPhrase' />
                {form.formState.errors.seedPhrase && (
                    <p className='text-xs text-destructive'>{form.formState.errors.seedPhrase.message}</p>
                )}

                <p className='mt-1 text-xs text-muted-foreground'>
                    Hash: {libertyCore.crypto.fingerprint.visual(seedHash)}
                </p>
            </section>

            {/* Config section */}
            <section className='flex flex-col gap-3 rounded-lg border bg-card p-4'>
                <div className='flex items-start justify-between gap-2'>
                    <div className='space-y-1'>
                        <p className='text-sm font-semibold'>Contact config</p>
                        <p className='text-xs text-muted-foreground'>
                            This config tells us how to wrap your encrypted message in extra noise so it looks nice and messy.
                        </p>
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
                                    <span className='font-medium'>Description</span> — free‑form notes for future‑you or your chumbas.
                                </li>
                            </ul>
                            <p className='text-xs text-muted-foreground'>
                                We hash this whole config so you can see if anything changed behind your back.
                            </p>
                        </div>
                    </TemplatePopover>
                </div>

                <div className='grid gap-3 md:grid-cols-2'>
                    <div className='flex flex-col gap-1'>
                        <Label htmlFor='tag' className='text-xs font-medium uppercase tracking-wide'>
                            Tag*
                        </Label>
                        <Input {...form.register('tag')} type='password' id='tag' />
                        {form.formState.errors.tag && (
                            <p className='text-xs text-destructive'>{form.formState.errors.tag.message}</p>
                        )}
                    </div>

                    <div className='flex flex-col gap-1'>
                        <Label htmlFor='noiseLength' className='text-xs font-medium uppercase tracking-wide'>
                            Noise Length* (0–512)
                        </Label>
                        <Input
                            {...form.register('noiseLength')}
                            type='password'
                            id='noiseLength'
                            inputMode='numeric'
                            onChange={handleNoiseLengthChange}
                        />
                        {form.formState.errors.noiseLength && (
                            <p className='text-xs text-destructive'>{form.formState.errors.noiseLength.message}</p>
                        )}
                    </div>
                </div>

                <div className='flex flex-col gap-1'>
                    <Label htmlFor='description' className='text-xs font-medium uppercase tracking-wide'>
                        Description
                    </Label>
                    <Input {...form.register('description')} type='password' id='description' />
                    {form.formState.errors.description && (
                        <p className='text-xs text-destructive'>{form.formState.errors.description.message}</p>
                    )}
                </div>

                <Separator />
                <p className='text-xs text-muted-foreground'>
                    Config hash: {libertyCore.crypto.fingerprint.visual(configHash)}
                </p>
            </section>

            <Button type='button' className='self-end' onClick={form.handleSubmit(onSubmit)}>
                Create Contact
            </Button>
        </form>
    );
};

export default CreateContact;
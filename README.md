# Liberty Browser Plugin

End-to-end encryption layer for messaging. Encrypt messages before sending through any messenger—even if someone gets access to your messenger secrets, they can't read your data.

## What It Does

Encrypts messages client-side before they hit any messenger. All encryption happens in your browser. No server, no middleman, no logs.

## Security Model

- **Client-side encryption only.** Your messages never leave your device unencrypted.
- **Password-protected storage.** All data encrypted at rest with your master password.
- **Canvas-based input fields.** Text never touches the DOM—rendered on canvas to prevent keyloggers and screen scrapers.
- **Emergency destructor.** Set an emergency password that wipes all data immediately. No recovery, no questions asked.

## Features

### Contact Management

- Create contacts with custom encryption config (tag, noise length, iterations)
- Edit existing contacts
- Delete contacts
- Visual hash verification for seed phrases and configs

### Message Encryption/Decryption

- Encrypt messages before sending
- Decrypt received messages
- Secure input/output fields (canvas-rendered, no DOM exposure)

### Data Protection

- All data encrypted with master password
- No plaintext storage
- Emergency password for instant data destruction

## Tech Stack

- React 19 + TypeScript
- Vite
- React Konva (canvas rendering)
- liberty-core (encryption backend)
- Zustand (state management)
- React Hook Form + Zod (form validation)

## Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Architecture

### Secure Input Fields

Input fields render text on canvas, not in DOM. This prevents:

- Keyloggers reading keystrokes
- Screen scrapers extracting text
- Browser extensions accessing form data
- DevTools inspection of sensitive values

### Encryption Flow

1. User enters message in secure canvas field
2. Message encrypted with contact's config
3. Encrypted payload ready for messenger
4. Recipient decrypts using matching contact config

### Storage

- All contacts stored encrypted
- Seed phrases hashed (never stored as plaintext)
- Config hashes for integrity verification
- Master password required for access

## Emergency Destructor

Set an emergency password during setup. If someone forces you to reveal your password, give them the emergency one. It immediately:

- Deletes all contacts
- Wipes all encrypted data
- Cannot be recovered

**Use this feature responsibly.** There's no undo.

## License

MIT

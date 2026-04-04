### WARNING: THIS IS FULLY VIBECODED. VERIFY THE CODE BEFORE RUNNING

# Start In Library (Decky Plugin)

A Decky plugin that switches Steam Deck to the **Library** tab shortly after startup.

Because Decky/Steam does not expose a direct "boot to tab" setting, this plugin waits for Decky to load and then navigates to `/library`.

## Configuration
Set timers to your prefernce in `src/index.tsx`
Default Values:
INITIAL_DELAY_MS = 2000
RETRY_INTERVAL_MS = 1000
MAX_RETRY_WINDOW_MS = 45000

## Build
Prerequisites:
- Node.js 16.14+ (or newer)
- pnpm 9.x

Commands:

```bash
pnpm install
pnpm run build
```

This creates the frontend bundle at `dist/index.js`.

## Install on Steam Deck (manual)

1. Copy the plugin folder (`decky-start-in-library`) into:
   - `~/homebrew/plugins/` on your Steam Deck
2. Ensure these files exist in that plugin directory:
   - `plugin.json`
   - `dist/index.js`
   - `main.py`
3. Restart Decky Loader (or reboot the Deck).

After restart, Decky will load the plugin and it should switch to Library after a short delay.

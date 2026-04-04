### WARNING: THIS IS FULLY VIBECODED. VERIFY THE CODE BEFORE RUNNING

# Start In Library (Decky Plugin)

A Decky plugin that switches Steam Deck to the **Library** tab shortly after startup. Also, if TabMaster is installed - waits for it to load(to make sure it updates library tabs)

Because Decky/Steam does not expose a direct "boot to tab" setting, this plugin waits for Decky to load and then navigates to `/library`.


## Install on Steam Deck (manual)

1. Download the zip from releases and extract into:
   - `~/homebrew/plugins/` on your Steam Deck
   - or enable developer mode in Decky and use the manual install button

2. Restart Decky Loader (or reboot the Deck).
   - After restart, Decky will load the plugin and it should switch to Library after a short delay.

3. Optional: TabMaster plugin is recommended to use with this plugin. Download here: https://github.com/Tormak9970/TabMaster

## Configuration
Set timers to your prefernce in `dist/index.js`
Default Values:
- INITIAL_DELAY_MS = 2000
- RETRY_INTERVAL_MS = 1000
- MAX_RETRY_WINDOW_MS = 45000

## Build
Prerequisites:
- Node.js 16.14+ (or newer)
- pnpm 9.x

Commands:

```bash
pnpm install
pnpm run build
```

Files required for plugin to work(these should be installed):
```
src/
dist/
main.py
package.json
plugin.json
rollup.config.js
tsconfig.json
```


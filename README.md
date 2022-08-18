# Better ad farmer for AI Dungeon
A new, better & safe advertisement farmer & bypass for AI Dungeon.

## What's new?
I added Safe Mode, so you can be completely sure you won't get banned(exceptions apply: see [Disclaimer](#disclaimer)) within that.

I also *slightly* improved the interface.

## Disclaimer
You will not get banned unless the developers silently update the API and I don't manage to place a warning and update the script in time, OR if you decide to use unsafe mode. Keep that in mind.

As a counter fact, I use this on main in unsafe mode with all restrictions lifted and still not banned.

## Usage
Check out the [showcase](https://youtu.be/Jr_UAZQ-mqQ) for an all-in-1 guide.
1. Open the Actions screen in AI Dungeon
2. Open the DevTools Console by pressing the key combo Ctrl+Shift+I.
2.1. Alternatively, right click anywhere on the page, click "Inspect element" and open the Console tab.
3. Copy the contents of either provided file(both work equally well, but `ai-dungeon-better-farmer.min.js` is smaller) into clipboard.
4. Paste the copied contents into the console and press Enter.
5. You should see the contents of the page change. If they didn't, check the console for a highlighted error and make an issue.
6. Press "Initialize Farmer"
7. Enjoy!
### How do I change the settings?
1. Download & open either provided file in any text editor of your preference. Notepad works just fine.
2. Place "yes" after the first setting, which immediately makes you responsible for a potential ban and enables unsafe mode.
3. Change the settings you're looking to change.
4. Save the file.
Supported values: `true`/`yes`/`enable`/`enabled` & `false`/`no`/`disable`/`disabled`(interchangeable)

## (Hopefully) Upcoming features
- Node.js support and Monitor Mode
- Reverse engineer the mobile application and add a safe action limit bypass
- TamperMonkey userscript
- Waiting for your suggestion

# Better ad farmer for AI Dungeon
A new, better & safer advertisement farmer & bypass for AI Dungeon.

## Meta
People might come here with the expected question of "why?", implying that ads were a good solution or something. Well, maybe. But:
1. I can't use my web-browser to watch ads. I want to.
2. I want to use an old build of AI Dungeon mobile app without ads. I can't(well, I do, thanks to AIDBF, doesn't matter).
3. 10 actions per 20-30 seconds? For real?
4. I can't use the AI Dungeon app to watch ads when I don't use a VPN, because I'm from Russia.

## Precautions
Please, for God's sake, don't get too greedy. It's highly unlikely the project will get outdated and abandoned in a matter of days, so, if you want to farm, do it passively. +300 actions per day at most. More will get you flagged and yeeted along with all your stories, so don't hold me responsible for this.

# v2
The userscript version, much more convenient and way more stable.

## Is it working right now?
Yes, 14.10.2022

## Usage
Check out the [showcase](https://check.the.url/you-are-too-early-and-i-am-too-lazy) for an in-depth guide.
1. Install TamperMonkey(GreaseMonkey NOT TESTED!).
2. Copy the contents of either provided file suffixed `.v2`(`ai-dungeon-better-farmer.v2.min.js` recommended) into clipboard.
3. Create a new TamperMonkey script and paste the copied contents into the script content(overwrite everything!).
4. Ctrl+S.
5. Enable it if required.
6. Open any adventure play of yours and (IMPORTANT) refresh the page, you'll see 2 additional buttons on your hotbar.
7. If you see that the icon at the top left isn't an arrow anymore, proceed to step 8, otherwise try refreshing again.
8. Click `+10 ACTIONS` or `+10 ACTIONS [FAST]`(may get the counter out of sync).
9. Your updated actions will be visible in the left menu panel.
10. To use the newly acquired actions, you'll have to refresh the page again.
11. Enjoy!

# v1 | NOT UPDATED
The DevTools version, less convenient and might be fixed soon.

## Is it working right now?
Unknown. Worked on main 21.09.2022(US 09/21/2022), but it's... not really supposed to anymore?

## Usage
Check out the [showcase](https://youtu.be/Jr_UAZQ-mqQ) for an all-in-1 guide.
1. Open the Actions screen in AI Dungeon.
2. Open the DevTools Console by pressing the key combo Ctrl+Shift+I.
3. Copy the contents of either provided file(both work equally well, but `ai-dungeon-better-farmer.min.js` is smaller) into clipboard.
4. Paste the copied contents into the console and press Enter.
5. You should see the contents of the page change. If they didn't, check the console for a highlighted error and make an issue.
6. Press "Initialize Farmer".
7. Enjoy!
### How do I change the settings?
1. Download & open either provided file in any text editor of your preference. Notepad works just fine.
2. Place "yes" after the first setting, which immediately makes you responsible for a potential ban and enables unsafe mode.
3. Change the settings you're looking to change.
4. Save the file.
Supported values: `true`/`yes`/`enable`/`enabled` & `false`/`no`/`disable`/`disabled`(interchangeable)

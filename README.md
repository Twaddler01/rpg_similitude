# RPG Similitude

## ONLINE URL
https://twaddler01.github.io/rpg_similitude/

## IMPORTANT
- To avoid database problems, use the RESET ALL DATA option on MAIN game tab if revisiting the online URL at a later time. Updates are continually being made to the database(s) and can be buggy.

## KNOWN ISSUES
- For best results, download .zip and use localhost server. This game does not yet use Node.js and is only client-side. (For Android, I use [Simple HTTP server](https://play.google.com/store/apps/details?id=com.phlox.simpleserver)).
- Identified an intermittent CSS error while using Google Chrome browser (Mobile) that may throw an error when applying a css classList. Try using Firefox or a different browser if this occurs.

## BUGS
- REVIVE seems to work intermittently, likely due an async issue with database timing. Page can be reloaded to reset.

## PROGRESSION WIP
* BATTLE needs to be revamped clean in preparation for battle icons, potion usage, etc.
* BATTLE needs preparation for the ability to attack multiple enemies simultaneously.
* (OLD) At about level 6 for location 1, need potion or healing ability to surive battles.
* More equipment items needed.

## FUTURE FEATURES
* A CURRENTLY EQUIPPED tooltip for stat comparisons of inventory items that match the currently equipped slot item.
* Drops for enemy types that can be sold or used for a purpose.
* CRAFT tab, for potion making and other professions.
* QUEST tab

## UPDATES
12-04-2024
- BATTLE: Added multiple enemy support and 3 basic player abilities. Not 100% sure of current ability layout quite yet, but it's similar to what I'm aiming for. Need a # of turns cooldown support for abilities and a very basic tooltip next.

12-03-2024
- BATTLE is done for location, level, enemy, and counts. Progress on battle elements is next, allowing for multiple enemies.

12-02-2024
- BATTLE remembers last selected level/enemy/count per session and will auto select them. Remaining work here is to load last location selected on refresh of tab (update_locations). Selections of enemies do not yet save after session, but may implement feature after further testing.

11-29-2024
- Updated BATTLE to show next unlock requirement (currently only kills) or if there is a newer level available than currently selected level, it instead shows that a new unlocked level is available.

11-26-2024
- In process of overhauling BATTLE tab with new database template and improved integration. This opens up level requirements beyond "kills" and can include many other checks. New structure accounts for location level names instead of just numbers. May integrate enemy level ranges for locations to better set it up for future battle/location dynamics.
- BATTLE fights can either taeget RANDOM or specific enemies. Future template update will include this.

11-25-2024
- Updated 'GATHER' section with revised code to show all gather inventory items as blank with '? Unknown' unless unlocked to eliminate 'jump' of screen when elements are added/updated.

11-23-2024
- Various bug fixes.
- "Gather" is still in progress, but the experience and unlocks portion of herb gathering are essentially done.
- Updated gatherData to work without its old array using integrated JSON database in one place. Since it was easiest to load images dynamically, these are generated per session. May eventually just add each img URL individually in JSON database for consistency.
- Updated create_el to work dynamically by using unique IDs when neccesary.

11-22-2024
- Added an [ Equipped ] display for weapons that shows the damage per turn as if weapon was equipped. This is in preparation for a "CURRENTLY EQUIPPED" tooltip to sit alongside regular one for comparisons in a future update.
- Cleaned out some old code and fixed some tabbing for better code look.
- Most create_el function calls now use const assignments to ensure proper element assignments.

11-21-2024
- Migrated all array data over to indexedDB. There may be some bugs or quirks but it seems to run generally smooth at the moment.
- Created temporary function to load an existing character slot template (slot 1) for testing purposes. Slot 2 is using blank template and should retain any progress on reload. Will probably eventually give option to import or export a .JSON save file to backup the data locally as an encrypted hash.

11-20-2024
- In process of converting code to SLOT format. Right now, code is between array (old method) and IndexedDB (new method). This will potentially use temporary arrays and direct updates to the database following JSON templates.
- Updated through STATS tab so far with async data used with database.

11-11-2024
- In process of moving all array data over to the IndexedDB format. This will require revamping a lot of functions, but trying to simplify it with new dynamic functions for database modifications. The database will ensure game can be saved, modified, and played more efficiently than using temporary array assignments. JSON will be used to create a new game to setup proper structure initially, then modifications can be easily made, while keeping the structure essentially the same as the array once was.
- This setup will allow for saved data "slots" and better functionality once code is ready for app development.

11-09-2024
- Cleaned up some elements and commented out test_section unless needed. Will be phasing out elementsData next.
- Need a starting tab area for first load to give overview and options to create new game or load existing game.
- An autosave feature would be beneficial to store JSON changes of saveData. Will soon test this option instead of using browser storage. Since ultimate goal is app development, will likely use Node.js soon for a server/client utilization instead.

11-08-2024
- Moved relevant functions to battle.js.
- Adjusted various parts of "next attacks" to match new format of clearing/recreating elements.
- Updated combat status to disable all tabs while in combat or while player is dead (until revived).
- Added a messages display area and corresponding function and array. Only player level-ups are integrated at this time.

11-06-2024
- Updated stats for battles using equipment.js function. Needs adjustments for balance due to armor mitigation, player damage increase, etc but seems to be working well so far.
- Added all other sections to tabs. Still need to move messages above tabs, but not sure how this design will go as of yet.
- Added new battle.js but need all relevant functions moved over to it.
- XP gains may need to be adjusted for QUESTS if decided to go that route eventually.

11-05-2024
- Stats area completed. Stats are based solely on battleStats array, which should ensure easy and updated values verses the old method. Still needs final testing, but seems to be working well so far. Next step is to ensure updates are applied when needed for new setup verses old setup.

11-03-2024
- Working on moving all stats over to new function from equipment.js. Integration not yet fully complete. There will likely be errors and log outputs at the moment.
- Decided all elements will be setup using tab layout, which will require recoding many functions, but worth the effort for style, layout, etc.
- New character creation needs future work. Right now, values are only for player level and display purposes. Will create select options for class/race and checks of proper values for player name, etc. Defaults if nothing is entered will be used for testing dynamics.

11-01-2024
- Updated equipment.js.
- Working on potentially adding "tabs" instead of the expand-type design. It should be a lot more visually appealing. Will require changing "toggle" setup and/or removing of it, but so far it looks much cleaner.

### SEE [README ARCHIVE](README_ARCHIVE.md) FOR MORE

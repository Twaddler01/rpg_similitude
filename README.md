# RPG Similitude
# URL
https://twaddler01.github.io/rpg_similitude/
# Issues
- May be issues loading code from URL. For best results, download .zip and use localhost server. (For Android, I use Simple HTTP server):
https://play.google.com/store/apps/details?id=com.phlox.simpleserver
- Added proper image files, but occasionally may receive a Github error. Pull request will be made next update to see if it resolves and to clean up unnecessary code/files.

# Updates

09-21-2024
- Inventory SHOULD be working as intended. May still be bugs. Need to add the newer code to swap equipment function but wanted to commit now in case of unwanted behavior during integration.
- A little restructuring with "general_functions.js" to make code cleaner. Will probably break down even more in functions.js soon, since it has about 2000 lines of code and is harder to navigate this way, etc.

09-19-2024
- Worked on an issue with equipment items that was removing an extra item from inventory when integrating 'REMOVE' button. Button works now but still needs actions (like placing back into inventory, etc). But, it is removed from array and disappears from elements when called again, as intended.
- "Equipment" and "inventory" elements/tooltips are treated more universal, with slight variations between functions to perform similar tasks, which gives code a much cleaner organization.
- Allowed user zooming in index.htnl file, which will probably stay.

09-14-2024
- Added health and resource bars for combat (energy/mana).
- Created a function for showing player status as in combat, which is whenever a battle is started.
- Need enemies and abilities to equip/swap gear as top priorities.

09-14-2024
- Added many stat calculations, stored main values in array for use in battles. Finished health bar.
- Need dynamic ability for equipment changes in a function to update as equipment is modified. Likely, this is the next process before starting on the "battle" functionality.

09-13-2024
- Player experience elements and data added and tested.
- Possibly will soon need to split functions.js into categories of functions, as code is getting quite lengthy.

09-11-2024
- Inventory "mess" resolved and data is properly placed in saveData array. Need a bit more debugging for testing purposes. Thinking of adding a "bank" for extra storage space. Need to setup working Gold currency, which is essentially ready to go already.

09-10-2024
- Inventory is working but messy. Will be revamping system for easy save.

09-06-2024
- Updated inventory to include items and image icons. Needs tooltip work and needs to save inventory data to saveData array.

09-05-2024
- Uploaded media files.
- Worked on stats. Adding each stat description/calculation to array in order to update to saveData eventually. Still working on details.
- Next long-term goal is adding more equipment and integrating with inventory to equip/unequip items with stats automatically updating.

09-04-2024
- Updated equipment section some more. Added default equipment and stat information. Armor is now totaled up based on what is equipped starting out, will add other stats dynamically soon.
- Likely need a few functions to update equipment slots as equipment is swapped, etc.
- Need current icon images uploaded to Github for full functionality.

09-02-2024
- Character section added for user to specify player info (name, race, class) if not yet created or saved.
- Added popup item tooltip and added equipment data. Ready for default equipment and adding extras for stats display from itemData array
- Items are ready to be worked, ensuring they are always saved in the main saveData array.

08-30-2024
- Completely revamped locations using a more direct approach. Other method required way too much code than necessary, including array data. New simplified approach will just require tracking locations and player 'kills', which it will keep memory of in future editions. This keeps data better maintained for progression, saving data, and for any future updates to new locations, etc. Next WIP is working fighting/battles and more character data, like leveling, skills, professions, etc.
- Locations has a great start now, but need to reintegrate battles with new design.
- Various scenarios are possible by manually changing saved array data. Added RESET to clear saved data easily, which will be needed for testing and the final product.

08-27-2024
- New updates to locations. Working on 'previous' and 'next' buttons. Can "one shot" which will be a kill (in one click) and later be the main trigger from enemy deaths.

08-24-2024
- In midst of integrating game progression to be saved to local storage, which requires a much different design around a tracking array (in this case, 'saveData').
- Temporarily moved some functions and variables being worked on to main.js for simplicity.
- Need game save & load functionality once game is more advanced. For testing purposes, manipulating array manually right now will suffice. This feature is easy to integrate when ready.
- Locations finally work, with integration with kill counts coming soon (currently, will set up where user must kill 3 at one level to move on to next level). These values can be easily adjusted later as necessary.
- Testing buttons will be available while in development for testing purposes.

08-09-2024
- Created basic inventory environment.

08-08-2024
- Initial setup on Github Pages.

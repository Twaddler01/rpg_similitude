# RPG Similitude
# URL
https://twaddler01.github.io/rpg_similitude/
# Updates

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

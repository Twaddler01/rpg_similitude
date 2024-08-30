# RPG Similitude
# URL
https://twaddler01.github.io/rpg_similitude/
# Updates

08-30-2024
- Completely revamped locations using a more direct approach. Other method required way too much code than necessary, including array data. New simplified approach will just require tracking locations and player 'kills', which it will keep memory of in future editions. This keeps data better maintained for progression, saving data, and for any future updates to new locations, etc. Next WIP is integrating new locations data with each battle, which should be fairly easy, and then can work on stats for fighting/battles.
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

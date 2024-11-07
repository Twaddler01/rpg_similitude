// battle.js
// need to move all other battle functions over from functions.js

import { characterData } from './data.js';

export function fetch_playerStats(opt) {
    let playerStats = characterData.find(d => d.id === 'player_stats');
    let stats = update_battleStats();

    playerStats.max_health = stats.calc_totalHealth();
    // playerStats.cur_health
    playerStats.max_resource = stats.calc_resource_melee();
    // playerStats.cur_resource

    if (opt === 'new') {
        // Reset current health
        playerStats.cur_health = playerStats.max_health;
        // Reset current resource
        playerStats.cur_resource = playerStats.max_resource;
    }
}
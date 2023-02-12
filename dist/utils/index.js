"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickRandom = exports.findDuplicatedSortStandings = void 0;
const findDuplicatedSortStandings = (standings) => {
    let array = [];
    let firstTeam = standings[0];
    for (let i = 0; i < standings.length; i++) {
        if (standings[i].goals === firstTeam.goals && standings[i].points === firstTeam.points)
            array.push(standings[i]);
    }
    return array;
};
exports.findDuplicatedSortStandings = findDuplicatedSortStandings;
const pickRandom = (choice1, choice2) => {
    return Math.random() < 0.5 ? choice1 : choice2;
};
exports.pickRandom = pickRandom;

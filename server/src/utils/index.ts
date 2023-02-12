import { IStanding } from '../models/Standing';

export const findDuplicatedSortStandings = (standings: Array<IStanding>) => {
    let array = [];
    let firstTeam = standings[0];
    for (let i = 0; i < standings.length; i++) {
        if (standings[i].goals === firstTeam.goals && standings[i].points === firstTeam.points) array.push(standings[i]);
    }
    return array;
};

export const pickRandom = (choice1: any, choice2: any) => {
    return Math.random() < 0.5 ? choice1 : choice2;
};

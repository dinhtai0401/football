import { NextFunction, Request, Response } from 'express';

import Team from '../../models/Team';
import Standing from '../../models/Standing';
import Match from '../../models/Match';

import matches from '../matches';
import standings from '../standings';
import logger from '../../library/logger';

const createATeam = async (teamName: string) => {
    return await Team.create({ teamName });
};

const getAllTeams = async (req: Request, res: Response, next: NextFunction) => {
    const teams = await Team.find();
    return res.status(200).json({ data: teams });
};

const createTeamsAndMatchs = async (req: Request, res: Response, next: NextFunction) => {
    const teams: string[] = req.body.teams;

    let createdTeams: any[] = [];
    for (let i = 0; i < teams.length; i++) {
        const team: any = await createATeam(teams[i]);
        await standings.createStanding(team._id, team.teamName);

        createdTeams.push(team);
    }

    let createdMatches = [];
    if (createdTeams)
        for (let firstTeam = 0; firstTeam < createdTeams.length; firstTeam++) {
            for (let secondTeam = firstTeam + 1; secondTeam < createdTeams.length; secondTeam++) {
                const match = await matches.createMatch(createdTeams[firstTeam]._id, createdTeams[secondTeam]._id, createdTeams[firstTeam].teamName, createdTeams[secondTeam].teamName);
                createdMatches.push(match);
            }
        }

    return res.status(201).json({ data: createdMatches });
};

const deleteAllData = async (req: Request, res: Response, next: NextFunction) => {
    const teamDrop = await Team.deleteMany();
    const matchDrop = await Match.deleteMany();
    const stadingDrop = await Standing.deleteMany();

    Promise.all([teamDrop, matchDrop, stadingDrop]).then(() => {
        logger.info('Deleted all data OK')
        return res.status(200).json({ message: 'ok' });
        
    });
};

export default { getAllTeams, createTeamsAndMatchs, deleteAllData };

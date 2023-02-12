import { NextFunction, Request, Response } from 'express';
import { Schema } from 'mongoose';
import Match from '../../models/Match';
import Standing, { IStanding } from '../../models/Standing';
import { findDuplicatedSortStandings, pickRandom } from '../../utils';

const getAllStandings = async (req: Request, res: Response, next: NextFunction) => {
    const standings = await Standing.find();
    return res.status(200).json({ data: standings });
};

const createStanding = async (teamId: Schema.Types.ObjectId, teamName: string) => {
    return await Standing.create({
        teamId,
        teamName
    });
};

const updateStanding = async (standingId: Schema.Types.ObjectId) => {
    return await Standing.updateOne({
        _id: standingId
    });
};

const getStandings = async (req: Request, res: Response, next: NextFunction) => {
    let standings: Awaited<IStanding | any> = await Standing.find();

    if (standings) {
        /** The team with most points wins */
        standings.sort((a: IStanding, b: IStanding) => (a.points < b.points ? 1 : -1));
        /** If two teams have equal amount of points, the team with more goals wins */
        standings.sort((a: IStanding, b: IStanding) => (a.goals < b.goals ? 1 : -1));
        /** If the number of goals is equal, the team that won the match between the two teams wins */
        const duplicatedStandings = findDuplicatedSortStandings(standings);
        if (duplicatedStandings.length === 2) {
            const matches = await Match.find({ $or: [{ homeTeamId: duplicatedStandings[0].teamId }, { awayTeamId: duplicatedStandings[0].teamId }] });
            let wonTeamId: any;
            for (let i = 1; i < duplicatedStandings.length; i++) {
                let matchedMatch = matches.filter((match) => match.homeTeamId.equals(duplicatedStandings[i].teamId) || match.awayTeamId.equals(duplicatedStandings[i].teamId));
                matchedMatch.map((i) => {
                    if (i.homeTeamGoal > i.awayTeamGoal) {
                        wonTeamId = i.homeTeamId;
                    } else if (i.homeTeamGoal < i.awayTeamGoal) {
                        wonTeamId = i.awayTeamId;
                    } else {
                        wonTeamId = pickRandom(i.homeTeamId, i.awayTeamId);
                    }
                });
            }
            duplicatedStandings.sort((a: any, b: any) => (a.teamId.equals(wonTeamId) ? -1 : 1));
        } else {
            /** Random order */
            duplicatedStandings[Math.floor(Math.random() * duplicatedStandings.length)];
        }
        const ids = new Set(duplicatedStandings.map((d) => d._id));
        standings = [...duplicatedStandings, ...standings.filter((d: IStanding) => !ids.has(d._id))];
    }

    res.status(200).json({ data: standings });
};

export default { getAllStandings, createStanding, updateStanding, getStandings };

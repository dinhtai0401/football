import { NextFunction, Request, Response } from 'express';
import { Schema } from 'mongoose';
import Match, { IMatch } from '../../models/Match';
import Standing from '../../models/Standing';
import { winToAddScore, drawToAddScore } from '../../utils/constants';
import logger from '../../library/logger';

const createMatch = async (homeTeamId: Schema.Types.ObjectId, awayTeamId: Schema.Types.ObjectId, homeTeamName: string, awayTeamName: string) => {
    const match = await Match.create({
        homeTeamId,
        awayTeamId,
        homeTeamName,
        awayTeamName
    });

    return match;
};

const getAllMatches = async (req: Request, res: Response, next: NextFunction) => {
    const matches = await Match.find({});

    return res.status(200).json({ data: matches });
};

const updateMatch = async (req: Request, res: Response, next: NextFunction) => {
    const matchId = req.params.matchId;
    const { homeTeamGoal, awayTeamGoal } = req.body;

    const match: IMatch | null = await Match.findById(matchId);

    if (match) {
        match.set(req.body);
        await match.save();

        const homeTeamStanding = await Standing.findOne({ teamId: match.homeTeamId });
        const awayTeamStanding = await Standing.findOne({ teamId: match.awayTeamId });

        /** The tournament standings. Winner of a match get 3 points, the loser gets 0 and if it's a tie,
both teams get 1 point */
        if (homeTeamStanding && awayTeamStanding) {
            let homeTeamStorage = {
                playedMatch: homeTeamStanding.playedMatch + 1,
                goals: homeTeamStanding.goals + homeTeamGoal,
                goalsAgainst: homeTeamStanding.goalsAgainst + awayTeamGoal
            };
            let awayTeamStorage = {
                playedMatch: awayTeamStanding.playedMatch + 1,
                goals: awayTeamStanding.goals + awayTeamGoal,
                goalsAgainst: awayTeamStanding.goalsAgainst + homeTeamGoal
            };
            if (match.homeTeamGoal > match.awayTeamGoal) {
                Object.assign(homeTeamStorage, { wins: homeTeamStanding.wins + 1, points: homeTeamStanding.points + winToAddScore });

                Object.assign(awayTeamStorage, { loses: awayTeamStanding.loses + 1 });
            } else if (match.homeTeamGoal === match.awayTeamGoal) {
                Object.assign(homeTeamStorage, { ties: homeTeamStanding.ties + 1, points: homeTeamStanding.points + drawToAddScore });

                Object.assign(awayTeamStorage, { ties: awayTeamStanding.ties + 1, points: awayTeamStanding.points + drawToAddScore });
            } else {
                Object.assign(homeTeamStorage, { loses: homeTeamStanding.loses + 1 });

                Object.assign(awayTeamStorage, { wins: awayTeamStanding.wins + 1, points: awayTeamStanding.points + winToAddScore });
            }
            /** HomeTeam is saving */
            homeTeamStanding.set(homeTeamStorage);
            await homeTeamStanding.save();

            awayTeamStanding.set(awayTeamStorage);
            /** AwayTeam is saving */
            await awayTeamStanding.save();
        }
    } else {
        logger.info('Update match for matchId: ${matchId} failed. Reason: Wrong matchId');
        let error: any;
        error.statusCode = 400;
        error.type = 'invalid_request';
    }

    return res.status(204).json({});
};

export default { getAllMatches, createMatch, updateMatch };

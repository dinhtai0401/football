"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Match_1 = __importDefault(require("../../models/Match"));
const Standing_1 = __importDefault(require("../../models/Standing"));
const constants_1 = require("../../utils/constants");
const logger_1 = __importDefault(require("../../library/logger"));
const createMatch = (homeTeamId, awayTeamId, homeTeamName, awayTeamName) => __awaiter(void 0, void 0, void 0, function* () {
    const match = yield Match_1.default.create({
        homeTeamId,
        awayTeamId,
        homeTeamName,
        awayTeamName
    });
    return match;
});
const getAllMatches = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const matches = yield Match_1.default.find({});
    return res.status(200).json({ data: matches });
});
const updateMatch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const matchId = req.params.matchId;
    const { homeTeamGoal, awayTeamGoal } = req.body;
    const match = yield Match_1.default.findById(matchId);
    if (match) {
        match.set(req.body);
        yield match.save();
        const homeTeamStanding = yield Standing_1.default.findOne({ teamId: match.homeTeamId });
        const awayTeamStanding = yield Standing_1.default.findOne({ teamId: match.awayTeamId });
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
                Object.assign(homeTeamStorage, { wins: homeTeamStanding.wins + 1, points: homeTeamStanding.points + constants_1.winToAddScore });
                Object.assign(awayTeamStorage, { loses: awayTeamStanding.loses + 1 });
            }
            else if (match.homeTeamGoal === match.awayTeamGoal) {
                Object.assign(homeTeamStorage, { ties: homeTeamStanding.ties + 1, points: homeTeamStanding.points + constants_1.drawToAddScore });
                Object.assign(awayTeamStorage, { ties: awayTeamStanding.ties + 1, points: awayTeamStanding.points + constants_1.drawToAddScore });
            }
            else {
                Object.assign(homeTeamStorage, { loses: homeTeamStanding.loses + 1 });
                Object.assign(awayTeamStorage, { wins: awayTeamStanding.wins + 1, points: awayTeamStanding.points + constants_1.winToAddScore });
            }
            /** HomeTeam is saving */
            homeTeamStanding.set(homeTeamStorage);
            yield homeTeamStanding.save();
            awayTeamStanding.set(awayTeamStorage);
            /** AwayTeam is saving */
            yield awayTeamStanding.save();
        }
    }
    else {
        logger_1.default.info('Update match for matchId: ${matchId} failed. Reason: Wrong matchId');
        let error;
        error.statusCode = 400;
        error.type = 'invalid_request';
    }
    return res.status(204).json({});
});
exports.default = { getAllMatches, createMatch, updateMatch };

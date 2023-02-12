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
const utils_1 = require("../../utils");
const getAllStandings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const standings = yield Standing_1.default.find();
    return res.status(200).json({ data: standings });
});
const createStanding = (teamId, teamName) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Standing_1.default.create({
        teamId,
        teamName
    });
});
const updateStanding = (standingId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Standing_1.default.updateOne({
        _id: standingId
    });
});
const getStandings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let standings = yield Standing_1.default.find();
    if (standings) {
        /** The team with most points wins */
        standings.sort((a, b) => (a.points < b.points ? 1 : -1));
        /** If two teams have equal amount of points, the team with more goals wins */
        standings.sort((a, b) => (a.goals < b.goals ? 1 : -1));
        /** If the number of goals is equal, the team that won the match between the two teams wins */
        const duplicatedStandings = (0, utils_1.findDuplicatedSortStandings)(standings);
        if (duplicatedStandings.length === 2) {
            const matches = yield Match_1.default.find({ $or: [{ homeTeamId: duplicatedStandings[0].teamId }, { awayTeamId: duplicatedStandings[0].teamId }] });
            let wonTeamId;
            for (let i = 1; i < duplicatedStandings.length; i++) {
                let matchedMatch = matches.filter((match) => match.homeTeamId.equals(duplicatedStandings[i].teamId) || match.awayTeamId.equals(duplicatedStandings[i].teamId));
                matchedMatch.map((i) => {
                    if (i.homeTeamGoal > i.awayTeamGoal) {
                        wonTeamId = i.homeTeamId;
                    }
                    else if (i.homeTeamGoal < i.awayTeamGoal) {
                        wonTeamId = i.awayTeamId;
                    }
                    else {
                        wonTeamId = (0, utils_1.pickRandom)(i.homeTeamId, i.awayTeamId);
                    }
                });
            }
            duplicatedStandings.sort((a, b) => (a.teamId.equals(wonTeamId) ? -1 : 1));
        }
        else {
            /** Random order */
            duplicatedStandings[Math.floor(Math.random() * duplicatedStandings.length)];
        }
        const ids = new Set(duplicatedStandings.map((d) => d._id));
        standings = [...duplicatedStandings, ...standings.filter((d) => !ids.has(d._id))];
    }
    res.status(200).json({ data: standings });
});
exports.default = { getAllStandings, createStanding, updateStanding, getStandings };

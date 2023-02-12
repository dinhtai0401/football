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
const Team_1 = __importDefault(require("../../models/Team"));
const Standing_1 = __importDefault(require("../../models/Standing"));
const Match_1 = __importDefault(require("../../models/Match"));
const matches_1 = __importDefault(require("../matches"));
const standings_1 = __importDefault(require("../standings"));
const logger_1 = __importDefault(require("../../library/logger"));
const createATeam = (teamName) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Team_1.default.create({ teamName });
});
const getAllTeams = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const teams = yield Team_1.default.find();
    return res.status(200).json({ data: teams });
});
const createTeamsAndMatchs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const teams = req.body.teams;
    let createdTeams = [];
    for (let i = 0; i < teams.length; i++) {
        const team = yield createATeam(teams[i]);
        yield standings_1.default.createStanding(team._id, team.teamName);
        createdTeams.push(team);
    }
    let createdMatches = [];
    if (createdTeams)
        for (let firstTeam = 0; firstTeam < createdTeams.length; firstTeam++) {
            for (let secondTeam = firstTeam + 1; secondTeam < createdTeams.length; secondTeam++) {
                const match = yield matches_1.default.createMatch(createdTeams[firstTeam]._id, createdTeams[secondTeam]._id, createdTeams[firstTeam].teamName, createdTeams[secondTeam].teamName);
                createdMatches.push(match);
            }
        }
    return res.status(201).json({ data: createdMatches });
});
const deleteAllData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const teamDrop = yield Team_1.default.deleteMany();
    const matchDrop = yield Match_1.default.deleteMany();
    const stadingDrop = yield Standing_1.default.deleteMany();
    Promise.all([teamDrop, matchDrop, stadingDrop]).then(() => {
        logger_1.default.info('Deleted all data OK');
        return res.status(200).json({ message: 'ok' });
    });
});
exports.default = { getAllTeams, createTeamsAndMatchs, deleteAllData };

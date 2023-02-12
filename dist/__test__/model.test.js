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
const mockingoose = require("mockingoose");
const Team_1 = __importDefault(require("../models/Team"));
const Match_1 = __importDefault(require("../models/Match"));
const Standing_1 = __importDefault(require("../models/Standing"));
describe('Test App Models', () => {
    test('Test Team model', () => __awaiter(void 0, void 0, void 0, function* () {
        const team = {
            _id: '507f191e810c19729de860ea',
            teamName: 'Bacelona',
        };
        mockingoose(Team_1.default).toReturn(team, 'findOne');
        return Team_1.default.findById({ _id: '507f191e810c19729de860ea' }).then((doc) => {
            expect(JSON.parse(JSON.stringify(doc))).toMatchObject(team);
        });
    }));
    test('Test Match model', () => __awaiter(void 0, void 0, void 0, function* () {
        const match = {
            _id: '507f191e810c19729de860ea',
            homeTeamId: '507f191e810c19729de860ea',
            awayTeamId: '507f191e810c19729de860ea',
            homeTeamGoal: 2,
            awayTeamGoal: 1,
        };
        mockingoose(Match_1.default).toReturn(match, 'findOne');
        return Match_1.default.findById({ _id: '507f191e810c19729de860ea' }).then((doc) => {
            expect(JSON.parse(JSON.stringify(doc))).toMatchObject(match);
        });
    }));
    test('Test Standing model', () => __awaiter(void 0, void 0, void 0, function* () {
        const standing = {
            _id: '507f191e810c19729de860ea',
            teamId: '507f191e810c19729de860ea',
            playedMatch: 1,
            wins: 2,
            ties: 3,
            loses: 4,
            goals: 5,
            goalsAgainst: 6,
            points: 7,
        };
        mockingoose(Standing_1.default).toReturn(standing, 'findOne');
        return Standing_1.default.findById({ _id: '507f191e810c19729de860ea' }).then((doc) => {
            expect(JSON.parse(JSON.stringify(doc))).toMatchObject(standing);
        });
    }));
});

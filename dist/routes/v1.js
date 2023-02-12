"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teams_1 = __importDefault(require("../controllers/teams"));
const standings_1 = __importDefault(require("../controllers/standings"));
const matches_1 = __importDefault(require("../controllers/matches"));
const middleware_1 = require("../middleware");
const teamValidation_1 = require("../controllers/teams/teamValidation");
const teamErrorHandler_1 = __importDefault(require("../controllers/teams/teamErrorHandler"));
const router = express_1.default.Router();
/** GET */
router.get('/api/v1/teams', (0, middleware_1.promiseHandler)(teams_1.default.getAllTeams));
router.get('/api/v1/standings', (0, middleware_1.promiseHandler)(standings_1.default.getAllStandings));
router.get('/api/v1/matches', (0, middleware_1.promiseHandler)(matches_1.default.getAllMatches));
/** POST */
router.post('/api/v1/teams', (0, middleware_1.validate)(teamValidation_1.createTeamsValidation), (0, middleware_1.promiseHandler)(teams_1.default.createTeamsAndMatchs), teamErrorHandler_1.default);
/** PUT */
router.put('/api/v1/match/:matchId', (0, middleware_1.promiseHandler)(matches_1.default.updateMatch));
/** DELETE */
router.delete('/api/v1/deleteall', (0, middleware_1.promiseHandler)(teams_1.default.deleteAllData));
exports.default = router;

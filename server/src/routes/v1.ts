import express from 'express';
import teams from '../controllers/teams';
import standings from '../controllers/standings';
import matches from '../controllers/matches';
import { promiseHandler, validate } from '../middleware';
import { createTeamsValidation } from '../controllers/teams/teamValidation';
import teamErrorHandler from '../controllers/teams/teamErrorHandler';

const router = express.Router();

/** GET */
router.get('/api/v1/teams', promiseHandler(teams.getAllTeams));
router.get('/api/v1/standings', promiseHandler(standings.getStandings));
router.get('/api/v1/matches', promiseHandler(matches.getAllMatches));

/** POST */
router.post('/api/v1/teams', validate(createTeamsValidation), promiseHandler(teams.createTeamsAndMatchs), teamErrorHandler);

/** PUT */
router.put('/api/v1/match/:matchId', promiseHandler(matches.updateMatch));

/** DELETE */
router.delete('/api/v1/deleteall', promiseHandler(teams.deleteAllData));

export default router;

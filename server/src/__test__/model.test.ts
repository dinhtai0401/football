const mockingoose = require("mockingoose");


import Team from '../models/Team';
import Match from '../models/Match';
import Standing from '../models/Standing';

describe('Test App Models', () => {
    test('Test Team model', async () => {
		const team = {
			_id: '507f191e810c19729de860ea',
			teamName: 'Bacelona',
		};
	  
		mockingoose(Team).toReturn(team, 'findOne');
		return Team.findById({ _id: '507f191e810c19729de860ea' }).then((doc) => {
            expect(JSON.parse(JSON.stringify(doc))).toMatchObject(team);
        });
    });

	test('Test Match model', async () => {
		const match = {
			_id: '507f191e810c19729de860ea',
			homeTeamId: '507f191e810c19729de860ea',
			awayTeamId: '507f191e810c19729de860ea',
			homeTeamGoal: 2,
			awayTeamGoal: 1,
		};
	  
		mockingoose(Match).toReturn(match, 'findOne');
		return Match.findById({ _id: '507f191e810c19729de860ea' }).then((doc) => {
            expect(JSON.parse(JSON.stringify(doc))).toMatchObject(match);
        });
    });

	test('Test Standing model', async () => {
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
	  
		mockingoose(Standing).toReturn(standing, 'findOne');
		return Standing.findById({ _id: '507f191e810c19729de860ea' }).then((doc) => {
            expect(JSON.parse(JSON.stringify(doc))).toMatchObject(standing);
        });
    });
});

import React, { useEffect, useState } from "react";
import {
	getAllTeams,
	getAllStandings,
	getAllMatches,
	createTeams,
	deleteData,
	editMatch,
} from "./api";
import _ from "lodash";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const Team = (props) => {
	return props.teams.map((team) => {
		return <li key={team._id}>{team.teamName}</li>;
	});
};

const Match = (props) => {
	return props.matches.map((match) => {
		return (
			<div key={match._id} style={{marginBottom: '10px'}}>
				<div>
					<h3>{match.homeTeamName} - {match.awayTeamName}</h3>
					<input
						defaultValue={match.homeTeamGoal}
						name="hometeam"
						onChange={props.onChangeMatchInput}
						id={match._id}
					/>{" "}
					-{" "}
					<input
						defaultValue={match.awayTeamGoal}
						name="awayteam"
						onChange={props.onChangeMatchInput}
						id={match._id}
					/>
					&nbsp;
					<button
						type="button"
						className="btn btn-primary"
						onClick={(event) => props.handleSubmitScore(event, match._id)}
					>
						Save
					</button>
				</div>
			</div>
		);
	});
};

const Standing = (props) => {
	return (
		<table className="table table-striped">
			<thead>
				<tr>
					<th scope="col">No</th>
					<th scope="col">Team</th>
					<th scope="col">M</th>
					<th scope="col">W</th>
					<th scope="col">T</th>
					<th scope="col">L</th>
					<th scope="col">G</th>
					<th scope="col">GA</th>
					<th scope="col">P</th>
				</tr>
			</thead>
			<tbody>
				{props.standings.map((standing, index) => {
					return (
						<tr key={standing._id}>
							<th scope="row">{index}</th>
							<td>{standing.teamName}</td>
							<td>{standing.playedMatch}</td>
							<td>{standing.wins}</td>
							<td>{standing.ties}</td>
							<td>{standing.loses}</td>
							<td>{standing.goals}</td>
							<td>{standing.goalsAgainst}</td>
							<td>{standing.points}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

const App = () => {
	const [teams, setTeams] = useState([]);
	const [standings, setStandings] = useState([]);
	const [matches, setMatches] = useState([]);

	const [teamsInput, setTeamsInput] = useState(null);
	const [matchInputs] = useState([]);

	const getTeamsData = () => {
		getAllTeams().then((data) => {
			if (data.status === 200) setTeams(data.data.data);
		});
	};

	const getMatchesData = () => {
		getAllMatches().then((data) => {
			if (data.status === 200) setMatches(data.data.data);
		});
	};

	const getStandingData = () => {
		getAllStandings().then((data) => {
			if (data.status === 200) setStandings(data.data.data);
		});
	};

	useEffect(() => {
		getTeamsData();
		getStandingData();
		getMatchesData();
	}, []);

	const onChangeTeamsInput = (e) => setTeamsInput(e);
	const onChangeMatchInput = (e) => {
		let inputToSet = {
			id: e.target.id,
		};

		if (e.target.name === "hometeam") {
			matchInputs.push({
				...inputToSet,
				awayTeam: e.target.defaultValue
			});
		} else {
			matchInputs.push({
				...inputToSet,
				awayTeam: e.target.defaultValue
			});
		}

		if (matchInputs.length > 0) {
			for (let i = 0; i < matchInputs.length; i++) {
				if (matchInputs[i].id === inputToSet.id) {
					if (
						matchInputs[i].homeTeam !== undefined &&
						inputToSet.homeTeam !== undefined && e.target.name === "hometeam"
					) {
						matchInputs.splice(i, 1);
					} else if (
						matchInputs[i].awayTeam !== undefined &&
						inputToSet.awayTeam !== undefined && e.target.name === "awayteam"
					) {
						matchInputs.splice(i, 1);
					}
				}
			}
		}

		if (e.target.name === "hometeam") {
			inputToSet = {
				...inputToSet,
				homeTeam: e.target.value,
			};
		} else {
			inputToSet = {
				...inputToSet,
				awayTeam: e.target.value,
			};
		}

		matchInputs.push(inputToSet);
	};

	const handleCreateTeams = async (e) => {
		let teamsName = [];
		e.preventDefault();
		if (teamsInput) {
			teamsName = teamsInput.split(/(?:,| )+/);
		}

		/** Only at least 3 teams so create a tournament */
		const hasDuplicates = teamsName.length !== new Set(teamsName).size;

		if (teamsName.length >= 3 && hasDuplicates === false) {
			await deleteData();
			await createTeams(teamsName)
				.then((res) => {
					if (res.status === 201) {
						getMatchesData();
						getStandingData();
						getTeamsData();
					}
					alert("Created teams successful")
				})
				.catch((err) => {
					alert("Failed to create teams, reason: ", JSON.stringify(err));
				});
		} else {
			alert("At least 3 teams to create a tournament Or Duplicated team's name");
		}
		setTeamsInput(null);
	};
	const handleSubmitScore = (e, id) => {
		e.preventDefault();

		var result = _(matchInputs).groupBy("id").map(_.spread(_.assign)).value();

		let calledObject = {};
		for (let i = 0; i < result.length; i++) {
			if (result[i].id === id) {
				calledObject = result[i];
				break;
			}
		}
		editMatch(calledObject.id, parseInt(calledObject.homeTeam), parseInt(calledObject.awayTeam)).then(() => {
			getMatchesData();
			getStandingData();
			alert("Updated!");
		}).catch((err) => alert(err));
	};

	return (
		<div className="container">
			<h1>Tournaments</h1>
			<label>Insert your teams name:</label>
			<InputGroup className="mb-3" value={teamsInput}>
				<Form.Control
					placeholder="Example: Team A, Team B, Team C"
					onChange={(e) => onChangeTeamsInput(e.target.value)}
				/>
				<Button
					variant="outline-secondary"
					id="button-addon2"
					onClick={handleCreateTeams}
				>
					Save
				</Button>
			</InputGroup>

			<h1>Teams</h1>
			<Team teams={teams} />

			<h1>Matches</h1>
			<Match
				matches={matches}
				onChangeMatchInput={onChangeMatchInput}
				handleSubmitScore={handleSubmitScore}
			/>

			<h1>Standings</h1>
			<Standing standings={standings} />
		</div>
	);
};

export default App;

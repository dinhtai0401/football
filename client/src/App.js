import React, { useEffect, useState } from "react";

import { getAllTeams, getAllStandings, getAllMatches, createTeams, deleteData, editMatch } from './api'

import _ from 'lodash'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const Team = (props) => {
	return props.teams.map((team) => {
    return <li key={team._id}>{team.teamName}</li>;
  });
}

const Match = (props) => {
	return props.matches.map((match) => {
    return <div key={match._id}>
		<div>
			{match.homeTeamName} - {match.awayTeamName} 
			<input defaultValue={match.homeTeamGoal} name='hometeam' onChange={props.onChangeMatchInput} id={match._id}/> - 
			<input defaultValue={match.awayTeamGoal} name='awayteam' onChange={props.onChangeMatchInput} id={match._id}/>
			&nbsp;<button type="button" className="btn btn-primary" onClick={(event) => props.handleSubmitScore(event, match._id)}>Submit</button>
		</div>
	</div>;
  });
}

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
				return <tr key={standing._id}>
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
			})}
		</tbody>
	</table>
	)
}

const App = () => {
	// App states
	const [teams, setTeams] = useState([])
	const [standings, setStandings] = useState([])
	const [matches, setMatches] = useState([])

	const [teamsInput, setTeamsInput] = useState(null)
	const [matchInputs, setMatchInputs] = useState([])

	const getTeamsData = () => {
		getAllTeams().then((data) => {
			if (data.status === 200) setTeams(data.data.data)
		})
	}

	const getMatchesData = () => {
		getAllMatches().then((data) => {
			if (data.status === 200) setMatches(data.data.data)
		})
	}

	const getStandingData = () => {
		getAllStandings().then((data) => {
			if (data.status === 200) setStandings(data.data.data)
		})
	}


	useEffect(() => {
		getTeamsData()
		getStandingData()
		getMatchesData()
	}, [])


	const onChangeTeamsInput =  (e) => setTeamsInput(e)
	const onChangeMatchInput = (e) => {

		let inputToSet = {
			id: e.target.id
		}

		if (e.target.name === 'hometeam') {
			inputToSet = {
				...inputToSet,
				homeTeam: e.target.value,
			}
		} else {
			inputToSet = {
				...inputToSet,
				awayTeam: e.target.value,
			}
		}
		matchInputs.push(inputToSet)
	}


	const handleCreateTeams = (e) => {
		let teamsName = []
		e.preventDefault();
		if (teamsInput) {
			teamsName = teamsInput.split(', ')
		}

		//  Only at least 3 teams so create a tournament
		if (teamsName.length >= 3) {
			createTeams(teamsName)
			.then((res) => {
				setTeamsInput(null)
				if (res.status === 201) getTeamsData()
			})
			.catch((err) => {
				console.error(err)
				alert('Failed to create teams, reason: ', JSON.stringify(err))
			})
		}
		else {
			alert('At least 3 teams to create a tournament')
		}
	}
	const handleSubmitScore = (e, id) => {
		e.preventDefault();
		console.log(matchInputs)
		
var output = [];
		matchInputs.forEach(function(item) {
			var existing = output.filter(function(v, i) {
			  return v.id == item.id;
			});
			if (existing.length) {
			  var existingIndex = output.indexOf(existing[0]);
			  output[existingIndex].awayTeam = item.awayTeam;
			  output[existingIndex].homeTeam = item.homeTeam;
			} 
			else {
			  if (typeof item.homeTeam == 'string') {
				console.log('home team', item.homeTeam)
				item.homeTeam = [item.homeTeam];
			  } else {
				item.awayTeam = [item.awayTeam];
			  }
			}
		  });

		  console.log(output)

		// if (matchInputs.length) {
		// 	let inputs = {}
		// 	for (let i=0; i < matchInputs.length; i++) {
		// 		if (matchInputs[i].id == matchInputs[i+1].id) {
		// 			inputs = _.merge(matchInputs[i], matchInputs[i+1])
		// 		}
		// 	}
		// 	console.log(inputs)
		// }
	}

	return (
    <div className="container">
      <h1>Tournaments</h1>
      <label>Insert your teams name:</label>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Example: Team A, Team B, Team C"
          onChange={(e) => onChangeTeamsInput(e.target.value)}
        />
        <Button
          variant="outline-secondary"
          id="button-addon2"
          onClick={handleCreateTeams}
        >
          Button
        </Button>
      </InputGroup>

      <h1>Teams</h1>
      <Team teams={teams}/>

      <h1>Matches</h1>
      <Match matches={matches} onChangeMatchInput={onChangeMatchInput} handleSubmitScore={handleSubmitScore}/>

      <h1>Standings</h1>
      <Standing standings={standings}/>
    </div>
  );
};

export default App;

import axios from 'axios'

export const getAllTeams = async () => {
    return await axios
    .get('/api/v1/teams')
    .then((result) => {
        return result
    })
    .catch((err) => console.error('getAllTeams failed. Reason: ', err))
}

export const getAllStandings = async () => {
    return await axios
    .get('/api/v1/standings')
    .then((result) => {
        return result
    })
    .catch((err) => console.error('getAllStandings failed. Reason: ', err))
}

export const getAllMatches = async () => {
    return await axios
    .get('/api/v1/matches')
    .then((result) => {
        return result
    })
    .catch((err) => console.error('getAllMatches failed. Reason: ', err))
}

export const createTeams = async (teamName) => {
    const data = {
        teams: teamName
    }
    return await axios
    .post('/api/v1/teams', data)
    .then((result) => {
        return result
    })
    .catch((err) => console.error('createTeams failed. Reason: ', err))
}

export const  editMatch = async (matchId, homeTeamGoal, awayTeamGoal) => {
    const data = {
        homeTeamGoal,
        awayTeamGoal
    }
    console.log(data);
    return await axios
    .put('/api/v1/match/' + matchId, data)
    .then((result) => {
        return result
    })
    .catch((err) => console.error('editMatch failed. Reason: ', err))
}


export const deleteData = async () => {
    return await axios
    .delete('/api/v1/deleteall')
    .then((result) => {
        return result
    })
    .catch((err) => console.error('deleteData failed. Reason: ', err))
}



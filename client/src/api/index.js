import axios from 'axios'

export const getAllTeams = () => {
    return axios
    .get('/api/v1/teams')
    .then((result) => {
        return result
    })
    .catch((err) => console.error('getAllTeams failed. Reason: ', err))
}

export const getAllStandings = () => {
    return axios
    .get('/api/v1/standings')
    .then((result) => {
        return result
    })
    .catch((err) => console.error('getAllStandings failed. Reason: ', err))
}

export const getAllMatches = () => {
    return axios
    .get('/api/v1/matches')
    .then((result) => {
        return result
    })
    .catch((err) => console.error('getAllMatches failed. Reason: ', err))
}

export const createTeams = (teamName) => {
    const data = {
        teams: teamName
    }
    return axios
    .post('/api/v1/teams', data)
    .then((result) => {
        console.log(result)
        return result
    })
    .catch((err) => console.error('createTeams failed. Reason: ', err))
}

export const editMatch = (matchId, homeTeamGoal, awayTeamGoal) => {
    const data = {
        homeTeamGoal,
        awayTeamGoal
    }
    return axios
    .put('/api/v1/match/' + matchId, data)
    .then((result) => {
        console.log(result)
        return result
    })
    .catch((err) => console.error('editMatch failed. Reason: ', err))
}


export const deleteData = () => {
    return axios
    .delete('/api/v1/deleteall')
    .then((result) => {
        console.log(result)
        return result
    })
    .catch((err) => console.error('deleteData failed. Reason: ', err))
}



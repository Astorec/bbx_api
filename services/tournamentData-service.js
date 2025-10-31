const pool = require("../connection");

// Because of the way we store data all the data from the tournament is stored in
// tblTournamentData. This will get used to cross refrence between player_db_ids 
// and tournament_ids. Tournament Data gets used in the leaderboard generation
// but this service is just for getting and setting the data. This will also
// be useful for getting Player stats for tournaments for displaying on a 
// dashboard or profile page.

// Get all tournament data for a specific tournament
// We should only ever get data for one tournament at a time here.
// Otherwise we could be here for awhile getting all that information lol.
async function getTournamentData(tournamentId) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblTournamentData WHERE tournament_id = ?", [tournamentId], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

// Get all tournament data for a specific player across all tournaments
async function getAllPlayerTournamentData(playerDbId) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblTournamentData WHERE player_db_id = ?", [playerDbId], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

async function getPlayerTournamentData(tournamentId, playerDbId) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblTournamentData WHERE tournament_id = ? AND player_db_id = ?", [tournamentId, playerDbId], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows[0]);
        });
    });
}

// Batch add tournament data
async function batchAddTournamentData(tournamentData) {
    return new Promise((resolve, reject) => {
        const values = tournamentData.map(td => [td.tournament_id, td.player_db_id, td.wins, td.losses, td.rank, td.win_percentage, td.score]);
        const query = "INSERT INTO tblTournamentData (tournament_id, player_db_id, wins, losses, rank, win_percentage, score) VALUES ?";
        pool.query(query, [values], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows);
        });
    });
}

async function addTournamentData(tournamentData) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO tblTournamentData (tournament_id, player_db_id, wins, losses, rank, win_percentage, score) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const params = [tournamentData.tournament_id, tournamentData.player_db_id, tournamentData.wins, tournamentData.losses, tournamentData.rank, tournamentData.win_percentage, tournamentData.score];
        pool.query(query, params, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.insertId);
        });
    });
}

// Batch update tournament data
async function batchUpdateTournamentData(tournamentData) {
    return new Promise((resolve, reject) => {
        const updatePromises = tournamentData.map(td => {
            return new Promise((res, rej) => {
                const query = "UPDATE tblTournamentData SET wins = ?, losses = ?, rank = ?, win_percentage = ?, score = ? WHERE tournament_id = ? AND player_db_id = ?";
                const params = [td.wins, td.losses, td.rank, td.win_percentage, td.score, td.tournament_id, td.player_db_id];
                pool.query(query, params, (err, result) => {
                    if (err) {
                        return rej(err);
                    }
                    res(result.affectedRows);
                });
            });
        });
        Promise.all(updatePromises)
            .then(results => resolve(results.reduce((a, b) => a + b, 0)))
            .catch(err => reject(err));
    });
}

async function updateTournamentData(tournamentId, playerDbId, tournamentData) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE tblTournamentData SET wins = ?, losses = ?, rank = ?, win_percentage = ?, score = ? WHERE tournament_id = ? AND player_db_id = ?";
        const params = [tournamentData.wins, tournamentData.losses, tournamentData.rank, tournamentData.win_percentage, tournamentData.score, tournamentId, playerDbId];
        pool.query(query, params, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows > 0);
        });
    });
}

// Delete tournament data by tournament ID
// This should only be used if deleting all the tournament data
// for a specific tournament. It is useful for when trying to
// re-import tournaments.
async function deleteTournamentDataByTournamentId(tournamentId) {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM tblTournamentData WHERE tournament_id = ?", [tournamentId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows);
        });
    });
}

// Delete tournament data by tournament ID and player DB ID
// This should be used when removing a specific player's
// data from a tournament. Useful for when removing a player in general
// in the event of a ban or disqualification.
async function deleteTournamentDataByTournamentIdAndPlayerDbId(tournamentId, playerDbId) {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM tblTournamentData WHERE tournament_id = ? AND player_db_id = ?", [tournamentId, playerDbId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows);
        });
    });
}

module.exports = {
    getTournamentData,
    getAllPlayerTournamentData,
    getPlayerTournamentData,
    batchAddTournamentData,
    addTournamentData,
    batchUpdateTournamentData,
    updateTournamentData,
    deleteTournamentDataByTournamentId,
    deleteTournamentDataByTournamentIdAndPlayerDbId
};
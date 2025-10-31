const pool = require("../connection");

//#region Tournament Related Calls

// Get participants by tournament ID
async function getParticipantsByTournamentId(tournamentId) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblParticipants WHERE tournament_id = ?", [tournamentId], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

// Get participants by player database ID
async function getParticipantsByPlayerDbId(playerDbId) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblParticipants WHERE player_db_id = ?", [playerDbId], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

// Batch add participants to a tournament instead of adding one at a time.
// This will be useful for when we are importing existing tournament data from
// challonge. Typically would just be one at a time if the tournament was 
// created and hasn't been started yet, but when  importing this makes more sense.
// This should just get called even if there is one participant to add.
async function batchAddParticipants(participants) {
    return new Promise((resolve, reject) => {
        const values = participants.map(p => [p.tournament_id, p.player_db_id, p.player_id, p.group_id]);
        const query = "INSERT INTO tblParticipants (tournament_id, player_db_id, player_id, group_id) VALUES ?";
        pool.query(query, [values], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows);
        });
    });
}

// Update participant details
async function updateParticipant(participant) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE tblParticipants SET tournament_id = ?, player_db_id = ?, player_id = ?, group_id = ? WHERE id = ?";
        const params = [participant.tournament_id, participant.player_db_id, participant.player_id, participant.group_id, participant.id];
        pool.query(query, params, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows > 0);
        });
    });
}

// Delete participant by tournament ID and player database ID
// Useful when removing a player from a specific tournament
async function deleteParticipantByTournamentIdAndPlayerDbId(tournamentId, playerDbId) {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM tblParticipants WHERE tournament_id = ? AND player_db_id = ?", [tournamentId, playerDbId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows > 0);
        });
    });
}

// Delete participant by player database ID
// Useful when removing a player from all tournaments
async function deleteParticipantByPlayerDbId(playerDbId) {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM tblParticipants WHERE player_db_id = ?", [playerDbId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows > 0);
        });
    });
}

// Delete participants by tournament ID
// Useful when resetting a tournament or deleting it altogether
async function deleteParticipantsByTournamentId(tournamentId) {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM tblParticipants WHERE tournament_id = ?", [tournamentId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows > 0);
        });
    });
}


//#endregion


module.exports = {
    batchAddParticipants,
    getParticipantsByPlayerDbId,
    getParticipantsByTournamentId,
    updateParticipant,
    deleteParticipantByPlayerDbId,
    deleteParticipantByTournamentIdAndPlayerDbId,
    deleteParticipantsByTournamentId
};
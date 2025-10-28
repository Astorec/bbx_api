const pool = require("../connection");

//#region Tournament Related Calls
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
//#endregion


module.exports = {
    batchAddParticipants,
    getParticipantsByPlayerDbId,
    getParticipantsByTournamentId
};
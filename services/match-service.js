const pool = require("../connection");

async function getAllMatches(tournament_id) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblMatches WHERE tournament_id = ?", [tournament_id], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

async function batchAddMatches(matches) {
    return new Promise((resolve, reject) => {
        const values = matches.map(m => [m.player1_id, m.player2_id, m.tournament_id, m.is_finals, m.match_id, m.round]);
        const query = "INSERT INTO tblMatches (player1_id, player2_id, tournament_id, is_finals, match_id, round) VALUES ?";
        pool.query(query, [values], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows);
        });
    });
}

async function batchUpdateMatches(matches) {
    return new Promise((resolve, reject) => {
        const updatePromises = matches.map(match => {
            return new Promise((res, rej) => {
                const query = "UPDATE tblMatches SET player1_score = ?, player2_score = ?, winner_id = ? WHERE match_id = ? AND tournament_id = ?";
                const params = [match.player1_score, match.player2_score, match.winner_id, match.match_id, match.tournament_id];
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

module.exports = {
    getAllMatches,
    batchUpdateMatches,
    batchAddMatches
};

const pool = require("../connection");

function getAllTournaments(callback) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblTournaments", (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function getTournamentById(id, callback) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblTournaments WHERE id = ?", [id], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows[0]);
        });
    });
}

module.exports = {
    getAllTournaments,
    getTournamentById,
};

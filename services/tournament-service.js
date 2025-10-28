const pool = require("../connection");

async function getAllTournaments() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblTournaments", (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

async function getTournamentById(id) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblTournaments WHERE id = ?", [id], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows[0]);
        });
    });
}

async function getTournamentByUrl(url) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblTournaments WHERE url = ?", [url], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows[0]);
        });
    });
}

async function createNewTournament(tournamentData) {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO tblTournaments SET ?", tournamentData, (err, result) => {
            if (err) {
                console.error("Database Error:", err); 
                return reject(err); 
            }
            resolve(result.insertId); 
        });
    });
}

module.exports = {
    getAllTournaments,
    getTournamentById,
    getTournamentByUrl,
    createNewTournament
};

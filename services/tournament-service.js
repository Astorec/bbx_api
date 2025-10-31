const pool = require("../connection");

// Get all tournaments
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

// Get tournament by ID
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

// Get tournament by URL
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

// Create a new tournament
async function createNewTournament(tournament) {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO tblTournaments SET ?", tournament, (err, result) => {
            if (err) {
                console.error("Database Error:", err); 
                return reject(err); 
            }
            resolve(result.insertId); 
        });
    });
}

// Delete a tournament by ID
async function deleteTournament(id) {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM tblTournaments WHERE id = ?", [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows > 0);
        });
    });
}

async function updateTournament(id, tournamentData) {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE tblTournaments SET ? WHERE id = ?", [tournamentData, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows > 0);
        });
    });
}


module.exports = {
    getAllTournaments,
    getTournamentById,
    getTournamentByUrl,
    createNewTournament,
    updateTournament,
    deleteTournament
};

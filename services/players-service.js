const pool = require("../connection");

// Get all players
async function getAllPlayers() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblPlayers", (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

// This should be used when doing calls from other services
async function getPlayerById(playerId) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblPlayers WHERE id = ?", [playerId], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows[0]);
        });
    });
}

// Get players by their username
async function getPlayerByUsername(username) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblPlayers WHERE username = ?", [username], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows[0]);
        });
    });
}

// Batch add players
async function batchAddPlayers(players) {
    return new Promise((resolve, reject) => {
        const values = players.map(p => [p.name, p.username, p.region]);
        const query = "INSERT INTO tblPlayers (name, username, region) VALUES ?";
        pool.query(query, [values], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows);
        });
    });
}

module.exports = {
    getAllPlayers,
    getPlayerById,
    getPlayerByUsername,
    batchAddPlayers
};
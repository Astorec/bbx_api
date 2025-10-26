const pool = require("../connection");

function getAllPlayers(callback) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblPlayers", (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function getPlayerById(playerId, callback) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblPlayers WHERE id = ?", [playerId], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows[0]);
        });
    });
}

function getPlayerByUsername(username, callback) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM tblPlayers WHERE username = ?", [username], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows[0]);
        });
    });
}

module.exports = {
    getAllPlayers,
    getPlayerById,
    getPlayerByUsername
};
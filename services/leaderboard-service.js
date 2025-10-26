const pool = require("../connection");
const scriptUtils = require('../utils/getscripts');

function getMainLeaderboard(callback) {
    return new Promise((resolve, reject) => {
        const script = scriptUtils.getScript('./services/mainboard_sql_script.txt');
        pool.query(script, (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

module.exports = {
    getMainLeaderboard,
};
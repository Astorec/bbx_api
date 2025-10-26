const express = require('express');
const router = express.Router(); 

const leaderboardService = require('../services/leaderboard-service');

router.get("/", async (req, res) => {
    try {
        const leaderboards = await leaderboardService.getMainLeaderboard();
        res.json(leaderboards);
    } catch (err) {
        console.error("Error in leaderboard route:", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
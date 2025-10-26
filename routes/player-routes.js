const express = require('express');
const router = express.Router(); 

const playersService = require('../services/players-service');

router.get("/", async (req, res) => {
    try {
        const players = await playersService.getAllPlayers();
        res.json(players);
    } catch (err) {
        console.error("Error in player route:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/:id", async (req, res) => {
    const playerId = req.params.id;
    try {
        const player = await playersService.getPlayerById(playerId);
        if (!player) {
            return res.status(404).send("Player not found");
        }
        res.json(player);
    } catch (err) {
        console.error("Error in player route:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/u/:username", async (req, res) => {
    const username = req.params.username;
    try {
        const player = await playersService.getPlayerByUsername(username);
        if (!player) {
            return res.status(404).send("Player not found");
        }
        res.json(player);
    } catch (err) {
        console.error("Error in player route:", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

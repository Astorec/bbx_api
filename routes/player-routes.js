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

router.post("/add", async (req, res) => {
    try {
        const players = Array.isArray(req.body) ? req.body : [req.body];
        if (!players.every(p => p.name)) {
            return res.status(400).send("Missing required field: name");
        }
        const newIds = await playersService.batchAddPlayers(players);
        res.status(201).json({ ids: newIds });
    } catch (err) {
        console.error("Error in player creation route:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.put("/update/:id", async (req, res) => {
    const playerId = req.params.id;
    const playerData = req.body;
    try {
        const updated = await playersService.updatePlayer(playerId, playerData);
        if (!updated) {
            return res.status(404).send("Player not found");
        }
        res.status(200).send("Player updated successfully");
    } catch (err) {
        console.error("Error in player update route:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.delete("/delete/:id", async (req, res) => {
    const playerId = req.params.id;
    try {
        const deleted = await playersService.deletePlayer(playerId);
        if (!deleted) {
            return res.status(404).send("Player not found");
        }
        res.status(200).send("Player deleted successfully");
    } catch (err) {
        console.error("Error in player deletion route:", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

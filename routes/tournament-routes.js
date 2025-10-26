const express = require('express');
const router = express.Router(); 


//#region Tournament Routes

// Import your service file
const tournamentService = require('../services/tournament-service');
const participantService = require('../services/participant-service');

// Define the route using the router
router.get("/", async (req, res) => {
    try {
        // CALL the database function from the service
        const tournaments = await tournamentService.getAllTournaments();
        res.json(tournaments);
    } catch (err) {
        console.error("Error in tournament route:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/:id", async (req, res) => {
    const tournamentId = req.params.id;
    try {
        const tournament = await tournamentService.getTournamentById(tournamentId);
        if (!tournament) {
            return res.status(404).send("Tournament not found");
        }
        res.json(tournament);
    } catch (err) {
        console.error("Error in tournament route:", err);
        res.status(500).send("Internal Server Error");
    }
}); 


router.post("/create/", async (req, res) => {
    

    try{
        const tournamentData = req.body;

        if(!tournamentData.name || !tournamentData.url)
        {
            return res.status(400).send("Missing required fields: name or url");
        }

        const newId = await tournamentService.createNewTournament(tournamentData);
        res.status(201).json({ id: newId, ...tournamentData });
    }catch(err){
        console.error("Error in tournament creation route:", err);
        res.status(500).send("Internal Server Error");
    }
});

//#endregion

//#region Tournament Participants Routes
router.get("/:id/participants", async (req, res) => {
    const tournamentId = req.params.id;
    try {
        const participants = await participantService.getParticipantsByTournamentId(tournamentId);
        res.json(participants);
    } catch (err) {
        console.error("Error in tournament participants route:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/:id/participants/add", async (req, res) => {
    const tournamentId = req.params.id;
    // Ensure participants is always an array
    const participants = Array.isArray(req.body) ? req.body : [req.body];

    try {
        const addedCount = await participantService.batchAddParticipants(participants);
        res.status(201).json({ added: addedCount });
    } catch (err) {
        console.error("Error in tournament participants add route:", err);
        res.status(500).send("Internal Server Error");
    }
});

//#endregion
module.exports = router;
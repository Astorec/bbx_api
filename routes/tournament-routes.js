const express = require("express");
const router = express.Router();

//#region Services

const tournamentService = require("../services/tournament-service");
const participantService = require("../services/participant-service");
const matchService = require("../services/match-service");
const tournamentDataService = require("../services/tournamentData-service");

//#endregion

//#region Tournament Routes

// Get all tournaments
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

// Get tournament by ID
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

// Get tournament by URL
router.get("/url/:url", async (req, res) => {
  const tournamentUrl = req.params.url;
  try {
    const tournament = await tournamentService.getTournamentByUrl(
      tournamentUrl
    );
    if (!tournament) {
      return res.status(404).send("Tournament not found");
    }
    res.json(tournament);
  } catch (err) {
    console.error("Error in tournament by URL route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Create a new tournament
router.post("/create", async (req, res) => {
  try {
    const tournamentData = req.body;

    if (!tournamentData.name || !tournamentData.url) {
      return res.status(400).send("Missing required fields: name or url");
    }

    const newId = await tournamentService.createNewTournament(tournamentData);
    res.status(201).json({ id: newId, ...tournamentData });
  } catch (err) {
    console.error("Error in tournament creation route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete tournament by ID
router.delete("/:id", async (req, res) => {
  const tournamentId = req.params.id;
  try {
    const success = await tournamentService.deleteTournament(tournamentId);
    if (!success) {
      return res.status(404).send("Tournament not found");
    }
    res.status(200).send("Tournament deleted successfully");
  } catch (err) {
    console.error("Error in tournament deletion route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Update tournament by ID
router.put("/:id", async (req, res) => {
  const tournamentId = req.params.id;
  const tournamentData = req.body;
  try {
    const success = await tournamentService.updateTournament(
      tournamentId,
      tournamentData
    );
    if (!success) {
      return res.status(404).send("Tournament not found");
    }
    res.status(200).send("Tournament updated successfully");
  } catch (err) {
    console.error("Error in tournament update route:", err);
    res.status(500).send("Internal Server Error");
  }
});

//#endregion

//#region Tournament Participants Routes

// Get participants by tournament ID
router.get("/:id/participants", async (req, res) => {
  const tournamentId = req.params.id;
  try {
    const participants = await participantService.getParticipantsByTournamentId(
      tournamentId
    );
    res.json(participants);
  } catch (err) {
    console.error("Error in tournament participants route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get participants by player database ID
router.get("/participants/player/:playerDbId", async (req, res) => {
  const playerDbId = req.params.playerDbId;
  try {
    const participants = await participantService.getParticipantsByPlayerDbId(
      playerDbId
    );
    res.json(participants);
  } catch (err) {
    console.error("Error in tournament participants by player route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Add participants to a tournament
router.post("/:id/participants/add", async (req, res) => {
  const tournamentId = req.params.id;
  // Ensure participants is always an array
  const participants = Array.isArray(req.body) ? req.body : [req.body];

  try {
    const addedCount = await participantService.batchAddParticipants(
      participants
    );
    res.status(201).json({ added: addedCount });
  } catch (err) {
    console.error("Error in tournament participants add route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Update participant by participant ID
router.put("/:id/participants/:participantId", async (req, res) => {
    const tournamentId = req.params.id;
    const participantId = req.params.participantId;
    const participantData = req.body;
    try {
        const updated = await participantService.updateParticipant(participantId, participantData);
        if (!updated) {
            return res.status(404).send("Participant not found");
        }
        res.status(200).send("Participant updated successfully");
    } catch (err) {
        console.error("Error in participant update route:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Delete participant by tournament ID and player database ID
router.delete("/:id/participants/player/:playerDbId", async (req, res) => {
    const tournamentId = req.params.id;
    const playerDbId = req.params.playerDbId;
    try {
        const success = await participantService.deleteParticipantByTournamentIdAndPlayerDbId(tournamentId, playerDbId);
        if (!success) {
            return res.status(404).send("Participant not found");
        }
        res.status(200).send("Participant deleted successfully");
    } catch (err) {
        console.error("Error in tournament participant delete route:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Delete participant by player database ID
router.delete("/participants/player/:playerDbId", async (req, res) => {
    const playerDbId = req.params.playerDbId;
    try {
        const success = await participantService.deleteParticipantByPlayerDbId(playerDbId);
        if (!success) {
            return res.status(404).send("Participant not found");
        }
        res.status(200).send("Participant deleted successfully");
    } catch (err) {
        console.error("Error in participant delete route:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Delete all participants for a given tournament ID
router.delete("/:id/participants", async (req, res) => {
    const tournamentId = req.params.id;
    try {
        const success = await participantService.deleteParticipantsByTournamentId(tournamentId);
        if (!success) {
            return res.status(404).send("No participants found for the tournament");
        }
        res.status(200).send("Participants deleted successfully");
    } catch (err) {
        console.error("Error in tournament participants delete route:", err);
        res.status(500).send("Internal Server Error");
    }
});

//#endregion

//#region Tournament Matches Routes

// Get matches by tournament ID
router.get("/:id/matches", async (req, res) => {
  const tournamentId = req.params.id;
  try {
    const matches = await matchService.getAllMatches(tournamentId);
    res.json(matches);
  } catch (err) {
    console.error("Error in tournament matches route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Update matches in a tournament
router.post("/:id/matches/update", async (req, res) => {
  const tournamentId = req.params.id;
  const matches = Array.isArray(req.body) ? req.body : [req.body];
  try {
    const updatedCount = await matchService.batchUpdateMatches(matches);
    res.json({ updated: updatedCount });
  } catch (err) {
    console.error("Error in tournament matches update route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Add matches to a tournament
router.put("/:id/matches", async (req, res) => {
  const tournamentId = req.params.id;
  const matches = Array.isArray(req.body) ? req.body : [req.body];
  try {
    const updatedCount = await matchService.batchUpdateMatches(matches);
    res.json({ updated: updatedCount });
  } catch (err) {
    console.error("Error in tournament matches update route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// delete matches to a tournament
router.delete("/:id/matches", async (req, res) => {
  const tournamentId = req.params.id;
  try {
    const success = await matchService.deleteMatchesByTournamentId(
      tournamentId
    );
    if (!success) {
      return res.status(404).send("No matches found for the tournament");
    }
    res.status(200).send("Matches deleted successfully");
  } catch (err) {
    console.error("Error in tournament matches delete route:", err);
    res.status(500).send("Internal Server Error");
  }
});

//#endregion

//#region Tournament Data Routes

// Get all tournament data for a specific tournament
router.get("/:id/data", async (req, res) => {
  const tournamentId = req.params.id;
  try {
    const data = await tournamentDataService.getTournamentData(tournamentId);
    res.json(data);
  } catch (err) {
    console.error("Error in tournament data route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// For when we want all tournament data for a specific player across all tournaments
router.get("/data/player/:playerDbId", async (req, res) => {
  const playerDbId = req.params.playerDbId;
  try {
    const data = await tournamentDataService.getAllPlayerTournamentData(
      playerDbId
    );
    res.json(data);
  } catch (err) {
    console.error("Error in tournament data route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get tournament data for a specific player in a specific tournament
router.get("/:id/data/player/:playerDbId", async (req, res) => {
  const tournamentId = req.params.id;
  const playerDbId = req.params.playerDbId;
  try {
    const data = await tournamentDataService.getPlayerTournamentData(
      tournamentId,
      playerDbId
    );
    res.json(data);
  } catch (err) {
    console.error("Error in tournament player data route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Add tournament data
router.post("/:id/data/add", async (req, res) => {
  const tournamentId = req.params.id;
  // call addTournamentData for single
  const tournamentData = req.body;
  try {
    let newId;
    if (Array.isArray(tournamentData)) {
      const addedCount = await tournamentDataService.batchAddTournamentData(
        tournamentData
      );
      res.status(201).json({ added: addedCount });
    } else {
      newId = await tournamentDataService.addTournamentData(tournamentData);
      res.status(201).json({ id: newId });
    }
  } catch (err) {
    console.error("Error in tournament data add route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Update tournament data
router.put("/:id/data/update", async (req, res) => {
  const tournamentId = req.params.id;
  const tournamentData = req.body;
  try {
    if (Array.isArray(tournamentData)) {
      const updatedCount =
        await tournamentDataService.batchUpdateTournamentData(tournamentData);
      res.json({ updated: updatedCount });
    } else {
      const updated = await tournamentDataService.updateTournamentData(
        tournamentData
      );
      res.json({ updated: updated });
    }
  } catch (err) {
    console.error("Error in tournament data update route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete tournament data by tournament ID
router.delete("/:id/data", async (req, res) => {
  const tournamentId = req.params.id;
  const tournamentData = req.body;
  try {
    await tournamentDataService.deleteTournamentData(tournamentId);
  } catch (err) {
    console.error("Error in tournament data delete route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete tournament data by tournament ID and player database ID
router.delete("/:id/data/player/:playerDbId", async (req, res) => {
  const tournamentId = req.params.id;
  const playerDbId = req.params.playerDbId;
  try {
    await tournamentDataService.deleteTournamentDataByTournamentIdAndPlayerDbId(
      tournamentId,
      playerDbId
    );
  } catch (err) {
    console.error("Error in tournament player data delete route:", err);
    res.status(500).send("Internal Server Error");
  }
});

//#endregion

module.exports = router;

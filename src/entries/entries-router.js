const path = require("path");
const express = require("express");
const logger = require("../logger");
const EntriesService = require("./entries-service");

const entriesRouter = express.Router();
const jsonParser = express.json();

const serializePlant = (entry) => ({
  id: entry.id,
  title: entry.title,
  mood: entry.mood,
  description: entry.description,
  modified: entry.modified,
  author: entry.author
});

//-----all plants
entriesRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    EntriesService.getAllPlants(knexInstance)
      .then((users) => {
        res.json(users.map(serializePlant));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, plant_type, toxicity, care_details } = req.body;
    const newPlant = { name, plant_type, toxicity, care_details };

    for (const [key, value] of Object.entries(newPlant))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    EntriesService.insertPlant(req.app.get("db"), newPlant)
      .then((plant) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${plant.id}`))
          .json(serializePlant(plant));
      })
      .catch(next);
  });

//-----specific plant
entriesRouter
  .route("/:entry_id")
  .all((req, res, next) => {
    EntriesService.getById(req.app.get("db"), req.params.entry_id)
      .then((entry) => {
        if (!entry) {
          return res.status(404).json({
            error: { message: `Moodly entry doesn't exist` },
          });
        }
        res.entry = entry; //save the article for the next middleware
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializePlant(res.plant));
  })
  .delete((req, res, next) => {
    EntriesService.deleteEntry(req.app.get("db"), req.params.entry_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = entriesRouter;

const path = require("path");
const express = require("express");
const logger = require("../logger");
const EntriesService = require("./entries-service");
const { toUnicode } = require("punycode");

const entriesRouter = express.Router();
const jsonParser = express.json();

const serializeEntry = (entry) => ({
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
        res.json(users.map(serializeEntry));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, mood, description, author = 1 } = req.body;
    const newEntry = { title, mood, description };

    for (const [key, value] of Object.entries(newEntry))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
    
    newEntry.author = author
    
    EntriesService.insertEntry(req.app.get("db"), newEntry)
      .then((entry) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${entry.id}`))
          .json(serializeEntry(entry));
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
    res.json(serializeEntry(res.entry));
  })
  .delete((req, res, next) => {
    EntriesService.deleteEntry(req.app.get("db"), req.params.entry_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = entriesRouter;

const express = require('express');
const moviesRouter = express.Router();
const upload = require('../storage');
const db = require('../db');

// GET all movies with genre names
moviesRouter.get("/", (req, res) => {
    const sql = `
    SELECT movies.*, genres.name AS genre
    FROM movies
    JOIN genres ON movies.genre_id = genres.id
  `;

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
});

// GET a single movie by ID
moviesRouter.get("/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
    SELECT movies.*, genres.name AS genre
    FROM movies
    JOIN genres ON movies.genre_id = genres.id
    WHERE movies.id = ?
  `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).send("Internal Server Error");
            return;
        }
        res.json(results[0]);
    });
});

// POST a new movie (with poster upload)
moviesRouter.post("/", upload.single("poster"), (req, res) => {
    const { title, release_year, genre_id } = req.body;
    const description = req.body.description || "";
    const poster = req.file ? req.file.filename : null;


    const sql = `
    INSERT INTO movies (title, description, release_year, poster, genre_id)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.query(sql, [title, description, release_year, poster, genre_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error adding movie");
        }

        res.status(200).json({ message: "Movie added successfully", id: results.insertId });
    });
});

// PUT (update) a movie
moviesRouter.put("/:id", upload.single("poster"), (req, res) => {
    const { id } = req.params;
    const { title, description, release_year, genre_id } = req.body;

    let sql = `UPDATE movies SET title = ?, description = ?, release_year = ?, genre_id = ?`;
    const params = [title, description, release_year, genre_id];

    if (req.file) {
        sql += `, poster = ?`;
        params.push(req.file.filename);
    }

    sql += ` WHERE id = ? LIMIT 1`;
    params.push(id);

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error updating movie");
        }

        res.json({ message: "Movie updated successfully" });
    });
});

// DELETE a movie
moviesRouter.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM movies WHERE id = ? LIMIT 1`;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting movie");
        }

        res.json({ message: "Movie deleted successfully" });
    });
});

module.exports = moviesRouter;

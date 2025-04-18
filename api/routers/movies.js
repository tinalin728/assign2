const express = require('express');
const moviesRouter = express.Router();
const upload = require('../storage');
const db = require('../db');
const verifyToken = require("../middleware/auth.jwt.js");

// GET all movies for the logged-in user
moviesRouter.get("/", verifyToken, (req, res) => {
    const genreId = req.query.genre;
    const userId = req.user.userId;

    let sql = `
      SELECT movies.*, genres.name AS genre
      FROM movies
      JOIN genres ON movies.genre_id = genres.id
      WHERE movies.user_id = ?
    `;
    const params = [userId];

    if (genreId) {
        sql += " AND movies.genre_id = ?";
        params.push(genreId);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// GET a single movie by ID for the logged-in user
moviesRouter.get("/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const sql = `
      SELECT movies.*, genres.name AS genre
      FROM movies
      JOIN genres ON movies.genre_id = genres.id
      WHERE movies.id = ? AND movies.user_id = ?
    `;

    db.query(sql, [id, userId], (err, results) => {
        if (err) return res.status(500).send("Internal Server Error");
        res.json(results[0]);
    });
});

// POST a new movie (with image upload)
moviesRouter.post("/", verifyToken, upload.single("poster"), (req, res) => {
    const { title, description, release_year, genre_id } = req.body;
    const poster = req.file ? req.file.filename : null;
    const userId = req.user.userId;

    const sql = `
      INSERT INTO movies (title, description, release_year, poster, genre_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [title, description, release_year, poster, genre_id, userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error adding movie");
        }

        res.status(200).json({ message: "Movie added successfully", id: results.insertId });
    });
});

// PUT (update) a movie - optionally you can add ownership check too
moviesRouter.put("/:id", verifyToken, upload.single("poster"), (req, res) => {
    const { id } = req.params;
    const { title, description, release_year, genre_id } = req.body;
    const userId = req.user.userId;

    let sql = `UPDATE movies SET title = ?, description = ?, release_year = ?, genre_id = ?`;
    const params = [title, description, release_year, genre_id];

    if (req.file) {
        sql += `, poster = ?`;
        params.push(req.file.filename);
    }

    sql += ` WHERE id = ? AND user_id = ? LIMIT 1`;
    params.push(id, userId);

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error updating movie");
        }

        res.json({ message: "Movie updated successfully" });
    });
});

// ✅ DELETE a movie by id (and owner check)
moviesRouter.delete("/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const sql = `DELETE FROM movies WHERE id = ? AND user_id = ? LIMIT 1`;

    db.query(sql, [id, userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting movie");
        }

        res.json({ message: "Movie deleted successfully" });
    });
});

module.exports = moviesRouter;

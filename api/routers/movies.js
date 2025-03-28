const express = require('express');
const moviesRouter = express.Router();
const upload = require('../storage');
const db = require('../db');

// GET all movies with genre names
moviesRouter.get("/", (req, res) => {

    // Get genre ID from query params if provided
    const genreId = req.query.genre;

    // Base SQL to join movies with genre names
    let sql = `
    SELECT movies.*, genres.name AS genre
    FROM movies
    JOIN genres ON movies.genre_id = genres.id
  `;

    const params = [];

    // If a genre was selected, add a WHERE condition to filter the results
    // This updates the SQL to only return movies from the selected genre    
    if (genreId) {
        // ? will be replaced with genreId
        sql += " WHERE movies.genre_id = ?";
        // Add genreId to the list of parameters
        params.push(genreId);
    }

    // Run the SQL query
    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        // If successful, send the result (movie list) back as JSON
        res.json(results);
    });
});

// GET a single movie by ID
moviesRouter.get("/:id", (req, res) => {
    // Extract the movie ID from the URL (e.g., /movies/3 → id = 3)
    const { id } = req.params;

    // SQL query to select all details of the movie, along with the genre name
    // It uses a JOIN to get the genre name from the genres table
    const sql = `
    SELECT movies.*, genres.name AS genre
    FROM movies
    JOIN genres ON movies.genre_id = genres.id
    WHERE movies.id = ?
  `;

    // Run the SQL query and pass in the movie ID as a parameter
    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).send("Internal Server Error");
            return;
        }
        res.json(results[0]);
    });
});

// POST a new movie (with image upload)
moviesRouter.post("/", upload.single("poster"), (req, res) => {
    const { title, release_year, genre_id } = req.body;
    const description = req.body.description || "";

    // Handle uploaded file
    const poster = req.file ? req.file.filename : null;

    // SQL to insert new movie
    const sql = `
    INSERT INTO movies (title, description, release_year, poster, genre_id)
    VALUES (?, ?, ?, ?, ?)
  `;

    // Execute insert query
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

    // Get the movie ID from the URL
    const { id } = req.params;

    // Get updated movie data from the request body
    const { title, description, release_year, genre_id } = req.body;

    // Start building the update SQL to update the movie
    let sql = `UPDATE movies SET title = ?, description = ?, release_year = ?, genre_id = ?`;
    const params = [title, description, release_year, genre_id];

    // If a new poster is uploaded, include it in the update
    if (req.file) {
        // If a new image is provided, update the poster field too
        sql += `, poster = ?`;
        // Add the new filename to the parameters
        params.push(req.file.filename);
    }

    // Complete the SQL query to only update the movie with the given ID
    sql += ` WHERE id = ? LIMIT 1`;
    // Add the ID to the parameters
    params.push(id);

    // run the update query
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error updating movie");
        }

        res.json({ message: "Movie updated successfully" });
    });
});

// DELETE a movie by id
moviesRouter.delete("/:id", (req, res) => {
    const { id } = req.params;

    // SQL query to delete the movie with the matching ID
    const sql = `DELETE FROM movies WHERE id = ? LIMIT 1`;

    // Run the delete query with the movie ID as a parameter
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting movie");
        }

        res.json({ message: "Movie deleted successfully" });
    });
});

module.exports = moviesRouter;

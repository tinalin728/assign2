const express = require('express');
const genresRouter = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth.jwt');

// GET /api/genres
genresRouter.get("/", verifyToken, (req, res) => {
    const userId = req.user.userId;

    const sql = `
      SELECT * FROM genres 
      WHERE user_id IS NULL OR user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).send("Server error");
        res.json(results);
    });
});

// POST a new genre (with user-specific support)
genresRouter.post('/', verifyToken, (req, res) => {
    const { new_genre } = req.body;
    const userId = req.user.userId;

    const sql = 'INSERT INTO genres (name, user_id) VALUES (?, ?)';

    db.query(sql, [new_genre, userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding genre');
        }

        res.json({ message: 'Genre added successfully', id: results.insertId });
    });
});



module.exports = genresRouter;

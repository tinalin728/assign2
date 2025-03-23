const express = require('express');
const genresRouter = express.Router();
const db = require('../db');

// GET all genres
genresRouter.get('/', (req, res) => {
    const sql = 'SELECT * FROM genres';

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
});

// POST a new genre
genresRouter.post('/', (req, res) => {
    const { new_genre } = req.body;

    const sql = 'INSERT INTO genres (name) VALUES (?)';

    db.query(sql, [new_genre], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred');
        }

        res.json({ message: 'Genre added successfully', id: results.insertId });
    });
});

module.exports = genresRouter;

// api/routers/users.js
require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET;
const usersRouter = express.Router();

// Register New User
usersRouter.post("/", [
    body("email").isEmail().withMessage("Invalid Email").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("username").notEmpty().withMessage("Username is required")

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
        [email, hashedPassword, username],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error creating user");
            }

            res.status(201).json({
                message: "User Created!",
                userId: result.insertId
            });
        }
    );
});

// User Login
usersRouter.post("/sign-in", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err || result.length === 0) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        const user = result[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "4h" }
        );

        res.json({ message: "Success!", jwt: token });
    });
});

module.exports = usersRouter;

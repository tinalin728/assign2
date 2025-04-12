const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3001;

// Import route handlers
const moviesRouter = require('./routers/movies');
const genresRouter = require('./routers/genres');
const usersRouter = require('./routers/users');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Static folder for uploaded posters
app.use('/uploads', express.static('uploads'));

// Use movie and genre routes
app.use('/api/movies', moviesRouter);
app.use('/api/genres', genresRouter);
app.use('/api/users', usersRouter);

// Start the server
app.listen(port, () => {
    console.log(`Movie Library API running at http://localhost:${port}`);
});

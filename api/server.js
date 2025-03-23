const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3001;

const moviesRouter = require('./routers/movies');
const genresRouter = require('./routers/genres');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Static folder for uploaded posters
app.use('/uploads', express.static('uploads'));

// Use routers
app.use('/api/movies', moviesRouter);
app.use('/api/genres', genresRouter);

// Start the server
app.listen(port, () => {
    console.log(`Movie Library API running at http://localhost:${port}`);
});

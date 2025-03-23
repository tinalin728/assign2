// storage.js
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    // Destination folder for uploaded images
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // this is /api/uploads
    },
    // Rename the uploaded file
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// Export the multer middleware
const upload = multer({ storage });
module.exports = upload;

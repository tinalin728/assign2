# 🎬 Movie Library App

A full-stack web application where users can sign up, log in, and manage their personal movie collection. Each user has their own private list, protected by JWT authentication.

## Tech Stack
- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MySQL (via phpMyAdmin / MAMP)
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer

---

## 🚀 Setup Instructions


### 1. Database Setup Instructions
1. Open MAMP and go to phpMyAdmin.
2. Click New to create a database named "movies"
3. After the database is created, click into it.
4. Go to the Import tab.
5. Choose the provided .sql file you exported.
6. Click Go to import the tables and data.

This will set up all the required tables (e.g., users, movies, genres) and any data included in the export.

### 2. Backend setup (API)
cd api
npm install
Then run the server


### 3. Frontend setup (Web)
cd ../web
npm install
npm run dev

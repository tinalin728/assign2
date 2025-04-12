import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router';

import Header from './components/Header';
import Footer from './components/Footer';

import authRequired from './authRequired';

import Movies from './pages/Movies';
import SingleMovie from './pages/SingleMovie';
import Home from './pages/Home';

// Protect your pages
const ProtectedMovies = authRequired(Movies);
const ProtectedSingleMovie = authRequired(SingleMovie);


function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  const fetchUser = () => {
    const token = localStorage.getItem("jwt-token");
    if (!token) return;

    fetch("http://localhost:3001/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(true);
        setUsername(data.username);
      })
      .catch((err) => console.error("Failed to fetch user info:", err));
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogin = (name) => {
    setIsAuthenticated(true);
    navigate("/movies");
    setUsername(name);
    fetchUser();
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");

    if (!token) return;

    fetch("http://localhost:3001/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(true);
        setUsername(data.username);
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
      });

  }, []);



  return (
    <div>
      <Header handleLogout={handleLogout} isAuthenticated={isAuthenticated} username={username} />
      <Routes>
        <Route path="/" element={<Home handleLogin={handleLogin} />} />

        <Route path="/movies" element={<ProtectedMovies />} />
        <Route path="/movies/:id" element={<ProtectedSingleMovie />} />

      </Routes>

      <Footer />
    </div>
  );
}

export default App;

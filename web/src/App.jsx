import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';

import Header from './components/Header';
import Footer from './components/Footer';

import authRequired from './authRequired';
import Movies from './pages/Movies';
import SingleMovie from './pages/SingleMovie';
import Home from './pages/Home';

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
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setIsAuthenticated(true);
        setUsername(data.username);
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
        localStorage.removeItem("jwt-token");
        setIsAuthenticated(false);
        setUsername("");
        navigate("/");
      });
  };


  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogin = () => {
    fetchUser();
    navigate("/movies");
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    setIsAuthenticated(false);
    setUsername("");
    navigate("/");
  };

  return (
    <div>
      <Header
        handleLogout={handleLogout}
        isAuthenticated={isAuthenticated}
        username={username}
      />

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

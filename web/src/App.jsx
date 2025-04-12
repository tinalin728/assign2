import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router';

import Header from './components/Header';
import Footer from './components/Footer';

import authRequired from './authRequired';

import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
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


  const handleLogin = (name) => {
    setIsAuthenticated(true);
    navigate("/movies");
    setUsername(name);
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
    const savedUsername = localStorage.getItem("username");
    if (token) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
    }
  }, []);

  return (
    <div>
      <Header handleLogout={handleLogout} isAuthenticated={isAuthenticated} username={username} />
      <Routes>
        <Route path="/" element={<Home handleLogin={handleLogin} />} />
        {/* <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn handleLogin={handleLogin} />} /> */}
        <Route path="/movies" element={<ProtectedMovies />} />
        <Route path="/movies/:id" element={<ProtectedSingleMovie />} />

      </Routes>

      <Footer />
    </div>
  );
}

export default App;

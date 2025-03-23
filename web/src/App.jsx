import { Routes, Route } from "react-router";
import Header from './components/Header'
import Movies from "./pages/Movies";
import SingleMovie from "./pages/SingleMovie";

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/movies/:id" element={<SingleMovie />} />
      </Routes>
    </>
  )
}

export default App

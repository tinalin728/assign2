import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function SingleMovie() {

    // Get the movie ID from the URL
    const { id } = useParams();
    // State to store the fetched movie data
    const [movieData, setMovieData] = useState(null);

    // Fetch movie data when component mounts or ID changes
    useEffect(() => {
        fetch(`http://localhost:3001/api/movies/${id}`)
            .then((res) => res.json())
            .then((data) => setMovieData(data))
            .catch((err) => console.error(err));
    }, [id]);


    // Show loading message while data is being fetched
    if (!movieData) return <p className="text-center mt-10">Loading...</p>;

    return (
        <main className="max-w-6xl min-h-screen mx-auto px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-1">
                    <img
                        src={`http://localhost:3001/uploads/${movieData.poster}`}
                        alt={movieData.title}
                        className="rounded shadow"
                    />
                </div>

                <div className="md:col-span-2 space-y-4">
                    <Link
                        to="/"
                        className="inline-block bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
                    >
                        &larr; Back to Movies
                    </Link>

                    <h1 className="text-3xl font-semibold">{movieData.title}</h1>
                    <p className="text-gray-500 text-sm">
                        {movieData.genre} &middot; {movieData.release_year}
                    </p>

                    <p className="text-gray-700">{movieData.description || "No description available."}</p>
                </div>
            </div>
        </main>
    );
}

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import Filter from '../components/Filter'
import AddMovieModal from '../components/AddMovieModal';
import UpdateMovieModal from '../components/UpdateMovieModal';

export default function Movies() {

    const [movies, setMovies] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);

    const fetchMovies = () => {
        const url = selectedGenre
            ? `http://localhost:3001/api/movies?genre=${selectedGenre}`
            : `http://localhost:3001/api/movies`;

        fetch(url)
            .then(res => res.json())
            .then((jsonData) => {
                console.log(jsonData);
                setMovies(jsonData);
            });
    };

    useEffect(() => {
        fetchMovies();
    }, [selectedGenre]);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this movie?");
        if (!confirm) return;

        try {
            const response = await fetch(`http://localhost:3001/api/movies/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchMovies();
            } else {
                console.error("Failed to delete movie");
            }
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    };


    return (
        <main className='max-w-container mt-10'>
            <div className='grid grid-cols-12 gap-10 min-h-screen'>
                <div className='col-span-2 border rounded border-gray-200 px-4 py-2'>
                    <Filter selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
                </div>

                <div className='col-span-10'>
                    <div className='flex justify-between items-center border-b pb-3 border-gray-200 '>
                        <h3 className='font-bold text-xl uppercase tracking-wide'>My Collection</h3>

                        <AddMovieModal onMovieAdded={fetchMovies} />
                    </div>


                    <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {movies.map(movie => (
                            <div
                                key={movie.id}
                                className="bg-white shadow rounded overflow-hidden border border-gray-200 p-4 flex flex-col justify-between relative"
                            >
                                <button className='z-10 absolute top-5 right-5 text-lg bg-white/60 backdrop-blur-sm shadow-lg h-8 w-8 rounded-full leading-0'
                                    onClick={() => handleDelete(movie.id)}
                                >
                                    X
                                </button>

                                <div>
                                    <img
                                        src={`http://localhost:3001/uploads/${movie.poster}`}
                                        alt={movie.title}
                                        className="w-full h-64 object-cover rounded"
                                    />

                                    <div className="mt-4">
                                        <h4 className="text-lg font-bold">{movie.title}</h4>
                                        <p className="text-sm text-gray-500">{movie.genre} • {movie.release_year}</p>

                                    </div>
                                </div>
                                <div className="flex justify-between mt-4 gap-2">
                                    <UpdateMovieModal movie={movie} onMovieUpdated={fetchMovies} />

                                    <Link
                                        to={`/movies/${movie.id}`}
                                        className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </main >
    )
}

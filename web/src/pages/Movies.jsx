import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Filter from '../components/Filter'
import AddMovieModal from '../components/AddMovieModal';
import UpdateMovieModal from '../components/UpdateMovieModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function Movies() {
    // Store the list of movies
    const [movies, setMovies] = useState([]);

    // Store the selected genre 
    const [selectedGenre, setSelectedGenre] = useState(null);

    // This is used to re-fetch genres when a new genre is added
    const [genreRefreshKey, setGenreRefreshKey] = useState(0);

    // States for handling the delete confirmation modal
    const [showConfirm, setShowConfirm] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    // Fetch movies from the server
    const fetchMovies = () => {

        // If a genre is selected, include it in the API request
        const url = selectedGenre
            ? `http://localhost:3001/api/movies?genre=${selectedGenre}`
            : `http://localhost:3001/api/movies`;

        // Fetch movies from the API
        fetch(url)
            .then(res => res.json())
            .then((jsonData) => {
                // console.log(jsonData);

                // Save movies to state
                setMovies(jsonData);
            });
    };

    // Run fetchMovies every time selectedGenre changes
    useEffect(() => {
        fetchMovies();
    }, [selectedGenre]);

    // Delete movie after confirmation
    const handleDelete = async (id) => {

        try {
            const response = await fetch(`http://localhost:3001/api/movies/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Refresh movie list after delete
                fetchMovies();
            } else {
                console.error("Failed to delete movie");
            }
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    };


    return (
        <main className="w-full md:my-10 md:max-w-[80rem] md:px-6 mx-auto">
            <div className='grid md:grid-cols-12 gap-6 md:gap-10 min-h-screen'>
                <div className='w-full h-fit md:col-span-3 lg:col-span-2 border-b md:border md:rounded border-gray-200 md:px-3 py-2'>
                    {/* Genre Filter Section */}
                    <Filter selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} refreshTrigger={genreRefreshKey} />
                </div>

                <div className='px-4 md:px-0 w-full md:col-span-9 lg:col-span-10'>
                    <div className='flex justify-between items-center border-b pb-3 border-gray-200 '>
                        <h3 className='font-bold text-lg md:text-xl uppercase tracking-wide'>My Collection</h3>

                        {/* Button to open the Add Movie modal */}
                        <AddMovieModal onMovieAdded={fetchMovies} setGenreRefreshKey={setGenreRefreshKey}
                        />
                    </div>


                    {/* movies */}
                    <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {movies.map(movie => (
                            <div
                                key={movie.id}
                                className="bg-white shadow rounded overflow-hidden border border-gray-200 p-4 flex flex-col justify-between relative"
                            >
                                <button className='z-10 absolute top-5 right-5 text-lg bg-white/60 backdrop-blur-sm shadow-lg h-8 w-8 rounded-full leading-0'
                                    onClick={() => {
                                        setToDelete(movie.id);
                                        setShowConfirm(true);
                                    }}
                                >
                                    X
                                </button>
                                {showConfirm && (
                                    <ConfirmDeleteModal
                                        onClose={() => setShowConfirm(false)}
                                        onConfirm={() => {
                                            handleDelete(toDelete);
                                            setShowConfirm(false);
                                        }}
                                    />
                                )}


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

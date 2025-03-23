import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import Filter from '../components/Filter'
import AddMovieModal from '../components/AddMovieModal';

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

    return (
        <main className='max-w-container mt-10'>
            <div className='grid grid-cols-12'>
                <div className='col-span-3'>
                    <Filter selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
                </div>

                <div className='col-span-9'>
                    <div className='flex justify-between items-center'>
                        <h3>My Collection</h3>
                        <AddMovieModal onMovieAdded={fetchMovies} />
                    </div>


                    <div className='mt-10 grid grid-cols-12 gap-4'>
                        {movies.map(movie => (
                            <Link
                                to={`/movies/${movie.id}`}
                                key={movie.id}
                                className='col-span-3 block hover:opacity-90 transition-all duration-200'
                            >
                                <img
                                    src={`http://localhost:3001/uploads/${movie.poster}`}
                                    alt={movie.title}
                                    className='rounded-md shadow w-full'
                                />

                                <div className='mt-2'>
                                    <h4 className='text-xl font-bold'>{movie.title}</h4>
                                    <div className='flex justify-between text-gray-500 text-sm'>
                                        <p>{movie.release_year}</p>
                                        <p>{movie.genre}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </main >
    )
}

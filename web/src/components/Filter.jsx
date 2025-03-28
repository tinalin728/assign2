import React, { useEffect, useState } from 'react';

export default function Filter({ selectedGenre, setSelectedGenre, refreshTrigger }) {
    const [genres, setGenres] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // Toggle for mobile view

    useEffect(() => {
        fetch('http://localhost:3001/api/genres')
            .then(res => res.json())
            .then(data => setGenres(data))
            .catch(err => console.error('Failed to load genres:', err));
    }, [refreshTrigger]);

    return (
        <div className="w-full">

            <div className="flex justify-center items-center gap-2 pb-1 md:justify-start">
                <p className="font-bold uppercase md:border-b md:pb-2 md:w-full md:border-black/30">Filter By Genre</p>
                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(prev => !prev)}
                    aria-label="Toggle Genre List"
                >
                    <span className="inline-block text-xl leading-none">&#9776;</span>
                </button>
            </div>


            {/* Genre List */}
            <ul className={`pt-4 flex-col w-full gap-3 justify-center items-center ${isOpen ? 'flex w-full' : 'hidden md:flex md:flex-col md:items-start md:pb-4'}`}>
                <li
                    onClick={() => setSelectedGenre(null)}
                    className={`cursor-pointer hover:underline ${selectedGenre === null ? 'font-bold text-black' : 'text-gray-500'}`}
                >
                    All
                </li>
                {genres.map((genre) => (
                    <li
                        key={genre.id}
                        className={`cursor-pointer hover:underline ${selectedGenre === genre.id ? 'font-bold text-black' : 'text-gray-500'}`}
                        onClick={() => setSelectedGenre(genre.id)}
                    >
                        {genre.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

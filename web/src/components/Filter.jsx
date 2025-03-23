import React, { useEffect, useState } from 'react'

export default function Filter({ selectedGenre, setSelectedGenre }) {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/genres')
            .then(res => res.json())
            .then(data => setGenres(data))
            .catch(err => console.error('Failed to load genres:', err));
    }, []);


    return (
        <aside className=''>
            <p className='pb-1 border-b w-fit border-black/30 font-bold uppercase'>Filter By Genre</p>

            <ul className='pt-4 flex flex-col gap-2'>
                <li>All</li>
                {genres.map((genre) => (
                    <li
                        key={genre.id}
                        className={selectedGenre === genre.id ? 'active' : ''}
                        onClick={() => setSelectedGenre(genre.id)}
                    >
                        {genre.name}
                    </li>
                ))}
            </ul>
        </aside>
    )
}

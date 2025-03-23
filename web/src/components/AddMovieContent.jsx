// src/components/AddMovieModalContent.jsx
import { useState, useEffect } from 'react';


export default function AddMovieContent({ onClose, onMovieAdded }) {
    const [genres, setGenres] = useState([]);
    const [genre, setGenre] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [releaseYear, setReleaseYear] = useState('');
    const [poster, setPoster] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/api/genres')
            .then(res => res.json())
            .then(data => {
                setGenres(data);
                if (data.length > 0) setGenre(data[0].id);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('genre_id', genre);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('release_year', releaseYear);
        formData.append('poster', poster);

        const response = await fetch('http://localhost:3001/api/movies', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        console.log('New movie:', result);

        onMovieAdded(); // Refresh movies
        onClose(); // Close modal
    };

    return (
        <div className='grid place-items-center'>
            <div className='max-w-xl border p-10 relative w-full' >
                <button onClick={onClose} className='absolute top-4 right-10 text-2xl'>x</button>

                <h3 className='text-xl font-bol text-center'>Add a new movie</h3>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className='mt-6 grid gap-1'>
                    <label>Genre: </label>
                    <select value={genre} onChange={(e) => setGenre(e.target.value)} className='border px-2 py-1'>
                        {genres.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>

                    <label className='mt-4'>Movie Title:</label>
                    <input className='border focus:outline-none placeholder:text-sm px-2 py-1'
                        placeholder='Enter Movie Title'
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} required />

                    <label className='mt-4'>Description:</label>
                    <textarea className='border focus:outline-none placeholder:text-sm px-2 py-1'
                        placeholder='Enter Movie Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} required />

                    <label className='mt-4'> Release Year:</label>
                    <input className='border px-2 py-1'
                        type="number"
                        value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} required />

                    <div className="mt-4 relative flex items-center gap-4">
                        <label className="block ">Upload Cover:</label>

                        <label className="bg-gray-800 text-white px-2 py-1 cursor-pointer hover:bg-gray-700">
                            Choose Image
                            <input
                                type="file"
                                onChange={(e) => setPoster(e.target.files[0])}
                                className="hidden"
                                accept="image/*"
                            />
                        </label>
                        {poster && (
                            <p className="text-sm mt-2 text-gray-600">
                                {poster.name}
                            </p>
                        )}
                    </div>

                    <button type="submit" className='mt-10 border px-4 py-2'>Add Now</button>
                </form>
            </div>
        </div>
    );
}

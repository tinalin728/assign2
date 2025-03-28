// src/components/AddMovieModalContent.jsx
import { useState, useEffect } from 'react';


export default function AddMovieContent({ onClose, onMovieAdded, setGenreRefreshKey }) {
    // State to store genres from the database
    const [genres, setGenres] = useState([]);

    // Tracks user input for movie fields
    const [genre, setGenre] = useState('');  // selected genre ID
    const [title, setTitle] = useState(''); //movie title
    const [description, setDescription] = useState(''); // movie description
    const [releaseYear, setReleaseYear] = useState(''); // movie year
    const [poster, setPoster] = useState(''); //uploaded image file

    // Handles whether the user is adding a new genre
    const [isNewGenre, setIsNewGenre] = useState(false);
    const [newGenre, setNewGenre] = useState("");

    // Fetch genres from the server when the component mounts
    useEffect(() => {
        fetch('http://localhost:3001/api/genres')
            .then(res => res.json())
            .then(data => {
                setGenres(data);
                // Set default genre if movie has none (fallback)
                if (data.length > 0) setGenre(data[0].id);
            });
    }, []);

    // Handle form submission for updating movie
    const handleSubmit = async (e) => {
        // Stop default form reload
        e.preventDefault();

        // start with selected genre
        let genre_id = genre;

        // If user typed in a new genre, send it to backend first
        if (isNewGenre && newGenre.trim() !== "") {
            const genreResponse = await fetch("http://localhost:3001/api/genres", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ new_genre: newGenre })
            });

            const genreData = await genreResponse.json();
            genre_id = genreData.id; // use newly created genre's ID
        }

        // triggers genre re-fetch / will refresh genre list in the UI after adding a new one
        setGenreRefreshKey(prev => prev + 1);

        //create form data to send with the POST request
        const formData = new FormData();
        formData.append('genre_id', genre_id);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('release_year', releaseYear);
        formData.append('poster', poster);

        // Send movie data to the backend
        const response = await fetch('http://localhost:3001/api/movies', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        // console.log('New movie:', result);

        // Refresh movie list on the UI
        onMovieAdded();

        // Close the modal after submission
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className='max-w-xl rounded p-10 relative w-full bg-white' >
                <button onClick={onClose} className='absolute top-4 right-10 text-2xl'>x</button>

                <h3 className='text-xl font-bol text-center'>Add a new movie</h3>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className='mt-6 grid gap-1'>
                    <label className="mt-4">Genre:</label>
                    {!isNewGenre ? (
                        <>
                            <select
                                value={genre}
                                onChange={(e) => {
                                    if (e.target.value === "-1") {
                                        setIsNewGenre(true);
                                        setGenre("");
                                    } else {
                                        setGenre(e.target.value);
                                    }
                                }}
                                className="border px-2 py-1 rounded"
                            >
                                {genres.map((g) => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                                <option value="-1">+ New Genre +</option>
                            </select>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Enter new genre"
                                value={newGenre}
                                onChange={(e) => setNewGenre(e.target.value)}
                                className="border px-2 py-1 rounded w-full  placeholder:text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setIsNewGenre(false)}
                                className="text-sm underline text-blue-500 text-nowrap"
                            >
                                Show List
                            </button>
                        </div>
                    )}


                    <label className='mt-4'>Movie Title:</label>
                    <input className='border focus:outline-none placeholder:text-sm px-2 py-1 rounded'
                        placeholder='Enter Movie Title'
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} required />

                    <label className='mt-4'>Description:</label>
                    <textarea className='border focus:outline-none placeholder:text-sm p-2 rounded'
                        placeholder='Enter Movie Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} required />

                    <label className='mt-4'> Release Year:</label>
                    <input className='border px-2 py-1 rounded'
                        type="number"
                        value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} required />

                    <div className="mt-4 relative flex gap-4">
                        <label className="block ">Upload Cover:</label>
                        <div className=''>

                            <label className="inline-block bg-gray-800 text-white px-2 py-1 cursor-pointer rounded hover:bg-gray-700">
                                Choose Image
                                <input
                                    type="file"
                                    onChange={(e) => setPoster(e.target.files[0])}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </label>
                            {poster && (
                                <div className="relative flex flex-col gap-2 w-full overflow-hidden">
                                    <p className="text-sm mt-2 text-gray-600 truncate">
                                        {poster.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button type="submit" className='mt-10 border px-4 py-2 rounded hover:bg-gray-100'>Add Now</button>
                </form>
            </div>
        </div>
    );
}

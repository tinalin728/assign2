import { useEffect, useState } from "react";

export default function UpdateMovieContent({ movie, onClose, onMovieUpdated }) {

    // Store genre options and current form field values
    const [genres, setGenres] = useState([]);
    const [genre, setGenre] = useState(movie.genre_id);
    const [title, setTitle] = useState(movie.title);
    const [description, setDescription] = useState(movie.description);
    const [releaseYear, setReleaseYear] = useState(movie.release_year);
    const [poster, setPoster] = useState(null); // New file upload

    // Fetch genres from the server when component loads
    useEffect(() => {
        const token = localStorage.getItem("jwt-token");

        fetch('http://localhost:3001/api/genres', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setGenres(data);
                if (data.length > 0) setGenre(data[0].id);
            })
            .catch(err => console.error("Failed to fetch genres:", err));
    }, []);


    // Handle form submission to update movie
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create form data to send to server
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("release_year", releaseYear);
        formData.append("genre_id", genre);

        // Only include image if user uploaded a new one
        if (poster) {
            formData.append("poster", poster);
        }

        // Send PUT request to update movie info
        const token = localStorage.getItem("jwt-token");

        const res = await fetch(`http://localhost:3001/api/movies/${movie.id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        });


        const result = await res.json();
        console.log(result);

        // Refresh the movie list
        onMovieUpdated();
        // Close the modal
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white p-8 w-full max-w-xl rounded relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-6 text-xl font-bold"
                >
                    ×
                </button>

                <h3 className="text-xl font-bold mb-4 text-center">Edit Movie</h3>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid gap-4">
                    <div className="flex items-center justify-center gap-4">
                        <div className="basis-1/3">
                            <label className="block mb-1">Genre:</label>
                            <select
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                className="border w-full px-2 py-[5px]"
                            >
                                {genres.map((g) => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block mb-1">Title:</label>
                            <input
                                className="border w-full px-2 py-1"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                    </div>


                    <div>
                        <label className="block mb-1">Description:</label>
                        <textarea
                            className="border w-full px-2 py-1"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Release Year:</label>
                        <input
                            className="border w-full px-2 py-1"
                            type="number"
                            value={releaseYear}
                            onChange={(e) => setReleaseYear(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Current Cover:</label>
                        <img
                            src={`http://localhost:3001/uploads/${movie.poster}`}
                            alt={movie.title}
                            className="w-32 h-auto mb-2"
                        />
                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex flex-col">
                                <label className="bg-gray-800 text-white px-4 py-2 cursor-pointer hover:bg-gray-700 w-fit">
                                    Choose New Image
                                    <input
                                        type="file"
                                        onChange={(e) => setPoster(e.target.files[0])}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </label>

                                {poster && (
                                    <p className="text-sm mt-2 text-gray-600">{poster.name}</p>
                                )}
                            </div>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className='mt-10 border px-4 py-2 hover:bg-gray-100'
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

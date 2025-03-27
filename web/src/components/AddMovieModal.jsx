import { useState } from 'react'
import { createPortal } from 'react-dom'
import AddMovieContent from './AddMovieContent'
import star from "../../public/star.png"

export default function AddMovieModal({ onMovieAdded, setGenreRefreshKey }) {

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className='px-2 py-2 border rounded hover:bg-gray-100 flex items-center gap-2'
                onClick={() => setShowModal(true)}
            >
                <div className='inline-block animate-scale-shake'>
                    <img src={star} alt="star" width={24} />
                </div>
                Add Movie
            </button>

            {
                showModal &&
                createPortal(
                    <AddMovieContent
                        onMovieAdded={onMovieAdded}
                        onClose={() => setShowModal(false)}
                        setGenreRefreshKey={setGenreRefreshKey}
                    />, document.body
                )
            }
        </>
    )
}

import { useState } from 'react'
import { createPortal } from 'react-dom'
import AddMovieContent from './AddMovieContent'

export default function AddMovieModal({ onMovieAdded }) {

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className='px-4 py-2 border rounded'
                onClick={() => setShowModal(true)}
            >
                Add Movie
            </button>

            {
                showModal &&
                createPortal(
                    <AddMovieContent
                        onMovieAdded={onMovieAdded}
                        onClose={() => setShowModal(false)}

                    />, document.body
                )
            }
        </>
    )
}

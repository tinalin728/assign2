import { useState } from "react";
import { createPortal } from "react-dom";
import UpdateMovieContent from "./UpdateMovieContent";

export default function UpdateMovieModal({ movie, onMovieUpdated }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                className="border text-sm px-3 py-1 rounded hover:bg-yellow-600"
                onClick={() => setShowModal(true)}
            >
                Edit
            </button>

            {showModal &&
                createPortal(
                    <UpdateMovieContent
                        movie={movie}
                        onClose={() => setShowModal(false)}
                        onMovieUpdated={onMovieUpdated}
                    />,
                    document.body
                )}
        </>
    );
}

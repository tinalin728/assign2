import React from "react";
import { createPortal } from "react-dom";

export default function ConfirmDeleteModal({ onClose, onConfirm }) {
    return createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded p-6 max-w-sm w-full shadow">
                <p className="mb-6">Are you sure you want to delete this movie?</p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

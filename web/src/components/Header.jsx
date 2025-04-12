import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header({ isAuthenticated, handleLogout, username }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="border-b border-black/20">
            <div className="max-w-container py-4">
                <nav className="flex justify-between items-center">
                    <Link to="/" className="text-lg font-semibold">
                        Movie Library
                    </Link>

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                            >
                                {username}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 bg-white border rounded shadow p-2 z-50">
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm text-red-600 hover:underline"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/"
                            className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition"
                        >
                            Sign In
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

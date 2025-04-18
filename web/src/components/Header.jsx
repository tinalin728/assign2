import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import user from '../../public/user.png'

export default function Header({ isAuthenticated, handleLogout, username }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <header className="border-b border-black/20">
            <div className="max-w-container py-4">
                <nav className="flex justify-between items-center">
                    <Link to="/" className="text-lg font-semibold">
                        Movie Library
                    </Link>

                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className="flex items-center gap-2"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                            >
                                <img src={user} alt="" width={30} />
                                {username}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 bg-white border rounded shadow p-2 z-50">
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            handleLogout();
                                        }}
                                        className="text-red-600 hover:underline text-nowrap" >
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

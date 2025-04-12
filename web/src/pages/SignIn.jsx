import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3001/api/users/sign-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.jwt);
            navigate("/movies");

        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <div className="h-[calc(100vh-105px)] flex flex-col justify-center items-center">
                <div className="max-w-md w-full mx-auto p-8 border border-gray-300 shadow-lg rounded-lg">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="">Email</label>
                            <input
                                type="email"
                                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="">Password</label>
                            <input
                                type="password"
                                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-md mt-2 hover:bg-gray-800 transition"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignIn;

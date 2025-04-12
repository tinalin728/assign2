import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthForm({ handleLogin }) {
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [username, setUsername] = useState(""); // 🆕
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt-token");
        if (token) navigate("/movies");
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (mode === "signup" && password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        const endpoint =
            mode === "login"
                ? "http://localhost:3001/api/users/sign-in"
                : "http://localhost:3001/api/users";

        const body =
            mode === "login"
                ? { email, password }
                : { email, password, username }; // 🆕

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.errors?.[0]?.msg || data.message || "Something went wrong");
                return;
            }

            if (mode === "login") {
                localStorage.setItem("jwt-token", data.jwt);
                localStorage.setItem("username", data.username); // 🆕
                navigate("/movies");
                handleLogin(data.username); // 🆕
            } else {
                // Auto login after signup
                const loginRes = await fetch("http://localhost:3001/api/users/sign-in", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
                const loginData = await loginRes.json();

                if (loginRes.ok) {
                    localStorage.setItem("jwt-token", loginData.jwt);
                    localStorage.setItem("username", loginData.username || ""); // 🆕
                    navigate("/movies");
                    handleLogin(loginData.username); // 🆕
                } else {
                    setError("Account created, but login failed. Please try logging in.");
                }
            }
        } catch (err) {
            setError("Server error. Try again later.");
        }
    };

    return (
        <div className="">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
                <div className="flex mb-6 border rounded-md border-gray-300 w-full overflow-hidden">
                    <button
                        onClick={() => setMode("login")}
                        className={`py-2 w-full uppercase font-medium tracking-wider transition ${mode === "login" ? "border-2 rounded-l-md" : "bg-white"}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setMode("signup")}
                        className={`w-full py-2 uppercase font-medium tracking-wider transition ${mode === "signup" ? "border-2 rounded-r-md" : "bg-white"}`}
                    >
                        Signup
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {mode === "signup" && ( // 🆕
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {mode === "signup" && (
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    )}

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-2 bg-black text-white rounded hover:opacity-90 transition"
                    >
                        {mode === "login" ? "Login" : "Create Account"}
                    </button>
                </form>

                {mode === "login" && (
                    <p className="text-sm italic text-center mt-4 text-gray-600 hover:underline cursor-pointer">
                        Forgot password?
                    </p>
                )}

                {mode === "login" ? (
                    <p className="text-sm text-center mt-4">
                        Create an account?{" "}
                        <span onClick={() => setMode("signup")} className="text-blue-600 cursor-pointer hover:underline">
                            Signup now
                        </span>
                    </p>
                ) : (
                    <p className="text-sm text-center mt-4">
                        Already have an account?{" "}
                        <span onClick={() => setMode("login")} className="text-blue-600 cursor-pointer hover:underline">
                            Login
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
}

export default AuthForm;

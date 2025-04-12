import { Link } from "react-router-dom";
import AuthForm from "./AuthForm";

function Home({ handleLogin }) {
    return (
        <main className="bg-cover bg-center min-h-[calc(100vh-105px)] flex items-center justify-center text-center px-4" >
            <div className="">
                <h1 className="text-4xl font-bold mb-4">Welcome, movie lover 🎬</h1>
                <p className="text-lg mb-6">Sign up and share your movie collection</p>

                <div className="flex justify-center gap-4">
                    <AuthForm handleLogin={handleLogin} />
                </div>
            </div>
        </main>
    );
}

export default Home;

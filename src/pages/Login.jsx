import React, { useState } from "react";
import { auth, provider } from "../firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useHistory } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            history.push("/");
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            history.push("/");
        } catch (error) {
            console.error("Error with Google login:", error);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    />
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
                </form>
                <button onClick={handleGoogleLogin} className="w-full mt-4 p-2 bg-red-500 text-white rounded">Login with Google</button>
            </div>
        </div>
    );
};

export default Login;

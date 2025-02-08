import { useState } from "react";
import axios from "axios";
import BackgroundAnimation from "../components/BgAnimation"

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5001/api/auth/forgot-password", { email });
            setMessage(response.data.message);
        } catch (error) {
            console.log(error);
            setMessage(error.response.data.message || "Error occurred");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <BackgroundAnimation/>
            <div className="z-10 text-center">
            <h1 className="text-4xl font-bold mb-20">Forgot Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary w-full">Send Reset Link</button>
            </form>
            {message && <p className="mt-4">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BackgroundAnimation from "../components/BgAnimation";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/auth/forgot-password", { email });
            toast.success(response.data.message);

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <BackgroundAnimation />
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
                    <button type="submit" className="btn btn-primary w-full">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
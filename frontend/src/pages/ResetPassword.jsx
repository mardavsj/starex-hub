import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import BackgroundAnimation from "../components/BgAnimation";

const ResetPassword = () => {
    const { token } = useParams();
    console.log("Token from URL", token);
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/auth/reset-password/${token}`, { password });
            toast.success(response.data.message);

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-primary/10">
            <BackgroundAnimation />
            <div className="z-10 text-center">
                <h1 className="text-4xl font-bold mb-20">Reset Password</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary w-full">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;

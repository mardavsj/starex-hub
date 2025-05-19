import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BackgroundAnimation from "../components/BgAnimation";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {

    useEffect(() => {
        document.title = 'Forgot Password? - Get the Reset Link at StarX';
      }, []);

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/api/auth/forgot-password", { email });
            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-primary/10 p-2">
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
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Sending...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;

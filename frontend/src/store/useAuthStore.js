import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data, otp) => {
        set({ isSigningUp: true });
        try {
            if (!otp) {
                await axiosInstance.post("/auth/send-otp", {
                    enrollmentNo: data.enrollmentNo,
                    email: data.email,
                });

                toast.success("OTP sent to your email");
                return { otpRequired: true };
            }

            const res = await axiosInstance.post("/auth/signup", { ...data, otp });

            set({ authUser: res.data });
            toast.success("Account created successfully");

            get().connectSocket();
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
            return { success: false };
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    deleteAccount: async (password) => {
        try {
            const res = await axiosInstance.post("/auth/delete-account", { password }, { withCredentials: true });

            toast.success(res.data.message);

            set({ authUser: null });
            localStorage.removeItem("authToken");

            get().disconnectSocket();
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting account");
            return { success: false };
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
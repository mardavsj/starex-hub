import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSidebarOpen: true,

    setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    setMessages: (newMessages) => set({ messages: newMessages }),

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load users.");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load messages.");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message.");
        }
    },

    deleteMessage: async (messageId) => {
        try {
            await axiosInstance.delete(`/messages/delete/${messageId}`);
            set({ messages: get().messages.filter((msg) => msg._id !== messageId) });

            const socket = useAuthStore.getState().socket;
            socket.emit("deleteMessage", messageId);
        } catch (error) {
            console.error("Failed to delete message:", error.response?.data || error.message);
        }
    },

    editMessage: async (messageId, newText) => {
        try {
            const res = await axiosInstance.put(`/messages/edit/${messageId}`, { text: newText });
            set({
                messages: get().messages.map((msg) =>
                    msg._id === messageId ? { ...msg, text: res.data.text } : msg
                ),
            });

            const socket = useAuthStore.getState().socket;
            socket.emit("editMessage", { messageId, newText });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to edit message.");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id && newMessage.receiverId !== selectedUser._id) return;

            set({ messages: [...get().messages, newMessage] });
        });

        socket.on("messageDeleted", (messageId) => {
            set({ messages: get().messages.filter((msg) => msg._id !== messageId) });
        });

        socket.on("messageEdited", ({ messageId, newText }) => {
            set({
                messages: get().messages.map((msg) =>
                    msg._id === messageId ? { ...msg, text: newText } : msg
                ),
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("messageDeleted");
        socket.off("messageEdited");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

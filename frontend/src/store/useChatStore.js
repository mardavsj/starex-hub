import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => {

    const saved = localStorage.getItem("clearedChats");
    const cleared = saved ? JSON.parse(saved) : {};

    const store = {
        messages: [],
        users: [],
        chatHistory: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,
        isChatHistoryLoading: false,
        isSidebarOpen: true,

        setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
        setMessages: (newMessages) => set({ messages: newMessages }),
        clearMessages: () => set({ messages: [] }),

        getUsers: async () => {
            set({ isUsersLoading: true });
            try {
                const res = await axiosInstance.get("/messages/users");
                const users = res.data;

                const chatMap = Object.fromEntries(get().chatHistory.map(chat => [chat._id, chat]));

                const enrichedUsers = users.map(user => ({
                    ...user,
                    unreadCount: chatMap[user._id]?.unreadCount || 0
                }));

                set({ users: enrichedUsers });
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load users.");
            } finally {
                set({ isUsersLoading: false });
            }
        },

        getChatHistory: async () => {
            set({ isChatHistoryLoading: true });
            try {
                const res = await axiosInstance.get("/messages/chats");
                set({ chatHistory: res.data });
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load chat history.");
            } finally {
                set({ isChatHistoryLoading: false });
            }
        },

        getMessages: async (userId) => {
            const { clearedChats } = get();
            set({ isMessagesLoading: true });

            try {
                const res = await axiosInstance.get(`/messages/${userId}`);
                const allMessages = res.data;

                const clearedAt = clearedChats[userId];
                const filteredMessages = clearedAt
                    ? allMessages.filter(msg => new Date(msg.createdAt).getTime() > clearedAt)
                    : allMessages;

                set({ messages: filteredMessages });

                const existingChat = get().chatHistory.find(chat => chat._id === userId);
                if (!existingChat) {
                    const user = get().users.find(user => user._id === userId);
                    if (user) set({ chatHistory: [...get().chatHistory, user] });
                }

                await get().markMessagesAsSeen(userId);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load messages.");
            } finally {
                set({ isMessagesLoading: false });
            }
        },

        sendMessage: async (messageData) => {
            const { selectedUser, messages, chatHistory } = get();
            if (!selectedUser) return;

            try {
                const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
                const newMessage = res.data;

                set({ messages: [...messages, newMessage] });

                const socket = useAuthStore.getState().socket;
                socket.emit("newMessage", {
                    senderId: useAuthStore.getState().authUser._id,
                    receiverId: selectedUser._id,
                    message: newMessage,
                });

                if (!chatHistory.some(chat => chat._id === selectedUser._id)) {
                    set({ chatHistory: [...chatHistory, selectedUser] });
                }
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

        clearedChats: cleared,

        clearMessagesForUser: async () => {
            const { selectedUser, clearedChats } = get();
            if (selectedUser?._id) {
                try {
                    await axiosInstance.put(`/messages/clear/${selectedUser._id}`);

                    const updated = { ...clearedChats, [selectedUser._id]: Date.now() };
                    set({ messages: [], clearedChats: updated });
                    localStorage.setItem("clearedChats", JSON.stringify(updated));
                } catch (error) {
                    console.error("Error clearing chat:", error);
                }
            }
        },

        markMessagesAsSeen: async (senderId) => {
            const { messages } = get();
            const unseenMessages = messages.filter(msg => msg.senderId === senderId && msg.status !== "seen");

            if (unseenMessages.length === 0) return;

            const messageIds = unseenMessages.map(msg => msg._id);

            try {
                const res = await axiosInstance.put(`/messages/mark-seen`, { messageIds });

                if (res.status === 200) {
                    set({
                        messages: messages.map(msg =>
                            messageIds.includes(msg._id) ? { ...msg, status: "seen" } : msg
                        ),
                    });

                    const socket = useAuthStore.getState().socket;
                    const receiverId = useAuthStore.getState().authUser._id;

                    socket.emit("messagesSeen", { senderId, receiverId, messageIds });
                }
            } catch (error) {
                console.error("❌ Failed to mark messages as seen:", error.response?.data || error.message);
            }
        },

        subscribeToMessages: () => {
            const socket = useAuthStore.getState().socket;

            socket.on("newMessage", (newMessage) => {
                set((state) => {
                    const { selectedUser } = useChatStore.getState();
                    const { authUser } = useAuthStore.getState();

                    if (
                        (newMessage.senderId === selectedUser?._id && newMessage.receiverId === authUser._id) ||
                        (newMessage.senderId === authUser._id && newMessage.receiverId === selectedUser?._id)
                    ) {
                        return { messages: [...state.messages, newMessage] };
                    }

                    return state;
                });
            });

            socket.on("messageDeleted", (messageId) => {
                set((state) => ({ messages: state.messages.filter(msg => msg._id !== messageId) }));
            });

            socket.on("messageEdited", ({ messageId, newText }) => {
                set((state) => ({
                    messages: state.messages.map(msg =>
                        msg._id === messageId ? { ...msg, text: newText } : msg
                    ),
                }));
            });

            socket.on("messagesSeen", ({ messageIds }) => {
                console.log("🔹 Messages marked as seen:", messageIds);

                set((state) => ({
                    messages: state.messages.map(msg =>
                        messageIds.includes(msg._id) ? { ...msg, status: "seen" } : msg
                    ),
                }));
            });
        },

        unsubscribeFromMessages: () => {
            const socket = useAuthStore.getState().socket;
            socket.off("newMessage");
            socket.off("messageDeleted");
            socket.off("messageEdited");
            socket.off("messagesSeen");
        },

        setSelectedUser: (selectedUser) => set({ selectedUser }),

    }
    return store;

});

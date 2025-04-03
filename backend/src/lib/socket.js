import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

const userSocketMap = {};

export function getReceiverSocketId(userId) {
    return userSocketMap[userId] || null;
}

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("newMessage", ({ senderId, receiverId, message }) => {
        console.log("New message from:", senderId, "to:", receiverId);

        const receiverSocketId = getReceiverSocketId(receiverId);
        const senderSocketId = getReceiverSocketId(senderId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageReceived", { senderId, receiverId, message });
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageReceived", { senderId, receiverId, message });
        }
    });

    socket.on("messagesSeen", ({ senderId, receiverId, messageIds }) => {
        console.log(`🔹 Sending seen update to sender: ${senderId}`);

        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messagesSeen", { messageIds });
        }
    });

    socket.on("editMessage", ({ messageId, senderId, receiverId, newText }) => {
        console.log("Editing message:", messageId, "New Text:", newText);

        const receiverSocketId = getReceiverSocketId(receiverId);
        const senderSocketId = getReceiverSocketId(senderId);

        if (receiverSocketId) io.to(receiverSocketId).emit("messageEdited", { messageId, newText });
        if (senderSocketId) io.to(senderSocketId).emit("messageEdited", { messageId, newText });
    });

    socket.on("deleteMessage", ({ messageId, senderId, receiverId }) => {
        console.log("Deleting message:", messageId);

        const receiverSocketId = getReceiverSocketId(receiverId);
        const senderSocketId = getReceiverSocketId(senderId);

        if (receiverSocketId) io.to(receiverSocketId).emit("messageDeleted", messageId);
        if (senderSocketId) io.to(senderSocketId).emit("messageDeleted", messageId);
    });

    socket.on("typing", ({ senderId, receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", { senderId });
        }
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userStoppedTyping", { senderId });
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);

        if (userId && userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));

            for (const receiverId in userSocketMap) {
                const receiverSocketId = getReceiverSocketId(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("userStoppedTyping", { senderId: userId });
                }
            }
        }
    });
});

export { io, app, server };

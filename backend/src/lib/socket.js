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
        console.log("New message received from:", senderId);
        io.emit("messageReceived", { senderId, receiverId, message });
    });

    socket.on("editMessage", ({ messageId, newText }) => {
        console.log("Editing message:", messageId, "New Text:", newText);
        io.emit("messageEdited", { messageId, newText });
    });

    socket.on("deleteMessage", (messageId) => {
        console.log("Deleting message:", messageId);
        io.emit("messageDeleted", messageId);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);

        if (userId && userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

export { io, app, server };
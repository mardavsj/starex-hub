
import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();
    const { authUser, socket } = useAuthStore();

    const [typingTimeout, setTypingTimeout] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleTyping = (e) => {
        setText(e.target.value);

        if (!socket) return;

        socket.emit("typing", {
            senderId: authUser._id,
            receiverId: useChatStore.getState().selectedUser._id,
        });

        if (typingTimeout) clearTimeout(typingTimeout);

        setTypingTimeout(
            setTimeout(() => {
                socket.emit("stopTyping", {
                    senderId: authUser._id,
                    receiverId: useChatStore.getState().selectedUser._id,
                });
            }, 2000)
        );
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

            socket.emit("stopTyping", {
                senderId: authUser._id,
                receiverId: useChatStore.getState().selectedUser._id,
            });

        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="w-full bg-primary/15 z-10">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-base-300 sm:p-2 p-1">
                <button
                    type="button"
                    className={`sm:flex hidden btn btn-circle 
                     ${imagePreview ? "text-emerald-500" : "text-primary"}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Image size={22} />
                </button>

                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        className="w-full h-10 input input-sm sm:input-md focus:outline-none focus:border-none bg-transparent placeholder:text-base-content/60"
                        placeholder="Type a message..."
                        value={text}
                        onChange={handleTyping}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-circle z-10 bg-primary text-primary-content hover:bg-primary hover:scale-105"
                    disabled={!text.trim() && !imagePreview}
                >
                    <Send size={25} />
                </button>
            </form>
        </div>
    );
};
export default MessageInput;
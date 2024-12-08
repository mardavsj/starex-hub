import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser, setIsSidebarOpen } = useChatStore();
    const { onlineUsers } = useAuthStore();

    return (
        <div className="md:p-2.5 p-1.5 border-b border-base-300 sticky z-10 bg-base-100">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium">{selectedUser.fullName}</h3>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setSelectedUser(null);
                        setIsSidebarOpen(true);
                    }}
                    className="px-2"
                >
                    <X />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;

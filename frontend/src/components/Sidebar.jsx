import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { GraduationCap, BriefcaseBusiness, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
    const {
        getUsers, users, selectedUser, setSelectedUser,
        isUsersLoading, isSidebarOpen, setIsSidebarOpen, chatHistory, getChatHistory
    } = useChatStore();

    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState("myChats");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getUsers();
        getChatHistory();
    }, [getUsers, getChatHistory]);

    useEffect(() => {
        const socket = useAuthStore.getState().socket;

        socket.on("messageReceived", () => {
            getChatHistory();
        });

        return () => {
            socket.off("messageReceived");
        };
    }, [getChatHistory]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const filteredUsers = showOnlineOnly
        ? users.filter(user => onlineUsers.includes(user._id))
        : users;

    const myChats = filteredUsers.filter(user =>
        chatHistory?.some(chat => chat._id === user._id)
    );

    const displayedUsers = (activeTab === "myChats" ? myChats : filteredUsers).filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className={`h-full w-full lg:w-96 border-r border-base-content/30 flex flex-col transition-all duration-200 ${!isSidebarOpen ? "hidden" : ""}`}>
            <div className="border-b border-base-content/30 w-full flex items-center justify-between ">
                <div className="relative flex w-full">
                    <button
                        className={`flex-1 font-medium text-sm py-2 transition-colors relative ${activeTab === "myChats" ? "text-primary" : "text-base-content/40"
                            }`}
                        onClick={() => setActiveTab("myChats")}
                    >
                        My Chats
                    </button>
                    <button
                        className={`flex-1 font-medium text-sm py-2 transition-colors relative ${activeTab === "allContacts" ? "text-primary" : "text-base-content/40"
                            }`}
                        onClick={() => setActiveTab("allContacts")}
                    >
                        All Contacts
                    </button>

                    <div
                        className={`absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ${activeTab === "myChats" ? "left-0 w-1/2" : "left-1/2 w-1/2"
                            }`}
                    />
                </div>
            </div>

            <div className="border-b border-base-content/30 p-2 flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 size-4 text-base-content/80" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users by name..."
                        className="w-full pl-8 pr-3 py-1.5 text-sm focus:outline-none text-base-content placeholder:text-base-content/80 bg-transparent"
                    />
                </div>
                <label className="cursor-pointer flex items-center gap-1">
                    <input
                        type="checkbox"
                        checked={showOnlineOnly}
                        onChange={(e) => setShowOnlineOnly(e.target.checked)}
                        className="checkbox size-3.5 border-base-content/80"
                    />
                    <span className="text-sm text-base-content/80">Show online only</span>
                </label>
            </div>

            <div className="overflow-y-auto flex-1 w-full py-3">
                {displayedUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => handleUserSelect(user)}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-primary/20 transition-colors ${selectedUser?._id === user._id ? "bg-primary/20" : ""
                            }`}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.name}
                                className="size-12 object-cover rounded-full"
                            />
                            {onlineUsers.includes(user._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-gray-900" />
                            )}
                        </div>

                        <div className="flex-1 text-left min-w-0">
                            <div className="font-medium truncate flex items-center gap-2">
                                <span>{user.fullName}</span>
                                {user.role === "student" && <GraduationCap className="size-5 text-primary" />}
                                {user.role === "faculty" && <BriefcaseBusiness className="size-4 text-primary" />}
                            </div>
                            <div className={`text-sm ${onlineUsers.includes(user._id) ? "text-green-500" : "text-gray-400"}`}>
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {displayedUsers.length === 0 && (
                    <div className="text-center h-full flex flex-1 flex-col items-center justify-center">
                        <span>
                            {searchTerm
                                ? activeTab === "myChats"
                                    ? "No chat found!"
                                    : "No user found!"
                                : showOnlineOnly
                                    ? "No online users currently!"
                                    : activeTab === "myChats"
                                        ? "No chats yet!"
                                        : "No users found!"}
                        </span>
                        {activeTab === "myChats" && !searchTerm && !showOnlineOnly && (
                            <button
                                onClick={() => setActiveTab("allContacts")}
                                className="mt-2 px-10 py-2 text-primary bg-primary/20 rounded-md hover:bg-primary/30 transition"
                            >
                                Get Started
                            </button>
                        )}
                    </div>
                )}

            </div>
        </aside>
    );
};

export default Sidebar;
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

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const markMessagesAsSeenFor = async (userId) => {
        const { messages } = useChatStore.getState();
        const unseenIds = messages
            .filter(msg => msg.senderId === userId && msg.status !== "seen")
            .map(msg => msg._id);

        if (unseenIds.length > 0) {
            await fetch("/api/message/mark-seen", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messageIds: unseenIds }),
            });
        }
    };

    useEffect(() => {
        getUsers();
        getChatHistory();
    }, [getUsers, getChatHistory]);

    useEffect(() => {
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", () => {
            getChatHistory();
        });

        return () => {
            socket.off("newMessage");
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

    const enrichedUsers = users.map(user => {
        const chat = chatHistory?.find(c => c._id === user._id);
        return {
            ...user,
            unreadCount: chat?.unreadCount || 0,
            role: chat?.role || user.role,
        };
    });

    const filteredUsers = showOnlineOnly
        ? enrichedUsers.filter(user => onlineUsers.includes(user._id))
        : enrichedUsers;

    const myChats = filteredUsers.filter(user =>
        chatHistory?.some(chat => chat._id === user._id)
    );

    const displayedUsers = (activeTab === "myChats" ? myChats : filteredUsers).filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUserSelect = async (user) => {
        setSelectedUser(user);
        if (isMobile) {
            setIsSidebarOpen(false);
        }

        await markMessagesAsSeenFor(user._id);
        getChatHistory();
    };

    const handleImageClick = (src) => {
        setSelectedImage(src);
        setIsImageModalOpen(true);
    };

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <>
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
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 size-4 text-base-content/70" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users by name..."
                        className="w-full pl-8 pr-3 py-1.5 text-sm focus:outline-none text-base-content placeholder:text-base-content/70 bg-transparent"
                    />
                </div>
                <label className="cursor-pointer flex items-center gap-1">
                    <input
                        type="checkbox"
                        checked={showOnlineOnly}
                        onChange={(e) => setShowOnlineOnly(e.target.checked)}
                        className="checkbox size-3.5 border-base-content/70"
                    />
                    <span className="text-sm text-base-content/70">Show online only</span>
                </label>
            </div>

            <div className="overflow-y-auto flex-1 w-full">
                {displayedUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => handleUserSelect(user)}
                        className={`relative w-full p-3 flex items-center gap-2 hover:bg-primary/15 transition-colors ${selectedUser?._id === user._id ? "bg-primary/15" : ""
                            }`}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.name}
                                className="size-12 object-cover rounded-full cursor-pointer hover:scale-105 transition-transform"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageClick(user.profilePic || "/avatar.png")
                                }}
                            />
                            {onlineUsers.includes(user._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-1 ring-gray-900" />
                            )}
                        </div>

                        {user.unreadCount > 0 && (
                            <div className="absolute right-4 font-bold text-primary text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                                {user.unreadCount === 1
                                    ? "1 new message"
                                    : `${user.unreadCount > 99 ? "99+" : user.unreadCount} new messages`}
                            </div>
                        )}

                        <div className="flex-1 text-left min-w-0">
                            <div className="font-medium truncate flex items-center gap-2">
                                <span className={user.unreadCount > 0 ? "font-bold text-primary" : "font-normal"}>
                                    {user.fullName}
                                </span>
                                {user.role === "student" && <GraduationCap className="size-5 text-primary" />}
                                {user.role === "faculty" && <BriefcaseBusiness className="size-4 text-primary" />}
                            </div>
                            <div className={`text-sm ${onlineUsers.includes(user._id) ? "text-green-500" : "text-gray-400"}`}>
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>

                        <div className="absolute w-[90%] bottom-0 border-b border-base-content/5"></div>
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
            {isImageModalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <img
                        src={selectedImage}
                        alt="Full Profile"
                        className="md:size-96 size-60 object-cover rounded-xl border border-base-content/30 bg-black"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
    </>
    );
};

export default Sidebar;
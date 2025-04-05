import { useEffect, useRef, useState } from "react";
import { Trash2, Loader, Edit2, ChevronDown, Check, CheckCheck } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
    editMessage,
    markMessagesAsSeen,
  } = useChatStore();

  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);
  const dropdownRef = useRef(null);
  const editBoxRef = useRef(null);

  const [loadingMessages, setLoadingMessages] = useState({});
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [getMessages, selectedUser._id, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedUser?._id || !messages.length) return;

    const unseenMessages = messages.filter(
      (msg) => msg.senderId === selectedUser._id && msg.status !== "seen"
    );

    if (unseenMessages.length > 0) {
      markMessagesAsSeen(selectedUser._id);
    }
  }, [authUser._id, markMessagesAsSeen, messages, selectedUser._id, socket]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }

      if (
        editingMessage !== null &&
        editBoxRef.current &&
        !editBoxRef.current.contains(event.target)
      ) {
        setEditingMessage(null);
        setOpenDropdownId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingMessage]);

  useEffect(() => {
    if (!socket || !selectedUser?._id) return;

    socket.on("userTyping", ({ senderId }) => {
      if (senderId === selectedUser._id) {
        setTypingUser(senderId);
      }
    });

    socket.on("userStoppedTyping", ({ senderId }) => {
      if (senderId === selectedUser._id) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket, selectedUser]);

  const handleDeleteMessage = async (messageId) => {
    setLoadingMessages((prev) => ({ ...prev, [messageId]: true }));

    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }

    setLoadingMessages((prev) => ({ ...prev, [messageId]: false }));
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message._id);
    setEditText(message.text);
    setOpenDropdownId(null);
  };

  const handleSaveEdit = async (messageId) => {
    if (!editText.trim()) {
      setEditingMessage(null);
      return;
    }

    try {
      await editMessage(messageId, editText);
    } catch (error) {
      console.error("Failed to edit message:", error);
    }

    setEditingMessage(null);
  };

  const toggleDropdown = (messageId) => {
    setOpenDropdownId((prev) => (prev === messageId ? null : messageId));
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      {isMessagesLoading ? (
        <MessageSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto md:p-5 p-2">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`chat group ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className="chat-image hidden lg:block avatar">
                <div className="size-10 rounded-full">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              <div
                className={`chat-bubble py-0 px-3 rounded-2xl max-w-[80%] flex flex-col text-[14px] relative items-center justify-center
                  ${message.senderId === authUser._id ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"}
                `}
              >
                {message.image && (
                  <div className="grid">
                    <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md" />
                  </div>
                )}

                <div className="flex items-center gap-2 relative w-full">
                  {editingMessage === message._id ? (
                    <input
                      ref={editBoxRef}
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(message._id)}
                      onBlur={() => handleSaveEdit(message._id)}
                      className="w-full px-2 py-1 text-base-content rounded-md border border-gray-300 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <p onDoubleClick={() => handleEditMessage(message)}>{message.text}</p>
                  )}

                  <time className="md:text-[10px] text-[9px] opacity-50 whitespace-nowrap self-start">
                    {formatMessageTime(message.createdAt)}
                  </time>

                  {message.senderId === authUser._id && (
                    <div className="relative flex flex-col items-center">
                      <button onClick={() => toggleDropdown(message._id)} className="hover:scale-125 duration-200 ease-in-out">
                        <ChevronDown size={18} />
                      </button>

                      <span>{message.status === "seen" ? <CheckCheck size={14} /> : <Check size={14} />}</span>

                      {openDropdownId === message._id && (
                        <div ref={dropdownRef} className="absolute top-10 right-0 rounded-lg bg-base-200 p-2 grid sm:flex-row sm:w-60 w-44 z-10">
                          <button onClick={() => handleEditMessage(message)} className="flex text-base-content items-center space-x-2 hover:bg-primary/25 rounded-lg p-2">
                            <Edit2 size={18} />
                            <span>Edit message</span>
                          </button>

                          <button onClick={() => handleDeleteMessage(message._id)} className="text-red-500 flex items-center space-x-2 hover:bg-red-500/15 rounded-lg p-2">
                            {loadingMessages[message._id] ? <Loader size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            <span>Delete message</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {typingUser && <div className="text-sm text-primary font-semibold italic px-4 py-2 animate-pulse">{selectedUser.name} Typing...</div>}
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
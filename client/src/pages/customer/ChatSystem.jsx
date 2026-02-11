import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Send, User, MessageSquare, Clock, Check, CheckCheck, Users } from "lucide-react";
import { useLocation } from "react-router-dom";
import CustomerLayout from "../../layout/CustomerLayout";
import {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getSuppliersFromOrders,
} from "../../services/customerApiService";
import { useAuth } from "../../context/AuthContext";

const ChatSystem = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [showSuppliers, setShowSuppliers] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
    // Poll for new conversations every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handle supplier selected from navigation (e.g., from ProductDetails)
  useEffect(() => {
    if (location.state?.selectedSupplier) {
      setSelectedUser(location.state.selectedSupplier);
      // Clear the navigation state to prevent re-selection on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Poll for messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
      pollingInterval.current = setInterval(() => {
        fetchMessages(selectedUser._id);
      }, 5000); // Poll every 5 seconds for active chat
    } else {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
      setMessages([]);
    }

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [selectedUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const response = await getConversations();
      if (response.success) {
        setConversations(response.data);
        // If no conversations, fetch suppliers to start chatting
        if (response.data.length === 0) {
          fetchSuppliers();
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      setLoadingSuppliers(true);
      const response = await getSuppliersFromOrders();
      if (response.success) {
        setSuppliers(response.data);
        setShowSuppliers(true);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await getMessages(userId);
      if (response.success) {
        setMessages(response.data);
        // Mark as read if receiving messages
        // if (response.data.some((m) => !m.read && m.sender._id === userId)) {
        //   await markMessagesAsRead(userId);
        // }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      setSending(true);
      const messageData = {
        receiverId: selectedUser._id,
        content: newMessage,
      };

      const response = await sendMessage(messageData);
      if (response.success) {
        setMessages((prev) => [...prev, response.data]);
        setNewMessage("");
        // Update last message in conversations/reorder
        fetchConversations();
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message");
    } finally {
      setSending(false);
    }
  };

  const handleUserSelect = async (convUser) => {
    setSelectedUser(convUser);
    // Optimistically mark as read in UI or wait for next poll
    await markMessagesAsRead(convUser._id);
    fetchConversations(); // Update unread counts if we track them in list
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <CustomerLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-[#f0f2f5] dark:bg-[#111b21] overflow-hidden">
        <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full shadow-lg h-full">
          
          {/* Sidebar - Conversations List */}
          <div className={`w-full md:w-[30%] lg:w-[25%] bg-white dark:bg-[#111b21] border-r border-[#e9edef] dark:border-[#2a3942] flex flex-col ${selectedUser ? 'hidden md:flex' : ''}`}>
            
            {/* Sidebar Header */}
            <div className="h-[60px] px-4 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-between border-b border-[#e9edef] dark:border-[#2a3942] flex-shrink-0">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                    {/* User's own Avatar */}
                     <User size={24} className="text-gray-500 m-auto mt-2" />
                 </div>
                 <h2 className="text-base font-semibold text-[#111b21] dark:text-[#e9edef]">Chats</h2>
              </div>
              <div className="flex gap-4 text-[#54656f] dark:text-[#aebac1]">
                 <MessageSquare size={20} className="cursor-pointer" />
                 <Users size={20} className="cursor-pointer" />
              </div>
            </div>

            {/* Search Bar (Visual only for now) */}
            <div className="p-2 bg-white dark:bg-[#111b21] border-b border-[#e9edef] dark:border-[#2a3942]">
                 <div className="bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-4 py-1.5 flex items-center">
                     <div className="text-[#54656f] dark:text-[#aebac1] mr-4">
                         <svg viewBox="0 0 24 24" width="24" height="24" className=""><path fill="currentColor" d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.608 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"></path></svg>
                     </div>
                     <input 
                        type="text" 
                        placeholder="Search or start new chat" 
                        className="bg-transparent border-none outline-none text-sm w-full text-[#3b4a54] dark:text-[#e9edef] placeholder:text-[#54656f] dark:placeholder:text-[#aebac1]"
                     />
                 </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-4 text-center text-[#54656f] dark:text-[#aebac1]">Loading chats...</div>
              ) : conversations.length === 0 ? (
                // Show suppliers to start conversations
                <div className="bg-white dark:bg-[#111b21]">
                  {loadingSuppliers ? (
                    <div className="p-4 text-center text-[#54656f]">Loading suppliers...</div>
                  ) : suppliers.length === 0 ? (
                    <div className="p-8 text-center text-[#54656f] flex flex-col items-center">
                      <p>No conversations yet.</p>
                      <p className="text-sm mt-2">Order from suppliers to start chatting.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="px-4 py-3 text-[#008069] text-base font-medium">
                        START A NEW CHAT
                      </div>
                      {suppliers.map((supplier) => (
                        <div
                          key={supplier._id}
                          onClick={() => handleUserSelect(supplier)}
                          className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] transition-colors"
                        >
                          <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden">
                             {supplier.profilePictureUrl ? (
                               <img src={supplier.profilePictureUrl} alt={supplier.name} className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full bg-[#dfe5e7] dark:bg-[#6c7b85] flex items-center justify-center">
                                 <User size={24} className="text-white" />
                               </div>
                             )}
                          </div>
                          <div className="flex-1 min-w-0 border-b border-[#e9edef] dark:border-[#2a3942] pb-3">
                             <div className="flex justify-between items-baseline">
                               <h3 className="text-[17px] text-[#111b21] dark:text-[#e9edef] font-normal truncate">
                                 {supplier.name}
                               </h3>
                             </div>
                             <p className="text-[14px] text-[#54656f] dark:text-[#aebac1] truncate mt-1">
                               {supplier.orderCount} order{supplier.orderCount > 1 ? 's' : ''} • Last: {new Date(supplier.lastOrderDate).toLocaleDateString()}
                             </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.user._id}
                    onClick={() => handleUserSelect(conv.user)}
                    className={`flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] transition-colors group ${
                      selectedUser?._id === conv.user._id ? "bg-[#f0f2f5] dark:bg-[#2a3942]" : ""
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden relative">
                         {conv.user.profilePictureUrl ? (
                            <img src={conv.user.profilePictureUrl} alt={conv.user.name} className="w-full h-full object-cover" />
                         ) : (
                            <div className="w-full h-full bg-[#dfe5e7] dark:bg-[#6c7b85] flex items-center justify-center">
                                <User size={24} className="text-white" />
                            </div>
                         )}
                    </div>
                    <div className="flex-1 min-w-0 border-b border-[#e9edef] dark:border-[#2a3942] pb-3 group-hover:border-transparent">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-[17px] text-[#111b21] dark:text-[#e9edef] font-normal truncate">
                          {conv.user.name}
                        </h3>
                        <span className="text-[12px] text-[#54656f] dark:text-[#aebac1]">
                          {conv.lastMessage && formatTime(conv.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className={`text-[14px] truncate flex items-center gap-1 ${
                          conv.lastMessage && !conv.lastMessage.read && conv.lastMessage.receiver === user._id 
                          ? "font-semibold text-[#111b21] dark:text-[#e9edef]" 
                          : "text-[#54656f] dark:text-[#aebac1]"
                      }`}>
                         {conv.lastMessage ? (
                            <>
                                {conv.lastMessage.sender === user._id && (
                                   <span className="text-[#54656f] dark:text-[#aebac1]">
                                      {conv.lastMessage.read ? <CheckCheck size={16} className="text-[#53bdeb]"/> : <Check size={16}/>}
                                   </span>
                                )}
                                {conv.lastMessage.content}
                            </>
                         ) : "Draft"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col bg-[#efeae2] dark:bg-[#0b141a] relative ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none" 
                 style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}>
            </div>

            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="h-[60px] px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-[#e9edef] dark:border-[#2a3942] flex items-center gap-4 flex-shrink-0 z-10 w-full">
                  <button 
                      className="md:hidden p-1 text-[#54656f]"
                      onClick={() => setSelectedUser(null)}
                  >
                      <span className="text-xl">←</span>
                  </button>
                  <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
                    {selectedUser.profilePictureUrl ? (
                      <img src={selectedUser.profilePictureUrl} alt={selectedUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#dfe5e7] dark:bg-[#6c7b85] flex items-center justify-center">
                          <User size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 cursor-pointer">
                    <h3 className="text-[16px] text-[#111b21] dark:text-[#e9edef] font-medium leading-tight">
                      {selectedUser.name}
                    </h3>
                    <p className="text-[13px] text-[#54656f] dark:text-[#aebac1] mt-0.5">Online</p>
                  </div>
                  <div className="flex gap-4 text-[#54656f] dark:text-[#aebac1]">
                     <div className="p-2 cursor-pointer hover:bg-black/5 rounded-full"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.9l5.1 5.1 1.5-1.5-5-5.1zm-6.2 0c-2.6 0-4.7-2.1-4.7-4.7s2.1-4.7 4.7-4.7 4.7 2.1 4.7 4.7-2.1 4.7-4.7 4.7z"></path></svg></div>
                     <div className="p-2 cursor-pointer hover:bg-black/5 rounded-full"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path></svg></div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 z-0 custom-scrollbar flex flex-col gap-2">
                  {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-[#54656f] dark:text-[#aebac1] bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm mx-auto my-auto max-w-sm text-center">
                          <div className="mb-4 text-[#d1d7db]"><MessageSquare size={48} /></div>
                          <p className="font-medium mb-1">No messages here yet...</p>
                          <p className="text-sm">Send a message to start the conversation!</p>
                      </div>
                  ) : (
                      messages.map((msg, index) => {
                      const isOwn = msg.sender._id === user._id;
                      const showTime = index === 0 || new Date(msg.createdAt) - new Date(messages[index-1].createdAt) > 5 * 60 * 1000;

                      return (
                          <div key={msg._id} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                          {showTime && (
                             <div className="w-full flex justify-center my-3">
                                 <span className="text-[12px] text-[#54656f] dark:text-[#aebac1] bg-white dark:bg-[#111b21] px-3 py-1 rounded-lg shadow-sm uppercase tracking-wide">
                                     {new Date(msg.createdAt).toLocaleDateString() === new Date().toLocaleDateString() 
                                        ? "TODAY" 
                                        : new Date(msg.createdAt).toLocaleDateString()}
                                 </span>
                             </div>
                          )}
                          <div
                              className={`max-w-[85%] md:max-w-[65%] px-2 py-1.5 rounded-lg shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] relative text-[14.2px] leading-[19px] break-words ${
                              isOwn
                                  ? "bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-tr-none"
                                  : "bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-none"
                              }`}
                          >
                              {/* Message Tail SVG (Optional, complex to positioning perfectly without extra divs, skipping for simplicity but using rounded corners to mimic) */}
                              
                              <div className="px-1 pb-1">
                                  {msg.content}
                              </div>
                              
                              <div className={`flex justify-end items-center gap-1 float-right mt-1 ml-2 -mb-1`}>
                                  <span className={`text-[11px] ${isOwn ? "text-[#54656f] dark:text-[#8696a0]" : "text-[#54656f] dark:text-[#8696a0]"}`}>
                                      {formatTime(msg.createdAt)}
                                  </span>
                                  {isOwn && (
                                      <span className={msg.read ? "text-[#53bdeb]" : "text-[#8696a0]"}>
                                          {msg.read ? <CheckCheck size={15}/> : <Check size={15}/>}
                                      </span>
                                  )}
                              </div>
                          </div>
                          </div>
                      );
                      })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="min-h-[62px] px-4 py-2 bg-[#f0f2f5] dark:bg-[#202c33] border-t border-[#e9edef] dark:border-[#2a3942] flex items-end gap-2 z-10 w-full">
                  <button className="p-2 text-[#54656f] hover:text-[#111b21] dark:text-[#8696a0] dark:hover:text-[#aebac1] mb-1">
                      <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.062 0-6.123 6.25-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"></path></svg>
                  </button>
                  <button className="p-2 text-[#54656f] hover:text-[#111b21] dark:text-[#8696a0] dark:hover:text-[#aebac1] mb-1">
                      <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1.816 15.556v8.002c0 1.589 1.984 2.311 2.98 1.084l2.819-3.474a2.26 2.26 0 0 1 1.432-.88l1.396-.108c.705-.054 1.505.792 1.346 1.485-.658 2.872-3.662 6.592-3.37 8.356.551 3.328 6.64 4.07 9.35 1.378 1.957-1.944 2.122-8.311 2.535-11.649.337-2.723-1.637-2.348-1.508-3.09.11-1.002.329-2.029.329-3.136 0-3.111-2.924-6.427-8.918-6.191-4.994.197-8.39 3.037-8.39 8.223z"></path></svg>
                  </button>
                  <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full bg-white dark:bg-[#2a3942] text-[#111b21] dark:text-[#e9edef] px-4 py-2.5 rounded-lg border-none outline-none focus:ring-0 placeholder:text-[#54656f] dark:placeholder:text-[#aebac1] text-[15px]"
                    />
                    {newMessage.trim() || sending ? (
                        <button
                          type="submit"
                          disabled={!newMessage.trim() || sending}
                          className="p-3 text-[#54656f] hover:text-[#111b21] dark:text-[#8696a0] dark:hover:text-[#aebac1] transition-colors"
                        >
                          <Send size={20} />
                        </button>
                    ) : (
                        <button className="p-3 text-[#54656f] hover:text-[#111b21] dark:text-[#8696a0] dark:hover:text-[#aebac1]">
                           <span className="material-icons"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"></path></svg></span>
                        </button>
                    )}
                  </form>
                </div>
              </>
            ) : (
              <div className="hidden md:flex flex-col items-center justify-center h-full text-[#54656f] dark:text-[#aebac1] border-b-[6px] border-[#43d35c]">
                <div className="w-[80px] h-[80px] mb-4 text-[#e9edef] dark:text-[#2a3942]">
                   {/* WhatsApp-like welcome image SVG or placeholder */}
                   <svg viewBox="0 0 24 24" width="80" height="80"><path fill="currentColor" d="M16.036 19.59a1 1 0 0 1-.997.999h-9.032a1 1 0 0 1-.997-.999V5.01a1 1 0 0 1 .997-.999h9.032a1 1 0 0 1 .997.999v14.58zM14.013 1.002H6.995a3.003 3.003 0 0 0-3.002 3L4 20.61a3.003 3.003 0 0 0 2.999 3.001h10.002a3.003 3.003 0 0 0 2.999-3.001V4.002a3.003 3.003 0 0 0-3-3z"></path></svg>
                </div>
                <h3 className="text-[32px] font-light text-[#41525d] dark:text-[#e9edef] mb-3">ConnectingConstructions Web</h3>
                <p className="text-[14px] text-[#667781] dark:text-[#8696a0] max-w-[60%] text-center leading-5">
                   Send and receive messages without keeping your phone online.
                   <br/>Use ConnectingConstructions on up to 4 linked devices and 1 phone.
                </p>
                <div className="mt-8 text-[12px] text-[#8696a0] flex items-center gap-1">
                   <svg viewBox="0 0 24 24" width="13" height="13"><path fill="currentColor" d="M12 2.003c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.481 6.476 2.003 12 2.003z"></path></svg>
                   End-to-end encrypted
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ChatSystem;

import React, { useEffect, useState } from "react";
import StudySyncmsgPic from"../../../assets/images/landingpage/login.png"
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import defaultProfileImage from "../../../assets/images/defaultprofile.png"


const Chat = () => {
  const [selected, setSelected] = useState(null);
  const location = useLocation();
const user=useSelector(state=>state.auth.user)
    //  const propdata = JSON.parse(localStorage.getItem("user"))
    // console.log(propdata)
    // const {data,isLoading,error} = useQuery({ queryKey: ["next-chating user"], queryFn: () => GetUser(propdata) })
    // if(isLoading)return<Loader/>
    // const user=data?.data
  return (
    <div className="flex  sm:h-full  rounded-xl overflow-hidden shadow-sm border border-zinc-200">
      {/* Sidebar */}
      <div
        className={`w-full ${location.pathname.includes('chat') && 'md:block hidden'} md:w-1/3 bg-zinc-50  border-r border-zinc-200 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="px-5 md:block hidden py-4 border-b border-zinc-200 bg-white flex-shrink-0">
          <h2 className="text-lg font-semibold text-zinc-700">Messages</h2>
          <p className="text-xs text-zinc-500 mt-1">Your conversations</p>
        </div>

        {/* Chat List */}
        {user?.chats?.length==0&&<p className="text-sm font-medium text-gray-500 text-center mt-10">No Conversation yet<br/> START CHATING</p>}
        <div className="overflow-y-auto  flex-1">
          {user?.chats?.map((contact) => (
            <Link 
              to={`/messages/chat/${contact.chatId}`}
              key={contact.chatId}
              className="block"
            >
              <div 
                onClick={() => setSelected(contact.chatId)} 
                className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-200 border-b border-zinc-100
                  ${selected === contact.chatId 
                    ? "bg-blue-50 border-l-4 border-l-blue-400" 
                    : "hover:bg-white border-l-4 border-l-transparent"
                  }`}
              >
                <div className="relative">
                  <img 
                    src={contact.profilePic || defaultProfileImage} 
                    className="h-12 w-12 rounded-full object-cover border-2 border-zinc-200" 
                    alt={contact.name}
                  />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-700 truncate">{contact.name}</p>
                  <p className="text-sm text-zinc-500 truncate">{contact.lastMessage || "Start a conversation"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className={`flex-1 ${location.pathname.includes('chat') ? '' : 'md:block hidden'} overflow-hidden`}>
        {location.pathname === "/messages" ? (
          <div className="h-full flex flex-col items-center justify-center px-8 py-12 bg-gradient-to-br from-zinc-50 to-white overflow-y-auto">
            {/* Icon Container */}
            <div className="mb-2 relative">
              <div className="absolute  opacity-30"></div>
              <div className="relative ">
                <img 
                  src={StudySyncmsgPic} 
                  className="w-24 h-24 rounded-full bg-gray-300 object-cover"
                  alt="StudySync messaging"
                />
              </div>
            </div>

            {/* Brand */}
            <h1 className="text-2xl font-bold text-zinc-700 mb-2">
              <span className="text-[#005188] font-bold">StudySync</span> Messages
            </h1>
            
            {/* Description */}
            <div className="max-w-md text-center space-y-3 mb-8">
              <p className="text-zinc-600 text-xs leading-relaxed">
                Select a teacher from your list to start chatting. Send messages, 
                ask questions, and get instant responses in a secure environment.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Instant messaging</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>Real-time notifications</span>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-200">
              <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              <span>End-to-end encrypted</span>
            </div>
          </div>
        ) : (
          user && <Outlet />
        )}
      </div>
    </div>
  );
};

export default Chat;
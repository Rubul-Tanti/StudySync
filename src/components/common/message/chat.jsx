import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import api from '../../../utils/axios'
import { Link, useParams } from 'react-router-dom'
import Loader from '../../loader'
import { FiSend } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { useSocket } from '../../../../soket'
import GetUser from '../../../services/get-user'
import chatbg from "../../../../public/chatbg.jpg"
import { MdArrowBack } from 'react-icons/md'
const fetchChats = async (id) => {
  const { data } = await api.get(`/v1/chats/${id}`)
  return data
}

const Message = () => {
  const { id } = useParams()
  const Authobj = useSelector(state => state.auth)
 

const user =Authobj.user
  const teacher = user?.chats?.find(item => item.chatId === id)
  const propdata = { id: teacher.id, role: user.role === "student" ? "teacher" : "student" }
  const Nextuser = useQuery({ queryKey: ["next-chating user"], queryFn: () => GetUser(propdata) })
  const socket = useSocket()
  const messagesEndRef = useRef(null)
const containerRef=useRef()
  const { data, isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => fetchChats(id),
  })

  const [chat, setChat] = useState([])
  const [text, setText] = useState('')
  const [senderId, setSenderId] = useState(null)

  useEffect(() => {
    if (data?.data?.messages) {
      setChat(data.data.messages)
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
    }
  }, [data])
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;


},[chat])

  useEffect(() => {
    if (!socket) return

    const handleReceive = (props) => {
      setChat(prev => [...prev, props.newChat])
      setSenderId(props.senderSocketId)
    }

    socket.on("receiveMessage", handleReceive)
    return () => {
      socket.off("receiveMessage", handleReceive)
    }
  }, [socket])

  const handleSend = () => {
    if (!text.trim()) return

    socket.emit("sendMessage", {
      senderUserId: user._id,
      senderSocketId: socket.id,
      receiverUserId: teacher.id,
      receiverSocketId: senderId,
      chatId: id,
      message: text,
      type: "text",
      userRole: user.role === "student" ? "teacher" : "student",
    })

    setChat(prev => [...prev, {
      sender: user._id,
      text,
      type: "text",
      createdAt: new Date().toISOString(),
    }])

    setText('')
  }

  if (isLoading || Nextuser.isLoading) return <Loader />
  if(Authobj.loading){return<Loader/>}
  return (
    <div style={{ backgroundImage: `url(${chatbg})`,backgroundSize: "contain",
    backgroundPosition: "center", }} className=" h-[calc(100vh-64px)] w-full relative flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white  border-b  border-zinc-200 shadow-sm">
    
        <div className="flex items-center justify-between p-4">
          
          <div className="flex items-center gap-3">
                <Link to={'/messages'}>
            <MdArrowBack className='' size={25}/>
            </Link> 
            <div className="relative">
              <img 
                src={teacher?.profilePic} 
                className='h-11 w-11 rounded-full object-cover border-2 border-zinc-200' 
                alt="teacher"
              />
              {Nextuser.data?.data?.online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-zinc-700 text-base">{teacher?.name}</h2>
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${Nextuser.data?.data?.online ? 'bg-green-400' : 'bg-zinc-400'}`}></div>
                <p className="text-xs text-zinc-500">
                  {Nextuser.data?.data?.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Messages */}
      <div  ref={containerRef}  className=" overflow-y-auto    p-2 md:p-6 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
        <div className='h-full'>{chat.map((msg, idx) => {
          const isOwn = msg.sender === user._id;
          const showAvatar = idx === 0 || chat[idx - 1].sender !== msg.sender;
          
          return (
            <div
              key={idx}
              className={`flex ${isOwn ? "justify-end" : "justify-start"} items-end gap-2 animate-slideIn`}
            >
           
              
              <div className={`max-w-[75%] md:max-w-[60%] group ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                <div className={`px-3.5 py-2.5 rounded-2xl shadow-sm transition-all ${
                  !isOwn 
                    ? "bg-black text-zinc-300 rounded-bl-md" 
                    : " bg-zinc-300 text-black rounded-br-md border border-zinc-200"
                }`}>
                  <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                </div>
                
                <div className={`flex items-center gap-1.5 mt-1 px-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                  <p className="text-xs text-zinc-700">
                    {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  {isOwn && (
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  )}
                </div>
              </div>
              
          
            </div>
          );
        })}
        </div>
        <div ref={messagesEndRef}/>
          
      </div>

      {/* Input */}
    <div className="bg-transparent  absolute bottom-5  w-full ">
        <div className="flex items-end gap-2 max-w-2xl mx-auto">
          <div className="flex-1 flex items-center gap-2 bg-zinc-800 border border-zinc-200 rounded-full px-4 py-2 transition-all">
            <button className="flex-shrink-0 p-1.5 hover:bg-zinc-200 rounded-full transition-colors">
              <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <textarea
              value={text}
              placeholder="Type a message..."
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 bg-transparent text-zinc-300 placeholder-zinc-400 outline-none resize-none text-sm"
              rows="1"
              style={{
                minHeight: '24px',
                maxHeight: '120px',
                fieldSizing: 'content'
              }}
            />
            
            {/* <button className="flex-shrink-0 p-1.5 hover:bg-zinc-200 rounded-full transition-colors">
              <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button> */}
                <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="flex-shrink-0 bg-[#005188] hover:bg-[#005188] text-white p-3 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#005188] shadow-sm hover:shadow-md transform active:scale-95"
          >
            <FiSend className="w-4 h-4" />
          </button>
          </div>
          
      
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d4d4d8;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #a1a1aa;
        }
      `}</style>
    </div>
  )
}

export default Message
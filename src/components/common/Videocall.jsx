import React, { useState, useRef, useEffect } from "react";
import { FiVideo, FiVideoOff, FiMic, FiMicOff, FiMonitor, FiSend } from "react-icons/fi";
import { GrEmoji } from "react-icons/gr";
import { MdCallEnd } from "react-icons/md";
import { toast } from "react-toastify";
import { Room } from "livekit-client";
import api from "../../utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../loader";
import DigitalQuran from "../digitalQuran";
import { MdChat } from "react-icons/md";

const Videocall = () => {
  const user=useSelector(state=>state.auth.user)
  const {videoRoom}=useParams()
const navigate=useNavigate()

  const localVideoRef = useRef(null);
  const remoteVideosContainerRef = useRef(null);
  const roomRef = useRef(null);
  const [chatOn,setchatOn]=useState(false)
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [screenShare, setShareScreen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [remoteParticipants, setRemoteParticipants] = useState(new Map());
  const roomName =videoRoom


  // Connect to LiveKit
  useEffect(() => {
    let lkRoom = null;
    const connectToRoom = async () => {
      try {
        setConnectionStatus("Connecting...");
        if(user){ 
          const identity=user._id
        console.log("Requesting token for room:", roomName, "identity:", identity);
        
        const res = await api.post(`/v1/livekit/token`, { identity, roomName,role:user.role });
        const { token, url } = res.data;
        
        console.log("Token received, connecting to:", url);
        
        lkRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: {
            resolution: { width: 1280, height: 720 }
          }
        });

        roomRef.current = lkRoom;

        // Set up all event listeners BEFORE connecting
        lkRoom.on('connected', () => {
          console.log('Successfully connected to room');
          setConnectionStatus("Connected");
          toast.success("Connected to video call");
        });

        lkRoom.on('disconnected', () => {
          console.log("Disconnected from room");
          setConnectionStatus("Disconnected");
          setRemoteParticipants(new Map());
        });

        lkRoom.on('participantConnected', (participant) => {
          console.log("Participant connected:", participant.identity);
          toast.info(`${participant.identity} joined the call`);
          setRemoteParticipants(prev => new Map(prev).set(participant.sid, {
            identity: participant.identity,
            sid: participant.sid
          }));
        });

        lkRoom.on('participantDisconnected', (participant) => {
          console.log("Participant disconnected:", participant.identity);
          toast.info(`${participant.identity} left the call`);
          setRemoteParticipants(prev => {
            const next = new Map(prev);
            next.delete(participant.sid);
            return next;
          });
          
          // Clean up video elements
          const container = remoteVideosContainerRef.current;
          if (container) {
            const elements = container.querySelectorAll(`[data-participant="${participant.sid}"]`);
            elements.forEach(el => el.remove());
          }
        });

        lkRoom.on('trackSubscribed', (track, publication, participant) => {
          console.log("Track subscribed:", track.kind, "from", participant.identity);
          attachTrack(track, participant);
        });

        lkRoom.on('trackUnsubscribed', (track, publication, participant) => {
          console.log("Track unsubscribed:", track.kind, "from", participant.identity);
          const container = remoteVideosContainerRef.current;
          if (container) {
            const elements = container.querySelectorAll(`[data-participant="${participant.sid}"][data-track-kind="${track.kind}"]`);
            elements.forEach(el => el.remove());
          }
        });

        lkRoom.on('dataReceived', (payload, participant) => {
          try {
            const decoder = new TextDecoder();
            const messageData = JSON.parse(decoder.decode(payload));
            console.log("Message received from:", participant?.identity);
            setChatMessages((prev) => [...prev, messageData]);
          } catch (err) {
            console.error("Error parsing message:", err);
          }
        });

        // Connect to the room
        await lkRoom.connect(url, token);
        console.log("Connected to room");

        // Enable local camera and microphone
        try {
          await lkRoom.localParticipant.setCameraEnabled(true);
          await lkRoom.localParticipant.setMicrophoneEnabled(true);
          
          // Attach local video
          setTimeout(() => {
            const videoPublication = Array.from(lkRoom.localParticipant.videoTrackPublications.values())[0];
            if (videoPublication?.track && localVideoRef.current) {
              const videoElement = videoPublication.track.attach();
              videoElement.style.width = '100%';
              videoElement.style.height = '100%';
              videoElement.style.objectFit = 'cover';
              localVideoRef.current.innerHTML = '';
              localVideoRef.current.appendChild(videoElement);
            }
          }, 500);
          
          console.log("Local tracks enabled");
        } catch (trackError) {
          console.error("Error enabling local tracks:", trackError);
          setConnectionStatus("Connected (No Camera/Mic)");
          toast.warning("Could not enable camera/microphone. Check permissions.");
        }

        // Handle tracks from participants who joined before us
        lkRoom.remoteParticipants.forEach((participant) => {
          participant.trackPublications.forEach((publication) => {
            if (publication.isSubscribed && publication.track) {
              attachTrack(publication.track, participant);
            }
          });
        });
      }
      } catch (err) {
        console.error("Error connecting to LiveKit:", err);
        setConnectionStatus("Connection Failed");
        toast.error("Failed to connect to video call");
      }
    };

    const attachTrack = (track, participant) => {
      const container = remoteVideosContainerRef.current;
      if (!container) return;

      if (track.kind === 'video') {
        // Remove existing video for this participant
        const existing = container.querySelector(`[data-participant="${participant.sid}"][data-track-kind="video"]`);
        if (existing) existing.remove();

        const videoElement = track.attach();
        videoElement.setAttribute('data-participant', participant.sid);
        videoElement.setAttribute('data-track-kind', 'video');
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover';
        videoElement.style.position = 'absolute';
        videoElement.style.top = '0';
        videoElement.style.left = '0';
        
        container.appendChild(videoElement);
      } else if (track.kind === 'audio') {
        // Remove existing audio for this participant
        const existing = container.querySelector(`[data-participant="${participant.sid}"][data-track-kind="audio"]`);
        if (existing) existing.remove();

        const audioElement = track.attach();
        audioElement.setAttribute('data-participant', participant.sid);
        audioElement.setAttribute('data-track-kind', 'audio');
        container.appendChild(audioElement);
      }
    };

    connectToRoom();

    return () => {
      if (lkRoom) {
        console.log("Cleaning up and disconnecting");
        lkRoom.disconnect();
      }
    };
  }, [videoRoom]);

  // Mic toggle
  const toggleMic = async () => {
    if (!roomRef.current) return;
    
    try {
      const newState = !micOn;
      await roomRef.current.localParticipant.setMicrophoneEnabled(newState);
      setMicOn(newState);
      toast.info(newState ? "Microphone unmuted" : "Microphone muted");
    } catch (err) {
      console.error("Error toggling microphone:", err);
      toast.error("Failed to toggle microphone");
    }
  };

  // Camera toggle
  const toggleCamera = async () => {
    if (!roomRef.current) return;
    
    try {
      const newState = !cameraOn;
      await roomRef.current.localParticipant.setCameraEnabled(newState);
      setCameraOn(newState);
      toast.info(newState ? "Camera turned on" : "Camera turned off");
    } catch (err) {
      console.error("Error toggling camera:", err);
      toast.error("Failed to toggle camera");
    }
  };

  // Screen share
  const toggleScreenShare = async () => {
    if (!roomRef.current) return;
    
    try {
      const newState = !screenShare;
      await roomRef.current.localParticipant.setScreenShareEnabled(newState);
      setShareScreen(newState);
      toast.success(newState ? "Screen sharing started" : "Screen sharing stopped");
    } catch (err) {
      console.error("Error toggling screen share:", err);
      toast.error("Failed to toggle screen share: " + err.message);
    }
  };

  // End call
  const endCall = () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      if(user.role==='teacher'){
        api.post('/v1/class-session-complete',videoRoom)
      }
      setConnectionStatus("Call Ended");
      toast.info("Call ended");
      navigate('/dashboard',{replace:true})
    }
  };

  // Send chat message
  const sendMessage = () => {
    if (!message.trim() || !roomRef.current) return;
    
    const newMessage = {
      text: message,
      sender: identity,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    try {
      const encoder = new TextEncoder();
      roomRef.current.localParticipant.publishData(
        encoder.encode(JSON.stringify(newMessage)), 
        { reliable: true }
      );
      
      setChatMessages((prev) => [...prev, newMessage]);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
    }
  };
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden relative items-center">
      {/* Main video + participants */}
      <div className="bg-zinc-50 p-1  sm:p-3 md:p-5 flex flex-1 flex-col md:flex-row gap-5 w-full md:w-[80%] h-[80vh] md:h-screen">
        
        {/* Video Section */}
        <div className="relative  w-full  h-[50vh] md:h-full">
          {/* Connection status */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded z-50 text-xs sm:text-sm">
            {connectionStatus}
          </div>

          {/* Controls */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 items-center justify-evenly px-1 sm:px-2 w-full  flex flex-row gap-2 lg:gap-5 ">
            <div className=" bg-zinc-950  max-h-14 items-center p-1 sm:p-2 flex flex-row flex-nowrap justify-center gap-1 sm:gap-3 rounded-full">
            {micOn ? (
              <FiMic
            
                onClick={toggleMic}
                className="text-white cursor-pointer bg-zinc-800 h-8 w-8 lg:h-9 lg:w-9 rounded-full p-2"
              />
            ) : (
              <FiMicOff
                size={22}
                onClick={toggleMic}
                className="text-white cursor-pointer bg-red-600 h-8 w-8 lg:h-9 lg:w-9 rounded-full p-2"
              />
            )}
            {cameraOn ? (
              <FiVideo
                onClick={toggleCamera}
                size={22}
                className="text-white cursor-pointer bg-zinc-800 h-8 w-8 lg:h-9 lg:w-9 rounded-full p-2"
              />
            ) : (
              <FiVideoOff
                onClick={toggleCamera}
                size={22}
                className="text-white cursor-pointer bg-red-600 h-8 w-8 lg:h-9 lg:w-9 rounded-full p-2"
              />
            )}
            <FiMonitor
              onClick={toggleScreenShare}
              size={22}
              className={`text-white cursor-pointer h-8 w-8 lg:h-9 lg:w-9 rounded-full p-2 ${
                screenShare ? "bg-[#005188]" : "bg-zinc-800"
              }`}
            />
            <MdChat
              onClick={()=>setchatOn(!chatOn)}
              size={22}
              className={`text-white cursor-pointer h-8 w-8 lg:h-9 lg:w-9 rounded-full p-2 ${
                chatOn ? "bg-[#005188]" : "bg-zinc-800"
              }`}
            />

         
            <MdCallEnd
              onClick={endCall}
              size={22}
              className="text-white cursor-pointer bg-red-800 h-8 w-8 lg:h-9 lg:w-9 rounded-full p-2"
            />
          </div>
              <div className=" flex justify-end w-1/2">
          <div className="w-24 h-24 sm:w-28 sm:h-28  rounded-xl bg-zinc-900 relative overflow-hidden">
            <div
              ref={localVideoRef}
              className="w-full h-full"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-[10px] sm:text-xs">
              You {!cameraOn && "(Camera Off)"}
            </div>
          </div>
          </div>
          </div>

          {/* Remote video container - Changed from <video> to <div> */}
          <div
            ref={remoteVideosContainerRef}
            className="w-full h-full rounded-xl  bg-gray-200 relative overflow-hidden"
          >
            {remoteParticipants.size === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                Waiting for others to join...
              </div>
            )}
          </div>
      
        </div>

      
      </div>

      <div className={`absolute right-[5%] z-50 ${chatOn?"transhlate-y-0":"translate-y-[140%]"} transition-all duration-300 ease-in-out bottom-20`}>
     <div className="w-[300px] h-[40vh] md:h-[70vh] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-200">
  {/* Header */}
  <div className="h-12 px-4 flex items-center bg-gradient-to-r from-[#005188] to-[#005188] text-white">
    <h3 className="font-semibold text-sm">Chat</h3>
  </div> 

  {/* Messages */}
  <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
    {chatMessages.length === 0 ? (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400 text-xs">No messages yet</p>
      </div>
    ) : (
      chatMessages.map((msg, index) => (
        <div key={index} className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-700">{msg.sender}</span>
          <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-800">{msg.text}</p>
          </div>
          <span className="text-xs text-gray-400">{msg.timestamp}</span>
        </div>
      ))
    )}
  </div> 

  {/* Input */}
  <div className="p-3 bg-white border-t border-gray-200">
    <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2 border border-gray-200 focus-within:border-[#005188] transition">
      <input
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <button 
        onClick={sendMessage}
        className="flex items-center justify-center h-8 w-8 bg-[#005188] hover:bg-[#005188] rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!message.trim()}
      >
        <FiSend className="text-white h-4 w-4" />
      </button>
    </div>
  </div>
</div>
      </div>

      {/* Chat panel */}
  
    </div>
  );
};

export default Videocall;
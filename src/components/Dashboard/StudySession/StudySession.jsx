import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaVideo, FaMicrophone, FaFile, FaPaperPlane, FaUsers, 
  FaArrowLeft, FaVideoSlash, FaMicrophoneSlash, FaShareSquare,
  FaDownload, FaEllipsisV, FaCrown, FaUserTimes, FaSignOutAlt, FaUserShield, FaStop
} from 'react-icons/fa';
import styles from './StudySession.module.css';
import VoiceChat from './VoiceChat';
import { toast } from 'react-hot-toast';

const StudySession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionData, setSessionData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isHost, setIsHost] = useState(true);
  const [showMenu, setShowMenu] = useState(null);
  const chatContainerRef = useRef(null);
  const menuRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        const userData = JSON.parse(userString);
        setUser(userData);
        
        // First, check if user is host from backend
        const hostCheckResponse = await fetch(`http://localhost:5001/api/sessions/${sessionId}/check-host`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const hostData = await hostCheckResponse.json();
        
        if (!hostData.success) {
          throw new Error('Failed to verify host status');
        }
        
        setIsHost(hostData.isHost);
        console.log('Is Host:', hostData.isHost);
        
        // Then fetch session data
        const response = await fetch(`http://localhost:5001/api/sessions/${sessionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setSessionData(data.data);
          
          // Map participants and mark the host
          const participantsData = data.data.participants.map(participant => ({
            _id: participant._id,
            name: participant.name || 'Anonymous',
            email: participant.email,
            isHost: participant._id === data.data.host,
            isMuted: false,
            isActive: true
          }));
          
          setParticipants(participantsData);
          console.log('Session Data:', data.data);
          console.log('Participants:', participantsData);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load session data');
      }
    };

    fetchSessionData();
  }, [sessionId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Add dummy participants with muted by default
  // useEffect(() => {
  //   const dummyParticipants = [
  //     {
  //       _id: 'host123',
  //       name: 'You',
  //       isHost: true,
  //       isMuted: true, // Host muted by default
  //       isActive: true
  //     },
  //     {
  //       _id: 'p1',
  //       name: 'Rajesh Kumar',
  //       isHost: false,
  //       isMuted: true, // Muted by default
  //       isActive: true
  //     },
  //     {
  //       _id: 'p2',
  //       name: 'Priya Sharma',
  //       isHost: false,
  //       isMuted: true, // Muted by default
  //       isActive: true
  //     },
  //     {
  //       _id: 'p3',
  //       name: 'Amit Patel',
  //       isHost: false,
  //       isMuted: true, // Muted by default
  //       isActive: true
  //     }
  //   ];

  //   setParticipants(dummyParticipants);
  //   setIsHost(true);
  // }, []);

  // When a new participant joins, they should be muted by default
  const addNewParticipant = (participant) => {
    setParticipants(prev => [...prev, {
      ...participant,
      isMuted: true, // New participants are muted by default
      isActive: true
    }]);
  };

  const handleParticipantAction = (participantId, action) => {
    const targetParticipant = participants.find(p => p._id === participantId);
    if (targetParticipant.isHost) return;

    setParticipants(prev => prev.map(p => {
      if (p._id === participantId && !p.isHost) {
        switch (action) {
          case 'kick':
            return { ...p, isActive: false };
          case 'mute':
            return { ...p, isMuted: true };
          case 'unmute':
            return { ...p, isMuted: false };
          default:
            return p;
        }
      }
      return p;
    }));
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toISOString()
      }]);
      setNewMessage('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file);
      // Add file to messages
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'You',
        content: `Shared file: ${file.name}`,
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        isFile: true,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const renderParticipantInfo = (participant) => {
    if (!participant) return null;
    
    return (
      <div className={styles.participantInfo}>
        <div className={styles.participantAvatar}>
          {participant.name ? participant.name[0].toUpperCase() : 'A'}
        </div>
        <div className={styles.participantDetails}>
          <span className={styles.participantName}>
            {participant.name}
            {participant.isHost && (
              <span className={styles.hostBadge}>
                <FaCrown /> Host
              </span>
            )}
            {participant._id === user?._id && (
              <span className={styles.selfBadge}>
                (You)
              </span>
            )}
          </span>
        </div>
      </div>
    );
  };

  const renderParticipantControls = (participant) => {
    // Don't show any controls if:
    // 1. Current user is not host (checked from backend)
    // 2. The participant is the host
    // 3. The participant is the current user
    if (!isHost || participant.isHost || participant._id === user?._id) {
      return null;
    }

    return (
      <div className={styles.participantControls}>
        <button 
          className={styles.controlButton}
          onClick={() => handleParticipantAction(participant._id, 'kick')}
          title="Remove participant"
        >
          <FaUserTimes />
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (socket) {
      socket.on('participantJoined', (newParticipant) => {
        // Ensure new participant is muted by default
        addNewParticipant({
          ...newParticipant,
          isMuted: true
        });
      });

      // ... other socket event handlers ...

      return () => {
        socket.off('participantJoined');
        // ... cleanup other listeners ...
      };
    }
  }, [socket]);

  const handleStopSession = async () => {
    if (window.confirm('Are you sure you want to stop this study session? This will end the session for all participants.')) {
      try {
        const token = localStorage.getItem('token');
        console.log('Stopping session:', sessionId); // Debug log

        const response = await fetch(`http://localhost:5001/api/sessions/${sessionId}/stop`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('Stop session response:', data); // Debug log
        
        if (data.success) {
          toast.success('Session ended successfully');
          
          // Clean up socket connection if it exists
          if (socket) {
            socket.emit('sessionStopped', {
              sessionId,
              message: 'The host has ended this session'
            });
            socket.disconnect();
          }

          // Force navigation to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          toast.error(data.message || 'Failed to stop session');
        }
      } catch (error) {
        console.error('Error stopping session:', error);
        toast.error('Failed to stop session');
      }
    }
  };

  // Update socket listener for session stopped
  useEffect(() => {
    if (socket) {
      socket.on('sessionStopped', (data) => {
        toast.info(data.message);
        // Cleanup and force navigation
        socket.disconnect();
        window.location.href = '/dashboard';
      });

      return () => {
        socket.off('sessionStopped');
      };
    }
  }, [socket]);

  const handleLeaveSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/sessions/${sessionId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?._id
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Left session successfully');
        
        // Emit socket event if socket exists
        if (socket) {
          socket.emit('participantLeft', {
            sessionId,
            userId: user?._id,
            name: user?.name
          });
          socket.disconnect();
        }

        // Navigate back to dashboard
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Failed to leave session');
      }
    } catch (error) {
      console.error('Error leaving session:', error);
      toast.error('Failed to leave session');
    }
  };

  // Add confirmation dialog
  const handleConfirmLeave = () => {
    if (window.confirm('Are you sure you want to leave this session?')) {
      handleLeaveSession();
    }
  };

  return (
    <div className={styles.studySessionContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
            <FaArrowLeft />
          </button>
          <h1>{sessionData?.title || 'Study Session'}</h1>
        </div>
        
        <div className={styles.headerCenter}>
          {isHost && (
            <button 
              className={styles.stopSessionButton}
              onClick={handleStopSession}
              title="End session for all participants"
            >
              <FaStop /> Stop Session
            </button>
          )}
        </div>

        <div className={styles.headerRight}>
          {!isHost && (
            <button 
              className={styles.leaveSessionButton}
              onClick={handleConfirmLeave}
              title="Leave this session"
            >
              <FaSignOutAlt /> Leave Session
            </button>
          )}
          <motion.button
            className={styles.participantsButton}
            onClick={() => setShowParticipants(!showParticipants)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUsers /> {participants.length}
          </motion.button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.mediaSection}>
          <div className={styles.videoGrid}>
            {participants.map((participant, index) => (
              <div key={index} className={styles.videoContainer}>
                <div className={styles.videoPlaceholder}>
                  <div className={styles.participantInitial}>
                    {participant.name?.charAt(0)}
                  </div>
                  <span>{participant.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.controls}>
            <motion.button
              className={`${styles.controlButton} ${!isVideoOn && styles.off}`}
              onClick={() => setIsVideoOn(!isVideoOn)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isVideoOn ? <FaVideo /> : <FaVideoSlash />}
            </motion.button>
            <label className={styles.fileUploadButton}>
              <FaShareSquare />
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
            <motion.button
              className={styles.controlButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEllipsisV />
            </motion.button>
            <VoiceChat 
              sessionId={sessionId}
              userId={localStorage.getItem('user')?._id}
              participants={participants}
            />
          </div>
        </div>

        <div className={styles.chatSection}>
          <div className={styles.chatMessages} ref={chatContainerRef}>
            {messages.map(message => (
              <motion.div
                key={message.id}
                className={styles.message}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.messageHeader}>
                  <span className={styles.sender}>{message.sender}</span>
                  <span className={styles.timestamp}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {message.isFile ? (
                  <div className={styles.fileMessage}>
                    <FaFile className={styles.fileIcon} />
                    <span>{message.fileName}</span>
                    <motion.button
                      className={styles.downloadButton}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(message.fileUrl)}
                    >
                      <FaDownload />
                    </motion.button>
                  </div>
                ) : (
                  <p className={styles.messageContent}>{message.content}</p>
                )}
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className={styles.chatInput}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPaperPlane />
            </motion.button>
          </form>
        </div>

        {showParticipants && (
          <div className={styles.participantsList}>
            <div className={styles.participantsHeader}>
              <h3>Participants ({participants.filter(p => p.isActive).length})</h3>
            </div>
            {participants
              .filter(p => p.isActive)
              .map(participant => (
                <div key={participant._id} className={styles.participantItem}>
                  <div className={styles.participantInfo}>
                    <div className={styles.participantAvatar}>
                      {participant.name[0].toUpperCase()}
                    </div>
                    <div className={styles.participantDetails}>
                      <span className={styles.participantName}>
                        {participant.name}
                        {participant.isHost && (
                          <span className={`${styles.badge} ${styles.hostBadge}`}>
                            <FaCrown /> Host
                          </span>
                        )}
                        {participant._id === user?._id && (
                          <span className={styles.selfBadge}>
                            (You)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Only render controls if backend confirms user is host */}
                  {renderParticipantControls(participant)}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySession; 
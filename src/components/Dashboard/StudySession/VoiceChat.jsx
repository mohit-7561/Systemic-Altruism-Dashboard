import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import styles from './VoiceChat.module.css';

const VoiceChat = ({ sessionId, userId, participants }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const localStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  const initializeMicrophone = async () => {
    try {
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted!');
      
      localStreamRef.current = stream;
      setHasPermission(true);
      setIsInitialized(true);
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      stream.getAudioTracks().forEach(track => {
        track.enabled = true;
        console.log('Audio track initialized:', track.label);
      });

      startAudioLevelMonitoring();
      setIsMuted(false);
      console.log('Audio setup complete');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setHasPermission(false);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const startAudioLevelMonitoring = () => {
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateAudioLevel = () => {
      if (!isMuted && analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average);
      }
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };
    
    updateAudioLevel();
  };

  const toggleMute = async () => {
    if (!isInitialized) {
      await initializeMicrophone();
    } else {
      const tracks = localStreamRef.current.getAudioTracks();
      tracks.forEach(track => {
        track.enabled = isMuted;
        console.log(`Microphone ${isMuted ? 'unmuted - others can hear you' : 'muted - others cannot hear you'}`);
      });
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('Audio track stopped:', track.label);
        });
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setIsMuted(true);
      console.log('Voice chat cleanup complete');
    };
  }, []);

  return (
    <div className={styles.voiceChatContainer}>
      <motion.button
        className={`${styles.controlButton} ${isMuted ? styles.off : ''}`}
        onClick={toggleMute}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isMuted ? "Click to unmute" : "Click to mute"}
      >
        {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </motion.button>
      {!isMuted && hasPermission && (
        <div className={styles.audioIndicator}>
          <div 
            className={styles.audioLevel} 
            style={{ height: `${Math.min(audioLevel, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default VoiceChat; 
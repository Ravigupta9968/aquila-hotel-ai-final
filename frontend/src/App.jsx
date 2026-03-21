import 'regenerator-runtime/runtime';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import Login from './components/Login';
import { Menu, Radio, Hotel, Mic, MicOff, X, Power, Zap, Brain } from 'lucide-react';

const IMG_IDLE = "/robot-idle.png";
const IMG_LISTENING = "/robot-listening.png";
const IMG_THINKING = "/robot-thinking.png";
const IMG_SPEAKING = "/robot-speaking.png";

const RealisticAiAvatar = ({ status, onClick }) => {
  const isSpeaking = status === 'Speaking...';
  const isProcessing = status.includes('Processing');
  const isListening = status === 'Listening...';
  const isIdle = !isSpeaking && !isProcessing && !isListening;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start overflow-hidden bg-white cursor-pointer group" onClick={onClick}>
      <div className="absolute top-4 z-[200] flex flex-col items-center gap-2 w-full px-4">
         <div className={`px-5 py-2 rounded-full border-2 backdrop-blur-xl text-[11px] font-bold tracking-widest uppercase shadow-sm flex items-center justify-center gap-2 transition-all duration-500 ${
            isListening ? 'bg-red-50/90 border-red-500 text-red-600 animate-pulse' :
            isProcessing ? 'bg-blue-50/90 border-blue-500 text-blue-600 animate-pulse' :
            isSpeaking ? 'bg-emerald-50/90 border-emerald-500 text-emerald-600' :
            'bg-slate-50/90 border-slate-300 text-slate-400'
         }`}>
            {isListening ? <Mic size={14} /> : isProcessing ? <Brain size={14} className="animate-spin-slow" /> : isSpeaking ? <Zap size={14} /> : <Power size={14} />}
            <span className="truncate max-w-[180px]">{status}</span>
         </div>
      </div>

      <div className="relative z-0 w-full h-full flex items-center justify-center pb-10">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] rounded-full blur-[70px] transition-all duration-700 z-0 pointer-events-none ${
          isListening ? 'bg-red-600 opacity-40 scale-110' : isSpeaking ? 'bg-emerald-600 opacity-20 scale-100' : isProcessing ? 'bg-blue-600 opacity-20 scale-100' : 'bg-transparent'
        }`}></div>

        <img src={IMG_IDLE} alt="AI Idle" className={`absolute w-full h-[85%] object-contain object-bottom transition-opacity duration-500 ease-in-out z-10 ${isIdle ? 'opacity-100' : 'opacity-0'}`} />
        <img src={IMG_LISTENING} alt="AI Listening" className={`absolute w-full h-[85%] object-contain object-bottom transition-opacity duration-500 ease-in-out z-10 ${isListening ? 'opacity-100' : 'opacity-0'}`} />
        <img src={IMG_THINKING} alt="AI Thinking" className={`absolute w-full h-[85%] object-contain object-bottom transition-opacity duration-500 ease-in-out z-10 ${isProcessing ? 'opacity-100' : 'opacity-0'}`} />
        <img src={IMG_SPEAKING} alt="AI Speaking" className={`absolute w-full h-[85%] object-contain object-bottom transition-opacity duration-500 ease-in-out z-10 ${isSpeaking ? 'opacity-100' : 'opacity-0'}`} />

        <div className={`absolute top-[18%] left-1/2 -translate-x-1/2 z-20 w-32 h-24 bg-blue-500/60 blur-2xl rounded-full animate-pulse pointer-events-none transition-opacity duration-300 ${isProcessing ? 'opacity-100' : 'opacity-0'}`}></div>

        <div className={`absolute top-[60%] left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center gap-1.5 transition-all duration-300 ${isSpeaking ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
           <div className="w-1.5 bg-gradient-to-t from-emerald-400 to-cyan-300 rounded-full h-6 animate-[eq_0.4s_ease-in-out_infinite_alternate]"></div>
           <div className="w-1.5 bg-gradient-to-t from-emerald-400 to-cyan-300 rounded-full h-10 animate-[eq_0.2s_ease-in-out_infinite_alternate]"></div>
           <div className="w-1.5 bg-gradient-to-t from-emerald-400 to-cyan-300 rounded-full h-7 animate-[eq_0.5s_ease-in-out_infinite_alternate]"></div>
           <div className="w-1.5 bg-gradient-to-t from-emerald-400 to-cyan-300 rounded-full h-11 animate-[eq_0.3s_ease-in-out_infinite_alternate]"></div>
           <div className="w-1.5 bg-gradient-to-t from-emerald-400 to-cyan-300 rounded-full h-5 animate-[eq_0.6s_ease-in-out_infinite_alternate]"></div>
        </div>
      </div>
      <style>{`@keyframes eq { 0% { transform: scaleY(0.4); opacity: 0.7; } 100% { transform: scaleY(1.3); opacity: 1; } }`}</style>
    </div>
  );
};


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [activeChatId, setActiveChatId] = useState(Date.now());
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);

  const [speechModeOpen, setSpeechModeOpen] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isHandsFree, setIsHandsFree] = useState(true);

  const currentAudioRef = useRef(null);
  const lastFetchedDataRef = useRef(null);
  const speechModeOpenRef = useRef(false);
  const isMutedRef = useRef(isMuted);
  const isHandsFreeRef = useRef(isHandsFree);
  const voiceStatusRef = useRef(voiceStatus);
  const isLoadingRef = useRef(isLoading);
  
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { isHandsFreeRef.current = isHandsFree; }, [isHandsFree]);
  useEffect(() => { voiceStatusRef.current = voiceStatus; }, [voiceStatus]);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // --- NAYA ELEVENLABS STT & RECORDING LOGIC START ---
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);

  const processAudioWithElevenLabs = async (audioBlob) => {
    const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!ELEVENLABS_API_KEY) return null;
    try {
      const formData = new FormData();
      // File bhej rahe hain ElevenLabs API ko
      formData.append("file", audioBlob, "audio.webm");
      formData.append("model_id", "scribe_v2");

      const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
        method: "POST",
        headers: { "xi-api-key": ELEVENLABS_API_KEY },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        return data.text;
      }
    } catch (error) {
      console.error("ElevenLabs STT error:", error);
    }
    return null; 
  };

  const startRecordingAudio = useCallback(async () => {
    try {
      if (!audioStreamRef.current) {
        audioStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") return;
      
      const recorder = new MediaRecorder(audioStreamRef.current);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
    } catch (err) {
      console.error("Mic error for recording:", err);
    }
  }, []);

  const stopRecordingAndGetText = useCallback(() => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const sttText = await processAudioWithElevenLabs(audioBlob);
          resolve(sttText);
        };
        mediaRecorderRef.current.stop();
      } else {
        resolve(null);
      }
    });
  }, []);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.onstop = null; 
      mediaRecorderRef.current.stop();
    }
  }, []);
  // --- NAYA ELEVENLABS STT & RECORDING LOGIC END ---
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);

  const initSpeechRecognition = useCallback(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return null;

    const recognition = new SpeechRec();
    recognition.continuous = false; 
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      let currentTrans = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTrans += event.results[i][0].transcript;
      }
      setTranscript(currentTrans);
    };

    
    recognition.onend = () => {
      if (shouldListenRef.current && !isMutedRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch (e) { /* Ignore already started */ }
        }, 200);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        shouldListenRef.current = false;
        console.error("Mic permission denied");
      }
    };

    return recognition;
  }, []);

  useEffect(() => {
    recognitionRef.current = initSpeechRecognition();
  }, [initSpeechRecognition]);

  const safeStartListening = useCallback(() => {
    if (isMutedRef.current) return;
    shouldListenRef.current = true;
    try {
      recognitionRef.current?.start();
    } catch (e) {}
  }, []);

  const safeStopListening = useCallback(() => {
    shouldListenRef.current = false; 
    try {
      recognitionRef.current?.stop();
    } catch (e) {}
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    try {
      recognitionRef.current?.stop(); 
    } catch(e) {}
  }, []);

  
  const USE_GROQ_STT = false; 
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  const processAudioWithGroq = async (audioBlob) => {
    if (!USE_GROQ_STT || !GROQ_API_KEY) return null;
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");
      formData.append("model", "whisper-large-v3");
      formData.append("language", "en");

      const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_API_KEY}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        return data.text;
      }
    } catch (error) {
      console.error("Groq STT failed, falling back to Native STT", error);
    }
    return null; 
  };
  

  const PROCESSING_PHRASES = [
    "Hold on, pulling the data right now.",
    "Fetching the latest records, just a moment.",
    "Connecting to the database, this won't take long.",
    "Still working on it, data is being compiled.",
    "Almost there, running the final checks.",
    "Just a few more seconds, putting it together."
  ];
  const processingIntervalRef = useRef(null);
  const processingIndexRef = useRef(0);
  const isSpeakingProcessingRef = useRef(false);
  const micCooldownRef = useRef(false);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('eglobe_active_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.id) {
          setCurrentUser(parsed);
          setIsLoggedIn(true);
        }
      }
    } catch (e) {
      localStorage.removeItem('eglobe_active_session');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const checkConnection = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/health`);
        if (!cancelled) setIsConnected(response.ok);
      } catch (error) {
        if (!cancelled) setIsConnected(false);
      }
    };
    if (BACKEND_URL) checkConnection();
    return () => { cancelled = true; };
  }, [BACKEND_URL]);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('eglobe_active_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSpeechModeOpen(false);
    speechModeOpenRef.current = false;
    setIsHandsFree(false);
    safeStopListening();
    
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    window.speechSynthesis.cancel();
    
    if (processingIntervalRef.current) {
      clearTimeout(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }
    setIsLoading(false);
    setLoadingMessage("");
    localStorage.removeItem('eglobe_active_session');
  };

  const createNewChat = useCallback(() => {
    setCurrentMessages(prev => {
      if (prev.length > 0) {
        const title = prev[0].text.substring(0, 25) + "...";
        setChatHistory(h => [{ id: activeChatId, title, messages: prev }, ...h.filter(c => c.id !== activeChatId)]);
      }
      return [];
    });
    setActiveChatId(Date.now());
  }, [activeChatId]);

  const deleteChat = useCallback((chatId) => {
    setChatHistory(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) createNewChat();
  }, [activeChatId, createNewChat]);

  const loadChat = useCallback((id) => {
    setCurrentMessages(prev => {
      if (prev.length > 0) {
        const title = prev[0].text.substring(0, 25) + "...";
        setChatHistory(h => {
          const existing = h.find(c => c.id === activeChatId);
          if (existing) return h.map(c => c.id === activeChatId ? { ...c, messages: prev } : c);
          return [{ id: activeChatId, title, messages: prev }, ...h];
        });
      }
      return prev;
    });
    setChatHistory(h => {
      const chatToLoad = h.find(c => c.id === id);
      if (chatToLoad) {
        setActiveChatId(id);
        setCurrentMessages(chatToLoad.messages);
      }
      return h;
    });
  }, [activeChatId]);

  const stopProcessingFeedback = useCallback(() => {
    if (processingIntervalRef.current) {
      clearTimeout(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }
    processingIndexRef.current = 0;
    isSpeakingProcessingRef.current = false;
    isLoadingRef.current = false;
    setIsLoading(false);
    setLoadingMessage("");
  }, []);

  const speakTextVoiceModeFnRef = useRef(null);

  const finishSpeakingAndListen = useCallback((onEndCallback) => {
    if (onEndCallback) onEndCallback();
    
    micCooldownRef.current = true;
    setTimeout(() => {
      micCooldownRef.current = false;
      resetTranscript();
    }, 2000);

    if (speechModeOpenRef.current && !isMutedRef.current) {
      setVoiceStatus('Listening...');
      safeStartListening();
      startRecordingAudio(); // <--- Yahan recording start hogi
    } else if (isHandsFreeRef.current && !isMutedRef.current) {
      setVoiceStatus('Idle');
      safeStartListening();
      cancelRecording(); // <--- Wake word mode me bas mic sunega, record nahi karega
    } else {
      setVoiceStatus('Idle');
      cancelRecording(); // <--- Recording cancel
    }
  }, [resetTranscript, safeStartListening, startRecordingAudio, cancelRecording]);

  const runFallbackTTS = useCallback((text, onEndCallback) => {
    safeStopListening(); 
    setVoiceStatus('Speaking...');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
// Browser mein se female voice dhoondhne ka logic
const femaleVoice = voices.find(voice => 
  voice.name.includes('Female') || 
  voice.name.includes('Woman') || 
  voice.name.includes('Zira') || 
  voice.name.includes('Samantha') || 
  voice.name.includes('Google UK English Female')
);

if (femaleVoice) {
  utterance.voice = femaleVoice;
}
////
      utterance.rate = 1.35;//(speed)
      
      
      utterance.onend = () => { 
        setTimeout(() => finishSpeakingAndListen(onEndCallback), 600); 
      };
      utterance.onerror = () => { 
        setTimeout(() => finishSpeakingAndListen(onEndCallback), 600); 
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => finishSpeakingAndListen(onEndCallback), 600);
    }
  }, [safeStopListening, finishSpeakingAndListen]);

  const speakTextVoiceMode = useCallback(async (text, onEndCallback) => {
    safeStopListening(); // Stop mic while speaking

    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/\*\*/g, '');
    const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
    //const VOICE_ID = "ErXwobaYiN019PkySvjV"; (male)
    const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    if (!ELEVENLABS_API_KEY) {
      runFallbackTTS(cleanText, onEndCallback);
      return;
    }

    try {
      setVoiceStatus('Processing Audio...');
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?optimize_streaming_latency=3`, {
        method: 'POST',
        headers: { 'Accept': 'audio/mpeg', 'xi-api-key': ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
  text: cleanText,
  model_id: "eleven_turbo_v2_5", // Sabse fast model
  voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.0, use_speaker_boost: true }
})
      });
      if (!response.ok) throw new Error("TTS Error");
      const audioUrl = URL.createObjectURL(await response.blob());
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onplay = () => {
        setVoiceStatus('Speaking...');
      };
      
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setTimeout(() => { finishSpeakingAndListen(onEndCallback); }, 600);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        runFallbackTTS(cleanText, onEndCallback);
      };

      audio.play().catch(() => {
        runFallbackTTS(cleanText, onEndCallback);
      });

    } catch (error) {
      runFallbackTTS(cleanText, onEndCallback);
    }
  }, [safeStopListening, runFallbackTTS, finishSpeakingAndListen]);

  useEffect(() => {
    speakTextVoiceModeFnRef.current = speakTextVoiceMode;
  }, [speakTextVoiceMode]);

  const speakProcessingPhrase = useCallback(async (text, onDone) => {
    if (!text) { onDone?.(); return; }
    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/\*\*/g, '');
    const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
    // const VOICE_ID = "ErXwobaYiN019PkySvjV";  (male)
    const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

    safeStopListening();
    setVoiceStatus('Speaking...');

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    const onFinished = () => {
      setVoiceStatus('Processing...');
      setTimeout(() => { onDone?.(); }, 600); 
    };

    if (!ELEVENLABS_API_KEY) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(cleanText);
        utt.rate = 1.1;
        utt.onend = () => onFinished();
        utt.onerror = () => onFinished();
        window.speechSynthesis.speak(utt);
      } else {
        onFinished();
      }
      return;
    }

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?optimize_streaming_latency=3`,
        {
          method: 'POST',
          headers: { 'Accept': 'audio/mpeg', 'xi-api-key': ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.45, similarity_boost: 0.85, style: 0.4, use_speaker_boost: true }
          })
        }
      );
      if (!response.ok) throw new Error("TTS Error");
      const audioUrl = URL.createObjectURL(await response.blob());
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      audio.onplay = () => setVoiceStatus('Speaking...');
      audio.onended = () => { URL.revokeObjectURL(audioUrl); onFinished(); };
      audio.onerror = () => { URL.revokeObjectURL(audioUrl); onFinished(); };
      audio.play().catch(() => onFinished());
    } catch {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(cleanText);
        utt.rate = 1.1;
        utt.onend = () => onFinished();
        utt.onerror = () => onFinished();
        window.speechSynthesis.speak(utt);
      } else {
        onFinished();
      }
    }
  }, [safeStopListening]);

  const speakNextProcessingPhrase = useCallback(() => {
    if (!isLoadingRef.current || isMutedRef.current) {
      isSpeakingProcessingRef.current = false;
      return;
    }
    
    const idx = processingIndexRef.current % PROCESSING_PHRASES.length;
    const phrase = PROCESSING_PHRASES[idx];
    setLoadingMessage(phrase);
    isSpeakingProcessingRef.current = true;
    processingIndexRef.current = idx + 1;

    speakProcessingPhrase(phrase, () => {
      const gap = 5000 + Math.random() * 1000; 
      processingIntervalRef.current = setTimeout(() => {
        if (isLoadingRef.current) {
          speakNextProcessingPhrase();
        } else {
          isSpeakingProcessingRef.current = false;
        }
      }, gap);
    });
  
  }, [speakProcessingPhrase]);

  const startProcessingFeedback = useCallback((initialSpeak = true) => {
    processingIndexRef.current = 0;
    isSpeakingProcessingRef.current = false;
    
    isLoadingRef.current = true;
    setIsLoading(true);
    setLoadingMessage(PROCESSING_PHRASES[0]);

    if (processingIntervalRef.current) {
      clearTimeout(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }

    if (!isMutedRef.current && initialSpeak) {
      processingIntervalRef.current = setTimeout(() => {
        if (isLoadingRef.current) {
          speakNextProcessingPhrase();
        }
      }, 5000);
    }
  
  }, [speakNextProcessingPhrase]);

  useEffect(() => {
    if (isMuted || !isLoggedIn) {
      safeStopListening();
      return;
    }
    if (voiceStatus === 'Idle' || voiceStatus === 'Listening...') {
      if (speechModeOpen || isHandsFree) {
        safeStartListening();
      } else {
        safeStopListening();
      }
    } else {
      safeStopListening();
    }
  }, [isMuted, voiceStatus, isLoggedIn, speechModeOpen, isHandsFree, safeStartListening, safeStopListening]);

  useEffect(() => {
    if (!transcript) return;
    if (micCooldownRef.current) return;

    const lowerTrans = transcript.toLowerCase().trim();
    if (!speechModeOpenRef.current && isHandsFreeRef.current) {
      if (
        lowerTrans.includes('hey eglobe') ||
        lowerTrans.includes('hey globe') ||
        lowerTrans.includes('hello robot') ||
        lowerTrans.includes('high eglobe') ||
        lowerTrans.includes('hii eglobe') ||
        lowerTrans.includes('hey e globe') ||
        lowerTrans.includes('hi globe') ||
        lowerTrans.includes('hello AI') ||
        lowerTrans.includes('hey igloo') ||
        lowerTrans.includes('hey iglobe')
      ) {
        safeStopListening();
        speechModeOpenRef.current = true;
        setSpeechModeOpen(true);
        //setSidebarOpen(false);
        resetTranscript();
        speakTextVoiceMode("Yes, I am listening. How can I help?", null);
      }
      return;
    }

    if (speechModeOpenRef.current && voiceStatusRef.current === 'Listening...') {

      if (['thank you', 'stop', 'close', 'exit', 'nothing', 'never mind', 'never','No'].some(w => lowerTrans.includes(w))) {
        safeStopListening();
        speakTextVoiceMode("Alright, going back to sleep mode. Feel free to say Hey eGlobe or hello robot anytime.", () => {
          speechModeOpenRef.current = false;
          setSpeechModeOpen(false);
          //setSidebarOpen(true);
          setVoiceStatus('Idle');
          resetTranscript();
        });
        return;
      }

      if (lastFetchedDataRef.current && ['explain', 'read', 'yes', 'batao', 'continue', 'haan'].some(w => lowerTrans.includes(w))) {
        safeStopListening();
        const textToRead = lastFetchedDataRef.current;
        lastFetchedDataRef.current = null;
        resetTranscript();
        speakTextVoiceMode(textToRead, null);
        return;
      }

      if (lastFetchedDataRef.current && ['no', 'next', 'skip', 'leave it', 'agle'].some(w => lowerTrans.includes(w))) {
        safeStopListening();
        lastFetchedDataRef.current = null;
        resetTranscript();
        speakTextVoiceMode("Sure! What would you like to know next?", null);
        return;
      }

      const timeoutId = setTimeout(async () => {
        const words = transcript.trim().split(/\s+/).filter(w => w.length > 0);
        
        // Background noise bachane ke liye kam se kam 3 words hone chahiye
        if (words.length >= 3 && !isLoadingRef.current && !micCooldownRef.current) {
          safeStopListening();
          setVoiceStatus('Processing Audio...'); // UI pe dikhega
          
          // Yahan audio stop hogi aur ElevenLabs se text aayega
          const elevenLabsText = await stopRecordingAndGetText();
          
          // Agar ElevenLabs ne perfect text diya toh wo use karein, warna native STT ka transcript
          const finalCommand = elevenLabsText || transcript;
          
          processVoicePanelCommand(finalCommand);
        }
      }, 1500); // 1.5 seconds ki silence matlab query khatam

      return () => clearTimeout(timeoutId);
    }
  }, [transcript]);

  const extractSpokenSummary = (rawText) => {
    const plain = rawText.replace(/<[^>]*>?/gm, '').replace(/\*\*/g, '').replace(/\n+/g, ' ').trim();
    const sentences = plain.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length === 0) return plain.substring(0, 120).trim();
    return sentences.slice(0, 2).join(' ').trim();
  };

  const processVoicePanelCommand = async (text) => {
    setVoiceStatus('Processing...');
    resetTranscript();

    const updatedMessages = [...currentMessages, { role: 'user', text: text }];
    setCurrentMessages(updatedMessages);

    startProcessingFeedback(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages.map(m => ({ role: m.role, text: m.text.replace(/<br\/>/g, '\n').replace(/<strong>|<\/strong>/g, '') })) })
      });

      if (!response.ok) throw new Error("HTTP error");
      setIsConnected(true);

      const data = await response.json();
      const rawText = data.text || "No response.";
      let formattedText = rawText.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      setCurrentMessages(prev => [...prev, { role: 'assistant', text: formattedText, citations: data.citations, follow_up: data.follow_up, tableData: data.tableData, vegaChart: data.vegaChart }]);

      stopProcessingFeedback();

      lastFetchedDataRef.current = rawText;
      const preview = extractSpokenSummary(rawText);
      speakTextVoiceMode(preview, () => {
        speakTextVoiceModeFnRef.current?.(
          "Would you like me to continue reading, or shall we move to your next query?",
          null
        );
      });

    } catch (error) {
      stopProcessingFeedback();
      setIsConnected(false);
      speakTextVoiceMode("I had a problem connecting to the server. Please check your connection and try again.", null);
    }
  };

  const handleSendMessage = async (text) => {
    if (!isConnected) return;
    if (isLoadingRef.current) return;

    const updatedMessages = [...currentMessages, { role: 'user', text: text }];
    setCurrentMessages(updatedMessages);

    startProcessingFeedback(false);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages.map(m => ({ role: m.role, text: m.text.replace(/<br\/>/g, '\n').replace(/<strong>|<\/strong>/g, '') })) })
      });
      if (!response.ok) throw new Error("HTTP error");
      const data = await response.json();
      let formattedText = (data.text || "No response received.").replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      setCurrentMessages(prev => [...prev, { role: 'assistant', text: formattedText, citations: data.citations, follow_up: data.follow_up, tableData: data.tableData, vegaChart: data.vegaChart }]);
      stopProcessingFeedback();
    } catch (error) {
      stopProcessingFeedback();
      setCurrentMessages(prev => [...prev, { role: 'assistant', text: "Connection error." }]);
    }
  };

  useEffect(() => {
    speechModeOpenRef.current = speechModeOpen;
    if (!speechModeOpen) {
      setVoiceStatus('Idle');
      window.speechSynthesis.cancel();
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      stopProcessingFeedback();
    }
  }, [speechModeOpen, stopProcessingFeedback]);

  if (!isLoggedIn) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">

      <div className={`fixed md:relative z-40 h-full shrink-0 transition-all duration-300 ease-in-out bg-white overflow-hidden ${sidebarOpen ? 'w-[280px] border-r border-slate-200' : 'w-0 border-r-0'}`}>
        <div className="w-[280px] h-full relative">

           {/* Ab ye cross button har baar dikhega jab sidebar open hoga */}
{sidebarOpen && (
  <button
    onClick={() => setSidebarOpen(false)}
    className="absolute top-1 right-1 z-[9999] p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center"
    title="Close Sidebar"
  >
    <X size={18} strokeWidth={2.5} />
  </button>
)}

           <Sidebar chatHistory={chatHistory} createNewChat={createNewChat} loadChat={loadChat} deleteChat={deleteChat} currentUser={currentUser} onLogout={handleLogout} />
        </div>
      </div>

      <div className={`flex-1 flex flex-col h-full relative transition-all duration-300 ease-in-out ${speechModeOpen ? 'mr-[320px] sm:mr-[400px]' : 'mr-0'}`}>

        <header className="h-[64px] border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 bg-white shadow-sm z-10">
            <div className="flex items-center gap-4">

                {/* Ye hamesha dikhega aur click karne par sidebar open karega */}
<button
  className="text-slate-500 hover:text-blue-600 hover:bg-slate-100 p-2 rounded-lg transition-all"
  onClick={() => setSidebarOpen(true)}
  title="Show Sidebar"
>
    <Menu size={24} />
</button>

                <div className="flex items-center gap-3 font-bold text-slate-800 tracking-tight transition-all">
                    <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100 shadow-inner">
                        <Hotel size={20} className="text-blue-600" />
                    </div>
                    <span className="text-lg hidden sm:block">Aquila Grand Suites</span>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
                <div className={`hidden lg:flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm ${isConnected ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                    <Radio size={14} className={isConnected ? "animate-pulse" : ""} />
                    <span>{isConnected ? "Connected" : "Disconnected"}</span>
                </div>

                <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:pl-5">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:block">
                       Hands-Free
                    </span>
                    <button
                       onClick={() => {
                         const nextState = !isHandsFree;
                         setIsHandsFree(nextState);
                         isHandsFreeRef.current = nextState;
                         if (!nextState) {
                           safeStopListening();
                         }
                       }}
                       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isHandsFree ? 'bg-blue-600 shadow-inner' : 'bg-slate-300'}`}
                       title="Enable Wake Word (Hey eGlobe)"
                    >
                       <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isHandsFree ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                <button
                    onClick={() => {
                       if (!speechModeOpenRef.current) {
                         speechModeOpenRef.current = true;
                         setSpeechModeOpen(true);
                         //setSidebarOpen(false);
                         
                         setTimeout(() => {
                           speakTextVoiceMode("Yes, I am listening. How can I help?", null);
                         }, 300);
                       }
                    }}
                    className="group flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-md transition-all text-sm font-bold text-slate-700 hover:text-blue-600"
                >
                    <div className="flex items-center gap-0.5 h-4">
                       <div className={`w-1 bg-blue-500 rounded-full transition-all ${isHandsFree ? 'h-full animate-[bounce_1s_infinite]' : 'h-1.5 group-hover:h-3'}`}></div>
                       <div className={`w-1 bg-blue-500 rounded-full transition-all ${isHandsFree ? 'h-2/4 animate-[bounce_0.8s_infinite]' : 'h-3 group-hover:h-full'}`}></div>
                       <div className={`w-1 bg-blue-500 rounded-full transition-all ${isHandsFree ? 'h-full animate-[bounce_1.2s_infinite]' : 'h-2 group-hover:h-2.5'}`}></div>
                    </div>
                    <span className="hidden md:inline">Voice Mode</span>
                </button>
            </div>
        </header>

        <ChatArea messages={currentMessages} isLoading={isLoading} loadingMessage={loadingMessage} onFollowUpClick={handleSendMessage} />

        <ChatInput
           onSend={handleSendMessage}
           disabled={isLoading || !isConnected}
           isHandsFree={isHandsFree}
           onMicClick={() => {
              if (!speechModeOpenRef.current) {
                speechModeOpenRef.current = true;
                setSpeechModeOpen(true);
                //setSidebarOpen(false);
                setTimeout(() => {
                  speakTextVoiceMode("Yes, I am listening. How can I help?", null);
                }, 300);
              }
           }}
        />

        {sidebarOpen && <div className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 transition-opacity" onClick={() => setSidebarOpen(false)}></div>}
      </div>

      <div className={`fixed top-0 right-0 h-full w-[320px] sm:w-[400px] bg-white border-l border-slate-200 shadow-2xl z-50 transform transition-transform duration-500 ease-out flex flex-col ${speechModeOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="absolute top-6 right-6 z-[9999] flex gap-3">
             <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-full transition-all shadow-xl backdrop-blur-md cursor-pointer border ${isMuted ? 'bg-red-500 text-white border-red-600 animate-pulse' : 'bg-white/90 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border-slate-200'}`} title={isMuted ? "Unmute Mic" : "Mute Mic"}>
                {isMuted ? <MicOff size={24} strokeWidth={2} /> : <Mic size={24} strokeWidth={2} />}
             </button>
             <button onClick={() => {
                 speechModeOpenRef.current = false;
                 setSpeechModeOpen(false);
                 //setSidebarOpen(true);
             }} className="p-3 rounded-full bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all shadow-xl backdrop-blur-md cursor-pointer border border-slate-200">
                <X size={24} strokeWidth={2.5} />
             </button>
          </div>

          <div className="flex-1 relative w-full h-full">
             <RealisticAiAvatar status={isMuted ? 'Muted' : voiceStatus} onClick={() => {}} />
          </div>

          <div className={`absolute bottom-10 left-6 right-6 z-50 px-5 py-4 bg-slate-900/90 backdrop-blur-xl rounded-2xl text-center shadow-2xl border border-white/20 transition-all duration-300 ${speechModeOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
             <p className="text-[15px] text-white font-medium leading-relaxed tracking-wide flex flex-col items-center justify-center min-h-[24px]">
                {loadingMessage ? (
                   <span className="text-blue-200 italic flex items-center gap-2">
                     <Brain size={14} className="animate-spin flex-shrink-0 text-blue-400" />
                     {loadingMessage}
                   </span>
                ) : transcript ? (
                  <span className="text-white">"{transcript}"</span>
                ) : voiceStatus === 'Listening...' && !isMuted ? (
                  <span className="text-slate-400 italic flex items-center gap-2"><Mic size={14} className="animate-pulse text-red-400 flex-shrink-0"/> Listening...</span>
                ) : voiceStatus === 'Speaking...' ? (
                  <span className="text-emerald-400 italic flex items-center gap-2"><Zap size={14} className="animate-pulse flex-shrink-0"/> Speaking...</span>
                ) : voiceStatus.includes('Processing') ? (
                  <span className="text-blue-400 italic flex items-center gap-2"><Brain size={14} className="animate-pulse flex-shrink-0"/> Processing...</span>
                ) : (
                  <span className="text-slate-500 text-xs">Say "Hey eGlobe" or "Hello Robot" to begin</span>
                )}
             </p>
          </div>
      </div>
    </div>
  );
}

export default App;
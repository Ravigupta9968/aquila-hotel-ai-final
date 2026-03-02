import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import { Menu, Radio, Headphones, Hotel, Mic, X, Activity, Timer, Power, Zap, Brain } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// ==============================================
// 🤖 4 DIFFERENT ROBOT STATES (URLS)
// IMPORTANT: Apne public folder me in chaaro files ko inhi naamo se save kijiye!
// ==============================================
const IMG_IDLE = "/robot-idle.png";       // 1. Hello / Auto / Pause mode
const IMG_LISTENING = "/robot-listening.png"; // 2. Jab AI aapki baat sun raha ho
const IMG_THINKING = "/robot-thinking.png";  // 3. Processing / Data load mode
const IMG_SPEAKING = "/robot-speaking.png";  // 4. Bolte waqt ka GIF


// ==============================================
// ULTRA-REALISTIC AI ROBOT VISUALIZER (FIXED WAVES)
// ==============================================
// ==============================================
// ULTRA-REALISTIC AI ROBOT VISUALIZER (FULL 3D EFFECTS & PERFECT TIMING)
// ==============================================
const RealisticAiAvatar = ({ status, onClick, readCountdown }) => {
  const isSpeaking = status === 'Speaking...';
  const isProcessing = status === 'Processing...' || status === 'Reviewing Data...';
  const isListening = status === 'Listening...';
  
  // Default Idle State
  const isIdle = !isSpeaking && !isProcessing && !isListening;

  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-start overflow-hidden bg-white cursor-pointer group"
      onClick={onClick}
    >
      
      {/* 1. Status Overlay */}
      <div className="absolute top-4 z-[200] flex flex-col items-center gap-2 w-full px-4">
         <div className={`px-5 py-2 rounded-full border-2 backdrop-blur-xl text-[11px] font-bold tracking-widest uppercase shadow-sm flex items-center justify-center gap-2 transition-all duration-500 ${
            isListening ? 'bg-red-50/90 border-red-500 text-red-600 animate-pulse' :
            isProcessing ? 'bg-blue-50/90 border-blue-500 text-blue-600 animate-pulse' :
            isSpeaking ? 'bg-emerald-50/90 border-emerald-500 text-emerald-600' :
            'bg-slate-50/90 border-slate-300 text-slate-400'
         }`}>
            {isListening ? <Mic size={14} /> : 
             isProcessing ? <Brain size={14} className="animate-spin-slow" /> :
             isSpeaking ? <Zap size={14} /> : <Power size={14} />}
            <span className="truncate max-w-[180px]">
                {status === 'Reviewing Data...' ? `Reading: ${readCountdown}s` : status}
            </span>
         </div>
      </div>

      {/* 2. THE STAGE: FIXED IMAGES & 3D LIGHTING */}
      <div className="relative z-0 w-full h-full flex items-center justify-center pb-10">
        
        {/* 🔥 EFFECT 1: LISTENING RED GLOW (Robot ke Peeche) */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] rounded-full blur-[70px] transition-all duration-700 z-0 pointer-events-none ${
          isListening ? 'bg-red-600 opacity-50 scale-110' : 
          isSpeaking ? 'bg-emerald-600 opacity-20 scale-100' : 
          isProcessing ? 'bg-blue-600 opacity-20 scale-100' : 'bg-transparent'
        }`}></div>
        
        {/* ============ TRANSPARENT ROBOT IMAGES (z-10) ============ */}
        <img src={IMG_IDLE} alt="AI Idle" className={`absolute w-full h-[85%] object-contain object-bottom transition-opacity duration-500 ease-in-out z-10 ${isIdle ? 'opacity-100' : 'opacity-0'}`} />
        <img src={IMG_LISTENING} alt="AI Listening" className={`absolute w-full h-[85%] object-contain object-bottom transition-opacity duration-500 ease-in-out z-10 ${isListening ? 'opacity-100' : 'opacity-0'}`} />
        <img src={IMG_THINKING} alt="AI Thinking" className={`absolute w-full h-[85%] object-contain object-bottom transition-opacity duration-500 ease-in-out z-10 ${isProcessing ? 'opacity-100' : 'opacity-0'}`} />
        <img src={IMG_SPEAKING} alt="AI Speaking" className={`absolute w-full h-[85%] object-contain object-bottom transition-opacity duration-500 ease-in-out z-10 ${isSpeaking ? 'opacity-100' : 'opacity-0'}`} />


        {/* 🔥 EFFECT 2: PROCESSING BLUE BLINK (Robot ke Sir (Head) ke Upar - z-20) */}
        <div className={`absolute top-[18%] left-1/2 -translate-x-1/2 z-20 w-32 h-24 bg-blue-500/60 blur-2xl rounded-full animate-pulse pointer-events-none transition-opacity duration-300 ${
           isProcessing ? 'opacity-100' : 'opacity-0'
        }`}></div>

        {/* 🔥 EFFECT 3: SPEAKING GREEN WAVES (Robot ke Gale par - z-[100]) */}
        <div className={`absolute top-[60%] left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center gap-1.5 transition-all duration-300 ${isSpeaking ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
           <div className="absolute w-32 h-16 bg-emerald-400/50 blur-2xl rounded-full pointer-events-none"></div>
           
           <div className="w-1.5 bg-gradient-to-t from-emerald-400 to-cyan-300 rounded-full shadow-[0_0_15px_rgba(52,211,153,1)] h-6 animate-[eq_0.4s_ease-in-out_infinite_alternate]"></div>
           <div className="w-1.5 bg-gradient-to-t from-emerald-400 to-cyan-300 rounded-full shadow-[0_0_15px_rgba(52,211,153,1)] h-10 animate-[eq_0.2s_ease-in-out_infinite_alternate]"></div>
           <div className="w-1.5 bg-gradient-to-t from-emerald-400 to-cyan-300 rounded-full shadow-[0_0_15px_rgba(52,211,153,1)] h-7 animate-[eq_0.5s_ease-in-out_infinite_alternate]"></div>
           <div className="w-1.5 bg-gradient-to-t from-emerald-400 to-cyan-300 rounded-full shadow-[0_0_15px_rgba(52,211,153,1)] h-11 animate-[eq_0.3s_ease-in-out_infinite_alternate]"></div>
           <div className="w-1.5 bg-gradient-to-t from-emerald-400 to-cyan-300 rounded-full shadow-[0_0_15px_rgba(52,211,153,1)] h-5 animate-[eq_0.6s_ease-in-out_infinite_alternate]"></div>
        </div>

      </div>

      {/* Real Wave Animation CSS */}
      <style>{`
        @keyframes eq {
          0% { transform: scaleY(0.4); opacity: 0.7; }
          100% { transform: scaleY(1.3); opacity: 1; }
        }
      `}</style>

      {/* Tap Info Overlay */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white px-5 py-2 rounded-full text-[11px] font-bold backdrop-blur-md z-[200] whitespace-nowrap pointer-events-none tracking-wider uppercase">
        Tap Anywhere to Interact
      </div>

    </div>
  );
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const currentUser = { name: "Ravi Gupta", role: "Hotel Manager" };
  
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [activeChatId, setActiveChatId] = useState(Date.now());
  const [chatHistory, setChatHistory] = useState([]); 
  const [currentMessages, setCurrentMessages] = useState([]);
  
  const [speechModeOpen, setSpeechModeOpen] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Idle');
  const [readCountdown, setReadCountdown] = useState(0); 
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
   
  const longWaitTimerRef = useRef(null);
  const speechModeOpenRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const readingIntervalRef = useRef(null);
  const silenceStepRef = useRef(0);
  const currentAudioRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://aquila-backend-jy3a.onrender.com";

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/health`);
        setIsConnected(response.ok);
      } catch (error) {
        setIsConnected(false);
      }
    };
    checkConnection();
  }, [BACKEND_URL]);

  const createNewChat = () => {
    if (currentMessages.length > 0) {
      const title = currentMessages[0].text.substring(0, 25) + "...";
      setChatHistory(prev => [{ id: activeChatId, title, messages: currentMessages }, ...prev.filter(c => c.id !== activeChatId)]);
    }
    setActiveChatId(Date.now());
    setCurrentMessages([]);
  };

  const loadChat = (id) => {
    if (currentMessages.length > 0) {
      const title = currentMessages[0].text.substring(0, 25) + "...";
      setChatHistory(prev => {
        const existing = prev.find(c => c.id === activeChatId);
        if (existing) return prev.map(c => c.id === activeChatId ? { ...c, messages: currentMessages } : c);
        return [{ id: activeChatId, title, messages: currentMessages }, ...prev];
      });
    }
    const chatToLoad = chatHistory.find(c => c.id === id);
    if (chatToLoad) {
      setActiveChatId(id);
      setCurrentMessages(chatToLoad.messages);
    }
  };

  const fillerPhrases = [
    "Let me check that for you...",
    "Analyzing your data, just a second...",
    "Pulling up the records now...",
    "Fetching the latest insights for you...",
    "Processing your request, please wait..."
  ];

  const getRandomFiller = () => fillerPhrases[Math.floor(Math.random() * fillerPhrases.length)];

  const handleSendMessage = async (text) => {
    if (!isConnected) return;
    const updatedMessages = [...currentMessages, { role: 'user', text: text }];
    setCurrentMessages(updatedMessages);
    setIsLoading(getRandomFiller());

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: updatedMessages.map(m => ({
            role: m.role, text: m.text.replace(/<br\/>/g, '\n').replace(/<strong>|<\/strong>/g, '')
          }))
        })
      });

      if (!response.ok) {
        setIsConnected(false); 
        throw new Error("HTTP error");
      }

      setIsConnected(true); 
      const data = await response.json();
      let formattedText = (data.text || "No response received.").replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      setCurrentMessages(prev => [...prev, { 
        role: 'assistant', text: formattedText, tableData: data.tableData, vegaChart: data.vegaChart
      }]);
    } catch (error) {
      setIsConnected(false);
      setCurrentMessages(prev => [...prev, { role: 'assistant', text: "Connection error. Server may be down." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const summarizeForSpeech = (text) => {
    let cleanText = text.replace(/<[^>]*>?/gm, '').replace(/\*\*/g, '');
    let sentences = cleanText.split(/(?<=[.!?])\s+/);
    let summary = sentences.slice(0, 3).join(' '); 
    if (summary.length > 250) summary = summary.substring(0, 250) + "..."; 
    return summary;
  };

  const checkNegativeIntent = (text) => {
    const lowerText = text.toLowerCase().trim();
    const negatives = ['no', 'nahi', 'nope', 'never', 'nothing', 'exit', 'close', 'stop', 'kuch nahi', 'bas', 'band karo'];
    return negatives.some(word => lowerText === word || lowerText.startsWith(word + " "));
  };

  const speakTextVoiceMode = async (text, onEndCallback) => {
    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/\*\*/g, ''); 
    const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const VOICE_ID = "ErXwobaYiN019PkySvjV"; 

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0; 
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
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_monolingual_v1",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      });

      if (!response.ok) throw new Error(`ElevenLabs API Error: ${response.status}`);

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio; 

      audio.onplay = () => setVoiceStatus('Speaking...');
      audio.onended = () => { if (onEndCallback) onEndCallback(); };
      await audio.play();
    } catch (error) {
      runFallbackTTS(cleanText, onEndCallback); 
    }
  };

  const runFallbackTTS = (text, onEndCallback) => {
    setVoiceStatus('Speaking...');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN'; 
      utterance.rate = 1.35; 
      utterance.onend = () => { if(onEndCallback) onEndCallback(); };
      utterance.onerror = () => { if(onEndCallback) onEndCallback(); };
      window.speechSynthesis.speak(utterance);
    } else {
      if(onEndCallback) onEndCallback();
    }
  };

  const startReadingPause = () => {
    setVoiceStatus('Reviewing Data...');
    setReadCountdown(25); 
    if (readingIntervalRef.current) clearInterval(readingIntervalRef.current);

    readingIntervalRef.current = setInterval(() => {
      setReadCountdown(prev => {
        if (prev <= 1) {
          clearInterval(readingIntervalRef.current);
          askForMoreQueries();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const askForMoreQueries = () => {
    speakTextVoiceMode("Do you have any other queries?", startVoiceLoop);
  };

  const startVoiceLoop = () => {
    if (!speechModeOpenRef.current) return;
    setVoiceStatus('Listening...');
    SpeechRecognition.startListening({ continuous: false, language: 'en-IN' });

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => { handleSilenceTimeout(); }, 10000); 
  };

  const handleSilenceTimeout = () => {
    if (!speechModeOpenRef.current) return;
    SpeechRecognition.stopListening();
    if (silenceStepRef.current === 0) {
      silenceStepRef.current = 1; 
      speakTextVoiceMode("Do you have another question? I’m here to help.", startVoiceLoop);
    } else if (silenceStepRef.current === 1) {
      silenceStepRef.current = 2; 
      speakTextVoiceMode("Thank you for using Aquila AI. Have a great day.", () => {
        setVoiceStatus('Idle');
        setSpeechModeOpen(false);
      });
    }
  };

  const processVoicePanelCommand = async (text) => {
    setVoiceStatus('Processing...');
    const updatedMessages = [...currentMessages, { role: 'user', text: text }];
    setCurrentMessages(updatedMessages);

    let isBackendDone = false; 
    const longWaitPhrases = [
      "Still crunching the numbers, please hold on...",
      "Taking a bit longer to fetch this data...",
      "Almost there, scanning the database...",
      "Just a moment more..."
    ];

    const fillerText = getRandomFiller();
    speakTextVoiceMode(fillerText, () => {
      if (!isBackendDone && speechModeOpenRef.current) {
        setVoiceStatus('Processing...'); 
        if (longWaitTimerRef.current) clearInterval(longWaitTimerRef.current);
        longWaitTimerRef.current = setInterval(() => {
          if (!isBackendDone && speechModeOpenRef.current) {
             const randomWaitText = longWaitPhrases[Math.floor(Math.random() * longWaitPhrases.length)];
             speakTextVoiceMode(randomWaitText, () => {
                if (!isBackendDone && speechModeOpenRef.current) setVoiceStatus('Processing...');
             });
          }
        }, 8000); 
      }
    });

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: updatedMessages.map(m => ({ role: m.role, text: m.text.replace(/<br\/>/g, '\n').replace(/<strong>|<\/strong>/g, '') }))
        })
      });

      isBackendDone = true;
      if (longWaitTimerRef.current) clearInterval(longWaitTimerRef.current);

      if (!response.ok) {
        setIsConnected(false);
        throw new Error("HTTP error");
      }
      setIsConnected(true);

      const data = await response.json();
      let formattedText = (data.text || "No response.").replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      setCurrentMessages(prev => [...prev, { role: 'assistant', text: formattedText, tableData: data.tableData, vegaChart: data.vegaChart }]);

      const summaryToSpeak = summarizeForSpeech(data.text);
      speakTextVoiceMode(summaryToSpeak, startReadingPause);

    } catch (error) {
      isBackendDone = true;
      if (longWaitTimerRef.current) clearInterval(longWaitTimerRef.current);
      setIsConnected(false);
      speakTextVoiceMode("I had a problem connecting. Please try again.", startVoiceLoop);
    }
  };

  useEffect(() => {
    speechModeOpenRef.current = speechModeOpen;
    if (speechModeOpen) {
      silenceStepRef.current = 0;
      startVoiceLoop();
    } else {
      setVoiceStatus('Idle');
      SpeechRecognition.stopListening();
      window.speechSynthesis.cancel();
      if (currentAudioRef.current) currentAudioRef.current.pause();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (readingIntervalRef.current) clearInterval(readingIntervalRef.current);
      if (longWaitTimerRef.current) clearInterval(longWaitTimerRef.current); 
    }
  }, [speechModeOpen]);

  useEffect(() => {
    if (speechModeOpen && transcript) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    }
  }, [transcript, speechModeOpen]);

  useEffect(() => {
    if (speechModeOpen && !listening && voiceStatus === 'Listening...') {
      if (transcript) {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceStepRef.current = 0; 
        
        if (checkNegativeIntent(transcript)) {
            speakTextVoiceMode("Alright, closing speech mode. Have a nice day!", () => {
                setVoiceStatus('Idle');
                setSpeechModeOpen(false);
                resetTranscript();
            });
            return;
        }

        processVoicePanelCommand(transcript);
        resetTranscript();
      } else {
        if (silenceStepRef.current < 2) {
          try { SpeechRecognition.startListening({ continuous: false, language: 'en-IN' }); } catch(e){}
        }
      }
    }
  }, [listening, speechModeOpen, transcript, voiceStatus]);

  const toggleVoiceModeListening = () => {
      if (voiceStatus === 'Reviewing Data...') {
          if (readingIntervalRef.current) clearInterval(readingIntervalRef.current);
          startVoiceLoop();
      } else if (listening) {
          SpeechRecognition.stopListening();
      } else {
          window.speechSynthesis.cancel(); 
          resetTranscript();
          SpeechRecognition.startListening({ language: 'en-IN' });
      }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:relative z-20 md:translate-x-0 transition-transform duration-300 ease-in-out h-full`}>
        <Sidebar chatHistory={chatHistory} createNewChat={createNewChat} loadChat={loadChat} currentUser={currentUser} />
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full relative transition-all duration-300 ease-in-out ${speechModeOpen ? 'mr-[320px] sm:mr-[400px]' : 'mr-0'}`}>
        
        <header className="h-[64px] border-b border-slate-200 flex items-center justify-between px-6 bg-white shadow-sm z-10">
            <div className="flex items-center gap-4">
                <button 
                  className="md:hidden text-slate-400 hover:text-blue-600 transition-colors" 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-3 font-bold text-slate-800 tracking-tight">
                    <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100 shadow-inner">
                        <Hotel size={20} className="text-blue-600" />
                    </div>
                    <span className="text-lg">Aquila Grand Suites</span>
                </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6">
                <div className={`hidden sm:flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm ${
                  isConnected 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                    : 'bg-rose-50 text-rose-600 border-rose-200'
                }`}>
                    <Radio size={14} className={isConnected ? "animate-pulse" : ""} />
                    <span>{isConnected ? "Connected" : "Disconnected"}</span>
                </div>

                <button 
                    onClick={() => setSpeechModeOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all text-sm font-semibold"
                >
                    <Headphones size={18} className="animate-pulse opacity-90" />
                    <span className="hidden md:inline">Speech Mode</span>
                </button>
            </div>
        </header>

        <ChatArea messages={currentMessages} isLoading={isLoading} />
        <ChatInput onSend={handleSendMessage} disabled={isLoading || !isConnected} />
        
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" 
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>

      {/* ============================================== */}
      {/* NEW ULTRA-REALISTIC FULL-SCREEN ROBOT PANEL  */}
      {/* ============================================== */}
      <div className={`fixed top-0 right-0 h-full w-[320px] sm:w-[400px] bg-white border-l border-slate-200 shadow-2xl z-50 transform transition-transform duration-500 ease-out flex flex-col ${speechModeOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <button 
             onClick={() => setSpeechModeOpen(false)} 
             className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/80 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all shadow-md backdrop-blur-md"
          >
            <X size={20} strokeWidth={3} />
          </button>

          <div className="flex-1 relative w-full h-full">
             <RealisticAiAvatar status={voiceStatus} onClick={toggleVoiceModeListening} readCountdown={readCountdown} />
          </div>

          {/* 🔥 FIX: Glitch hatane ke liye heavy CSS animations ('animate-in', 'fade-in') hata di hain */}
          {transcript && (
            <div className="absolute bottom-10 left-6 right-6 z-50 px-5 py-3 bg-slate-900/80 backdrop-blur-md rounded-2xl text-center shadow-lg border border-white/20">
               <p className="text-[14px] text-white font-medium leading-relaxed italic">
                 "{transcript}"
               </p>
            </div>
          )}

      </div>
    </div>
  );
}

export default App;
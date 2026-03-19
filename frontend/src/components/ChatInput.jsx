import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

const ChatInput = ({ onSend, disabled, isHandsFree }) => {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(true);
  const textareaRef = useRef(null); 
  const recognitionRef = useRef(null);

 
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; 
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        let currentTrans = "";
        for (let i = 0; i < event.results.length; ++i) {
          currentTrans += event.results[i][0].transcript;
        }
        setInput(currentTrans);
        
        
        if (textareaRef.current) {
          textareaRef.current.style.height = '52px';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
      };

      recognition.onerror = (event) => {
        console.error("ChatInput Speech Error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setBrowserSupportsSpeech(false);
    }
  }, []);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
      
      
      if (isListening) {
        try { recognitionRef.current?.stop(); } catch(e) {}
        setIsListening(false);
      }
      
      if (textareaRef.current) {
        textareaRef.current.style.height = '52px';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  
  const toggleListening = () => {
    if (isListening) {
      try { recognitionRef.current?.stop(); } catch(e) {}
      setIsListening(false);
    } else {
      setInput(""); 
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Mic start error", e);
      }
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "52px"; 
    e.target.style.height = `${e.target.scrollHeight}px`; 
  };

  return (
    <div className="absolute bottom-0 left-0 w-full border-t border-slate-200 bg-white p-4">
      <div className="max-w-4xl mx-auto relative flex items-center">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask eGlobe AI..."
          rows={1}
          disabled={disabled}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-5 pr-24 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all overflow-y-auto scrollbar-thin shadow-sm hover:border-slate-300"
          style={{ minHeight: '52px', maxHeight: '150px' }}
        />
        
        <div className="absolute right-2 flex items-center gap-1.5">
           
           
           {browserSupportsSpeech && !isHandsFree && (
            <button
              onClick={toggleListening}
              disabled={disabled}
              className={`p-2.5 rounded-xl transition-all ${
                isListening 
                  ? 'text-red-500 bg-red-50 shadow-inner animate-pulse' 
                  : 'text-slate-400 hover:bg-slate-100 hover:text-blue-600'
              }`}
              title={isListening ? "Stop Voice Typing" : "Start Voice Typing"}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}

          <button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              !input.trim() || disabled 
                ? 'text-slate-300 bg-transparent' 
                : 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            <Send size={18} className={!input.trim() || disabled ? "" : "ml-0.5"} />
          </button>
        </div>
      </div>
      <div className="text-[11px] text-center font-medium text-slate-400 mt-3">
        eGlobe Intelligence may produce inaccurate results. Please verify important business data.
      </div>
    </div>
  );
};

export default ChatInput;
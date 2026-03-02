import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ChatInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
      resetTranscript();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false, language: 'en-IN' });
    }
  };

  return (
    // Naya Light Theme Container
    <div className="absolute bottom-0 left-0 w-full border-t border-slate-200 bg-white p-4">
      <div className="max-w-4xl mx-auto relative flex items-center">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Aquila AI..."
          rows={1}
          disabled={disabled}
          // Premium Input Field Styling
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-5 pr-24 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all overflow-hidden shadow-sm hover:border-slate-300"
          style={{ minHeight: '52px', maxHeight: '200px' }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />
        
        <div className="absolute right-2 flex items-center gap-1.5">
           {/* Mic Button */}
           {browserSupportsSpeechRecognition && (
            <button
              onClick={toggleListening}
              disabled={disabled}
              className={`p-2.5 rounded-xl transition-all ${
                listening 
                  ? 'text-red-500 bg-red-50 shadow-inner' 
                  : 'text-slate-400 hover:bg-slate-100 hover:text-blue-600'
              }`}
              title={listening ? "Stop listening" : "Start speaking"}
            >
              {listening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}

          {/* Send Button */}
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
        Aquila Intelligence may produce inaccurate results. Please verify important business data.
      </div>
    </div>
  );
};

export default ChatInput;
import React, { useState } from 'react';
import { Plus, MessageSquare, LogOut, Settings, MoreHorizontal, Trash2, History } from 'lucide-react';

const Sidebar = ({ chatHistory, createNewChat, loadChat, deleteChat, currentUser }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // 🔥 Naya state history chupane ke liye

  return (
    <div className="w-[280px] bg-slate-50 flex flex-col h-full border-r border-slate-200 relative">
      
      {/* Naya Header (New Chat + History Toggle) */}
      <div className="p-4 border-b border-slate-200/60 bg-white/50 flex gap-2">
        <button 
          onClick={createNewChat} 
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold text-blue-600 shadow-sm transition-all hover:border-blue-300 hover:shadow-md hover:bg-blue-50"
        >
          <Plus size={18} />
          New Chat
        </button>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className={`p-3 rounded-xl border transition-all flex items-center justify-center ${showHistory ? 'bg-blue-50 border-blue-300 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}
          title="Toggle History"
        >
          <History size={18} />
        </button>
      </div>

      {/* Chat History List (Sirf tab dikhega jab showHistory true ho) */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        {showHistory && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 mt-2">
              Recent Chats
            </div>
            <div className="flex flex-col gap-1">
              {chatHistory.map((chat) => (
                <div key={chat.id} className="group relative w-full flex items-center">
                  <button 
                    onClick={() => loadChat(chat.id)}
                    className="flex-1 flex items-center gap-3 rounded-xl p-3 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:shadow-sm hover:text-blue-600 truncate text-left border border-transparent hover:border-slate-200 pr-10"
                  >
                    <MessageSquare size={16} className="text-slate-400 shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </button>
                  {/* 🔥 Naya Delete Button (Hover par dikhega) */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Chat load hone se rokne ke liye
                      deleteChat(chat.id);
                    }}
                    className="absolute right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Chat"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile Settings Popup */}
      {showProfileMenu && (
        <div className="absolute bottom-20 left-4 w-[248px] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-bottom-2">
          <button className="flex w-full items-center gap-3 p-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors">
            <Settings size={16} className="text-slate-400" /> Settings & Preferences
          </button>
          <div className="h-[1px] bg-slate-100 my-1"></div>
          <button className="flex w-full items-center gap-3 p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={16} className="text-red-500" /> Sign Out
          </button>
        </div>
      )}

      {/* User Profile Section (Bottom) */}
      <div className="border-t border-slate-200 p-4 bg-white/50">
        <div 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center justify-between rounded-xl p-2.5 hover:bg-white hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-slate-200"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-bold text-white shadow-md">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-sm font-semibold truncate">
              <div className="text-slate-800">{currentUser.name}</div>
              <div className="text-xs font-medium text-slate-500">{currentUser.role}</div>
            </div>
          </div>
          <MoreHorizontal size={18} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
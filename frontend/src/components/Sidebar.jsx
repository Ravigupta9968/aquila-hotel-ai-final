import React, { useState } from 'react';
import { Plus, MessageSquare, LogOut, Settings, MoreHorizontal, Trash2, History, X, Mail, Key, User as UserIcon } from 'lucide-react';

const Sidebar = ({ chatHistory, createNewChat, loadChat, deleteChat, currentUser, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false); 

  return (
    <>
      <div className="w-[280px] bg-slate-50 flex flex-col h-full border-r border-slate-200 relative">
        <div className="p-4 border-b border-slate-200/60 bg-white/50 flex gap-2">
          <button onClick={createNewChat} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold text-blue-600 shadow-sm transition-all hover:border-blue-300 hover:shadow-md hover:bg-blue-50">
            <Plus size={18} /> New Chat
          </button>
          <button onClick={() => setShowHistory(!showHistory)} className={`p-3 rounded-xl border transition-all flex items-center justify-center ${showHistory ? 'bg-blue-50 border-blue-300 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`} title="Toggle History">
            <History size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
          {showHistory && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 mt-2">Recent Chats</div>
              <div className="flex flex-col gap-1">
                {chatHistory.map((chat) => (
                  <div key={chat.id} className="group relative w-full flex items-center">
                    <button onClick={() => loadChat(chat.id)} className="flex-1 flex items-center gap-3 rounded-xl p-3 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:shadow-sm hover:text-blue-600 truncate text-left border border-transparent hover:border-slate-200 pr-10">
                      <MessageSquare size={16} className="text-slate-400 shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }} className="absolute right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
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
            <button onClick={() => { setShowSettings(true); setShowProfileMenu(false); }} className="flex w-full items-center gap-3 p-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors">
              <Settings size={16} className="text-slate-400" /> Settings & Profile
            </button>
            <div className="h-[1px] bg-slate-100 my-1"></div>
            
            <button onClick={onLogout} className="flex w-full items-center gap-3 p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut size={16} className="text-red-500" /> Sign Out
            </button>
          </div>
        )}

        <div className="border-t border-slate-200 p-4 bg-white/50">
          <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center justify-between rounded-xl p-2.5 hover:bg-white hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-bold text-white shadow-md">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="text-sm font-semibold truncate">
                <div className="text-slate-800">{currentUser?.name}</div>
                <div className="text-xs font-medium text-slate-500">{currentUser?.role}</div>
              </div>
            </div>
            <MoreHorizontal size={18} className="text-slate-400" />
          </div>
        </div>
      </div>

      {/* 🌟 SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Settings size={20} className="text-blue-600" /> Profile Settings</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 bg-white hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-full transition-all shadow-sm"><X size={18} /></button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                 <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">{currentUser?.name?.charAt(0)}</div>
                 <div>
                    <h3 className="font-bold text-slate-800 text-lg">{currentUser?.name}</h3>
                    <span className="bg-blue-200 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{currentUser?.role}</span>
                 </div>
              </div>
              <div className="space-y-4 mt-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1"><Mail size={14}/> Email Address</label>
                  <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm">{currentUser?.email || "admin@eglobe.com"}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1"><Key size={14}/> Password</label>
                  <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm tracking-widest">{currentUser?.password ? "••••••••" : "••••••••"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
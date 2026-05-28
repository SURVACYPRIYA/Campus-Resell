import toast, { Toaster } from 'react-hot-toast';
import React, {
  useState,
  useEffect,
  useRef
} from 'react';

import { useLocation } from 'react-router-dom';

import axios from '../axios';

import socket from '../socket';

import {
  Send,
  Loader2,
  MessageSquare,
  Trash2,
  Smile,
  Mic
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

// Subtle neutral pattern for messages background
const chatBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f8fafc'/%3E%3Cg opacity='0.08' fill='none' stroke='%2394a3b8' stroke-width='1'%3E%3Ccircle cx='20' cy='20' r='8'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3Crect x='70' y='10' width='16' height='16' rx='3'/%3E%3Crect x='10' y='70' width='16' height='16' rx='3'/%3E%3Cpath d='M40 5 L45 15 L55 15 L47 22 L50 32 L40 26 L30 32 L33 22 L25 15 L35 15 Z'/%3E%3C/g%3E%3C/svg%3E")`;

const ChatPage = () => {

  const { user } = useAuth();
  const { markRead } = useNotification();
  const location = useLocation();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const hasAutoOpened = useRef(false);

  const isOnlyEmojis = (str) => {
    if (!str) return false;
    const noSpace = str.replace(/[\s\n]/g, '');
    if (noSpace.length === 0) return false;
    return /^[\p{Extended_Pictographic}\u2764\uFE0F\u200D]+$/u.test(noSpace);
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const emojiPickerRef = useRef(null);
  const recognitionRef = useRef(null);

  // CLOSE emoji picker on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // COMMON EMOJIS
  const EMOJIS = [
    '😊','😂','🤣','❤️','😍','🙏','😭','😘','👍','😅',
    '🔥','🎉','💯','😁','🥺','😢','😎','🤔','😴','👀',
    '💪','🤝','😉','🙌','✅','⭐','💰','📦','🏷️','🚀',
    '😆','😜','🤩','😋','🤗','😏','🥳','👋','💬','📱'
  ];

  const handleEmojiClick = (emoji) => {
    setNewMessage((prev) => prev + emoji);
  };

  // MIC — Web Speech API
  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast('Speech recognition is not supported in your browser. Try Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewMessage((prev) => prev ? prev + ' ' + transcript : transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      const res = await axios.get('/api/chats');
      const fetchedChats = res.data.data.chats;
      setChats(fetchedChats);
      
      // Join all chat rooms so we can receive live updates for them in the background
      fetchedChats.forEach(chat => {
        socket.emit('join_chat', chat._id);
      });
      
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  // FETCH CHATS ONCE ON MOUNT
  useEffect(() => { fetchChats(); }, []);

  // SOCKET LISTENER
  useEffect(() => {
    socket.on('receive_message', (data) => {
      if (activeChat && data.chatId === activeChat._id) {
        setMessages((prev) => [...prev, data]);
        // Mark as read immediately if it's the active chat and not my message
        if (data.sender._id !== user._id) {
           axios.post(`/api/chats/${data.chatId}/read`).catch(console.error);
           markRead(1);
        }
      } else {
        // Show premium custom toast notification instead of default tick
        toast.custom((t) => (
          <div
            style={{
              background: '#ffffff',
              padding: '12px 20px',
              borderRadius: '50px',
              boxShadow: '0 8px 24px rgba(35, 53, 89, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '2px solid var(--primary)',
              opacity: t.visible ? 1 : 0,
              transform: t.visible ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              cursor: 'pointer'
            }}
            onClick={() => toast.dismiss(t.id)}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #8b1a25)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '0.85rem'
            }}>
              {data.sender?.name?.charAt(0).toUpperCase() || '💬'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: '700', color: '#233559', fontSize: '0.9rem', lineHeight: '1.2' }}>
                {data.sender?.name || 'Someone'}
              </span>
              <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '500' }}>
                Sent you a new message
              </span>
            </div>
          </div>
        ), { duration: 4000 });
      }

      // Real-time update for the sidebar list
      setChats(prevChats => {
        let updatedChats = [...prevChats];
        const chatIndex = updatedChats.findIndex(c => c._id === data.chatId);
        
        if (chatIndex > -1) {
          // Create a shallow copy of the chat to avoid mutating state directly (fixes StrictMode double-increment)
          const chatToUpdate = { ...updatedChats[chatIndex] };
          updatedChats.splice(chatIndex, 1);
          
          chatToUpdate.lastMessage = data;
          
          if (data.sender._id !== user._id && (!activeChat || activeChat._id !== data.chatId)) {
            chatToUpdate.unreadCount = (chatToUpdate.unreadCount || 0) + 1;
          }
          
          updatedChats.unshift(chatToUpdate);
        }
        return updatedChats;
      });
    });
    return () => { socket.off('receive_message'); };
  }, [activeChat, user]);

  // AUTO-OPEN CHAT FROM PRODUCT PAGE (fires only once)
  useEffect(() => {
    if (!loading && location.state?.activeChatId && !hasAutoOpened.current) {
      hasAutoOpened.current = true;
      const found = chats.find((c) => c._id === location.state.activeChatId);
      if (found) selectChat(found);
    }
  }, [loading, chats]);

  // AUTO SCROLL
  useEffect(() => { scrollToBottom(); }, [messages]);

  const selectChat = async (chat) => {
    setActiveChat(chat);
    socket.emit('join_chat', chat._id);
    try {
      const res = await axios.get(`/api/chats/${chat._id}/messages`);
      setMessages(res.data.data.messages);

      // Clear unread count locally and mark as read in DB
      if (chat.unreadCount > 0) {
        setChats(prevChats => prevChats.map(c => 
          c._id === chat._id ? { ...c, unreadCount: 0 } : c
        ));
        await axios.post(`/api/chats/${chat._id}/read`).catch(err => console.error('Failed to mark as read', err));
        markRead(chat.unreadCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChat = (chatId) => {
    toast.custom((t) => (
      <div style={{
        background: '#ffffff', padding: '20px 24px', borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(35, 53, 89, 0.2)', display: 'flex', flexDirection: 'column', gap: '16px',
        border: '1px solid var(--glass-border)', opacity: t.visible ? 1 : 0,
        transform: t.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)', width: '320px', pointerEvents: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <Trash2 size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '700', color: '#233559', fontSize: '1.05rem' }}>Delete Chat</span>
            <span style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2px' }}>This conversation cannot be recovered.</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', fontSize: '0.9rem' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
          >Cancel</button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`/api/chats/${chatId}`);
                setChats(prev => prev.filter(c => c._id !== chatId));
                if (activeChat?._id === chatId) setActiveChat(null);
                toast.success('Conversation deleted');
              } catch (err) {
                console.error(err);
                toast.error('Failed to delete chat');
              }
            }}
            style={{ flex: 1, padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', fontSize: '0.9rem' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
          >Yes, Delete</button>
        </div>
      </div>
    ), { duration: Infinity, position: 'top-center', id: 'delete-chat-toast' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    socket.emit('send_message', {
      chatId: activeChat._id,
      senderId: user._id,
      content: newMessage
    });
    setNewMessage('');
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  if (loading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 140px)' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );

  return (
    <>
      <div style={{
        height: 'calc(100vh - 80px)',
        display: 'flex',
        background: 'var(--bg)',
        fontFamily: "'Segoe UI', sans-serif",
        overflow: 'hidden'
    }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: '340px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255,255,255,0.85)',
        borderRight: '1px solid var(--glass-border)',
        backdropFilter: 'blur(10px)'
      }}>

        {/* Sidebar Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          <h2 style={{ color: 'var(--text-main)', fontSize: '1.4rem', fontWeight: 'bold', margin: 0 }}>
            Messages
          </h2>
        </div>

        {/* Chat List */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {chats.length === 0 ? (
            <p style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No conversations yet.
            </p>
          ) : (
            chats.map((chat) => {
              const getOtherParticipant = (participants) => {
                const getUserId = (u) => (typeof u === 'string' ? u : (u._id || u.id));
                const currentUserId = getUserId(user);
                return participants.find(p => String(getUserId(p)) !== String(currentUserId)) || participants[0] || {};
              };
              const other = getOtherParticipant(chat.participants);
              const isActive = activeChat?._id === chat._id;

              return (
                <div
                  key={chat._id}
                  onClick={() => selectChat(chat)}
                  style={{
                    padding: '14px 20px',
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: isActive ? 'rgba(193,38,50,0.08)' : 'transparent',
                    borderBottom: '1px solid var(--glass-border)',
                    borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(193,38,50,0.04)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), #8b1a25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', userSelect: 'none' }}>
                      {other.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '3px' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {other.name || 'Unknown User'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                      {chat.lastMessage?.content || chat.product?.title || 'Product Chat'}
                    </p>
                  </div>
                  {/* UNREAD BADGE */}
                  {chat.unreadCount > 0 && (
                    <div style={{
                      background: '#16a34a', color: 'white', fontSize: '0.75rem', fontWeight: 'bold',
                      minWidth: '22px', height: '22px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', flexShrink: 0
                    }}>
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── CHAT WINDOW ── */}
      {activeChat ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Chat Header */}
          <div style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.92)',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexShrink: 0,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), #8b1a25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                  {(() => {
                    const getUserId = (u) => (typeof u === 'string' ? u : (u._id || u.id));
                    const currentUserId = getUserId(user);
                    const activeOther = activeChat.participants.find(p => String(getUserId(p)) !== String(currentUserId)) || activeChat.participants[0] || {};
                    return (activeOther.name || '?').charAt(0).toUpperCase();
                  })()}
                </span>
              </div>
              <div>
                <h3 style={{ color: 'var(--text-main)', margin: 0, fontSize: '1rem', fontWeight: '700' }}>
                  {(() => {
                    const getUserId = (u) => (typeof u === 'string' ? u : (u._id || u.id));
                    const currentUserId = getUserId(user);
                    const activeOther = activeChat.participants.find(p => String(getUserId(p)) !== String(currentUserId)) || activeChat.participants[0] || {};
                    return activeOther.name || 'Unknown User';
                  })()}
                </h3>
                {activeChat.product && (
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.78rem' }}>
                    {activeChat.product.title} · <span style={{ color: '#16a34a', fontWeight: '600' }}>₹{Number(activeChat.product.price).toLocaleString('en-IN')}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => handleDeleteChat(activeChat._id)}
              style={{
                background: 'var(--primary)', border: 'none', color: '#ffffff',
                cursor: 'pointer', padding: '8px 14px', borderRadius: '6px',
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s',
                boxShadow: '0 2px 5px rgba(193,38,50,0.3)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#8b1a25'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '16px 8%',
            background: '#f8fafc',
            backgroundImage: chatBg,
            backgroundSize: '100px 100px',
            display: 'flex', flexDirection: 'column', gap: '3px', minHeight: 0
          }}>
            {messages.length === 0 && (
              <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '0.9rem' }}>Send a message to start the conversation!</p>
              </div>
            )}

            {messages.map((msg, index) => {
              const isMine = msg.sender?._id === user._id;
              const onlyEmojis = isOnlyEmojis(msg.content);

              return (
                <div
                  key={msg._id || index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMine ? 'flex-end' : 'flex-start',
                    marginBottom: '2px'
                  }}
                >
                  <div style={{ position: 'relative', maxWidth: '65%' }}>

                    {/* Bubble tail */}
                    {!onlyEmojis && (
                      <div style={{
                        position: 'absolute', top: 0, width: 0, height: 0,
                        ...(isMine
                          ? { right: '-8px', borderLeft: '8px solid var(--primary)', borderTop: '8px solid transparent' }
                          : { left: '-8px', borderRight: '8px solid #cbd5e1', borderTop: '8px solid transparent' }
                        )
                      }} />
                    )}

                    {/* Bubble */}
                    <div style={{
                      background: onlyEmojis ? 'transparent' : (isMine ? 'var(--primary)' : '#cbd5e1'),
                      padding: onlyEmojis ? '0' : '7px 12px 5px',
                      borderRadius: isMine ? '10px 0px 10px 10px' : '0px 10px 10px 10px',
                      boxShadow: onlyEmojis ? 'none' : '0 1px 4px rgba(0,0,0,0.1)'
                    }}>

                      {/* Sender name (received only) */}
                      {!isMine && !onlyEmojis && (
                        <div style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '3px' }}>
                          {msg.sender?.name || 'Unknown'}
                        </div>
                      )}

                      {/* Message text */}
                      <span style={{
                        color: isMine ? '#ffffff' : 'var(--text-main)',
                        fontSize: onlyEmojis ? '3.5rem' : '0.92rem',
                        lineHeight: onlyEmojis ? '1.2' : '1.45',
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        display: 'inline-block'
                      }}>
                        {msg.content}
                      </span>

                      {/* Timestamp + ticks row */}
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                        gap: '3px', marginTop: onlyEmojis ? '0' : '3px', marginLeft: '12px',
                        float: onlyEmojis ? 'none' : 'right', clear: 'both',
                        background: onlyEmojis ? 'rgba(255,255,255,0.5)' : 'transparent',
                        padding: onlyEmojis ? '2px 6px' : '0',
                        borderRadius: onlyEmojis ? '10px' : '0',
                        alignSelf: 'flex-end', width: 'fit-content', marginLeft: onlyEmojis ? 'auto' : '12px'
                      }}>
                        <span style={{ fontSize: '0.67rem', color: onlyEmojis ? 'var(--text-muted)' : (isMine ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)'), lineHeight: 1 }}>
                          {formatTime(msg.createdAt)}
                        </span>
                        {isMine && (
                          <span style={{ fontSize: '0.7rem', color: onlyEmojis ? 'var(--primary)' : 'rgba(255,255,255,0.7)', letterSpacing: '-2px', lineHeight: 1 }}>
                            ✓✓
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Nego Templates */}
          <div style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.92)',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap', flexShrink: 0
          }}>
            {[
              'Is this still available?',
              'Will you take ₹100 less?',
              'Can we meet at Central Library?',
              'Can I inspect the item first?',
              'Block-D canteen at 3 PM today?'
            ].map((template, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setNewMessage(template)}
                style={{
                  padding: '5px 14px', borderRadius: '18px',
                  border: '1px solid var(--glass-border)', background: '#ffffff',
                  color: 'var(--text-main)', fontSize: '0.78rem', fontWeight: '500',
                  cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-main)'; }}
              >
                {template}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.92)',
              borderTop: '1px solid var(--glass-border)',
              flexShrink: 0
            }}
          >
            {/* EMOJI PICKER WRAPPER */}
            <div ref={emojiPickerRef} style={{ position: 'relative', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker((v) => !v)}
                title="Emoji"
                style={{
                  background: 'none', border: 'none',
                  color: showEmojiPicker ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px'
                }}
              >
                <Smile size={22} />
              </button>

              {/* EMOJI PANEL */}
              {showEmojiPicker && (
                <div style={{
                  position: 'absolute', bottom: '44px', left: 0,
                  background: '#ffffff', border: '1px solid var(--glass-border)',
                  borderRadius: '12px', padding: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  display: 'grid', gridTemplateColumns: 'repeat(8, max-content)',
                  gap: '8px', width: 'max-content', zIndex: 100
                }}>
                  {EMOJIS.map((emoji, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { handleEmojiClick(emoji); setShowEmojiPicker(false); }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '1.4rem', padding: '6px', borderRadius: '6px',
                        transition: 'background 0.15s', lineHeight: 'normal',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder="Type message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{
                flex: 1, background: '#f1f5f9',
                border: '1px solid var(--glass-border)',
                borderRadius: '24px', padding: '10px 18px',
                color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none'
              }}
            />

            {newMessage.trim() ? (
              <button
                type="submit"
                style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'var(--primary)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#8b1a25'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
              >
                <Send size={18} color="white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleMicClick}
                title={isListening ? 'Stop recording' : 'Voice input'}
                style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: isListening ? '#ef4444' : 'var(--primary)',
                  border: 'none', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                  transition: 'background 0.2s',
                  boxShadow: isListening ? '0 0 0 4px rgba(239,68,68,0.25)' : 'none',
                  animation: isListening ? 'pulse 1.2s infinite' : 'none'
                }}
              >
                <Mic size={18} color="white" />
              </button>
            )}
            <style>{`
              @keyframes pulse {
                0%, 100% { box-shadow: 0 0 0 4px rgba(239,68,68,0.25); }
                50% { box-shadow: 0 0 0 8px rgba(239,68,68,0.1); }
              }
            `}</style>
          </form>

        </div>
      ) : (
        /* No chat selected */
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#f8fafc', backgroundImage: chatBg, backgroundSize: '100px 100px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.92)', padding: '40px 60px', borderRadius: '16px',
            textAlign: 'center', boxShadow: '0 4px 20px rgba(193,38,50,0.08)',
            border: '1px solid var(--glass-border)'
          }}>
            <MessageSquare size={60} color="var(--primary)" style={{ opacity: 0.7, marginBottom: '16px' }} />
            <h2 style={{ color: 'var(--text-main)', margin: '0 0 8px', fontSize: '1.4rem' }}>Campus Resell Chat</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select a conversation to start chatting</p>
          </div>
        </div>
      )}

      </div>
    </>
  );
};

export default ChatPage;
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../axios';
import socket from '../socket';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';
import { MessageCircle } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [globalUnread, setGlobalUnread] = useState(0);

  // Fetch total unread count whenever user changes
  useEffect(() => {
    if (!user) {
      setGlobalUnread(0);
      return;
    }

    // Initial fetch
    const fetchUnread = async () => {
      try {
        const res = await axios.get('/api/chats');
        const chats = res.data.data.chats;
        const total = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
        setGlobalUnread(total);
      } catch (err) {
        console.error('NotificationContext: failed to fetch unread count', err);
      }
    };
    fetchUnread();

    // Register this user's personal socket room
    const registerRoom = () => {
      socket.emit('setup', user._id);
    };
    registerRoom();
    socket.on('connect', registerRoom);

    // When a new message arrives for this user (they are NOT the sender)
    const onNewMessage = (data) => {
      setGlobalUnread(prev => prev + 1);
      
      // Global toast notification
      if (data && data.sender && data.chatId !== window.currentActiveChatId) {
        toast.custom((t) => (
          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              padding: '14px 22px',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              opacity: t.visible ? 1 : 0,
              transform: t.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              cursor: 'pointer'
            }}
            onClick={() => {
              toast.dismiss(t.id);
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.1rem',
              flexShrink: 0,
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
            }}>
              {data.sender?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
              <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.2' }}>
                {data.sender?.name || 'Someone'}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginTop: '2px' }}>
                New message received
              </span>
            </div>

            <div style={{
              background: 'rgba(59, 130, 246, 0.15)',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa',
              flexShrink: 0
            }}>
              <MessageCircle size={22} />
            </div>
          </div>
        ), { duration: 4000 });
      }
    };
    socket.on('new_message_notification', onNewMessage);

    return () => {
      socket.off('connect', registerRoom);
      socket.off('new_message_notification', onNewMessage);
    };
  }, [user]);

  // Called by ChatPage when user reads a chat
  const markRead = (count = 1) => {
    setGlobalUnread(prev => Math.max(0, prev - count));
  };

  return (
    <NotificationContext.Provider value={{ globalUnread, markRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

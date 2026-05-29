import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../axios';
import socket from '../socket';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

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
            onClick={() => {
              toast.dismiss(t.id);
            }}
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

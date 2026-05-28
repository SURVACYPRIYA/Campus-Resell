import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../axios';
import socket from '../socket';
import { useAuth } from './AuthContext';

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
    const onNewMessage = () => {
      setGlobalUnread(prev => prev + 1);
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

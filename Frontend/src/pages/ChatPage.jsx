import React, {
  useState,
  useEffect,
  useRef
} from 'react';

import { useLocation } from 'react-router-dom';

import axios from '../axios';

import io from 'socket.io-client';

import {
  Send,
  Loader2,
  MessageSquare
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

// SOCKET CONNECTION
const socket = io(
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000'
);

const ChatPage = () => {

  const { user } = useAuth();

  const location = useLocation();

  const [chats, setChats] = useState([]);

  const [activeChat, setActiveChat] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [newMessage, setNewMessage] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const messagesEndRef = useRef(null);

  // AUTO SCROLL
  const scrollToBottom = () => {

    messagesEndRef.current?.
      scrollIntoView({
        behavior: 'smooth'
      });

  };

  // FETCH CHATS
  const fetchChats = async () => {

    try {

      const res = await axios.get(
        '/api/chats',
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setChats(res.data.data.chats);

      setLoading(false);

    } catch (err) {

      console.error(err);
    }
  };

  // SOCKET LISTENER
  useEffect(() => {

    fetchChats();

    socket.on(
      'receive_message',
      (data) => {

        if (
          activeChat &&
          data.chatId === activeChat._id
        ) {

          setMessages((prev) =>
            [...prev, data]
          );

        }

      }
    );

    return () => {

      socket.off(
        'receive_message'
      );

    };

  }, [activeChat]);

  // OPEN CHAT FROM PRODUCT PAGE
  useEffect(() => {

    if (
      location.state?.activeChatId
    ) {

      const chatId =
        location.state.activeChatId;

      if (chats.length > 0) {

        const found =
          chats.find(
            (c) => c._id === chatId
          );

        if (found)
          selectChat(found);

      }

    }

  }, [location.state, chats]);

  // AUTO SCROLL
  useEffect(() => {

    scrollToBottom();

  }, [messages]);

  // SELECT CHAT
  const selectChat = async (chat) => {

    setActiveChat(chat);

    socket.emit(
      'join_chat',
      chat._id
    );

    try {

      const res = await axios.get(
        `/api/chats/${chat._id}/messages`,
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setMessages(
        res.data.data.messages
      );

    } catch (err) {

      console.error(err);
    }
  };

  // SEND MESSAGE
  const handleSendMessage =
    async (e) => {

      e.preventDefault();

      if (
        !newMessage.trim() ||
        !activeChat
      ) return;

      socket.emit(
        'send_message',
        {
          chatId:
            activeChat._id,

          senderId:
            user._id,

          content:
            newMessage
        }
      );

      setNewMessage('');

    };

  // LOADING
  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '100px'
        }}
      >
        <Loader2
          className="animate-spin"
          size={48}
          color="var(--primary)"
        />
      </div>
    );

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        height:
          'calc(100vh - 150px)'
      }}
    >

      <div
        className="glass-card chat-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))', /* Fallback */
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {/* WE WILL USE CSS IN App.css FOR RESPONSIVENESS, OR JUST INLINE HERE */}
        <style>
          {`
            .chat-container {
              grid-template-columns: 350px minmax(0, 1fr) !important;
            }
            @media (max-width: 768px) {
              .chat-container {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>

        {/* SIDEBAR */}
        <div
          style={{
            borderRight:
              '1px solid var(--glass-border)',
            overflowY: 'auto'
          }}
        >

          <div
            style={{
              padding: '25px',
              borderBottom:
                '1px solid var(--glass-border)'
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              Messages
            </h2>
          </div>

          {chats.length === 0 ? (

            <p
              style={{
                padding: '40px',
                textAlign: 'center',
                color:
                  'var(--text-muted)'
              }}
            >
              No conversations yet.
            </p>

          ) : (

            chats.map((chat) => {

              const otherParticipant =
                chat.participants.find(
                  (p) =>
                    p._id !== user._id
                ) || chat.participants[0] || {};

              return (

                <div
                  key={chat._id}
                  onClick={() =>
                    selectChat(chat)
                  }
                  style={{
                    padding: '20px',
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition:
                      'all 0.2s',

                    background:
                      activeChat?._id ===
                      chat._id
                        ? 'rgba(29, 78, 216, 0.08)'
                        : 'transparent',

                    borderLeft:
                      activeChat?._id ===
                      chat._id
                        ? '4px solid var(--primary)'
                        : '4px solid transparent'
                  }}
                >

                  <img
                    src={
                      otherParticipant.avatar
                    }
                    alt=""
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%'
                    }}
                  />

                  <div
                    style={{
                      overflow: 'hidden',
                      flex: 1
                    }}
                  >

                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        marginBottom: '4px'
                      }}
                    >

                      <h4>
                        {
                          otherParticipant.name
                        }
                      </h4>

                      <span
                        style={{
                          fontSize: '0.7rem',
                          color:
                            'var(--text-muted)'
                        }}
                      >
                        {chat.product?.price
                          ? `₹${chat.product.price}`
                          : ''}
                      </span>

                    </div>

                    <p
                      style={{
                        fontSize: '0.85rem',
                        color:
                          'var(--text-muted)'
                      }}
                    >
                      {chat.product?.title ||
                        'Product Chat'}
                    </p>

                  </div>

                </div>

              );

            })

          )}

        </div>

        {/* CHAT WINDOW */}
        {activeChat ? (

          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >

            {/* HEADER */}
            <div
              style={{
                padding: '20px',
                borderBottom:
                  '1px solid var(--glass-border)'
              }}
            >

              <h3>
                {
                  activeChat
                    .participants.find(
                      (p) =>
                        p._id !== user._id
                    )?.name
                }
              </h3>

            </div>

            {/* MESSAGES */}
            <div
              style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}
            >

              {messages.map(
                (msg, index) => (

                  <div
                    key={
                      msg._id || index
                    }
                    style={{
                      alignSelf:
                        msg.sender?._id ===
                        user._id
                          ? 'flex-end'
                          : 'flex-start',

                      background:
                        msg.sender?._id ===
                        user._id
                          ? 'var(--primary)'
                          : '#e2e8f0',

                      padding:
                        '12px 18px',

                      borderRadius:
                        '18px',

                      maxWidth: '70%',

                      color:
                        msg.sender?._id ===
                        user._id
                          ? '#ffffff'
                          : 'var(--text-main)'
                    }}
                  >

                    {msg.content}

                  </div>

                )
              )}

              <div
                ref={messagesEndRef}
              />

            </div>

            {/* QUICK NEGO TEMPLATES */}
            <div style={{
              padding: '10px 20px',
              borderTop: '1px solid var(--glass-border)',
              background: '#f8fafc',
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}>
              {[
                "Is this still available?",
                "Will you take ₹100 less?",
                "Can we meet at Central Library?",
                "Can I inspect the item first?",
                "Block-D canteen at 3 PM today?"
              ].map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNewMessage(template)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    background: '#ffffff',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.background = 'rgba(193, 38, 50, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  {template}
                </button>
              ))}
            </div>

            {/* INPUT */}
            <form
              onSubmit={
                handleSendMessage
              }
              style={{
                display: 'flex',
                gap: '10px',
                padding: '20px',
                borderTop:
                  '1px solid var(--glass-border)'
              }}
            >

              <input
                type="text"
                className="input-glass"
                placeholder="Type message..."
                value={newMessage}
                onChange={(e) =>
                  setNewMessage(
                    e.target.value
                  )
                }
              />

              <button
                type="submit"
                className="btn-primary"
              >

                <Send size={20} />

              </button>

            </form>

          </div>

        ) : (

          <div
            style={{
              display: 'flex',
              justifyContent:
                'center',
              alignItems: 'center',
              color:
                'var(--text-muted)'
            }}
          >

            <div
              style={{
                textAlign: 'center'
              }}
            >

              <MessageSquare
                size={60}
                style={{
                  opacity: 0.2
                }}
              />

              <p>
                Select a chat
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default ChatPage;
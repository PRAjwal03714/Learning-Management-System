'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { FaUser, FaPaperPlane, FaSmile } from 'react-icons/fa';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  created_at: string;
  status: 'delivered' | 'read';
  profile_picture?: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline';
  last_active: string;
  profile_picture?: string;
}

export default function CourseChat() {
  const { id: courseId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<'group' | string>('group');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    if (!courseId) {
      console.error('No courseId provided');
      setError('Course ID is missing');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No auth token found');
      setError('Please log in to access the chat');
      return;
    }

    console.log('Initializing chat with courseId:', courseId);
    
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([fetchMessages(true), fetchUsers()]);
        setInitialLoadComplete(true);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching initial data:', {
            message: error.message,
            response: axios.isAxiosError(error) ? error.response?.data : undefined,
            status: axios.isAxiosError(error) ? error.response?.status : undefined,
            courseId,
            selectedRoom
          });
          setError(axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to load chat data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
    // Set up polling for new messages and user status
    const pollInterval = setInterval(() => {
      if (!document.hidden) {
        fetchMessages(false).catch(console.error);
        fetchUsers().catch(console.error);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [courseId, selectedRoom]);

  // Update online status
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !courseId) return;

    // Set status to online when component mounts
    const setOnlineStatus = async () => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/status`,
          { status: 'online' },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } catch (error) {
        console.error('Error updating online status:', error);
      }
    };

    // Set user as online
    setOnlineStatus();

    // Set up event listeners for page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User left the page
        axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/status`,
          { status: 'offline' },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        ).catch(console.error);
      } else {
        // User returned to the page
        axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/status`,
          { status: 'online' },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        ).catch(console.error);
      }
    };

    // Set up event listeners for window focus changes
    const handleFocusChange = () => {
      if (document.hasFocus()) {
        axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/status`,
          { status: 'online' },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        ).catch(console.error);
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocusChange);

    // Cleanup: Set status to offline when component unmounts
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocusChange);
      
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/status`,
        { status: 'offline' },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      ).catch(console.error);
    };
  }, [courseId]);

  const fetchMessages = async (isInitialLoad: boolean = false) => {
    const token = localStorage.getItem('token');
    if (!token || !courseId) return;

    try {
      console.log('Fetching messages:', {
        courseId,
        selectedRoom,
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/chat/${courseId}/messages${selectedRoom === 'group' ? '' : `/${selectedRoom}`}`
      });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/${courseId}/messages${selectedRoom === 'group' ? '' : `/${selectedRoom}`}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Messages response:', response.data);
      const newMessages = response.data.messages || [];
      
      // Only scroll if:
      // 1. Not initial load AND
      // 2. There are new messages AND
      // 3. Initial load is complete
      if (!isInitialLoad && newMessages.length > messages.length && initialLoadComplete) {
        setMessages(newMessages);
        scrollToBottom('smooth');
      } else {
        setMessages(newMessages);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching messages:', {
          message: error.message,
          response: axios.isAxiosError(error) ? error.response?.data : undefined,
          status: axios.isAxiosError(error) ? error.response?.status : undefined
        });
      }
      throw error;
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token || !courseId) return;

    try {
      console.log('Fetching users:', {
        courseId,
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/chat/${courseId}/users`
      });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/${courseId}/users`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Users response:', response.data);
      setUsers(response.data.users || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching users:', {
          message: error.message,
          response: axios.isAxiosError(error) ? error.response?.data : undefined,
          status: axios.isAxiosError(error) ? error.response?.status : undefined
        });
      }
      throw error;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/${courseId}/messages${selectedRoom === 'group' ? '' : `/${selectedRoom}`}`,
        { content: newMessage },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setNewMessage('');
      await fetchMessages();
      scrollToBottom('smooth'); // Scroll after sending a new message
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-600">Loading chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="-mt-4 flex h-full bg-white relative">
      {/* Users List with its own border */}
      <div className="w-64 overflow-y-auto bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">Course Chat</h2>
        </div>
        <div className="p-2">
          <div
            onClick={() => setSelectedRoom('group')}
            className={`p-3 rounded-lg mb-2 cursor-pointer ${
              selectedRoom === 'group' ? 'bg-[#8e2c2c] text-white' : 'hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">Course Group Chat</div>
          </div>
          {users.map(user => (
            <div
              key={user.id}
              onClick={() => setSelectedRoom(user.id)}
              className={`p-3 rounded-lg mb-2 cursor-pointer ${
                selectedRoom === user.id ? 'bg-[#8e2c2c] text-white' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className="relative">
                  {user.profile_picture ? (
                    <img 
                    src={
                      user.profile_picture?.startsWith('http')
                        ? user.profile_picture
                        : `${process.env.NEXT_PUBLIC_API_URL}${user.profile_picture}`
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  
                  ) : (
                    <FaUser className={`w-8 h-8 ${selectedRoom === user.id ? 'text-white' : 'text-gray-600'}`} />
                  )}
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{user.name}</div>
                    {user.role === 'instructor' && (
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        selectedRoom === user.id 
                          ? 'bg-white text-[#8e2c2c]' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        INSTRUCTOR
                      </span>
                    )}
                  </div>
                  <div className={`text-xs ${selectedRoom === user.id ? 'text-white' : 'text-gray-500'}`}>
                    {user.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h3 className="font-semibold">
            {selectedRoom === 'group' ? 'Course Group Chat' : users.find(u => u.id === selectedRoom)?.name}
          </h3>
          {isTyping && <div className="text-sm text-gray-500">Someone is typing...</div>}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="flex items-start">
                {message.profile_picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
  src={
    message.profile_picture?.startsWith('http')
      ? message.profile_picture
      : `${process.env.NEXT_PUBLIC_API_URL}${message.profile_picture}`
  }
  alt={message.sender_name}
  className="w-6 h-6 rounded-full object-cover mt-1"
/>

                ) : (
                  <FaUser className="text-gray-600 w-6 h-6 mt-1" />
                )}
                <div className="ml-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${message.sender_role === 'instructor' ? 'text-blue-600' : ''}`}>
                      {message.sender_name}
                    </span>
                    {message.sender_role === 'instructor' && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-medium">
                        INSTRUCTOR
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`mt-1 ${message.sender_role === 'instructor' ? 'text-blue-800' : 'text-gray-800'}`}>
                    {message.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{message.status}</div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-[#8e2c2c]"
            />
            <button
              type="button"
              className="p-2 bg-gray-100 border border-l-0 border-gray-300 hover:bg-gray-200"
            >
              <FaSmile className="text-gray-600 w-5 h-5" />
            </button>
            <button
              type="submit"
              className="p-2 bg-[#8e2c2c] text-white rounded-r-lg hover:bg-[#7a2424]"
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
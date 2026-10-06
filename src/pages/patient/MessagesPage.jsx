import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaPaperPlane, 
  FaPaperclip, 
  FaSearch, 
  FaEllipsisV, 
  FaPhone, 
  FaVideo, 
  FaInfoCircle,
  FaChevronLeft,
  FaComments
} from 'react-icons/fa';
import { format } from 'date-fns';

const MessagesPage = () => {
  const { t, i18n } = useTranslation();
  const [activeThread, setActiveThread] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const isRTL = i18n.language === 'ar';
  
  // Mock data - replace with real data from your API
  const [threads, setThreads] = useState([
    { 
      id: 1, 
      name: 'Dr. Ahmed Ben Salah', 
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'Cardiologist',
      lastMessage: 'Your test results are ready. Please schedule a follow-up appointment.', 
      time: '2h ago', 
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: true,
      messages: [
        { id: 1, sender: 'them', text: 'Hello, your test results are ready.', time: '10:30 AM' },
        { id: 2, sender: 'me', text: 'Thank you doctor. What do they show?', time: '10:32 AM' },
        { id: 3, sender: 'them', text: 'Everything looks good, but I recommend a follow-up appointment to discuss the details.', time: '10:35 AM' },
      ]
    },
    { 
      id: 2, 
      name: 'Cardiology Department', 
      avatar: 'https://img.icons8.com/color/96/000000/medical-doctor.png',
      role: 'Hospital Department',
      lastMessage: 'Appointment reminder for tomorrow at 2:00 PM', 
      time: '1d ago', 
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unread: false,
      messages: [
        { id: 1, sender: 'them', text: 'This is a reminder for your appointment tomorrow at 2:00 PM.', time: '9:00 AM' },
        { id: 2, sender: 'them', text: 'Please arrive 15 minutes early for check-in.', time: '9:00 AM' },
      ]
    },
    { 
      id: 3, 
      name: 'Dr. Leila Trabelsi', 
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'Dermatologist',
      lastMessage: 'Your prescription has been renewed', 
      time: '3d ago', 
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      unread: false,
      messages: [
        { id: 1, sender: 'them', text: 'I\'ve renewed your prescription. You can pick it up at your pharmacy.', time: '11:20 AM' },
        { id: 2, sender: 'me', text: 'Thank you, doctor. How long should I continue this medication?', time: '11:25 AM' },
        { id: 3, sender: 'them', text: 'Continue for 2 more weeks and then we can reassess.', time: '11:30 AM' },
      ]
    },
  ]);

  const activeThreadData = threads.find(t => t.id === activeThread);
  const filteredThreads = threads.filter(thread => 
    thread.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Auto-scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThreadData?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const updatedThreads = threads.map(thread => {
      if (thread.id === activeThread) {
        const newMsg = {
          id: thread.messages.length + 1,
          sender: 'me',
          text: newMessage,
          time: format(new Date(), 'h:mm a')
        };
        return {
          ...thread,
          lastMessage: newMessage,
          time: 'Just now',
          timestamp: new Date(),
          messages: [...thread.messages, newMsg]
        };
      }
      return thread;
    });

    setThreads(updatedThreads);
    setNewMessage('');
  };

  const markAsRead = (threadId) => {
    setThreads(threads.map(thread => 
      thread.id === threadId ? { ...thread, unread: false } : thread
    ));
  };

  const formatMessageTime = (date) => {
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return format(date, 'EEEE'); // Day of week
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm overflow-hidden ${isRTL ? 'rtl' : ''}`}>
      <div className="flex flex-1 overflow-hidden">
        {/* Thread list */}
        <div className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${!activeThread ? 'flex' : 'hidden md:flex'}`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">{t('messages.title')}</h1>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <FaEllipsisV className="text-gray-500" />
              </button>
            </div>
            <div className="mt-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('messages.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
                <FaSearch className="h-10 w-10 mb-2 opacity-30" />
                <p>{t('messages.noThreadsFound')}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredThreads.map((thread) => (
                  <div 
                    key={thread.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer flex items-start ${
                      activeThread === thread.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      setActiveThread(thread.id);
                      markAsRead(thread.id);
                    }}
                  >
                    <img 
                      src={thread.avatar} 
                      alt={thread.name}
                      className="h-12 w-12 rounded-full object-cover mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className={`text-sm font-medium truncate ${
                          thread.unread ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {thread.name}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {thread.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{thread.role}</p>
                      <p className={`text-sm mt-1 ${
                        thread.unread ? 'font-medium text-gray-900' : 'text-gray-500'
                      }`}>
                        {thread.lastMessage}
                      </p>
                    </div>
                    {thread.unread && (
                      <div className="ml-2 flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-blue-500 text-white text-xs">
                        {thread.unread ? '1' : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message area */}
        {activeThreadData ? (
          <div className="flex-1 flex flex-col md:flex">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center">
                <button 
                  className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setActiveThread(null)}
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                <img 
                  src={activeThreadData.avatar} 
                  alt={activeThreadData.name}
                  className="h-10 w-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h2 className="font-medium text-gray-900">{activeThreadData.name}</h2>
                  <p className="text-xs text-gray-500">{activeThreadData.role}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900">
                  <FaPhone className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900">
                  <FaVideo className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900">
                  <FaInfoCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="max-w-3xl mx-auto space-y-4">
                {activeThreadData.messages.map((message, index) => {
                  // Check if we need to show date header
                  const showDateHeader = index === 0 || 
                    formatMessageTime(activeThreadData.timestamp) !== 
                    formatMessageTime(activeThreadData.messages[index - 1]?.timestamp);

                  return (
                    <React.Fragment key={message.id}>
                      {showDateHeader && (
                        <div className="flex justify-center my-4">
                          <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                            {formatMessageTime(activeThreadData.timestamp)}
                          </span>
                        </div>
                      )}
                      <div 
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                            message.sender === 'me' 
                              ? 'bg-blue-500 text-white rounded-br-none' 
                              : 'bg-white border border-gray-200 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 text-right ${
                            message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <button type="button" className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                  <FaPaperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  className="flex-1 mx-3 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('messages.typeMessage')}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="p-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={!newMessage.trim()}
                >
                  <FaPaperPlane className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center p-8 max-w-md">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <FaComments className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{t('messages.noThreadSelected')}</h3>
              <p className="text-gray-500 text-sm">
                {t('messages.selectThreadToStart')}
              </p>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {[1, 2, 3].map((msg) => (
                  <div key={msg} className={`flex ${msg % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg % 2 === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                    >
                      <p>This is a sample message {msg}. In a real app, this would be the actual message content.</p>
                      <p className="text-xs mt-1 opacity-70">10:30 AM</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;

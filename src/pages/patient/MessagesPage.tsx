import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { format, formatDistanceToNow } from 'date-fns';
import { fr, arTN } from 'date-fns/locale';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  read: boolean;
}

interface Thread {
  id: string;
  participant: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    read: boolean;
  };
  unreadCount: number;
}

export default function MessagesPage() {
  const { t, i18n } = useTranslation();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentLanguage = i18n.language;

  // Fetch threads list
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/messages/threads', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        // });
        // const data = await response.json();
        
        // Mock data
        const mockThreads: Thread[] = [
          {
            id: '1',
            participant: {
              id: 'doc1',
              name: 'Dr. Sarah Johnson',
              role: 'Cardiologist',
            },
            lastMessage: {
              content: 'Your test results look good. We can discuss them in our next appointment.',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              read: false,
            },
            unreadCount: 2,
          },
          {
            id: '2',
            participant: {
              id: 'doc2',
              name: 'Dr. Michael Chen',
              role: 'Dermatologist',
            },
            lastMessage: {
              content: 'Please apply the prescribed cream twice daily.',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              read: true,
            },
            unreadCount: 0,
          },
        ];
        
        setThreads(mockThreads);
        
        // Auto-select first thread if available
        if (mockThreads.length > 0) {
          setSelectedThread(mockThreads[0]);
        }
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, []);

  // Fetch messages for selected thread
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedThread) return;
      
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/messages/threads/${selectedThread.id}`, {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        // });
        // const data = await response.json();
        
        // Mock data - generate some sample messages
        const mockMessages: Message[] = [
          {
            id: '1',
            sender: {
              id: 'user1',
              name: 'You',
            },
            content: 'Hello Doctor, I was wondering about my test results?',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: true,
          },
          {
            id: '2',
            sender: {
              id: selectedThread.participant.id,
              name: selectedThread.participant.name,
            },
            content: 'Hello! I have your test results. When would you like to discuss them?',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: true,
          },
          {
            id: '3',
            sender: {
              id: 'user1',
              name: 'You',
            },
            content: 'Can we schedule a call tomorrow?',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            read: true,
          },
          {
            id: '4',
            sender: {
              id: selectedThread.participant.id,
              name: selectedThread.participant.name,
            },
            content: 'Your test results look good. We can discuss them in our next appointment.',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            read: false,
          },
        ];
        
        setMessages(mockMessages);
        
        // Mark messages as read
        // TODO: Implement API call to mark messages as read
        // await fetch(`/api/messages/threads/${selectedThread.id}/read`, {
        //   method: 'POST',
        //   headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        // });
        
        // Update thread's unread count in the UI
        setThreads(prevThreads => 
          prevThreads.map(thread => 
            thread.id === selectedThread.id 
              ? { ...thread, unreadCount: 0, lastMessage: { ...thread.lastMessage, read: true } } 
              : thread
          )
        );
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [selectedThread]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThread) return;
    
    const tempId = `temp-${Date.now()}`;
    const newMsg: Message = {
      id: tempId,
      sender: {
        id: 'user1', // Current user ID
        name: 'You',
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    // Optimistically update UI
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/messages/threads/${selectedThread.id}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      //   },
      //   body: JSON.stringify({ content: newMessage })
      // });
      // const sentMessage = await response.json();
      
      // Update the message with the real ID from the server
      // setMessages(prev => 
      //   prev.map(msg => msg.id === tempId ? { ...msg, id: sentMessage.id } : msg)
      // );
      
      // Simulate server response
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId 
              ? { ...msg, id: `real-${Date.now()}` } 
              : msg
          )
        );
      }, 1000);
      
      // Update the thread's last message in the sidebar
      setThreads(prevThreads => 
        prevThreads.map(thread => 
          thread.id === selectedThread.id
            ? {
                ...thread,
                lastMessage: {
                  content: newMessage,
                  timestamp: new Date().toISOString(),
                  read: true,
                },
                unreadCount: 0,
              }
            : thread
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // Revert optimistic update on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If message is from today, show time only
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'HH:mm');
    }
    
    // If message is from yesterday, show 'Yesterday'
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return t('messages.yesterday');
    }
    
    // If message is from the last 7 days, show day name
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (date > oneWeekAgo) {
      return format(date, 'EEEE', {
        locale: currentLanguage === 'fr' ? fr : currentLanguage === 'ar' ? arTN : undefined
      });
    }
    
    // Otherwise, show date
    return format(date, 'MMM d, yyyy');
  };

  if (isLoading && threads.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Threads sidebar */}
        <div className="w-full md:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">{t('messages.messages')}</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {threads.map(thread => (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedThread?.id === thread.id ? 'bg-blue-50 dark:bg-gray-800' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{thread.participant.name}</h3>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(thread.lastMessage.timestamp), {
                      addSuffix: true,
                      locale: currentLanguage === 'fr' ? fr : currentLanguage === 'ar' ? arTN : undefined
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                  {thread.lastMessage.content}
                </p>
                {thread.unreadCount > 0 && (
                  <div className="mt-1">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {thread.unreadCount} {t('messages.unread')}
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            {threads.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                {t('messages.noThreads')}
              </div>
            )}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedThread ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-200 font-medium">
                  {selectedThread.participant.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{selectedThread.participant.name}</h3>
                  <p className="text-xs text-gray-500">{selectedThread.participant.role}</p>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <svg
                      className="h-12 w-12 mb-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <p>{t('messages.noMessages')}</p>
                    <p className="text-sm">{t('messages.startConversation')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const isCurrentUser = message.sender.id === 'user1'; // Replace with actual user ID check
                      const showHeader = index === 0 || 
                        messages[index - 1].sender.id !== message.sender.id ||
                        (new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime()) > 3600000; // 1 hour
                      
                      return (
                        <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl ${isCurrentUser ? 'ml-auto' : 'mr-auto'}`}>
                            {showHeader && !isCurrentUser && (
                              <div className="text-xs text-gray-500 mb-1">
                                {message.sender.name} • {formatMessageTime(message.timestamp)}
                              </div>
                            )}
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                isCurrentUser
                                  ? 'bg-blue-500 text-white rounded-br-none'
                                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{message.content}</p>
                              <div className={`text-right mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500 text-xs'}`}>
                                {format(new Date(message.timestamp), 'HH:mm')}
                                {isCurrentUser && (
                                  <span className="ml-1">
                                    {message.read ? '✓✓' : '✓'}
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
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('messages.typeMessage')}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('messages.send')}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6">
              <svg
                className="h-16 w-16 mb-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <h3 className="text-lg font-medium">{t('messages.selectConversation')}</h3>
              <p className="text-sm mt-1 text-center max-w-md">
                {t('messages.selectConversationDescription')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faSearch, 
  faPaperclip,
  faPaperPlane,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import styles from '../Dashboard.module.css';

interface Message {
  id: number;
  sender: string;
  preview: string;
  time: string;
  unread: boolean;
  avatar: string;
}

const MessagesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [message, setMessage] = useState('');

  const messages: Message[] = [
    {
      id: 1,
      sender: 'Dr. Sarah Smith',
      preview: 'Your test results are in. Please schedule a follow-up appointment to discuss...',
      time: 'Today, 9:45 AM',
      unread: true,
      avatar: 'SS'
    },
    {
      id: 2,
      sender: 'Billing Department',
      preview: 'Your insurance has processed the claim for your recent visit. You owe...',
      time: 'Yesterday, 3:22 PM',
      unread: true,
      avatar: 'BD'
    },
    {
      id: 3,
      sender: 'Dr. Michael Johnson',
      preview: 'The prescription you requested has been sent to your pharmacy...',
      time: 'Aug 28, 11:30 AM',
      unread: false,
      avatar: 'MJ'
    },
    {
      id: 4,
      sender: 'Appointment Reminders',
      preview: 'Friendly reminder about your upcoming appointment on September 15 at 2:00 PM...',
      time: 'Aug 25, 2:15 PM',
      unread: false,
      avatar: 'AR'
    },
    {
      id: 5,
      sender: 'Dr. Emily Williams',
      preview: 'I\'ve reviewed your MRI results. Please call the office to schedule a time to discuss...',
      time: 'Aug 20, 4:45 PM',
      unread: false,
      avatar: 'EW'
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className={styles.messagesContainer}>
      <div className={styles.messagesSidebar}>
        <div className={styles.messagesHeader}>
          <h2>Messages</h2>
          <button className={styles.primaryButton}>
            <FontAwesomeIcon icon={faPlus} className={styles.buttonIcon} />
            New Message
          </button>
        </div>
        
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search messages..." 
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.messageTabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'inbox' ? styles.active : ''}`}
            onClick={() => setActiveTab('inbox')}
          >
            Inbox
            <span className={styles.unreadBadge}>2</span>
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'sent' ? styles.active : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'drafts' ? styles.active : ''}`}
            onClick={() => setActiveTab('drafts')}
          >
            Drafts
          </button>
        </div>
        
        <div className={styles.messageList}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`${styles.messageItem} ${msg.unread ? styles.unread : ''} ${selectedMessage?.id === msg.id ? styles.active : ''}`}
              onClick={() => setSelectedMessage(msg)}
            >
              <div className={styles.messageAvatar}>
                {msg.avatar}
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageHeader}>
                  <span className={styles.messageSender}>{msg.sender}</span>
                  <span className={styles.messageTime}>{msg.time}</span>
                </div>
                <div className={styles.messagePreview}>
                  {msg.preview}
                </div>
              </div>
              {msg.unread && <div className={styles.unreadDot}></div>}
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.messageDetail}>
        {selectedMessage ? (
          <>
            <div className={styles.messageDetailHeader}>
              <div className={styles.messageRecipient}>
                <div className={styles.messageAvatar}>
                  {selectedMessage.avatar}
                </div>
                <div>
                  <div className={styles.messageRecipientName}>{selectedMessage.sender}</div>
                  <div className={styles.messageRecipientStatus}>Online</div>
                </div>
              </div>
              <button className={styles.messageActionButton}>
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </div>
            
            <div className={styles.messageThread}>
              <div className={styles.messageBubble}>
                <div className={styles.messageText}>
                  {selectedMessage.preview}
                </div>
                <div className={styles.messageTimeStamp}>
                  {selectedMessage.time}
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSendMessage} className={styles.messageCompose}>
              <div className={styles.messageToolbar}>
                <button type="button" className={styles.messageToolbarButton}>
                  <FontAwesomeIcon icon={faPaperclip} />
                </button>
              </div>
              <textarea 
                className={styles.messageInput}
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
              <div className={styles.messageActions}>
                <button type="submit" className={styles.primaryButton}>
                  <FontAwesomeIcon icon={faPaperPlane} className={styles.buttonIcon} />
                  Send Message
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className={styles.noMessageSelected}>
            <div className={styles.noMessageIcon}>💬</div>
            <h3>Select a message to view</h3>
            <p>Choose a message from the list or start a new conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesSection;

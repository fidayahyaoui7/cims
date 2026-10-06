import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import messagingClient from '../services/messagingClient';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const MessagesPage = () => {
  const { t } = useTranslation();
  const query = useQuery();
  const [conversationId, setConversationId] = useState(query.get('conv') || 'demo');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    // init socket once
    const token = localStorage.getItem('access') || localStorage.getItem('token');
    if (!token) return;
    try {
      messagingClient.init({ token, url: process.env.REACT_APP_WS_URL || 'http://localhost:4000' });
      setConnected(true);
    } catch (e) {
      setConnected(false);
    }

    const off = messagingClient.onMessage((msg) => {
      // only show current conversation
      if (!msg?.conversationId || msg.conversationId !== conversationId) return;
      setMessages((prev) => [...prev, msg]);
    });
    return () => off();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // scroll to bottom on new messages
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onApplyKey = () => {
    messagingClient.setEncryptionKey(encryptionKey || null);
  };

  const send = () => {
    if (!input.trim()) return;
    try {
      messagingClient.sendMessage({ conversationId, content: input.trim(), contentType: 'text/plain' });
      setInput('');
    } catch (e) {
      // ignore UI error for now
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1>{t('messages') || 'Messages'}</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <input
          value={conversationId}
          onChange={(e) => setConversationId(e.target.value)}
          placeholder={t('conversation_id') || 'Conversation ID'}
          style={{ flex: 1, padding: 8 }}
        />
        <input
          value={encryptionKey}
          onChange={(e) => setEncryptionKey(e.target.value)}
          placeholder={t('encryption_key_optional') || 'Encryption key (optional)'}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={onApplyKey} className="btn btn-secondary">
          {t('apply') || 'Apply'}
        </button>
      </div>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, height: 420, overflowY: 'auto' }}>
        {!connected && (
          <div style={{ color: '#a00', marginBottom: 8 }}>{t('not_connected') || 'Not connected'}</div>
        )}
        {messages.map((m) => (
          <div key={m.id || `${m.senderId}-${m.createdAt || Math.random()}`} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: '#666' }}>{m.senderId} · {new Date(m.createdAt || Date.now()).toLocaleString()}</div>
            <div>{m.content}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={t('type_message') || 'Type a message'}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={send} className="btn btn-primary">
          {t('send') || 'Send'}
        </button>
      </div>
    </div>
  );
};

export default MessagesPage;

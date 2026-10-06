// Socket.IO-based messaging client with optional AES encryption
// Matches server protocol in server-auth/src/realtime.js

import { io } from 'socket.io-client';
import CryptoJS from 'crypto-js';

const DEFAULT_URL = process.env.REACT_APP_WS_URL || 'http://localhost:4000';

class MessagingClient {
  constructor() {
    this.socket = null;
    this.encryptionKey = null; // optional
    this.connected = false;
    this.handlers = new Set(); // listeners for incoming messages
  }

  // Initialize connection using JWT access token (stored by auth flow)
  init({ token, url = DEFAULT_URL, encryptionKey = null }) {
    if (!token) {
      const stored = localStorage.getItem('access') || localStorage.getItem('token');
      token = stored || token;
    }
    if (!token) throw new Error('MessagingClient: missing auth token');

    this.encryptionKey = encryptionKey || this.encryptionKey;

    // Close previous connection if any
    if (this.socket) {
      try { this.socket.close(); } catch {}
      this.socket = null;
    }

    this.socket = io(url, {
      transports: ['websocket'],
      auth: { token },
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
    });

    // Incoming messages broadcast by server
    this.socket.on('message:new', (msg) => {
      const normalized = this._maybeDecrypt(msg);
      this.handlers.forEach((cb) => cb(normalized));
    });

    return this;
  }

  onMessage(cb) {
    this.handlers.add(cb);
    return () => this.handlers.delete(cb);
  }

  sendMessage({ conversationId, content, contentType = 'text/plain' }) {
    if (!this.socket || !this.connected) throw new Error('Socket not connected');
    const payload = {
      conversationId,
      content: this._maybeEncrypt(content),
      contentType,
    };
    this.socket.emit('message:send', payload);
  }

  setEncryptionKey(key) {
    this.encryptionKey = key;
  }

  _maybeEncrypt(content) {
    if (!this.encryptionKey) return content;
    return CryptoJS.AES.encrypt(String(content), this.encryptionKey).toString();
  }

  _maybeDecrypt(message) {
    const copy = { ...message };
    if (this.encryptionKey && typeof copy.content === 'string') {
      try {
        const bytes = CryptoJS.AES.decrypt(copy.content, this.encryptionKey);
        copy.content = bytes.toString(CryptoJS.enc.Utf8) || copy.content;
      } catch {
        // keep original if decryption fails
      }
    }
    return copy;
  }
}

const messagingClient = new MessagingClient();
export default messagingClient;

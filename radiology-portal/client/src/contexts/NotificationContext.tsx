import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

type Notification = {
  id: number;
  message: string;
  type: AlertColor;
  open: boolean;
};

type NotificationContextType = {
  showNotification: (message: string, type?: AlertColor) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentId, setCurrentId] = useState(0);

  const showNotification = useCallback((message: string, type: AlertColor = 'info') => {
    const id = currentId + 1;
    setCurrentId(id);
    
    const newNotification: Notification = {
      id,
      message,
      type,
      open: true,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove notification after 6 seconds
    setTimeout(() => {
      setNotifications((prev) => 
        prev.map(n => n.id === id ? { ...n, open: false } : n)
      );
      
      // Remove from state after animation
      setTimeout(() => {
        setNotifications((prev) => prev.filter(n => n.id !== id));
      }, 500);
    }, 6000);
  }, [currentId]);

  const handleClose = (id: number) => {
    setNotifications((prev) => 
      prev.map(n => n.id === id ? { ...n, open: false } : n)
    );
    
    // Remove from state after animation
    setTimeout(() => {
      setNotifications((prev) => prev.filter(n => n.id !== id));
    }, 500);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 6 }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;

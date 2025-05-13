import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getNotifications } from '../services/api';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !socket) {
      const newSocket = io('http://localhost:5000', {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });

      newSocket.on('connect_error', (err) => {
        console.log('Socket connection error:', err);
      });

      newSocket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      newSocket.on('newRequest', (request) => {
        setNotifications((prev) => [{
          message: `New blood request for ${request.bloodGroup} in your area`,
          data: { requestId: request._id },
          createdAt: new Date()
        }, ...prev]);
      });

      newSocket.on('requestAccepted', ({ requestId }) => {
        setNotifications((prev) => [{
          message: `Your blood request has been accepted`,
          data: { requestId },
          createdAt: new Date()
        }, ...prev]);
      });

      // Fetch initial notifications
      const fetchInitialNotifications = async () => {
        try {
          const initialNotifications = await getNotifications();
          setNotifications(initialNotifications);
        } catch (err) {
          console.error('Failed to fetch initial notifications:', err);
        }
      };

      fetchInitialNotifications();

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    socket,
    notifications,
    isConnected,
    clearNotifications,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
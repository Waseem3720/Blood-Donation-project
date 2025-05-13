import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { getNotifications, markNotificationAsRead } from '../services/api';
import '../assets/notification.css';

const NotificationBell = () => {
  const { notifications, clearNotifications, socket } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setUnreadCount((data.notifications || []).filter(n => !n.read).length);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();
  }, [notifications]);

  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationAsRead(notification._id);

      if (notification.data?.requestId) {
        console.log('Notification clicked:', notification);
        // You can navigate or perform other actions here
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  return (
    <div className="notification-container">
      <button 
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
        {(notifications.length > 0 || unreadCount > 0) && (
          <span className="notification-badge">
            {notifications.length + unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            <button 
              className="clear-btn"
              onClick={clearNotifications}
            >
              Clear All
            </button>
          </div>

          {notifications.length === 0 && unreadCount === 0 ? (
            <div className="notification-empty">
              No new notifications
            </div>
          ) : (
            <>
              {notifications.map((notification, index) => (
                <div 
                  key={index} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <p>{notification.message}</p>
                  <small>
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </small>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

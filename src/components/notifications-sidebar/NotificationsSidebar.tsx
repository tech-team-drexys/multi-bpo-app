import React from "react";
import styles from "./notificationsSidebar.module.scss";
import { X, Bell, CheckCircle } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatTimestamp, getTypeColor } from "@/hooks/";
import { Button, List, ListItem, ListItemAvatar, ListItemText, Typography, Chip } from "@mui/material";

interface NotificationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsSidebar = ({ isOpen, onClose }: NotificationsSidebarProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} />;
      case 'warning': return <Bell size={16} />;
      case 'error': return <Bell size={16} />;
      default: return <Bell size={16} />;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Bell className={styles.icon} />
            <span>Notificações</span>
          </div>
          <div className={styles.actions}>
            {unreadCount > 0 && (
              <Button 
                variant="text" 
                size="small" 
                onClick={markAllAsRead}
                className={styles.markAllAsRead}
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X className={styles.closeIcon} />
          </button>
        </div>
        
        <div className={styles.content}>
          {notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <Bell className={styles.emptyIcon} />
              <p>Nenhuma notificação no momento</p>
            </div>
          ) : (
            <div className={styles.listContent}>
              <List>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : styles.read}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <ListItemAvatar>
                      <div className={styles.notificationAvatar}>
                        {getTypeIcon(notification.type)}
                      </div>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <div className={styles.notificationHeader}>
                          <Typography variant="body1" fontWeight={!notification.isRead ? 'bold' : 'normal'}>
                            {notification.title}
                          </Typography>
                          <Chip 
                            label={notification.type}
                            color={getTypeColor(notification.type)}
                            size="small"
                          />
                        </div>
                      }
                      secondary={
                        <div className={styles.notificationContent}>
                          <Typography variant="body2" color="text.secondary" className={styles.message}>
                            {notification.message}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" className={styles.timestamp}>
                            {formatTimestamp(notification.timestamp)}
                          </Typography>
                        </div>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 
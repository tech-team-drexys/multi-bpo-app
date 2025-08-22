import React from "react";
import styles from "./notificationsSidebar.module.scss";
import { X, Bell, CheckCircle } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatTimestamp, getTypeColor } from "@/hooks/";
import { Badge, Button, List, Typography, Tag } from "antd";

const { Text } = Typography;

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
                type="text" 
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
              <List
                dataSource={notifications}
                renderItem={(notification) => (
                  <List.Item
                    className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : styles.read}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <List.Item.Meta
                      avatar={
                        <div className={styles.notificationAvatar}>
                          {getTypeIcon(notification.type)}
                        </div>
                      }
                      title={
                        <div className={styles.notificationHeader}>
                          <Text strong={!notification.isRead}>
                            {notification.title}
                          </Text>
                          <Tag 
                            color={getTypeColor(notification.type)}
                          >
                            {notification.type}
                          </Tag>
                        </div>
                      }
                      description={
                        <div className={styles.notificationContent}>
                          <Text type="secondary" className={styles.message}>
                            {notification.message}
                          </Text>
                          <Text type="secondary" className={styles.timestamp}>
                            {formatTimestamp(notification.timestamp)}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 
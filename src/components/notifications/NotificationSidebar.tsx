'use client';
import React, { useState, useEffect } from 'react';
import { Badge, Button, List, Typography, Space, Tag } from 'antd';
import { Bell, Check, CheckCircle, X } from 'lucide-react';
import styles from './notificationSidebar.module.scss';
import { formatTimestamp, getTypeColor } from '@/hooks/';

const { Text } = Typography;

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationSidebarProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationSidebar = ({ open, onClose }: NotificationSidebarProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Bem-vindo ao sistema',
        message: 'Sistema de notificações configurado com sucesso',
        timestamp: new Date(),
        isRead: false,
        type: 'info'
      },
      {
        id: '2',
        title: 'Atualização disponível',
        message: 'Nova versão do sistema disponível',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
        type: 'warning'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} />;
      case 'warning': return <Bell size={16} />;
      case 'error': return <Bell size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  if (!open) return null;

  return (
    <div className={styles.notificationSidebar}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Bell />
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
      </div>

      <div className={styles.content}>
        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <Bell size={48} className={styles.emptyIcon} />
            <Text type="secondary">Nenhuma notificação</Text>
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
  );
}; 
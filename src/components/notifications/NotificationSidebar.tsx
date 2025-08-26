'use client';
import React, { useState, useEffect } from 'react';
import { Badge, Button, List, ListItem, ListItemAvatar, ListItemText, Typography, Chip, Box } from '@mui/material';
import { Bell, Check, CheckCircle, X } from 'lucide-react';
import styles from './notificationSidebar.module.scss';
import { formatTimestamp, getTypeColor } from '@/hooks/';
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
              variant="text" 
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
            <Typography variant="body2" color="text.secondary">Nenhuma notificação</Typography>
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
                        <Typography variant="body1" className={styles.notificationTitle}>
                          {notification.title}
                        </Typography>
                        <Chip 
                          label={notification.type}
                          color={getTypeColor(notification.type) as any}
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
  );
}; 
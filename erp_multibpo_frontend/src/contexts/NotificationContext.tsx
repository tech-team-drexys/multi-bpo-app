'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock notifications - em produção viria de uma API
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
      },
      {
        id: '3',
        title: 'Nova mensagem',
        message: 'Você recebeu uma nova mensagem no chat',
        timestamp: new Date(Date.now() - 1800000),
        isRead: false,
        type: 'info'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 
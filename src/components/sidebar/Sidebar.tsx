'use client';
import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  House,
  ChartNoAxesCombined,
  Archive,
  Headset,
  BotMessageSquare,
  LayoutGrid,
  Newspaper,
  CalendarDays,
  Store,
  Bell,
  User,
  Lightbulb,
  ShieldCheck,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import styles from './sidebar.module.scss';
import { Avatar, Badge } from '@mui/material';
import { NotificationSidebar } from '../notifications/NotificationSidebar';
import { AccountSettingsModal } from '../modal/AccountSettingsModal';
import { RegistrationModal } from '../modal/RegistrationModal';
import { useAuth } from '@/hooks';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isHomePage?: boolean;
  isManuallyCollapsed?: boolean;
  onHover?: (isHovered: boolean) => void;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  isSearch?: boolean;
  isNewChat?: boolean;
  isHistory?: boolean;
}

export const Sidebar = ({ isCollapsed, onToggleCollapse, isHomePage = false, isManuallyCollapsed = false, onHover }: SidebarProps) => {
  const { isLoggedIn, login, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const userModalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(2);

  const menuItems: MenuItem[] = [
    { icon: House, label: 'Página inicial', path: '/' },
    { icon: ChartNoAxesCombined, label: 'Dashboard', path: '/dashboard' },
    { icon: Archive, label: 'Drive', path: '/drive' },
    { icon: CalendarDays, label: 'Agenda', path: '/agenda' },
    { icon: ShieldCheck, label: 'Certificados', path: '/certificados' },
    { icon: BotMessageSquare, label: 'Luca IA', path: '/lucaIA' },
    { icon: Store, label: 'Loja', path: '/loja' },
    { icon: LayoutGrid, label: 'Utilitários', path: '/utilitarios' },
    { icon: Newspaper, label: 'Notícias', path: '/noticias' },
    { icon: Lightbulb, label: 'Ideias', path: '/ideias' },
    { icon: FileText, label: 'Contratos', path: '/contrato' },
    { icon: Headset, label: 'Central de Atendimento', path: '/central-de-atendimento' },
    { icon: Bell, label: 'Notificações', path: '/notificacoes' },
  ];

  const isItemActive = (item: MenuItem) => {
    if (item.isSearch) {
      return false;
    }
    if (item.isNewChat) {
      return false;
    }
    if (item.isHistory) {
      return open || pathname.includes('conversation=');
    }
    if (item.path === '/notificacoes') {
      return isNotificationDrawerOpen;
    }
    if (item.path) {
      return pathname === item.path;
    }
    return false;
  };

  const handleMenuClick = (path: string) => {
    if (path === '/notificacoes') {
      setIsNotificationDrawerOpen(!isNotificationDrawerOpen);
    } else {
      router.push(path);
    }
  };

  const handleMouseEnter = () => {
    if (isCollapsed && !isHomePage && isManuallyCollapsed) {
      setIsHovered(true);
      onHover?.(true);
    }
  };

  const handleMouseLeave = () => {
    if (isCollapsed && !isHomePage && isManuallyCollapsed) {
      setIsHovered(false);
      onHover?.(false);
    }
  };

  const handleToggleCollapse = () => {
    onToggleCollapse();
  };

  const handleUserClick = () => {
    if (isLoggedIn) {
      setIsUserModalOpen(!isUserModalOpen);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserModalOpen(false);
  };

  const handleLogin = () => {
    setIsLoginModalOpen(true);
    setIsUserModalOpen(false);
  };

  const handleSettings = () => {
    setIsAccountSettingsOpen(true);
    setIsUserModalOpen(false);
  };

  const shouldShowExpanded = isHomePage
    ? !isCollapsed
    : !isCollapsed || (isHovered && isManuallyCollapsed) || isNotificationDrawerOpen;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userModalRef.current && !userModalRef.current.contains(event.target as Node)) {
        setIsUserModalOpen(false);
      }
    };

    if (isUserModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserModalOpen]);

  return (
    <>
    
    <div
      className={`${styles.sidebar} ${shouldShowExpanded ? styles.expanded : styles.collapsed}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.header}>
        <div className={styles.headerInner}>
          {shouldShowExpanded && (
            <div className={styles.logo}>
              <Image src="/white-logo-multibpo.svg" alt="Luca IA" width={100} height={30} />
            </div>
          )}
          <button onClick={handleToggleCollapse} className={styles.toggleButton}>
            {!shouldShowExpanded ? (
              <Image src="/white-logo.svg" alt="Luca IA" width={30} height={30} />
            ) : (
              <ChevronLeft className={styles.toggleIcon} />
            )}
          </button>
        </div>
      </div>

      <div className={styles.menu}>
        <div className={styles.contentMenuItems}>
          {menuItems.map((item) => {
            const isNotificationItem = item.path === '/notificacoes';
            return (
              <button
                key={item.label}
                className={`${styles.menuItem} ${!shouldShowExpanded ? styles.menuItemCollapsed : ''} ${isItemActive(item) ? styles.menuItemActive : ''}`}
                onClick={() => {
                  handleMenuClick(item.path);
                }}
              >
                {isNotificationItem ? (
                  <Badge badgeContent={unreadCount} color="error">
                    <item.icon className={styles.menuIcon} />
                  </Badge>
                ) : (
                  <item.icon className={styles.menuIcon} />
                )}
                {shouldShowExpanded && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
        <div className={styles.account}>
          <div className={`${styles.accountInfo} ${!shouldShowExpanded ? styles.accountInfoCollapsed : ''}`}>
            <div className={`${styles.userSection} ${!shouldShowExpanded ? styles.userSectionCollapsed : ''}`} onClick={handleUserClick}>
              <Avatar className={styles.avatar}>
                <User />
              </Avatar>
              {shouldShowExpanded && (
                <span>{isLoggedIn ? 'João Silva' : 'Fazer Login'}</span>
              )}
            </div>
            
            {isUserModalOpen && isLoggedIn && (
              <div className={styles.userModal} ref={userModalRef}>
                <div className={styles.modalItem} onClick={handleSettings}>
                  <Settings size={16} />
                  <span>Configurações</span>
                </div>
                <div className={styles.modalItem} onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
      <NotificationSidebar
        open={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />
      
      <AccountSettingsModal
        isOpen={isAccountSettingsOpen}
        onClose={() => setIsAccountSettingsOpen(false)}
      />
      
      <RegistrationModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

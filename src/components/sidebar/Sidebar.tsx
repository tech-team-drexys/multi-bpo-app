'use client';
import { useState } from 'react';
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
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import styles from './sidebar.module.scss';
import { Avatar, Badge } from 'antd';
import { HistoryModal } from '../modal/HistoryModal';
import { NotificationSidebar } from '../notifications/NotificationSidebar';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isHomePage?: boolean;
  isManuallyCollapsed?: boolean;
  onHover?: (isHovered: boolean) => void;
}

export const Sidebar = ({ isCollapsed, onToggleCollapse, isHomePage = false, isManuallyCollapsed = false, onHover }: SidebarProps) => {
  const [open, setOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(2);

  const menuItems = [
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

  const isItemActive = (item: any) => {
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

  const shouldShowExpanded = isHomePage
    ? !isCollapsed
    : !isCollapsed || (isHovered && isManuallyCollapsed) || isNotificationDrawerOpen;

  return (
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
                  <Badge count={unreadCount} size="small" offset={[-5, 5]}>
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
            <Avatar icon={<User />} size={30} />
            {shouldShowExpanded && <span>Luca IA</span>}
          </div>
        </div>
      </div>
      
      <NotificationSidebar
        open={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />
    </div>
  );
};

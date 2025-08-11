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
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import styles from './sidebar.module.scss';
import { Avatar } from 'antd';
import { HistoryModal } from '../modal/HistoryModal';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isHomePage?: boolean;
  isManuallyCollapsed?: boolean;
  onHover?: (isHovered: boolean) => void;
}

export const Sidebar = ({ isCollapsed, onToggleCollapse, isHomePage = false, isManuallyCollapsed = false, onHover }: SidebarProps) => {
  const [open, setOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [conversations] = useState([
    { id: 1, title: 'Saudação amigável e oferta de ajuda', time: 'Today', isActive: true },
    { id: 2, title: 'Clarifying "Teste" Meaning in Context', time: 'Yesterday' },
    { id: 3, title: 'Cumprimento amigável em português', time: 'Yesterday' },
    { id: 4, title: 'AI Technology Image Factivity Analysis', time: 'Yesterday' },
  ]);

  const menuItems = [
    { icon: House, label: 'Página inicial', path: '/' },
    { icon: ChartNoAxesCombined, label: 'Dashboard', path: '/dashboard' },
    { icon: Archive, label: 'Drive', path: '/drive' },
    { icon: Headset, label: 'Central de Atendimento', path: '/central-de-atendimento' },
    { icon: BotMessageSquare, label: 'Luca IA', path: '/lucaIA' },
    { icon: LayoutGrid, label: 'Utilitários', path: '/utilitarios' },
    { icon: Newspaper, label: 'Notícias', path: '/noticias' },
    { icon: CalendarDays, label: 'Agenda', path: '/agenda' },
    { icon: Store, label: 'Loja', path: '/loja' },
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
    if (item.path) {
      return pathname === item.path;
    }
    return false;
  };

  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  const handleConversationClick = (conversationId: number) => {
    router.push(`/lucaIA?conversation=${conversationId}`);
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
    : !isCollapsed || (isHovered && isManuallyCollapsed);

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
          {menuItems.map((item) =>
            <button
              key={item.label}
              className={`${styles.menuItem} ${!shouldShowExpanded ? styles.menuItemCollapsed : ''} ${isItemActive(item) ? styles.menuItemActive : ''}`}
              onClick={() => {
                handleMenuClick(item.path);
              }}
            >
              <item.icon className={styles.menuIcon} />
              {shouldShowExpanded && <span>{item.label}</span>}
            </button>
          )}
        </div>
        <div className={styles.account}>
          <div className={`${styles.accountInfo} ${!shouldShowExpanded ? styles.accountInfoCollapsed : ''}`}>
            <Avatar icon={<User />} size={30} />
            {shouldShowExpanded && <span>Luca IA</span>}
          </div>
        </div>
      </div>

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </div>
  );
};

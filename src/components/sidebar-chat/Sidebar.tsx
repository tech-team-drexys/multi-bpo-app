'use client';
import { useRef, useState } from 'react';
import {
  History,
  Search,
  ChevronLeft,
  SquarePen,
  Images,
} from 'lucide-react';
import Image from 'next/image';
import { ChevronDown } from "lucide-react";
import { useRouter, usePathname } from 'next/navigation';
import styles from './sidebar.module.scss';
import { Button, Popover } from '@mui/material';
import { HistoryModal } from '../modal/HistoryModal';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  path?: string;
  isSearch?: boolean;
  isNewChat?: boolean;
  isHistory?: boolean;
}

export const Sidebar = ({ isCollapsed, onToggleCollapse }: SidebarProps) => {
  const [open, setOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  const [conversations] = useState([
    { id: 1, title: 'Saudação amigável e oferta de ajuda', time: 'Today', isActive: true },
    { id: 2, title: 'Clarifying "Teste" Meaning in Context', time: 'Yesterday' },
    { id: 3, title: 'Cumprimento amigável em português', time: 'Yesterday' },
    { id: 4, title: 'AI Technology Image Factivity Analysis', time: 'Yesterday' },
  ]);

  const menuItems: MenuItem[] = [
    { icon: Search, label: 'Buscar em chats', isSearch: true },
    { icon: SquarePen, label: 'Novo chat', path: '/lucaIA', isNewChat: true },
    { icon: Images, label: 'Galeria', path: '/lucaIA/galeria' },
    { icon: History, label: 'Histórico', isHistory: true },
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

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);

  const content = (
    <>
      <div className={`${styles.group} ${!open ? styles.groupClosed : ''}`}>
        <div className={styles.label}>Today</div>
                 {conversations
           .filter((conv) => conv.time === 'Today')
           .map((conversation) => (
             <div 
               key={conversation.id} 
               className={styles.conversationItem}
               onClick={() => handleConversationClick(conversation.id)}
             >
               <p className={styles.conversationText}>
                 {conversation.title}
               </p>
             </div>
           ))}
      </div>

      <div className={styles.group}>
        <div className={styles.label}>Yesterday</div>
                 {conversations
           .filter((conv) => conv.time === 'Yesterday')
           .map((conversation) => (
             <div 
               key={conversation.id} 
               className={styles.conversationItem}
               onClick={() => handleConversationClick(conversation.id)}
             >
               <p className={styles.conversationText}>
                 {conversation.title}
               </p>
             </div>
           ))}
        <button 
          className={styles.viewAll}
          onClick={() => setIsHistoryModalOpen(true)}
        >
          Ver todos
        </button>
      </div>
    </>
  );

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          {!isCollapsed && (
            <div className={styles.logo}>
              <Image src="/logo-luca-complete.png" alt="Luca IA" width={97} height={35} />
            </div>
          )}
          <button onClick={onToggleCollapse} className={styles.toggleButton}>
            {isCollapsed ? (
              <Image src="/logo-luca.png" alt="Luca IA" width={35} height={35} />
            ) : (
              <ChevronLeft className={styles.toggleIcon} />
            )}
          </button>
        </div>
      </div>
      
      <div className={styles.menu}>
        {menuItems.map((item) =>
          item.isHistory ? (
            <div key={item.label} className={styles.wrapper} ref={ref}>
              {!isCollapsed ? (
                <div
                  className={`${styles.menuItem} ${isItemActive(item) ? styles.menuItemActive : ''}`}
                  onClick={() => setOpen(!open)}
                >
                  <span className={styles.iconContainer}>
                    <item.icon className={styles.clockIcon} size={19} />
                    <ChevronDown size={18} className={styles.chevronIcon} />
                  </span>
                  <span>Histórico</span>
                </div>
              ) : (
                <button 
                  className={`${styles.menuItemButton} ${styles.iconContainer} ${isItemActive(item) ? styles.menuItemActive : ''}`}
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                >
                  <item.icon className={styles.clockIcon} size={20} />
                </button>
              )}

              {open && !isCollapsed && (
                <div className={styles.dropdown}>
                  {content}
                </div>
              )}
            </div>
          ) : (
            <button
              key={item.label}
              className={`${styles.menuItem} ${isCollapsed ? styles.menuItemCollapsed : ''} ${isItemActive(item) ? styles.menuItemActive : ''}`}
              onClick={() => {
                if (item.isSearch) {
                  setIsHistoryModalOpen(true);
                } else if (item.path) {
                  handleMenuClick(item.path);
                }
              }}
            >
              <item.icon className={styles.menuIcon} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          )
        )}
      </div>

      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div style={{ padding: '16px' }}>
          {content}
        </div>
      </Popover>
      
      <HistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </div>
  );
};

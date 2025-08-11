import React, { useState } from "react";
import styles from "./header.module.scss";
import { ChevronLeft, Edit, House, LockKeyhole, LockKeyholeOpen, MoreHorizontal, Share } from "lucide-react";
import { Breadcrumb } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isCollapsed: boolean;
  chatSidebarCollapsed?: boolean;
  onToggleCollapse: () => void;
  isSidebarHovered?: boolean;
  isHomePage?: boolean;
  isManuallyCollapsed?: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export const Header = ({ isCollapsed, chatSidebarCollapsed, onToggleCollapse, isSidebarHovered = false, isHomePage = false, isManuallyCollapsed = false }: SidebarProps) => {
  const [privacy, setPrivacy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const isConversationStarted = messages.length > 0;
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    const items = [
      {
        title: (
          <Link href="/" className={styles.breadcrumbLink}>
            <House size={16} />
          </Link>
        ),
      },
    ];

    if (pathname === '/') {
      items.push({
        title: <span>Página Inicial</span>,
      });
    } else if (pathname === '/lucaIA') {
      items.push({
        title: <span>Luca IA</span>,
      });
    } else if (pathname === '/dashboard') {
      items.push({
        title: <span>Dashboard</span>,
      });
    } else if (pathname === '/drive') {
      items.push({
        title: <span>Drive</span>,
      });
    } else if (pathname === '/central-de-atendimento') {
      items.push({
        title: <span>Central de Atendimento</span>,
      });
    } else if (pathname === '/utilitarios') {
      items.push({
        title: <span>Utilitários</span>,
      });
    } else if (pathname === '/noticias') {
      items.push({
        title: <span>Notícias</span>,
      });
    } else if (pathname === '/agenda') {
      items.push({
        title: <span>Agenda</span>,
      });
    } else if (pathname === '/loja') {
      items.push({
        title: <span>Loja</span>,
      });
    } else if (pathname === '/notificacoes') {
      items.push({
        title: <span>Notificações</span>,
      });
    }

    return items;
  };

  const getHeaderClasses = () => {
    const baseClass = styles.header;
    const isLucaIAPage = pathname === '/lucaIA';
    
    // Determina se o sidebar está efetivamente expandido
    const isSidebarExpanded = isHomePage 
      ? !isCollapsed 
      : !isCollapsed || (isSidebarHovered && isManuallyCollapsed);
    
    if (isLucaIAPage) {
      if (isSidebarExpanded && chatSidebarCollapsed) {
        return `${baseClass} ${styles.expanded} ${styles.chatCollapsed}`;
      } else if (isSidebarExpanded && !chatSidebarCollapsed) {
        return `${baseClass} ${styles.expanded} ${styles.chatExpanded}`;
      } else if (!isSidebarExpanded && chatSidebarCollapsed) {
        return `${baseClass} ${styles.collapsed} ${styles.chatCollapsed}`;
      } else {
        return `${baseClass} ${styles.collapsed} ${styles.chatExpanded}`;
      }
    } else {
      return `${baseClass} ${isSidebarExpanded ? styles.expanded : styles.collapsed}`;
    }
  };

  return (
    <div className={getHeaderClasses()}>
      {pathname !== '/' && <Breadcrumb items={getBreadcrumbItems()} />}

      <div className={styles.right}>
        {pathname === '/lucaIA' && isConversationStarted && (
          <>
            <button className={styles.iconButton}><Edit className={styles.icon} /></button>
            <button className={styles.iconButton}><Share className={styles.icon} /></button>
            <button className={styles.iconButton}><MoreHorizontal className={styles.icon} /></button>
          </>
        )}
      </div>
    </div>
  );
};

'use client';
import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Sidebar as ChatSidebar } from "@/components/sidebar-chat/Sidebar";
import { SidebarMobile } from "@/components/sidebar-mobile/SidebarMobile";
import { HeaderMobile } from "@/components/header-mobile/HeaderMobile";
import { NotificationsSidebar } from "@/components/notifications-sidebar/NotificationsSidebar";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { NotificationProvider } from "@/contexts/NotificationContext";
import styles from "./layout.module.scss";
import { usePathname } from "next/navigation";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";


interface LayoutClientProps {
  children: ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatSidebarCollapsed, setChatSidebarCollapsed] = useState(false);
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const pathname = usePathname();
  const isLucaIAPage = pathname === '/lucaIA';
  const isHomePage = pathname === '/';

  // Controla o estado do sidebar baseado na página atual
  useEffect(() => {
    if (isHomePage) {
      // Na home, o sidebar fica aberto por padrão
      setSidebarCollapsed(false);
      setIsManuallyCollapsed(false);
    } else {
      // Em outras páginas, o sidebar fica fechado
      setSidebarCollapsed(true);
      setIsManuallyCollapsed(true);
    }
  }, [pathname, isHomePage]);

  const handleSidebarToggle = () => {
    if (isHomePage) {
      // Na home, permite fechar/abrir manualmente
      setSidebarCollapsed(!sidebarCollapsed);
      setIsManuallyCollapsed(!sidebarCollapsed);
    } else {
      // Em outras páginas, apenas alterna o estado manual
      setIsManuallyCollapsed(!isManuallyCollapsed);
      setSidebarCollapsed(!isManuallyCollapsed);
    }
  };

  const handleSidebarHover = (isHovered: boolean) => {
    setIsSidebarHovered(isHovered);
  };

  const handleToggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleToggleSidebarMobile = () => {
    setSidebarMobileOpen(!sidebarMobileOpen);
  };

  return (
    <ConfigProvider locale={ptBR}>
      <NotificationProvider>
        <div className={styles.page}>
          <div className={styles.layout}>
            <Sidebar
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={handleSidebarToggle}
              isHomePage={isHomePage}
              isManuallyCollapsed={isManuallyCollapsed}
              onHover={handleSidebarHover}
            />
            {isLucaIAPage && (
              <ChatSidebar
                isCollapsed={chatSidebarCollapsed}
                onToggleCollapse={() => setChatSidebarCollapsed(!chatSidebarCollapsed)}
              />
            )}
            <div className={styles.main}>
              <HeaderMobile
                onToggleSidebar={handleToggleSidebarMobile}
                onToggleNotifications={handleToggleNotifications}
              />
              <main className={styles.content}>
                <Breadcrumbs />
                {children}
              </main>
            </div>
          </div>
        </div>
        
        <SidebarMobile
          isOpen={sidebarMobileOpen}
          onClose={() => setSidebarMobileOpen(false)}
        />
        
        <NotificationsSidebar
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />
      </NotificationProvider>
    </ConfigProvider>
  );
} 
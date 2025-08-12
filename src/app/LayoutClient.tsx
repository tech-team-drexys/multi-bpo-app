'use client';
import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Sidebar as ChatSidebar } from "@/components/sidebar-chat/Sidebar";
import { Header } from "@/components/header/Header";
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

  return (
    <ConfigProvider locale={ptBR}>
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
            <Header
              isCollapsed={sidebarCollapsed}
              chatSidebarCollapsed={isLucaIAPage ? chatSidebarCollapsed : undefined}
              onToggleCollapse={handleSidebarToggle}
              isSidebarHovered={isSidebarHovered}
              isHomePage={isHomePage}
              isManuallyCollapsed={isManuallyCollapsed}
            />
            <main className={styles.content}>
              {children}
            </main>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
} 
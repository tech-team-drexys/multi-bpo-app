'use client';
import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Sidebar as ChatSidebar } from "@/components/sidebar-chat/Sidebar";
import { SidebarMobile } from "@/components/sidebar-mobile/SidebarMobile";
import { HeaderMobile } from "@/components/header-mobile/HeaderMobile";
import { NotificationsSidebar } from "@/components/notifications-sidebar/NotificationsSidebar";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { UpgradeFab } from "@/components/floating-action-button/UpgradeFab";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthProvider } from "@/contexts/AuthContext"; // ⭐ NOVO IMPORT
import styles from "./layout.module.scss";
import { usePathname } from "next/navigation";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from "@/hooks";


interface LayoutClientProps {
  children: ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatSidebarCollapsed, setChatSidebarCollapsed] = useState(false);
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const pathname = usePathname();
  const isLucaIAPage = pathname === '/lucaIA';
  const isHomePage = pathname === '/';
  const isPricingPage = pathname === '/plans';

  useEffect(() => {
    if (isHomePage) {
      setSidebarCollapsed(false);
      setIsManuallyCollapsed(false);
    } else {
      setSidebarCollapsed(true);
      setIsManuallyCollapsed(true);
    }
  }, [pathname, isHomePage]);

  // Verificar automaticamente se o usuário está logado
  useEffect(() => {
    if (!isLoading && !isLoggedIn && typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('lucaIA_rememberedEmail');
      const savedPassword = localStorage.getItem('lucaIA_rememberedPassword');
      const isLoggedInStorage = localStorage.getItem('lucaIA_loggedIn') === 'true';

      // Se não está logado mas tem credenciais salvas, fazer login automático
      if (!isLoggedInStorage && savedEmail && savedPassword) {
        localStorage.setItem('lucaIA_loggedIn', 'true');
        // Recarregar a página para atualizar o estado de autenticação
        window.location.reload();
      }
    }
  }, [isLoading, isLoggedIn]);

  const handleSidebarToggle = () => {
    if (isHomePage) {
      setSidebarCollapsed(!sidebarCollapsed);
      setIsManuallyCollapsed(!sidebarCollapsed);
    } else {
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

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  if (isPricingPage) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <div className={styles.page}>
            {children}
          </div>
        </NotificationProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <AuthProvider> {/* ⭐ NOVO: AuthProvider envolvendo tudo */}
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
            <UpgradeFab />
          </NotificationProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>

  );
}
import React from "react";
import styles from "./headerMobile.module.scss";
import { Menu, Bell } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/contexts/NotificationContext";

interface HeaderMobileProps {
  onToggleSidebar: () => void;
  onToggleNotifications: () => void;
}

export const HeaderMobile = ({ onToggleSidebar, onToggleNotifications }: HeaderMobileProps) => {
  const router = useRouter();
  const { unreadCount } = useNotifications();

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <div className={styles.headerMobile}>
      <button 
        className={styles.iconButton} 
        onClick={onToggleSidebar}
        aria-label="Abrir/fechar menu"
      >
        <Menu className={styles.icon} />
      </button>
      
      <button 
        className={styles.logoButton} 
        onClick={handleLogoClick}
        aria-label="Ir para página inicial"
      >
        <Image
          src="/logo.png"
          alt="Multi BPO"
          width={100}
          height={32}
          className={styles.logo}
        />
      </button>
      
      <button 
        className={styles.iconButton} 
        onClick={onToggleNotifications}
        aria-label="Abrir notificações"
      >
        <div className={styles.bellContainer}>
          <Bell className={styles.icon} />
          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
          )}
        </div>
      </button>
    </div>
  );
}; 
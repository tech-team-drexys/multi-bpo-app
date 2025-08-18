import React from "react";
import styles from "./sidebarMobile.module.scss";
import { X, House, ChartNoAxesCombined, Archive, Headset, BotMessageSquare, LayoutGrid, Newspaper, CalendarDays, Store, Bell, User, Lightbulb, ShieldCheck, FileText } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

interface SidebarMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarMobile = ({ isOpen, onClose }: SidebarMobileProps) => {
  const router = useRouter();
  const pathname = usePathname();

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
  ];

  const handleMenuClick = (path: string) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Image
              src="/white-logo-multibpo.svg"
              alt="Logo"
              width={100}
              height={32}
              className={styles.logoImage}
            />
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X className={styles.closeIcon} />
          </button>
        </div>
        
        <div className={styles.content}>
          <nav className={styles.nav}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              
              return (
                <button
                  key={index}
                  className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                  onClick={() => handleMenuClick(item.path)}
                >
                  <Icon className={styles.icon} />
                  <span className={styles.label}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <User className={styles.avatarIcon} />
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>Usuário</span>
              <span className={styles.userEmail}>usuario@email.com</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 
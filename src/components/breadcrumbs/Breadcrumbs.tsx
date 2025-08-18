import React from "react";
import styles from "./breadcrumbs.module.scss";
import { Breadcrumb } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House } from "lucide-react";

// Mapeamento de rotas para títulos
const ROUTE_TITLES: Record<string, string> = {
  '/': 'Página Inicial',
  '/lucaIA': 'Luca IA',
  '/dashboard': 'Dashboard',
  '/drive': 'Drive',
  '/central-de-atendimento': 'Central de Atendimento',
  '/utilitarios': 'Utilitários',
  '/noticias': 'Notícias',
  '/agenda': 'Agenda',
  '/loja': 'Loja',
  '/notificacoes': 'Notificações',
  '/ideias': 'Ideias',
  '/ideias/adicionar-ideia': 'Adicionar Ideia',
  '/ideias/detalhes': 'Detalhes da Ideia',
};

// Mapeamento de segmentos de URL para títulos
const SEGMENT_TITLES: Record<string, string> = {
  'ideias': 'Ideias',
  'adicionar-ideia': 'Adicionar Ideia',
  'detalhes': 'Detalhes',
  'lucaIA': 'Luca IA',
  'dashboard': 'Dashboard',
  'drive': 'Drive',
  'central-de-atendimento': 'Central de Atendimento',
  'utilitarios': 'Utilitários',
  'noticias': 'Notícias',
  'agenda': 'Agenda',
  'loja': 'Loja',
  'galeria': 'Galeria',
  'luca': 'Luca IA',
};

export const Breadcrumbs = () => {
  const pathname = usePathname();

  // Não mostra breadcrumbs na página inicial
  if (pathname === '/') {
    return null;
  }

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

    // Divide o pathname em segmentos
    const segments = pathname.split('/').filter(Boolean);
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Verifica se é o último segmento (página atual)
      const isLast = index === segments.length - 1;
      
      // Tenta encontrar o título no mapeamento de segmentos
      let title = SEGMENT_TITLES[segment];
      
      // Se não encontrar, verifica se é um número (ID)
      if (!title) {
        if (/^\d+$/.test(segment)) {
          // Se estamos em uma página de detalhes, mostra "Ideia #ID"
          const isDetailsPage = segments.includes('detalhes');
          if (isDetailsPage) {
            title = `Ideia #${segment}`;
          } else {
            title = `ID: ${segment}`;
          }
        } else {
          // Capitaliza o segmento
          title = segment.charAt(0).toUpperCase() + segment.slice(1);
        }
      }

      // Se for o último item, não adiciona link
      if (isLast) {
        items.push({
          title: <span>{title}</span>,
        });
      } else {
        items.push({
          title: (
            <Link href={currentPath} className={styles.breadcrumbLink}>
              {title}
            </Link>
          ),
        });
      }
    });

    return items;
  };

  return (
    <div className={styles.breadcrumbsContainer}>
      <Breadcrumb items={getBreadcrumbItems()} />
    </div>
  );
}; 
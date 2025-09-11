import React from "react";
import styles from "./breadcrumbs.module.scss";
       import { Button, Breadcrumbs as MUIBreadcrumbs, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { House, Sparkles } from "lucide-react";


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
  const router = useRouter();

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

    const segments = pathname.split('/').filter(Boolean);
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      const isLast = index === segments.length - 1;

      let title = SEGMENT_TITLES[segment];

      if (!title) {
        if (/^\d+$/.test(segment)) {
          const isDetailsPage = segments.includes('detalhes');
          if (isDetailsPage) {
            title = `Ideia #${segment}`;
          } else {
            title = `ID: ${segment}`;
          }
        } else {
          title = segment.charAt(0).toUpperCase() + segment.slice(1);
        }
      }

      if (isLast) {
        items.push({
          title: <Typography color="text.primary">{title}</Typography>,
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
      <MUIBreadcrumbs aria-label="breadcrumb">
        {getBreadcrumbItems().map((item, index) => (
          <div key={index}>
            {item.title}
          </div>
        ))}
      </MUIBreadcrumbs>
      {pathname === '/lucaIA' && (
        <Button variant="contained" color="primary" className={styles.upgradeButton} 
        onClick={() => router.push('/plans')}>
          <Sparkles size={16} className={styles.upgradeIcon}/>
          Fazer upgrade do plano
        </Button>
      )}
    </div>
  );
}; 
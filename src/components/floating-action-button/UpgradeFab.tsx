'use client';
import { Fab } from '@mui/material';
import { Sparkles } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './UpgradeFab.module.scss';

export const UpgradeFab = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  if (pathname === '/plans' || pathname === '/lucaIA') {
    return null;
  }

  const handleUpgradeClick = () => {
    router.push('/plans');
  };

  return (
    <div className={styles.fabContainer}>
        <Fab
          className={styles.upgradeFab}
          onClick={handleUpgradeClick}
          variant='extended'
        >
          <Sparkles className={styles.upgradeIcon} />
          <span className={styles.upgradeText}>Fazer upgrade do plano</span>
        </Fab>
    </div>
  );
};

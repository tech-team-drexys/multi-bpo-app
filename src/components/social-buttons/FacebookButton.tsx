'use client';

import React from 'react';
import { Button } from '@mui/material';
import styles from './SocialButtons.module.scss';
import { Facebook } from '@/icons/facebook';

interface FacebookButtonProps {
  onClick: () => void;
  text: string;
  disabled?: boolean;
}

export const FacebookButton: React.FC<FacebookButtonProps> = ({ onClick, text, disabled = false }) => {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      className={styles.socialButton}
      startIcon={
        <Facebook className={styles.socialIcon} width={20} height={20} />
      }
      fullWidth
    >
      {text}
    </Button>
  );
};

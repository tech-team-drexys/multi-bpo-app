'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  siteKey: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  className?: string;
}

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export const Turnstile: React.FC<TurnstileProps> = ({
  onVerify,
  onError,
  onExpire,
  siteKey,
  theme = 'light',
  size = 'normal',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const isRenderedRef = useRef<boolean>(false);

  const handleVerify = useCallback((token: string) => {
    onVerify(token);
  }, [onVerify]);

  const handleError = useCallback(() => {
    onError?.();
  }, [onError]);

  const handleExpire = useCallback(() => {
    onExpire?.();
  }, [onExpire]);

  useEffect(() => {
    if (isRenderedRef.current || !containerRef.current) {
      return;
    }

    const loadTurnstile = () => {
      if (window.turnstile && containerRef.current && !isRenderedRef.current) {
        try {
          isRenderedRef.current = true;
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme,
            size,
            callback: handleVerify,
            'error-callback': handleError,
            'expired-callback': handleExpire,
          });
          console.log('Turnstile renderizado com sucesso');
        } catch (error) {
          console.error('Erro ao renderizar Turnstile:', error);
          isRenderedRef.current = false;
          handleError();
        }
      }
    };

    if (window.turnstile) {
      loadTurnstile();
    } else {
      const existingScript = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
      
      if (!existingScript) {
        console.log('Carregando script do Turnstile...');
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('Script do Turnstile carregado');
          loadTurnstile();
        };
        script.onerror = () => {
          console.error('Erro ao carregar script do Turnstile');
          handleError();
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', loadTurnstile);
      }
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
          isRenderedRef.current = false;
        } catch (error) {
          console.error('Erro ao remover Turnstile:', error);
        }
      }
    };
  }, [siteKey, theme, size, handleVerify, handleError, handleExpire]);

  return <div ref={containerRef} className={className} />;
};

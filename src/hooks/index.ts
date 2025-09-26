export function formatTimestamp(timestamp: Date) {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    
    return timestamp.toLocaleDateString('pt-BR');
  };

  export function getTypeColor(type: string) {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

export const usePhoneMask = () => {
  const applyPhoneMask = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const removePhoneMask = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  return {
    applyPhoneMask,
    removePhoneMask
  };
};

export const getPlanColor = (planType: string) => {
  switch (planType) {
    case 'basic': return 'blue';
    case 'premium': return 'purple';
    case 'enterprise': return 'yellow';
    default: return 'blue';
  }
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};


export { useAuth } from './useAuth';
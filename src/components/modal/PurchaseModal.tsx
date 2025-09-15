'use client';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box, Divider } from '@mui/material';
import { XIcon, ShoppingCartIcon } from 'lucide-react';
import styles from './PurchaseModal.module.scss';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  service: Service | null;
  onConfirmPurchase: (couponCode?: string) => void;
}

export default function PurchaseModal({ open, onClose, service, onConfirmPurchase }: PurchaseModalProps) {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState<{ message: string, type: string }>({
    message: '',
    type: ''
  });

  const handleCouponApply = () => {
    if (couponCode.toLowerCase() === 'desconto10') {
      setDiscount(10);
      setMessage({ message: 'Cupom aplicado com sucesso, você economizou 10%', type: 'success' });
    } else if (couponCode.toLowerCase() === 'desconto20') {
      setDiscount(20);
      setMessage({ message: 'Cupom aplicado com sucesso, você economizou 20%', type: 'success' });
    } else {
      setDiscount(0);
      setMessage({ message: 'Cupom inválido, tente novamente', type: 'error' });
    }
  };

  const getFinalPrice = () => {
    if (!service) return 0;
    const basePrice = 100;
    const discountAmount = (basePrice * discount) / 100;
    return basePrice - discountAmount;
  };

  const handleConfirm = () => {
    onConfirmPurchase(couponCode || undefined);
    setCouponCode('');
    setDiscount(0);
    setMessage({ message: '', type: '' });
    onClose();
  };

  if (!service) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className={styles.purchaseModal}
    >
      <DialogTitle className={styles.modalHeader}>
        <Box className={styles.headerContent}>
          <Box className={styles.titleSection}>
            <Typography variant="h6" className={styles.title}>
              Finalizar Compra
            </Typography>
          </Box>
          <Button
            onClick={() => {
              setMessage({ message: '', type: '' });
              onClose();
            }}
            className={styles.closeButton}
            size="small"
          >
            <XIcon size={20} />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent className={styles.modalContent}>
        <Box className={styles.itemSection}>          
          <Box className={styles.itemCard}>
            <Typography variant="h6" className={styles.itemTitle}>
              {service.title}
            </Typography>
            <Typography variant="body2" className={styles.itemDescription}>
              {service.description}
            </Typography>
            <Typography variant="body2" className={styles.itemCategory}>
              Categoria: {service.category}
            </Typography>
            
            <Box className={styles.priceSection}>
              <Box className={styles.pricing}>
                <Typography variant="h6" className={styles.currentPrice}>
                  R$ {getFinalPrice().toFixed(2).replace('.', ',')}
                </Typography>
                {discount > 0 && (
                  <>
                    <Typography variant="body2" className={styles.oldPrice}>
                      R$ 100,00
                    </Typography>
                    <Typography variant="body2" className={styles.discountTag}>
                      {discount}% de desconto
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider className={styles.divider} />

        <Box className={styles.couponSection}>
          <Typography variant="h6" className={styles.sectionTitle}>
            Cupom de Desconto
          </Typography>
          
          <Box className={styles.couponInput}>
            <TextField
              fullWidth
              label="Código do cupom"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              variant="outlined"
              size="small"
              placeholder="Digite seu cupom aqui"
            />
            <Button
              variant="outlined"
              onClick={handleCouponApply}
              className={styles.applyButton}
              disabled={!couponCode.trim()}
            >
              Aplicar
            </Button>
          </Box>
          
          {message.message && (
            <Box className={styles.discountInfo}>
              <Typography variant="body2" className={`${message.type === 'success' ? styles.success : styles.error}`}>
                {message.message}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider className={styles.divider} />

        <Box className={styles.summarySection}>
          <Typography variant="h6" className={styles.sectionTitle}>
            Resumo da Compra
          </Typography>
          
          <Box className={styles.summaryDetails}>
            <Box className={styles.summaryRow}>
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">R$ 100,00</Typography>
            </Box>
            
            {discount > 0 && (
              <Box className={styles.summaryRow}>
                <Typography variant="body2" className={styles.discountLabel}>
                  Desconto ({discount}%):
                </Typography>
                <Typography variant="body2" className={styles.discountValue}>
                  -R$ {(100 - getFinalPrice()).toFixed(2).replace('.', ',')}
                </Typography>
              </Box>
            )}
            
            <Divider className={styles.summaryDivider} />
            
            <Box className={styles.summaryRow}>
              <Typography variant="h6" className={styles.totalLabel}>
                Total:
              </Typography>
              <Typography variant="h6" className={styles.totalValue}>
                R$ {getFinalPrice().toFixed(2).replace('.', ',')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className={styles.modalActions}>
        <Button
          onClick={onClose}
          variant="outlined"
          className={styles.cancelButton}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          className={styles.confirmButton}
        >
          Confirmar Compra
        </Button>
      </DialogActions>
    </Dialog>
  );
}

'use client';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box, Divider, Snackbar, Alert, Chip } from '@mui/material';
import { XIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { ProductCategoryLabels } from "@/enums/index ";
import { applyCoupon as applyCouponAPI, createOrder } from "@/services/api";
import styles from './PurchaseModal.module.scss';
import { useRouter } from 'next/navigation';

interface Service {
  id: number;
  name: string;
  description: string;
  product_type: string;
  price: string;
  access_duration_days: number;
  active: boolean;
  created_at: string;
}

interface StaticService {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  service: Service | StaticService | null;
  onConfirmPurchase: (couponCode?: string) => void;
}

export default function PurchaseModal({ open, onClose, service, onConfirmPurchase }: PurchaseModalProps) {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [couponExpanded, setCouponExpanded] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const getSubtotal = () => {
    if (!service || !('price' in service)) return 100;
    return parseFloat(service.price);
  };

  const getTotalDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getSubtotal();
    return subtotal * appliedCoupon.discount / 100;
  };

  const getFinalPrice = () => {
    return getSubtotal() - getTotalDiscount();
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    if (appliedCoupon) {
      setSnackbar({
        open: true,
        message: 'Apenas um cupom pode ser aplicado por vez. Remova o cupom atual primeiro.',
        severity: 'error'
      });
      return;
    }

    if (!service || !('id' in service)) {
      setSnackbar({
        open: true,
        message: 'Erro: produto não encontrado.',
        severity: 'error'
      });
      return;
    }

    setCouponLoading(true);

    try {
      const planId = Number(service.id);
      const response = await applyCouponAPI(planId, couponCode.trim());

      if (response.valid) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discount: response.discount?.discount_percent || 0
        });

        setSnackbar({
          open: true,
          message: response.message || 'Cupom aplicado com sucesso!',
          severity: 'success'
        });

        setCouponCode('');
      } else {
        setSnackbar({
          open: true,
          message: 'Cupom inválido ou expirado!',
          severity: 'error'
        });
      }
    } catch (error: any) {
      console.error('Erro ao aplicar cupom:', error);

      const errorMessage = error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Erro ao validar cupom. Tente novamente.';

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setSnackbar({
      open: true,
      message: 'Cupom removido!',
      severity: 'info'
    });
  };

  const handleConfirm = async () => {
    try {
      if (!service || !('id' in service)) {
        setSnackbar({
          open: true,
          message: 'Erro: produto não encontrado.',
          severity: 'error'
        });
        return;
      }

      const response = await createOrder(Number(service.id));
      if (response.success) {
        window.open(response.checkout_url, '_blank');
      } else {
        setSnackbar({
          open: true,
          message: 'Erro ao finalizar compra. Tente novamente.',
          severity: 'error'
        });
      }


      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao finalizar compra. Tente novamente.',
        severity: 'error'
      });
    }
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
            onClick={onClose}
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
              {'price' in service ? service.name : service.title}
            </Typography>
            <Typography variant="body2" className={styles.itemDescription}>
              {service.description}
            </Typography>
            <Typography variant="body2" className={styles.itemCategory}>
              Categoria: {'product_type' in service
                ? ProductCategoryLabels[service.product_type as keyof typeof ProductCategoryLabels] || service.product_type
                : service.category}
            </Typography>

            <Box className={styles.priceSection}>
              <Box className={styles.pricing}>
                <Typography variant="h6" className={styles.currentPrice}>
                  R$ {getFinalPrice().toFixed(2).replace('.', ',')}
                </Typography>
                {appliedCoupon && (
                  <>
                    <Typography variant="body2" className={styles.oldPrice}>
                      R$ {getSubtotal().toFixed(2).replace('.', ',')}
                    </Typography>
                    <Typography variant="body2" className={styles.discountTag}>
                      {appliedCoupon.discount}% de desconto
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider className={styles.divider} />

        {/* Seção de Cupom */}
        <Box className={styles.couponSection}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '0.5rem 0',
              borderBottom: couponExpanded ? '1px solid #e0e0e0' : 'none'
            }}
            onClick={() => setCouponExpanded(!couponExpanded)}
          >
            <Typography variant="h6" className={styles.sectionTitle}>
              Cupom de Desconto
            </Typography>
            {couponExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </Box>

          {couponExpanded && (
            <Box sx={{ padding: '1rem 0 0.5rem 0' }}>
              <Box sx={{ display: 'flex', gap: 1, marginBottom: '0.5rem' }}>
                <TextField
                  size="small"
                  placeholder="Digite o código do cupom"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={applyCoupon}
                  disabled={!couponCode.trim() || couponLoading || !!appliedCoupon}
                >
                  {couponLoading ? 'Aplicando...' : 'Aplicar'}
                </Button>
              </Box>
            </Box>
          )}

          {/* Cupom aplicado */}
          {appliedCoupon && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, marginTop: couponExpanded ? 0 : '0.5rem' }}>
              <Chip
                label={`${appliedCoupon.code} (-${appliedCoupon.discount}%)`}
                size="small"
                onDelete={removeCoupon}
                color="success"
                variant="outlined"
              />
            </Box>
          )}
        </Box>

        <Divider className={styles.divider} />

        {/* Resumo de valores */}
        <Box className={styles.summarySection}>
          <Typography variant="h6" className={styles.sectionTitle}>
            Resumo da Compra
          </Typography>

          <Box className={styles.summaryDetails}>
            <Box className={styles.summaryRow}>
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">
                R$ {getSubtotal().toFixed(2).replace('.', ',')}
              </Typography>
            </Box>

            {appliedCoupon && (
              <Box className={styles.summaryRow}>
                <Typography variant="body2" className={styles.discountLabel} sx={{ color: 'success.main' }}>
                  Desconto ({appliedCoupon.discount}%):
                </Typography>
                <Typography variant="body2" className={styles.discountValue} sx={{ color: 'success.main' }}>
                  -R$ {getTotalDiscount().toFixed(2).replace('.', ',')}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

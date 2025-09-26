'use client';
import { useEffect, useState } from "react";
import { ArrowRightIcon, ShoppingBagIcon, ShoppingCart, Trash2Icon, ChevronUp, ChevronDown } from "lucide-react";
import styles from "./page.module.scss";
import { Button, RadioGroup, FormControlLabel, Radio, Drawer, List, ListItem, ListItemText, Typography, Box, Snackbar, Alert, TextField, Chip } from "@mui/material";
import PurchaseModal from "../../components/modal/PurchaseModal";
import { createOrder, getProducts, applyCoupon as applyCouponAPI, createListOrder } from "@/services/api";
import { formatPrice } from "@/hooks/index";
import { ProductCategoryLabels } from "@/enums/index ";

interface Service {
  id: number;
  name: string;
  description: string;
  product_type: string;
  price: string;
  access_duration_days: number;
  active: boolean;
  created_at: string;
  discount_percent?: number;
  old_price?: string;
}

interface CartItem extends Service {
  quantity: number;
}

export default function Loja() {
  const [value, setValue] = useState("todos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [products, setProducts] = useState([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [couponExpanded, setCouponExpanded] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    Promise.all([getProducts()]).then(([data]) => {
      setProducts(data.products);
    }).catch(
      (error) => {
        console.error("Erro ao buscar produtos:", error);
      }
    );
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const clearFilters = () => {
    setValue("todos");
  };

  const addToCart = (service: Service) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === service.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...service, quantity: 1 }];
    });

    setSnackbar({
      open: true,
      message: `${service.name} foi adicionado ao seu carrinho`,
      severity: 'success'
    });
  };

  const removeFromCart = (serviceId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== serviceId));
  };

  const updateQuantity = (serviceId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === serviceId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getCartSubtotal();
    return subtotal * appliedCoupon.discount / 100;
  };

  const getCartTotal = () => {
    return getCartSubtotal() - getTotalDiscount();
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

    if (cart.length === 0) {
      setSnackbar({
        open: true,
        message: 'Adicione itens ao carrinho antes de aplicar um cupom.',
        severity: 'error'
      });
      return;
    }

    setCouponLoading(true);

    try {
      const planId = cart[0].id;
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
    } catch (error: unknown) {
      console.error('Erro ao aplicar cupom:', error);

      const errorMessage = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data?.message ||
        (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data?.error ||
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

  const finalizePurchase = async () => {
    if (cart.length === 0) {
      setSnackbar({
        open: true,
        message: 'Carrinho vazio. Adicione itens antes de finalizar a compra.',
        severity: 'error'
      });
      return;
    }

    try {
      const items = cart.map(item => ({
        product_id: item.id.toString(),
        quantity: item.quantity
      }));

      const response = await createListOrder(items);


      if (response.success) {
        if (response.checkout_url) {
          window.open(response.checkout_url, '_blank');
        }

        setSnackbar({
          open: true,
          message: 'Pedido criado com sucesso! Redirecionando para pagamento...',
          severity: 'success'
        });

        setCart([]);
        setAppliedCoupon(null);
        setCouponExpanded(false);
        setCouponCode('');
        setCartDrawerOpen(false);
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Erro ao finalizar compra. Tente novamente.',
          severity: 'error'
        });
      }
    } catch (error: unknown) {
      console.error('Erro ao finalizar compra:', error);

      const errorMessage = (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data?.message ||
        (error as { response?: { data?: { message?: string; error?: string } } })
        ?.response?.data?.error ||
        'Erro ao finalizar compra. Tente novamente.';

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handleBuyNow = (service: Service) => {
    setSelectedService(service);
    setPurchaseModalOpen(true);
  };

  const handleConfirmPurchase = (couponCode?: string) => {
    if (selectedService) {
      const message = couponCode
        ? `Compra de "${selectedService.name}" finalizada com sucesso! Cupom aplicado: ${couponCode}`
        : `Compra de "${selectedService.name}" finalizada com sucesso!`;

      setSnackbar({
        open: true,
        message,
        severity: 'success'
      });
    }
  };

  const getFilteredServices = () => {
    if (value === "todos") {
      return products;
    }

    const categoryMap = {
      "terceirização": "terceirização",
      "premium_feature": "premium_feature",
      "servicos-digitais": "servicos_digitais"
    };

    return products.filter((product: Service) => product.product_type === categoryMap[value as keyof typeof categoryMap]);
  };

  const renderServiceCard = (service: Service) => {
    const price = parseFloat(service.price);
    const hasDiscount = service.discount_percent && service.discount_percent > 0;
    const originalPrice = hasDiscount && service.old_price ? parseFloat(service.old_price) : null;

    return (
      <div
        key={service.id}
        className={`${styles.serviceCard}`}
      >
        <div className={styles.cardContent}>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
          <div className={styles.priceSection}>
            {hasDiscount && (
              <div className={styles.discountTag}>{service.discount_percent}% off</div>
            )}
            <div className={styles.pricing}>
              <span className={styles.currentPrice}>{formatPrice(price)}</span>
              {hasDiscount && originalPrice && (
                <span className={styles.oldPrice}>{formatPrice(originalPrice)}</span>
              )}
            </div>
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.addCartBtn}
              onClick={() => addToCart(service)}
            >
              <ShoppingCart size={16} className={styles.arrowIcon} /> Adicionar ao Carrinho
            </button>
            <button
              className={styles.buyNowBtn}
              onClick={() => handleBuyNow(service)}
            >
              Comprar Agora
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <div className={styles.header}>
            <h1>Loja</h1>
            <p>Descubra nossos serviços especializados</p>
          </div>
          <Button
            variant="outlined"
            className={styles.shoppingBagBtn}
            onClick={() => setCartDrawerOpen(true)}
          >
            <ShoppingBagIcon size={25} className={styles.shoppingBagIcon} />
            {cart.length > 0 && (
              <span className={styles.cartBadge}>{cart.length}</span>
            )}
          </Button>
        </div>

        <div className={styles.contentEcommerce}>
          <div className={styles.contentFilter}>
            <div className={styles.filterHeader}>
              <p>Escolha por categoria:</p>
              <button onClick={clearFilters} className={styles.clearFiltersBtn}>
                Limpar filtros
              </button>
            </div>
            <RadioGroup
              value={value}
              onChange={onChange}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <FormControlLabel value="todos" control={<Radio />} label="Todos" />
              <FormControlLabel value="terceirização" control={<Radio />} label={ProductCategoryLabels.outsource} />
              <FormControlLabel value="premium_feature" control={<Radio />} label={ProductCategoryLabels.premium_feature} />
              <FormControlLabel value="servicos-digitais" control={<Radio />} label={ProductCategoryLabels.digital_services} />
            </RadioGroup>
          </div>

          <div className={styles.servicesGrid}>
            {getFilteredServices().map(renderServiceCard)}
          </div>
        </div>
      </div>

      <Drawer
        anchor="right"
        onClose={() => setCartDrawerOpen(false)}
        open={cartDrawerOpen}
        className={styles.cartDrawer}
        PaperProps={{
          style: { width: 400 }
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}>
          <Box sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: 'white'
          }}>
            <Typography variant="body1" fontWeight="bold">
              Carrinho de Compras
            </Typography>
            <Button
              onClick={() => setCartDrawerOpen(false)}
              sx={{ minWidth: 'auto', padding: '6px' }}
            >
              ✕
            </Button>
          </Box>

          <Box sx={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem'
          }}>
            {cart.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <ShoppingBagIcon size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <Typography variant="body2" color="text.secondary">Seu carrinho está vazio</Typography>
              </Box>
            ) : (
              <>
                <List>
                  {cart.map((item) => (
                    <ListItem
                      key={item.id}
                      secondaryAction={
                        <Button
                          variant="text"
                          color="error"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2Icon size={16} />
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={<Typography variant="body1" fontWeight="bold">{item.name}</Typography>}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                            <Box sx={{ mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Button
                                  size="small"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  -
                                </Button>
                                <Typography>{item.quantity}</Typography>
                                <Button
                                  size="small"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </Box>
                              <Typography variant="body1" fontWeight="bold">
                                R$ {(parseFloat(item.price) * item.quantity).toFixed(2).replace('.', ',')}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>

          {cart.length > 0 && (
            <Box sx={{
              flexShrink: 0,
              backgroundColor: 'white',
              borderTop: 1,
              borderColor: 'divider',
              padding: '1rem',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
            }}>
              {/* Seção de Cupom */}
              <Box sx={{ marginBottom: '1rem' }}>
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
                  <Typography variant="body2" fontWeight="medium">
                    Adicionar cupom
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

              {/* Resumo de valores */}
              <Box sx={{ marginBottom: '1rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">
                    R$ {getCartSubtotal().toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>

                {appliedCoupon && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <Typography variant="body2" color="success.main">Desconto:</Typography>
                    <Typography variant="body2" color="success.main">
                      -R$ {getTotalDiscount().toFixed(2).replace('.', ',')}
                    </Typography>
                  </Box>
                )}

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #e0e0e0',
                  paddingTop: '0.5rem'
                }}>
                  <Typography variant="h6" fontWeight="bold">Total:</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    R$ {getCartTotal().toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={finalizePurchase}
                disabled={cart.length === 0}
              >
                Finalizar Compra
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      <PurchaseModal
        open={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        service={selectedService}
        onConfirmPurchase={handleConfirmPurchase}
      />

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
    </div>
  );
} 
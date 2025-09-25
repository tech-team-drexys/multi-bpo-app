'use client';
import { useState, useEffect } from 'react';
import { X, User, Shield, Gem, Wallet, Banknote, Search, MoreVertical, Download, Eye, CreditCard, SquareArrowOutUpRight, Repeat, Package, QrCode, Barcode, EyeOff } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthProvider';
import styles from './AccountSettingsModal.module.scss';
import { cancelSubscription, getMySubscriptions, getUserProfile, listMyOrders, updatePassword } from '@/services/api';
import { Alert, Button, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { formatPrice, formatDate } from '@/hooks';
import Image from 'next/image';
import { CreditCardBrand, MenuOption } from '@/enums/index ';
import { Input } from 'antd';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
interface Purchase {
  id: string;
  title: string;
  orderId: string;
  type: 'subscription' | 'one-time';
  purchaseDate: string;
  value: number;
  paymentType: 'Pagamento Único' | 'Recorrente';
  frequency: 'Único' | 'Mensal' | 'Anual';
  status: 'pending' | 'paid' | 'active' | 'cancelled';
  nextCharge?: string;
  cancelledDate?: string;
  checkout_url?: string;
  transaction_type?: string;
  products?: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
    quantity?: number;
    subtotal?: string;
  }>;
  totalAmount: string;
  ordersCount: number;
}

interface ApiOrder {
  group_id: string;
  group_timestamp: string;
  created_at: string;
  expires_at: string;
  checkout_url: string;
  orders_count: number;
  products: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
    product_type: string;
    order_id: string;
    order_status: string;
    status: string;
    total_amount: string;
    access_duration_days?: number;
    active?: boolean;
    discount_percent?: number;
    discount_percent_formatted?: string;
    has_discount?: boolean;
    old_price?: string;
    quantity?: number;
    unit_price?: string;
    subtotal?: string;
  }>;
  transaction_type?: string;
  status: string;
  total_amount: string;
}

interface SubscriptionData {
  subscription: {
    asaas_subscription_id: string;
    cancel_at_period_end: boolean;
    created_at: string;
    current_period_end: string;
    current_period_start: string;
    days_until_renewal: number;
    id: string;
    is_active: boolean;
    plan: {
      active: boolean;
      billing_cycle: string;
      created_at: string;
      description: string;
      features: string[];
      id: number;
      luca_questions_limit: number;
      max_users: number;
      name: string;
      plan_type: string;
      price: string;
      yearly_price: number;
    };
    status: string;
    user_email: string;
  };
  payment_info: {
    billing_address: any;
    billing_type: string;
    cancellation: {
      cancelled: boolean;
      cancel_at_period_end: boolean;
    };
    credit_card: {
      brand: string;
      credit_card_brand: string;
      has_card: boolean;
      last_digits: string;
    };
    latest_payment: {
      status: string;
      value: number;
      due_date: string;
      invoice_url: string;
      bank_slip_url: string | null;
      pix_qr_code: string | null;
    };
    payment_method: string;
  };
  success: boolean;
}

export const AccountSettingsModal = ({ isOpen, onClose }: AccountSettingsModalProps) => {
  const router = useRouter();
  const { userData, refreshUserData } = useAuthContext();

  const getCreditCardBrandImage = (brand: string): string => {
    const brandMapping: Record<string, CreditCardBrand> = {
      'VISA': CreditCardBrand.VISA,
      'MASTERCARD': CreditCardBrand.MASTERCARD,
      'AMERICAN_EXPRESS': CreditCardBrand.AMERICAN_EXPRESS,
      'AMEX': CreditCardBrand.AMERICAN_EXPRESS,
      'DINERS': CreditCardBrand.DINERS,
      'ELO': CreditCardBrand.ELO,
      'BANES_CARD': CreditCardBrand.BANES_CARD,
      'CABAL': CreditCardBrand.CABAL,
      'CREDSYSTEM': CreditCardBrand.CREDSYSTEM,
      'CREDZ': CreditCardBrand.CREDZ,
      'DISCOVER': CreditCardBrand.DISCOVER,
      'SOROCRED': CreditCardBrand.SOROCRED,
      'UCB': CreditCardBrand.UCB,
    };

    return brandMapping[brand?.toUpperCase()] || CreditCardBrand.VISA;
  };
  const [activeMenu, setActiveMenu] = useState<MenuOption>(MenuOption.CONTA);
  const [formData, setFormData] = useState({
    full_name: '',
    apelido: '',
    telefone: '',
    email: ''
  });
  const [securityFormData, setSecurityFormData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });
  // const [originalData, setOriginalData] = useState({
  //   full_name: '',
  //   apelido: '',
  //   telefone: '',
  //   email: '',
  // });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  })
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    Promise.all([getUserProfile()]).then(([userData]) => {
      if (isOpen && userData) {
        const initialData = {
          full_name: userData.user.full_name || '',
          apelido: '',
          telefone: userData.user.whatsapp || userData.user.phone || '',
          email: userData.user.email || '',
        };
        setFormData(initialData);
      }
    }).catch(error => {
      setSnackbar({ open: true, message: 'Erro ao carregar dados da conta', severity: 'error' });
    });
  }, [isOpen, userData]);

  const convertApiOrdersToPurchases = (apiOrders: ApiOrder[]): Purchase[] => {
    const purchases: Purchase[] = [];

    apiOrders.forEach((orderGroup) => {
      const firstProduct = orderGroup.products[0];
      if (!firstProduct) return;

      const hasSubscription = orderGroup.transaction_type === 'subscription';

      const getStatus = (orderStatus: string) => {
        if (orderStatus === 'pending') return 'pending';
        if (orderStatus === 'paid' || orderStatus === 'completed') return 'paid';
        if (orderStatus === 'active') return 'active';
        if (orderStatus === 'cancelled') return 'cancelled';
        return 'pending';
      };

      const title = orderGroup.products.length === 1
        ? orderGroup.products[0].name
        : `Pedido com ${orderGroup.products.length} produtos`;

      const purchase: Purchase = {
        id: orderGroup.group_id,
        title: title,
        orderId: orderGroup.group_id,
        type: hasSubscription ? 'subscription' : 'one-time',
        purchaseDate: new Date(orderGroup.created_at).toLocaleDateString('pt-BR'),
        value: parseFloat(orderGroup.total_amount),
        paymentType: hasSubscription ? 'Recorrente' : 'Pagamento Único',
        frequency: hasSubscription ? 'Mensal' : 'Único',
        status: getStatus(orderGroup.status),
        checkout_url: orderGroup.checkout_url,
        products: orderGroup.products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity || 1,
          subtotal: product.subtotal || product.price
        })),
        transaction_type: orderGroup.transaction_type,
        totalAmount: orderGroup.total_amount,
        ordersCount: orderGroup.orders_count
      };

      purchases.push(purchase);
    });

    return purchases;
  };

  useEffect(() => {
    Promise.all([getMySubscriptions(), listMyOrders()]).then(([subscriptions, orders]) => {
      setSubscriptions(subscriptions);

      const orderData = orders?.grouped_orders;
      if (orderData && Array.isArray(orderData) && orderData.length > 0) {
        setOrders(orderData);
        const convertedPurchases = convertApiOrdersToPurchases(orderData);
        setPurchases(convertedPurchases);
      } else {
        setOrders([]);
        setPurchases([]);
      }
    }).catch(error => {
      setSnackbar({ open: true, message: 'Erro ao carregar assinaturas', severity: 'error' });
      setSubscriptions(null);
      setOrders([]);
      setPurchases([]);
    });
  }, [cancelSubscription]);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (activeMenu === MenuOption.SEGURANCA) {
      setSecurityFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // const hasChanges = () => {
  //   if (activeMenu === MenuOption.CONTA) {
  //     return (
  //       formData.full_name !== originalData.full_name ||
  //       formData.apelido !== originalData.apelido ||
  //       formData.telefone !== originalData.telefone ||
  //       formData.email !== originalData.email
  //     );
  //   }
  //   return formData.senhaAtual || formData.novaSenha || formData.confirmarSenha;
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeMenu === MenuOption.SEGURANCA) {
      if (securityFormData.senhaAtual === '' || securityFormData.novaSenha === '' || securityFormData.confirmarSenha === '') {
        setSnackbar({ open: true, message: 'Por favor, preencha todos os campos', severity: 'error' });
        return;
      }

      if (securityFormData.novaSenha !== securityFormData.confirmarSenha) {
        setSnackbar({ open: true, message: 'As senhas não coincidem', severity: 'error' });
        return;
      }

      const response = await updatePassword(securityFormData.senhaAtual, securityFormData.novaSenha);
      if (response.success) {
        setSnackbar({ open: true, message: 'Senha atualizada com sucesso', severity: 'success' });
        setSecurityFormData({
          senhaAtual: '',
          novaSenha: '',
          confirmarSenha: '',
        });
        await refreshUserData();
      } else {
        setSnackbar({ open: true, message: 'Erro ao atualizar senha', severity: 'error' });
      }
    } else if (activeMenu === MenuOption.CONTA) {
      // Aqui você pode adicionar a lógica para salvar os dados da conta
      setSnackbar({ open: true, message: 'Dados da conta atualizados com sucesso', severity: 'success' });
    }
  };

  const getStatusInfo = (status: Purchase['status']) => {
    switch (status) {
      case 'paid':
        return { text: 'Pago', className: styles.statusPaid };
      case 'active':
        return { text: 'Ativo', className: styles.statusActive };
      case 'pending':
        return { text: 'Pendente', className: styles.statusPending };
      case 'cancelled':
        return { text: 'Cancelado', className: styles.statusCancelled };
      default:
        return { text: 'Desconhecido', className: styles.statusUnknown };
    }
  };

  const getIcon = (type: Purchase['type']) => {
    return type === 'subscription' ? <Repeat size={20} /> : <Package size={20} />;
  };

  const handleViewDetails = (purchaseId: string) => {
    console.log('Ver detalhes da compra:', purchaseId);
    setOpenActionMenu(null);
  };

  const handlePayNow = (checkoutUrl: string | undefined) => {
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    }
    setOpenActionMenu(null);
  };

  const handleDownloadReceipt = (purchaseId: string) => {
    console.log('Baixar comprovante:', purchaseId);
    setOpenActionMenu(null);
  };

  const toggleActionMenu = (purchaseId: string) => {
    setOpenActionMenu(openActionMenu === purchaseId ? null : purchaseId);
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
      setSnackbar({ open: true, message: 'Assinatura cancelada com sucesso', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao cancelar assinatura', severity: 'error' });
    }

  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.orderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'Todos' ||
      (statusFilter === 'Pago' && purchase.status === 'paid') ||
      (statusFilter === 'Pendente' && purchase.status === 'pending') ||
      (statusFilter === 'Ativo' && purchase.status === 'active') ||
      (statusFilter === 'Cancelado' && purchase.status === 'cancelled');

    const matchesType = typeFilter === 'Todos' ||
      (typeFilter === 'Pagamento Único' && purchase.transaction_type === 'purchase') ||
      (typeFilter === 'Recorrente' && purchase.transaction_type === 'subscription');

    return matchesSearch && matchesStatus && matchesType;
  });

  const menuOptions = [
    { id: 'conta', label: 'Conta', icon: User },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'assinaturas', label: 'Assinaturas', icon: Gem },
    { id: 'historico-compras', label: 'Minhas Compras', icon: Banknote },
    { id: 'financeiro', label: 'Financeiro', icon: Wallet }
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case MenuOption.SEGURANCA:
        return (
          <div className={styles.content}>
            <h2>{menuOptions.find(opt => opt.id === activeMenu)?.label}</h2>

            <div className={styles.settingItem}>
              <label>Senha Atual</label>
              <Input.Password placeholder="Digite sua senha atual" className={styles.input} value={securityFormData.senhaAtual} onChange={(e) => handleInputChange('senhaAtual', e.target.value)} />
            </div>
            <div className={styles.settingItem}>
              <label>Nova Senha</label>
              <Input.Password placeholder="Digite sua nova senha" className={styles.input} value={securityFormData.novaSenha} onChange={(e) => handleInputChange('novaSenha', e.target.value)} />
            </div>
            <div className={styles.settingItem}>
              <label>Confirmar Nova Senha</label>
              <Input.Password placeholder="Digite sua nova senha novamente" className={styles.input} value={securityFormData.confirmarSenha} onChange={(e) => handleInputChange('confirmarSenha', e.target.value)} />
            </div>
          </div>
        );
      case MenuOption.ASSINATURAS:
        return (
          <div className={styles.content}>
            <h2>{menuOptions.find(opt => opt.id === activeMenu)?.label}</h2>
            {subscriptions?.subscription?.plan?.active ? (
              <>
                <div className={styles.subscriptionSection}>
                  <h3>ASSINATURA ATUAL</h3>
                  <div className={styles.currentSubscription}>
                    <div className={styles.planInfo}>
                      <h4>{subscriptions.subscription.plan.name}</h4>
                      <div className={styles.price}>
                        <span className={styles.amount}>{formatPrice(parseFloat(subscriptions.subscription.plan.price))}</span>
                        <span className={styles.period}>/{subscriptions.subscription.plan.billing_cycle === 'monthly' ? 'mês' : 'ano'}</span>
                      </div>
                      <a href="#" className={styles.detailsLink}>Ver detalhes</a>
                      {subscriptions.subscription.cancel_at_period_end && (
                        <p className={styles.renewalDate}>Sua assinatura será cancelada em {formatDate(subscriptions.subscription.current_period_end)}.</p>
                      )}
                      {!subscriptions.subscription.cancel_at_period_end && (
                        <p className={styles.renewalDate}>Sua assinatura renova em {formatDate(subscriptions.subscription.current_period_end)}.</p>
                      )}
                    </div>
                    <div className={styles.subscriptionActions}>
                      {subscriptions.subscription.cancel_at_period_end && (
                        <button className={styles.updateButton} onClick={() => router.push(`/plans`)}>Reativar assinatura</button>
                      )}
                      {!subscriptions.subscription.cancel_at_period_end && (
                        <>
                          <button className={styles.updateButton} onClick={() => router.push(`/plans`)}>Atualizar assinatura</button>
                          <button className={styles.cancelButton} onClick={handleCancelSubscription}>Cancelar assinatura</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.subscriptionSection}>
                  <h3>MÉTODO DE PAGAMENTO</h3>
                  <div className={styles.paymentMethod}>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardIcon}>
                        {subscriptions?.payment_info?.credit_card?.has_card && subscriptions?.payment_info?.credit_card?.credit_card_brand ? (
                          <Image
                            src={getCreditCardBrandImage(subscriptions.payment_info.credit_card.credit_card_brand)}
                            alt={subscriptions.payment_info.credit_card.credit_card_brand}
                            width={40}
                            height={25}
                            className={styles.cardBrandImage}
                          />
                        ) : (
                          <div className={styles.defaultCardIcon}>
                            <CreditCard size={24} />
                          </div>
                        )}
                      </div>
                      <div className={styles.cardDetails}>
                        <span className={styles.cardNumber}>
                          {subscriptions?.payment_info?.credit_card?.credit_card_brand || 'Cartão'} ****{subscriptions?.payment_info?.credit_card?.last_digits}
                        </span>
                        <span className={styles.cardStatus}>
                          {subscriptions?.payment_info?.payment_method || 'Cartão de Crédito'}
                        </span>
                      </div>
                      <button className={styles.removeCard}>×</button>
                    </div>
                    <button className={styles.addPaymentButton}>
                      <span>+</span>
                      Adicionar método de pagamento
                    </button>
                  </div>
                </div>

                <div className={styles.subscriptionSection}>
                  <h3>INFORMAÇÕES DE COBRANÇA</h3>
                  <div className={styles.billingInfo}>
                    <div className={styles.billingColumn}>
                      <div className={styles.billingField}>
                        <label>Email</label>
                        <span className={styles.billingValue}>{subscriptions.subscription.user_email}</span>
                      </div>
                      <div className={styles.billingField}>
                        <label>Status da Assinatura</label>
                        <span className={styles.billingValue}>
                          {subscriptions.subscription.plan.active ? 'Ativa' : 'Cancelada'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.billingColumn}>
                      <div className={styles.billingField}>
                        <label>Data de Criação</label>
                        <span className={styles.billingValue}>{formatDate(subscriptions.subscription.created_at)}</span>
                      </div>
                      <div className={styles.billingField}>
                        <label>{subscriptions.subscription.cancel_at_period_end ? `Ficará ativo até` : `Próximo Pagamento`}</label>
                        <span className={styles.billingValue}>
                          {subscriptions.subscription.cancel_at_period_end ?
                            formatDate(subscriptions.subscription.current_period_end) :
                            formatDate(subscriptions.payment_info.latest_payment.due_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.subscriptionSection}>
                  <div className={styles.historyHeader}>
                    <h3>HISTÓRICO DE FATURAS</h3>
                  </div>
                  <div className={styles.invoiceHistory}>
                    {subscriptions.payment_info?.latest_payment && (
                      <div className={styles.invoiceRow}>
                        <span className={styles.invoiceDate}>
                          {formatDate(subscriptions.payment_info.latest_payment.due_date)}
                        </span>
                        <span className={styles.invoiceAmount}>
                          {formatPrice(subscriptions.payment_info.latest_payment.value)}
                        </span>
                        <span className={styles.invoiceStatus}>
                          {subscriptions.payment_info.latest_payment.status === 'CONFIRMED' ? 'Pago' :
                            subscriptions.payment_info.latest_payment.status === 'PENDING' ? 'Pendente' :
                              subscriptions.payment_info.latest_payment.status === 'OVERDUE' ? 'Vencido' : 'Desconhecido'}
                        </span>
                        <span className={styles.invoicePlan}>{subscriptions.subscription.plan.name}</span>
                        <button className={styles.expandButton} onClick={() => window.open(subscriptions.payment_info.latest_payment.invoice_url, '_blank')}>
                          {subscriptions.payment_info.payment_method === 'BOLETO' ? (
                            <Barcode width={16} height={16} />
                          ) : subscriptions.payment_info.payment_method === 'PIX' ? (
                            <QrCode width={16} height={16} />
                          ) : (
                            <SquareArrowOutUpRight width={16} height={16} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <a href="#" className={styles.viewMoreLink}>Ver mais</a>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>Você não possui nenhuma assinatura ativa.</p>
                <Button variant="contained" color="primary" className={styles.upgradeButton} onClick={() => router.push('/plans')}>Assine agora</Button>
              </div>
            )}
          </div>
        );
      case MenuOption.HISTORICO_COMPRAS:
        return (
          <div className={styles.content}>
            <h2>Extrato de Pedidos</h2>
            <p className={styles.subtitle}>Histórico completo das suas transações e assinaturas</p>

            <div className={styles.filtersBar}>

              <div className={styles.searchSection}>
                <div className={styles.searchInput}>
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Buscar transação..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className={styles.dropdowns}>
                  <select
                    className={styles.dropdown}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option>Todos</option>
                    <option>Pago</option>
                    <option>Pendente</option>
                    <option>Ativo</option>
                    <option>Cancelado</option>
                  </select>

                  <select
                    className={styles.dropdown}
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option>Todos</option>
                    <option>Pagamento Único</option>
                    <option>Recorrente</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.purchasesList}>
              {filteredPurchases.map((purchase) => {
                const statusInfo = getStatusInfo(purchase.status);
                const isActionMenuOpen = openActionMenu === purchase.id;

                return (
                  <div key={purchase.id} className={styles.purchaseCard}>
                    <div className={styles.cardLeft}>
                      <div className={styles.iconContainer}>
                        <span className={styles.typeIcon}>{getIcon(purchase.type)}</span>
                      </div>

                      <div className={styles.purchaseInfo}>
                        <h3>{purchase.title}</h3>
                        <div className={styles.orderDetails}>
                          <span className={styles.orderId}>{purchase.orderId}</span>
                          <span className={styles.purchaseDate}>{purchase.purchaseDate}</span>
                          <span className={styles.paymentType}>{purchase.paymentType}</span>
                        </div>
                        {purchase.products && purchase.products.length > 1 && (
                          <div className={styles.productsList}>
                            {purchase.products.map((product, index) => (
                              <div key={product.id} className={styles.productItem}>
                                <span className={styles.productName}>{product.name}</span>
                                <span className={styles.productPrice}>
                                  {product.quantity && product.quantity > 1 ? `${product.quantity}x ` : ''}
                                  {formatPrice(parseFloat(product.price))}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        {purchase.nextCharge && (
                          <div className={styles.nextCharge}>
                            Próxima cobrança: {purchase.nextCharge}
                          </div>
                        )}
                        {purchase.cancelledDate && (
                          <div className={styles.cancelledInfo}>
                            Cancelado em: {purchase.cancelledDate}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.cardRight}>
                      <div className={styles.priceInfo}>
                        <div className={styles.price}>{formatPrice(purchase.value)}</div>
                        <div className={styles.frequency}>{purchase.frequency}</div>
                      </div>

                      <div className={styles.statusBadge}>
                        <div className={`${styles.status} ${statusInfo.className}`}>
                          {statusInfo.text}
                        </div>
                      </div>

                      <div className={styles.actionMenu}>
                        <button
                          className={styles.actionButton}
                          onClick={() => toggleActionMenu(purchase.id)}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {isActionMenuOpen && (
                          <div className={styles.actionDropdown}>
                            <button
                              className={styles.actionItem}
                              onClick={() => handleViewDetails(purchase.id)}
                            >
                              <Eye size={16} />
                              Ver Detalhes
                            </button>

                            {purchase.status === 'pending' && purchase.checkout_url && (
                              <button
                                className={`${styles.actionItem} ${styles.actionItemGreen}`}
                                onClick={() => purchase.checkout_url && handlePayNow(purchase.checkout_url)}
                              >
                                <CreditCard size={16} />
                                Pagar Agora
                              </button>
                            )}

                            {purchase.status === 'paid' && (
                              <button
                                className={styles.actionItem}
                                onClick={() => handleDownloadReceipt(purchase.id)}
                              >
                                <Download size={16} />
                                Baixar Comprovante
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPurchases.length === 0 && (
              <div className={styles.emptyState}>
                <p>Nenhuma transação encontrada com os filtros aplicados.</p>
              </div>
            )}
          </div>
        );
      case MenuOption.FINANCEIRO:
        return (
          <div className={styles.content}>
            <h2>{menuOptions.find(opt => opt.id === activeMenu)?.label}</h2>
          </div>
        );
      default:
        return (
          <div className={styles.content}>
            <h2>Conta</h2>
            <div className={styles.settingItem}>
              <label>Nome completo</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.settingItem}>
              <label>Como gostaria de ser chamado?</label>
              <input
                type="text"
                value={formData.apelido}
                onChange={(e) => handleInputChange('apelido', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.settingItem}>
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.settingItem}>
              <label>Telefone</label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Configurações</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <nav className={styles.sidebar}>
            {menuOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  className={`${styles.menuItem} ${activeMenu === option.id ? styles.active : ''}`}
                  onClick={() => setActiveMenu(option.id as MenuOption)}
                >
                  <IconComponent size={20} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </nav>

          <div className={styles.mainContent}>
            {renderContent()}

            {(activeMenu === MenuOption.CONTA || activeMenu === MenuOption.SEGURANCA) && (
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    if (activeMenu === MenuOption.SEGURANCA) {
                      setSecurityFormData({
                        senhaAtual: '',
                        novaSenha: '',
                        confirmarSenha: '',
                      });
                    }
                    // Para a aba conta, os dados já estão sendo editados em tempo real
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  onClick={handleSubmit}
                >
                  Salvar Alterações
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
}; 
'use client';
import { useState, useEffect } from 'react';
import { X, User, Shield, Gem, ChevronDown, ArrowDownToLine, Wallet, Banknote, Filter, Search, MoreVertical, Download, AlertTriangle, Eye, CreditCard, SquareArrowOutUpRight, Repeat, Package } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthProvider';
import styles from './AccountSettingsModal.module.scss';
import { cancelSubscription, getMySubscriptions, listMyOrders } from '@/services/api';
import { Alert, Button, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { formatPrice, formatDate } from '@/hooks';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MenuOption = 'conta' | 'seguranca' | 'assinaturas' | 'historico-compras' | 'financeiro';

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
      has_card: boolean;
      last_digits: string;
    };
    latest_payment: {
      status: string;
      value: number;
      due_date: string;
      invoice_url: string;
      bank_slip_url: string | null;
    };
    payment_method: string;
  };
  success: boolean;
}

export const AccountSettingsModal = ({ isOpen, onClose }: AccountSettingsModalProps) => {
  const router = useRouter();
  const { userData, refreshUserData } = useAuthContext();
  const [activeMenu, setActiveMenu] = useState<MenuOption>('conta');
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    apelido: '',
    telefone: '',
    email: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });
  const [originalData, setOriginalData] = useState({
    nome: '',
    sobrenome: '',
    apelido: '',
    telefone: '',
    email: '',
  });
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
    if (isOpen && userData) {
      const initialData = {
        nome: userData.first_name || '',
        sobrenome: userData.last_name || '',
        apelido: '',
        telefone: userData.whatsapp || '',
        email: userData.email || '',
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: '',
      };
      setFormData(initialData);
      setOriginalData({
        nome: userData.first_name || '',
        sobrenome: userData.last_name || '',
        apelido: '',
        telefone: userData.whatsapp || '',
        email: userData.email || '',
      });
    }
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

    console.log("purchases", purchases);
    
    return purchases;
  };

  useEffect(() => {
    Promise.all([getMySubscriptions(), listMyOrders()]).then(([subscriptions, orders]) => {
      setSubscriptions(subscriptions);

      const orderData = orders?.grouped_orders;
      if (orderData && Array.isArray(orderData) && orderData.length > 0) {
        console.log(orderData);
        
        setOrders(orderData);
        const convertedPurchases = convertApiOrdersToPurchases(orderData);
        setPurchases(convertedPurchases);
      } else {
        setOrders([]);
        setPurchases([]);
      }
    }).catch(error => {
      console.error('Erro ao carregar assinaturas:', error);
      setSubscriptions(null);
      setOrders([]);
      setPurchases([]);
    });
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasChanges = () => {
    if (activeMenu === 'conta') {
      return (
        formData.nome !== originalData.nome ||
        formData.sobrenome !== originalData.sobrenome ||
        formData.apelido !== originalData.apelido ||
        formData.telefone !== originalData.telefone ||
        formData.email !== originalData.email
      );
    }
    return formData.senhaAtual || formData.novaSenha || formData.confirmarSenha;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeMenu === 'conta') {
      setOriginalData({
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        apelido: formData.apelido,
        telefone: formData.telefone,
        email: formData.email,
      });
    }

    await refreshUserData();
    onClose();
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
      console.log('Pagar agora:', checkoutUrl);
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
      case 'seguranca':
        return (
          <div className={styles.content}>
            <h2>{menuOptions.find(opt => opt.id === activeMenu)?.label}</h2>

            <div className={styles.settingItem}>
              <label>Senha Atual</label>
              <input
                type="password"
                value={formData.senhaAtual}
                onChange={(e) => handleInputChange('senhaAtual', e.target.value)}
                placeholder="Senha atual"
                className={styles.input}
              />
            </div>
            <div className={styles.settingItem}>
              <label>Nova Senha</label>
              <input
                type="password"
                value={formData.novaSenha}
                onChange={(e) => handleInputChange('novaSenha', e.target.value)}
                placeholder="Nova senha"
                className={styles.input}
              />
            </div>
            <div className={styles.settingItem}>
              <label>Confirmar Nova Senha</label>
              <input
                type="password"
                value={formData.confirmarSenha}
                onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                placeholder="Confirmar nova senha"
                className={styles.input}
              />
            </div>
          </div>
        );
      case 'assinaturas':
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
                      <button className={styles.updateButton} onClick={() => router.push(`/plans`)}>Atualizar assinatura</button>
                      {subscriptions.subscription.cancel_at_period_end && (
                        <button className={styles.updateButton} onClick={() => router.push(`/plans`)}>Reativar assinatura</button>
                      )}
                      {!subscriptions.subscription.cancel_at_period_end && (
                        <button className={styles.cancelButton} onClick={handleCancelSubscription}>Cancelar assinatura</button>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.subscriptionSection}>
                  <h3>MÉTODO DE PAGAMENTO</h3>
                  <div className={styles.paymentMethod}>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardIcon}>
                        <div className={styles.mastercardIcon}>
                          {subscriptions?.payment_info?.credit_card?.brand === 'VISA' ? 'V' :
                            subscriptions?.payment_info?.credit_card?.brand === 'MASTERCARD' ? 'MC' :
                              subscriptions?.payment_info?.credit_card?.brand === 'AMEX' ? 'AE' : 'CC'}
                        </div>
                      </div>
                      <div className={styles.cardDetails}>
                        <span className={styles.cardNumber}>
                          {subscriptions?.payment_info?.credit_card?.brand || 'Cartão'} ****{subscriptions?.payment_info?.credit_card?.last_digits}
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
                          {subscriptions.subscription.status === 'pending' ? 'Pendente' :
                            subscriptions.subscription.status === 'active' ? 'Ativa' :
                              subscriptions.subscription.status === 'cancelled' ? 'Cancelada' : 'Desconhecido'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.billingColumn}>
                      <div className={styles.billingField}>
                        <label>Data de Criação</label>
                        <span className={styles.billingValue}>{formatDate(subscriptions.subscription.created_at)}</span>
                      </div>
                      <div className={styles.billingField}>
                        <label>Próximo Pagamento</label>
                        <span className={styles.billingValue}>
                          {subscriptions.payment_info?.latest_payment?.due_date ?
                            formatDate(subscriptions.payment_info.latest_payment.due_date) :
                            'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* <button className={styles.updateInfoButton}>Atualizar informações</button> */}
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
                          <SquareArrowOutUpRight width={16} height={16} />
                        </button>
                      </div>
                    )}
                    {subscriptions.payment_info?.latest_payment?.invoice_url && (
                      <div className={styles.invoiceActions}>
                        {subscriptions.payment_info.latest_payment.bank_slip_url && (
                          <a
                            href={subscriptions.payment_info.latest_payment.bank_slip_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.invoiceLink}
                          >
                            Boleto
                          </a>
                        )}
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
      case 'historico-compras':
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
      case 'financeiro':
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
              <label>Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.settingItem}>
              <label>Sobrenome</label>
              <input
                type="text"
                value={formData.sobrenome}
                onChange={(e) => handleInputChange('sobrenome', e.target.value)}
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

            {/* Botão de salvar - só aparece quando há alterações */}
            {hasChanges() && (
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    // Resetar para dados originais
                    if (activeMenu === 'conta') {
                      setFormData(prev => ({
                        ...prev,
                        nome: originalData.nome,
                        sobrenome: originalData.sobrenome,
                        apelido: originalData.apelido,
                        telefone: originalData.telefone,
                        email: originalData.email,
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        senhaAtual: '',
                        novaSenha: '',
                        confirmarSenha: '',
                      }));
                    }
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
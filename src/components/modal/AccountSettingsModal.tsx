'use client';
import { useState, useEffect } from 'react';
import { X, User, Shield, Gem, ChevronDown, ArrowDownToLine, Wallet, Banknote, Filter, Search, MoreVertical, Download, AlertTriangle, Eye, CreditCard } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthProvider';
import styles from './AccountSettingsModal.module.scss';

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
}

export const AccountSettingsModal = ({ isOpen, onClose }: AccountSettingsModalProps) => {
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

  // Estados para a seção de compras
  const [purchases] = useState<Purchase[]>([
    {
      id: '1',
      title: 'Consultoria Técnica',
      orderId: 'ORD-003',
      type: 'one-time',
      purchaseDate: '19/01/2024',
      value: 499.99,
      paymentType: 'Pagamento Único',
      frequency: 'Único',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Certificado SSL Premium',
      orderId: 'ORD-001',
      type: 'one-time',
      purchaseDate: '14/01/2024',
      value: 299.99,
      paymentType: 'Pagamento Único',
      frequency: 'Único',
      status: 'paid'
    },
    {
      id: '3',
      title: 'Auditoria de Segurança',
      orderId: 'ORD-005',
      type: 'one-time',
      purchaseDate: '11/01/2024',
      value: 1299.99,
      paymentType: 'Pagamento Único',
      frequency: 'Único',
      status: 'paid'
    },
    {
      id: '4',
      title: 'Backup Automático',
      orderId: 'ORD-006',
      type: 'subscription',
      purchaseDate: '04/01/2024',
      value: 49.99,
      paymentType: 'Recorrente',
      frequency: 'Mensal',
      status: 'active',
      nextCharge: '04/02/2024'
    },
    {
      id: '5',
      title: 'Plano Premium Mensal',
      orderId: 'ORD-002',
      type: 'subscription',
      purchaseDate: '31/12/2023',
      value: 99.99,
      paymentType: 'Recorrente',
      frequency: 'Mensal',
      status: 'active',
      nextCharge: '31/01/2024'
    },
    {
      id: '6',
      title: 'Plano Enterprise Anual',
      orderId: 'ORD-007',
      type: 'subscription',
      purchaseDate: '15/12/2023',
      value: 999.99,
      paymentType: 'Recorrente',
      frequency: 'Anual',
      status: 'cancelled',
      cancelledDate: '10/01/2024'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

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

  // Funções para a seção de compras
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
    return type === 'subscription' ? '🔄' : '📦';
  };

  const handleViewDetails = (purchaseId: string) => {
    console.log('Ver detalhes da compra:', purchaseId);
    setOpenActionMenu(null);
  };

  const handlePayNow = (purchaseId: string) => {
    console.log('Pagar agora:', purchaseId);
    setOpenActionMenu(null);
  };

  const handleDownloadReceipt = (purchaseId: string) => {
    console.log('Baixar comprovante:', purchaseId);
    setOpenActionMenu(null);
  };

  const handleReportProblem = (purchaseId: string) => {
    console.log('Reportar problema:', purchaseId);
    setOpenActionMenu(null);
  };

  const toggleActionMenu = (purchaseId: string) => {
    setOpenActionMenu(openActionMenu === purchaseId ? null : purchaseId);
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
                       (typeFilter === 'Pagamento Único' && purchase.paymentType === 'Pagamento Único') ||
                       (typeFilter === 'Recorrente' && purchase.paymentType === 'Recorrente');
    
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
            <div className={styles.subscriptionSection}>
              <h3>ASSINATURA ATUAL</h3>
              <div className={styles.currentSubscription}>
                <div className={styles.planInfo}>
                  <h4>Plano Premium</h4>
                  <div className={styles.price}>
                    <span className={styles.amount}>R$ 59,90</span>
                    <span className={styles.period}>por mês</span>
                  </div>
                  <a href="#" className={styles.detailsLink}>Ver detalhes</a>
                  <p className={styles.renewalDate}>Sua assinatura renova em 30 de Janeiro, 2025.</p>
                </div>
                <div className={styles.subscriptionActions}>
                  <button className={styles.updateButton}>Atualizar assinatura</button>
                  <button className={styles.cancelButton}>Cancelar assinatura</button>
                </div>
              </div>
            </div>

            <div className={styles.subscriptionSection}>
              <h3>MÉTODO DE PAGAMENTO</h3>
              <div className={styles.paymentMethod}>
                <div className={styles.cardInfo}>
                  <div className={styles.cardIcon}>
                    <div className={styles.mastercardIcon}>MC</div>
                  </div>
                  <div className={styles.cardDetails}>
                    <span className={styles.cardNumber}>Mastercard ****0608</span>
                    <span className={styles.cardStatus}>Padrão • Expira 07/2034</span>
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
                    <label>Nome</label>
                    <span className={styles.billingValue}>JOÃO SILVA</span>
                  </div>
                  <div className={styles.billingField}>
                    <label>Endereço de cobrança</label>
                    <div className={styles.address}>
                      <span>Rua das Flores, 123</span>
                      <span>Centro, São Paulo-SP</span>
                      <span>01234-567</span>
                      <span>BR</span>
                    </div>
                  </div>
                </div>
                <div className={styles.billingColumn}>
                  <div className={styles.billingField}>
                    <label>Email</label>
                    <span className={styles.billingValue}>joao@email.com</span>
                  </div>
                </div>
              </div>
              <button className={styles.updateInfoButton}>Atualizar informações</button>
            </div>

            <div className={styles.subscriptionSection}>
              <div className={styles.historyHeader}>
                <h3>HISTÓRICO DE FATURAS</h3>
              </div>
              <div className={styles.invoiceHistory}>
                <div className={styles.invoiceRow}>
                  <span className={styles.invoiceDate}>30 Ago, 2025</span>
                  <span className={styles.invoiceAmount}>R$ 59,90</span>
                  <span className={styles.invoiceStatus}>Pendente</span>
                  <span className={styles.invoicePlan}>Plano Premium</span>
                  <button className={styles.expandButton}>
                    <ArrowDownToLine width={16} height={16} />
                  </button>
                </div>
                <div className={styles.invoiceRow}>
                  <span className={styles.invoiceDate}>30 Jul, 2025</span>
                  <span className={styles.invoiceAmount}>R$ 59,90</span>
                  <span className={styles.invoiceStatus}>Pago</span>
                  <span className={styles.invoicePlan}>Plano Premium</span>
                  <button className={styles.expandButton}>
                    <ArrowDownToLine width={16} height={16} />
                  </button>
                </div>
                <div className={styles.invoiceRow}>
                  <span className={styles.invoiceDate}>30 Jun, 2025</span>
                  <span className={styles.invoiceAmount}>R$ 59,90</span>
                  <span className={styles.invoiceStatus}>Pago</span>
                  <span className={styles.invoicePlan}>Plano Premium</span>
                  <button className={styles.expandButton}>
                    <ArrowDownToLine width={16} height={16} />
                  </button>
                </div>
              </div>
              <a href="#" className={styles.viewMoreLink}>Ver mais</a>
            </div>
          </div>
        );
      case 'historico-compras':
        return (
          <div className={styles.content}>
            <h2>Extrato de Pedidos</h2>
            <p className={styles.subtitle}>Histórico completo das suas transações e assinaturas</p>

            <div className={styles.filtersBar}>
              <button className={styles.filtersButton}>
                <Filter size={16} />
                Filtros
              </button>
              
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
                          <span className={styles.orderId}>#{purchase.orderId}</span>
                          <span className={styles.purchaseDate}>{purchase.purchaseDate}</span>
                          <span className={styles.paymentType}>{purchase.paymentType}</span>
                        </div>
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
                        <div className={styles.price}>R$ {purchase.value.toFixed(2).replace('.', ',')}</div>
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
                            
                            {purchase.status === 'pending' && (
                              <button 
                                className={`${styles.actionItem} ${styles.actionItemGreen}`}
                                onClick={() => handlePayNow(purchase.id)}
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
                            
                            <button 
                              className={`${styles.actionItem} ${styles.actionItemRed}`}
                              onClick={() => handleReportProblem(purchase.id)}
                            >
                              <AlertTriangle size={16} />
                              Reportar Problema
                            </button>
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
    </div>
  );
}; 
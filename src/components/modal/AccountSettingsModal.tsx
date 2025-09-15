'use client';
import { useState, useEffect } from 'react';
import { X, User, Shield, Gem, ChevronDown, ArrowDownToLine } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthProvider';
import styles from './AccountSettingsModal.module.scss';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MenuOption = 'conta' | 'seguranca' | 'assinaturas';

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

  const menuOptions = [
    { id: 'conta', label: 'Conta', icon: User },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'assinaturas', label: 'Assinaturas', icon: Gem },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'conta':
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
      default:
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
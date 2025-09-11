'use client';
import { useState, useEffect } from 'react';
import { X, User, Shield } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthProvider';
import styles from './AccountSettingsModal.module.scss';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MenuOption = 'conta' | 'seguranca';

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

  // Carregar dados do usuário quando o modal abrir
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
'use client';
import { useState } from 'react';
import { X, User, Shield } from 'lucide-react';
import styles from './AccountSettingsModal.module.scss';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MenuOption = 'conta' | 'seguranca';

export const AccountSettingsModal = ({ isOpen, onClose }: AccountSettingsModalProps) => {
  const [activeMenu, setActiveMenu] = useState<MenuOption>('conta');
  const [formData, setFormData] = useState({
    nome: 'João',
    sobrenome: 'Silva',
    apelido: '',
    telefone: '',
    email: 'joao@exemplo.com',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
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
          </div>
        </div>
      </div>
    </div>
  );
}; 
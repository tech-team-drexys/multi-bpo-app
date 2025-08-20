'use client';
import { useState } from 'react';
import { X, User, Phone, Mail, Lock } from 'lucide-react';
import styles from './AccountSettingsModal.module.scss';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSettingsModal = ({ isOpen, onClose }: AccountSettingsModalProps) => {
  const [formData, setFormData] = useState({
    nome: 'João',
    sobrenome: 'Silva',
    apelido: '',
    telefone: '',
    email: 'joao@exemplo.com',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de salvamento aqui
    console.log('Dados do formulário:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <User className={styles.titleIcon} />
            <div>
              <h2>Configurações da Conta</h2>
              <p>Atualize suas informações pessoais e configurações de segurança.</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3>Informações Pessoais</h3>
            <div className={styles.inputGroup}>
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="sobrenome">Sobrenome</label>
              <input
                type="text"
                id="sobrenome"
                value={formData.sobrenome}
                onChange={(e) => handleInputChange('sobrenome', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="apelido">Apelido</label>
              <input
                type="text"
                id="apelido"
                value={formData.apelido}
                onChange={(e) => handleInputChange('apelido', e.target.value)}
                placeholder="Como você gostaria de ser chamado"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3>Informações de Contato</h3>
            <div className={styles.inputGroup}>
              <label htmlFor="telefone">
                <Phone size={16} />
                Número de Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(00) 00000-0000"
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3>
              <Lock size={16} />
              Alterar Senha
            </h3>
            <div className={styles.inputGroup}>
              <label htmlFor="senhaAtual">Senha Atual</label>
              <input
                type="password"
                id="senhaAtual"
                value={formData.senhaAtual}
                onChange={(e) => handleInputChange('senhaAtual', e.target.value)}
                placeholder="Digite sua senha atual"
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="novaSenha">Nova Senha</label>
              <input
                type="password"
                id="novaSenha"
                value={formData.novaSenha}
                onChange={(e) => handleInputChange('novaSenha', e.target.value)}
                placeholder="Nova senha"
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmarSenha">Confirmar Senha</label>
              <input
                type="password"
                id="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                placeholder="Confirme a senha"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 
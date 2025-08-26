'use client';
import { useState } from 'react';
import { X, User, Bell, Clock, Link, Database, Shield, Settings } from 'lucide-react';
import styles from './AccountSettingsModal.module.scss';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MenuOption = 'geral' | 'notificacoes' | 'personalizacao' | 'aplicativos' | 'dados' | 'seguranca' | 'conta';

export const AccountSettingsModal = ({ isOpen, onClose }: AccountSettingsModalProps) => {
  const [activeMenu, setActiveMenu] = useState<MenuOption>('geral');
  const [formData, setFormData] = useState({
    nome: 'João',
    sobrenome: 'Silva',
    apelido: '',
    telefone: '',
    email: 'joao@exemplo.com',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
    tema: 'Sistema',
    corEnfase: 'Padrão',
    idioma: 'Autodetectar',
    linguagemFalada: 'Autodetectar',
    voz: 'Sol',
    sugestoesComplementares: true
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
    { id: 'geral', label: 'Geral', icon: Settings },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'personalizacao', label: 'Personalização', icon: Clock },
    { id: 'aplicativos', label: 'Aplicativos conectados', icon: Link },
    { id: 'dados', label: 'Controlar dados', icon: Database },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'conta', label: 'Conta', icon: User }
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'geral':
        return (
          <div className={styles.content}>
            <h2>Geral</h2>
            <div className={styles.settingItem}>
              <label>Tema</label>
              <select 
                value={formData.tema} 
                onChange={(e) => handleInputChange('tema', e.target.value)}
                className={styles.select}
              >
                <option value="Sistema">Sistema</option>
                <option value="Claro">Claro</option>
                <option value="Escuro">Escuro</option>
              </select>
            </div>
            <div className={styles.settingItem}>
              <label>Cor de ênfase</label>
              <div className={styles.colorSelector}>
                <select 
                  value={formData.corEnfase} 
                  onChange={(e) => handleInputChange('corEnfase', e.target.value)}
                  className={styles.select}
                >
                  <option value="Padrão">Padrão</option>
                  <option value="Azul">Azul</option>
                  <option value="Verde">Verde</option>
                </select>
                <div className={styles.colorPreview}></div>
              </div>
            </div>
            <div className={styles.settingItem}>
              <label>Idioma</label>
              <select 
                value={formData.idioma} 
                onChange={(e) => handleInputChange('idioma', e.target.value)}
                className={styles.select}
              >
                <option value="Autodetectar">Autodetectar</option>
                <option value="Português">Português</option>
                <option value="Inglês">Inglês</option>
              </select>
            </div>
            <div className={styles.settingItem}>
              <label>Linguagem falada</label>
              <select 
                value={formData.linguagemFalada} 
                onChange={(e) => handleInputChange('linguagemFalada', e.target.value)}
                className={styles.select}
              >
                <option value="Autodetectar">Autodetectar</option>
                <option value="Português">Português</option>
                <option value="Inglês">Inglês</option>
              </select>
              <p className={styles.description}>
                Para obter melhores resultados, selecione o idioma principal que você fala. 
                Caso não esteja listado, ele ainda poderá ser compatível por meio da detecção automática.
              </p>
            </div>
            <div className={styles.settingItem}>
              <label>Voz</label>
              <div className={styles.voiceSelector}>
                <button className={styles.playButton}>Reproduzir</button>
                <select 
                  value={formData.voz} 
                  onChange={(e) => handleInputChange('voz', e.target.value)}
                  className={styles.select}
                >
                  <option value="Sol">Sol</option>
                  <option value="Lua">Lua</option>
                  <option value="Estrela">Estrela</option>
                </select>
              </div>
            </div>
            <div className={styles.settingItem}>
              <label>Exibir sugestões complementares nas conversas</label>
              <div className={styles.toggle}>
                <input
                  type="checkbox"
                  id="sugestoes"
                  checked={formData.sugestoesComplementares}
                  onChange={(e) => handleInputChange('sugestoesComplementares', e.target.checked)}
                />
                <label htmlFor="sugestoes" className={styles.toggleLabel}></label>
              </div>
            </div>
          </div>
        );
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
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
          </div>
        );
      default:
        return (
          <div className={styles.content}>
            <h2>{menuOptions.find(opt => opt.id === activeMenu)?.label}</h2>
            <p>Configurações para {menuOptions.find(opt => opt.id === activeMenu)?.label.toLowerCase()} serão implementadas em breve.</p>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
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
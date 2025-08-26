'use client';

import React, { useEffect, useState } from 'react';
import { Button, Checkbox, TextField, FormControlLabel, Snackbar, Alert } from '@mui/material';
import { X, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { Tag } from 'antd';
import styles from './RegistrationModal.module.scss';
import { useAuth, usePhoneMask } from '@/hooks';
import { Facebook } from '@/icons/facebook';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  const { login } = useAuth();
  const { applyPhoneMask, removePhoneMask } = usePhoneMask();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    firstName: '',
    acceptTerms: false
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Simular verificação automática do email após 20 segundos
  useEffect(() => {
    if (currentStep === 3 && !isEmailVerified) {
      const timer = setTimeout(() => {
        setIsEmailVerified(true);
        showMessage('Email verificado com sucesso!', 'success');
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isEmailVerified]);

  // Funções de validação para cada step
  const isStep2Valid = () => {
    return formData.email && formData.password && formData.acceptTerms;
  };

  const isStep2ContactValid = () => {
    const phoneNumbers = removePhoneMask(formData.phone);
    return formData.firstName && phoneNumbers.length >= 10;
  };

  const isStep5Valid = () => {
    return formData.email && formData.password;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhoneChange = (value: string) => {
    const maskedValue = applyPhoneMask(value);
    handleInputChange('phone', maskedValue);
  };

  const showMessage = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      if (!formData.firstName) {
        showMessage('Por favor, preencha o nome completo', 'error');
        return;
      }
      const phoneNumbers = removePhoneMask(formData.phone);
      if (phoneNumbers.length < 10) {
        showMessage('Por favor, adicione um telefone válido', 'error');
        return;
      }
      setCurrentStep(3);
    }

    setCurrentStep(currentStep + 1);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showMessage('Por favor, preencha todos os campos', 'error');
      return;
    }

    showMessage('Login realizado com sucesso!', 'success');
    login();

    setCurrentStep(1);
    setIsLoginMode(false);
    setFormData({
      email: '',
      password: '',
      phone: '',
      firstName: '',
      acceptTerms: false
    });

    onClose();
  };

  const handleCloseModal = () => {
    setCurrentStep(1);
    setIsLoginMode(false);
    setFormData({
      email: '',
      password: '',
      phone: '',
      firstName: '',
      acceptTerms: false
    });
    onClose();
  };

  const handleSocialLogin = (provider: string) => {
    showMessage(`Cadastro com ${provider} em desenvolvimento`, 'info');
  };

  const handleSwitchToLogin = () => {
    setIsLoginMode(true);
    setCurrentStep(5);
  };

  const handleSwitchToSignup = () => {
    setIsLoginMode(false);
    setCurrentStep(1);
  };

  const resetModal = () => {
    setCurrentStep(1);
    setIsLoginMode(false);
    setFormData({
      email: '',
      password: '',
      phone: '',
      firstName: '',
      acceptTerms: false,
    });
    setIsEmailVerified(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={resetModal}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

          <button className={styles.closeButton} onClick={resetModal}>
            <X size={24} />
          </button>

          <div className={styles.modalContent}>
            <div className={styles.contentAlert}>
              {!isLoginMode && currentStep <= 3 ? (
                <div className={styles.floatingTags}>
                  <div className={styles.contentMessage}>
                    <h1>Você atingiu o limite de <br /> <span>Mensagens</span> <br /> sem fazer cadastro.</h1>
                    <p>Para continuar, faça seu cadastro agora e gratuitamente!</p>
                  </div>
                  <img src="/background-test.png" alt="Success Ilustration " className={styles.successIlustration} />
                </div>
              ) : !isLoginMode && currentStep > 3 ? (
                <>
                  <div className={styles.floatingTags}>
                    <div className={styles.contentMessage}>
                      <h1>Seu email foi validado e seu cadastro foi realizado com <br /> <span>Sucesso!</span></h1>
                      <p>Agora você pode começar a usar o sistema a vontade e aproveitar todas as funcionalidades!</p>
                    </div>
                    <div className={styles.tagsContainer}>
                      <Tag className={styles.tag} color="blue">Gestão Financeira</Tag>
                      <Tag className={styles.tag} color="purple">ERP</Tag>
                      <Tag className={styles.tag} color="green">Controle de Estoque</Tag>
                      <Tag className={styles.tag} color="orange">Relatórios Avançados</Tag>
                      <Tag className={styles.tag} color="cyan">Automação de Processos</Tag>
                      <Tag className={styles.tag} color="magenta">Integração Completa</Tag>
                      <Tag className={styles.tag} color="red">Dashboard Inteligente</Tag>
                    </div>
                    <img src="/background-test.png" alt="Success Ilustration " className={styles.successIlustration} />
                  </div>
                </>
              ) : (
                <div className={styles.floatingTags}>
                  <div className={styles.contentMessage}>
                    <h1>Bem-vindo de volta! <br /> <span>Faça login</span> <br /> para continuar.</h1>
                    <p>Acesse sua conta e aproveite todas as funcionalidades do sistema!</p>
                  </div>
                  <img src="/background-test.png" alt="Success Ilustration " className={styles.successIlustration} />
                </div>
              )}
            </div>
            <div className={styles.rightSection}>
              <div className={styles.contentContainer}>
                <img src="/new-logo.png" alt="Logo" className={styles.logoImage} width={70} height={54} />

                {!isLoginMode ? (
                  <>
                    {currentStep === 1 ? (
                      <div className={styles.stepContent}>
                        <div className={styles.titleContainer}>
                          <h1 className={styles.title}>
                            Cadastre-se e aproveite!
                          </h1>
                        </div>
                        <div className={styles.socialButtons}>
                          <Button
                            className={styles.socialButton}
                            size="small"
                            fullWidth
                            onClick={() => handleSocialLogin('Google')}
                            variant="outlined"
                          >
                            <img src="/google-icon.svg" alt="Google" className={styles.socialIcon} width={24} height={24} />
                            Cadastro com Google
                          </Button>

                          <Button
                            className={styles.socialButton}
                            size="small"
                            fullWidth
                            onClick={() => handleSocialLogin('Facebook')}
                            variant="outlined"
                          >
                            <Facebook className={styles.socialIcon} width={24} height={24} />
                            Cadastro com Facebook
                          </Button>
                        </div>

                        <div className={styles.divider}>
                          <span>ou</span>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className={styles.form}>
                          <label className={styles.label}>E-mail</label>
                          <TextField
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            size="small"
                            required
                            fullWidth
                            variant="outlined"
                            className={styles.input}
                          />

                          <label className={styles.label}>Senha</label>
                          <TextField
                            type="password"
                            placeholder="Digite sua senha"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            size="small"
                            required
                            fullWidth
                            variant="outlined"
                            className={styles.input}
                          />

                          <div className={styles.captchaContainer}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  className={styles.checkbox}
                                />
                              }
                              label={
                                <span className={styles.termsCheckboxLabel}>
                                  Confirmo que não sou um robô
                                </span>
                              }
                            />
                          </div>

                          <div className={styles.termsCheckbox}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.acceptTerms}
                                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                                  required
                                  className={styles.checkbox}
                                />
                              }
                              label={
                                <span className={styles.termsCheckboxLabel}>
                                  Aceito os{' '}
                                  <a href="#" className={styles.link}>Termos de Uso</a>
                                  {' '}e{' '}
                                  <a href="#" className={styles.link}>Política de Privacidade</a>
                                </span>
                              }
                            />
                          </div>

                          <Button
                            variant="contained"
                            type="submit"
                            className={styles.submitButton}
                            size="large"
                            fullWidth
                            disabled={!isStep2Valid()}
                            onClick={() => setCurrentStep(2)}
                          >
                            Avançar
                          </Button>
                        </form>

                        <div className={styles.loginLink}>
                          <span>Já possui cadastro? </span>
                          <button
                            type="button"
                            className={styles.linkButton}
                            onClick={handleSwitchToLogin}
                          >
                            Fazer login
                          </button>
                        </div>
                      </div>
                    ) : currentStep === 2 ? (
                      <div className={styles.stepContent}>
                        <div className={styles.contentBackButton}>
                          <Button
                            variant='text'
                            type="button"
                            className={styles.backButton}
                            onClick={() => setCurrentStep(currentStep - 1)}
                          >
                            <ArrowLeft size={14} />
                            Voltar
                          </Button>
                          <div className={styles.titleContainer}>
                            <h1 className={styles.title}>Informações de Contato</h1>
                            <p className={styles.subtitle}>Complete seu cadastro</p>
                          </div>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className={styles.form}>
                          <label className={styles.label}>Nome completo *</label>
                          <TextField
                            type="text"
                            placeholder="Digite seu nome"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            size="medium"
                            required
                            fullWidth
                            variant="outlined"
                            className={styles.input}
                          />

                          <label className={styles.label}>Telefone *</label>
                          <TextField
                            type="text"
                            placeholder="(11) 99999-9999"
                            value={formData.phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            size="medium"
                            required
                            fullWidth
                            variant="outlined"
                            className={styles.input}
                          />

                          <div className={styles.termsSection}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.acceptTerms}
                                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                                  className={styles.checkbox}
                                />
                              }
                              label={
                                <span className={styles.termsCheckboxLabel}>
                                  Concordo em receber notificações por WhatsApp
                                </span>
                              }
                            />
                          </div>
                        </form>

                        <Button
                          variant="contained"
                          type="submit"
                          className={styles.submitButton}
                          size="large"
                          fullWidth
                          disabled={!isStep2ContactValid()}
                          onClick={() => handleNextStep()}
                        >
                          Continuar
                        </Button>
                      </div>
                    ) : currentStep === 3 ? (
                      <div className={styles.stepContent}>
                        <div className={styles.contentBackButton}>
                          <Button
                            variant='text'
                            type="button"
                            className={styles.backButton}
                            onClick={() => setCurrentStep(currentStep - 1)}
                          >
                            <ArrowLeft size={14} />
                            Voltar
                          </Button>
                        </div>
                        <div>
                          <h1 className={styles.title}>Verifique seu email</h1>
                          <p className={styles.subtitle}>Enviamos um email de verificação para {formData.email}</p>
                          <div className={`${styles.verificationContainer} ${isEmailVerified ? styles.verified : styles.pending}`}>
                            <div className={styles.verificationContent}>
                              {isEmailVerified ? (
                                <>
                                  <CheckCircle size={20} color="var(--success)" />
                                  <span className={styles.verificationText}>Email verificado com sucesso!</span>
                                </>
                              ) : (
                                <>
                                  <Clock size={20} color="var(--warning)" />
                                  <span className={styles.verificationText}>Verificação pendente</span>
                                </>
                              )}
                            </div>
                          </div>

                          <p className={styles.subtitle}>Não recebeu o email? Verifique sua caixa de spam ou tente novamente.</p>
                          <Button
                            variant="contained"
                            type="submit"
                            className={styles.submitButton}
                            size="large"
                            fullWidth
                            disabled={!isEmailVerified}
                            onClick={() => handleNextStep()}
                          >
                            {isEmailVerified ? 'Continuar' : 'Aguardando verificação...'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.fullWidthSection}>
                        <div className={styles.centeredContent}>

                          <div className={styles.stepContent}>
                            <div className={styles.successSection}>
                              <h1 className={styles.title}>Seu cadastro foi realizado com <br /> <span>Sucesso!</span></h1>
                              <p className={styles.subtitle}>Agora você pode começar a usar o sistema a vontade!</p>
                            </div>

                            <div className={styles.accountSummary}>
                              <p>O que nosso sistema oferece para você?</p>
                              <ul className={styles.summaryList}>
                                <li><CheckCircle size={15} color='var(--secondary)' /> Tenha acesso a nossa IA</li>
                                <li><CheckCircle size={15} color='var(--secondary)' /> Nossa central de atendimento disponível 24h</li>
                                <li><CheckCircle size={15} color='var(--secondary)' /> Gerenciamento de prazos com a nossa agenda</li>
                                <li><CheckCircle size={15} color='var(--secondary)' /> Gerenciamento de documentos</li>
                                <li><CheckCircle size={20} color='var(--secondary)' /> Certificados digitais de seus clientes em um só lugar e fácil de acessar</li>
                              </ul>
                            </div>

                            <Button
                              variant="contained"
                              onClick={handleCloseModal}
                              className={styles.submitButton}
                              size="large"
                              fullWidth
                            >
                              Navegar pelo sistema
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.stepContent}>
                    <div className={styles.titleContainer}>
                      <h1 className={styles.title}>Faça login na sua conta</h1>
                      <p className={styles.subtitle}>Acesse sua conta e aproveite todas as funcionalidades</p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className={styles.form}>
                      <label className={styles.label}>E-mail *</label>
                      <TextField
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        size="medium"
                        required
                        fullWidth
                        variant="outlined"
                        className={styles.input}
                      />

                      <label className={styles.label}>Senha *</label>
                      <TextField
                        type="password"
                        placeholder="Digite sua senha"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        size="medium"
                        required
                        fullWidth
                        variant="outlined"
                        className={styles.input}
                      />

                      <div className={styles.captchaContainer}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              className={styles.checkbox}
                            />
                          }
                          label={
                            <span className={styles.termsCheckboxLabel}>
                              Confirmo que não sou um robô
                            </span>
                          }
                        />
                      </div>

                      <Button
                        variant="contained"
                        type="submit"
                        className={styles.submitButton}
                        size="large"
                        fullWidth
                        disabled={!isStep5Valid()}
                      >
                        Entrar
                      </Button>

                      <div className={styles.signupLink}>
                        <span>Não tem conta? </span>
                        <button
                          type="button"
                          className={styles.linkButton}
                          onClick={handleSwitchToSignup}
                        >
                          Cadastre-se
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div >

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}; 
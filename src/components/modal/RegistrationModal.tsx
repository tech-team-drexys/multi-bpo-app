'use client';

import React, { useEffect, useState } from 'react';
import { Button, Checkbox, TextField, FormControlLabel, Snackbar, Alert } from '@mui/material';
import { X, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { Divider, Tag } from 'antd';
import styles from './RegistrationModal.module.scss';
import { signIn, useSession } from 'next-auth/react';
import { Facebook } from '@/icons/facebook';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  openedFromSidebar?: boolean;
  setIsRegistrationSidebar: (e: boolean) => void;
}

export const RegistrationModal = ({
  isOpen,
  onClose,
  openedFromSidebar,
  setIsRegistrationSidebar,
}: RegistrationModalProps) => {
  const { data: session } = useSession();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    firstName: '',
    acceptTerms: false,
    rememberMe: false,
  });

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Polling para verificação de e-mail
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (currentStep === 3 && !isEmailVerified && isOpen && formData.email) {
      const checkEmailConfirmation = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/email-status/?email=${encodeURIComponent(
              formData.email
            )}`
          );
          if (!response.ok) return;

          const data = await response.json();
          if (data.success && data.email_verified) {
            setIsEmailVerified(true);
            clearInterval(pollInterval);
            setTimeout(() => setCurrentStep(4), 2000);
          }
        } catch (error) {
          console.error('Erro ao consultar status de email:', error);
        }
      };

      setTimeout(() => {
        pollInterval = setInterval(checkEmailConfirmation, 5000);
      }, 3000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [currentStep, isEmailVerified, isOpen, formData.email]);

  // Carregar credenciais salvas
  useEffect(() => {
    if (isOpen && isLoginMode && typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('lucaIA_rememberedEmail');
      if (savedEmail) setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, [isOpen, isLoginMode]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showMessage = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Próximo passo no cadastro
  const handleNextStep = async () => {
    if (currentStep === 2) {
      if (!formData.firstName) {
        showMessage('Por favor, preencha o nome completo', 'error');
        return;
      }
      if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
        showMessage('Por favor, adicione um telefone válido', 'error');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            whatsapp: formData.phone,
            password: formData.password,
            password_confirm: formData.password,
            captcha_token: 'demo-token-123',
            accept_terms: formData.acceptTerms,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showMessage('Cadastro realizado! Verifique seu email.', 'success');
          setCurrentStep(3);
        } else {
          showMessage(data.message || 'Erro no cadastro', 'error');
        }
      } catch (err) {
        showMessage('Erro ao cadastrar', 'error');
      }
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  // Login com NextAuth Credentials
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showMessage('Por favor, preencha todos os campos', 'error');
      return;
    }

    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      showMessage(res.error, 'error');
    } else {
      showMessage('Login realizado com sucesso!', 'success');
      onClose();
    }

    // Lembrar-me
    if (formData.rememberMe) {
      localStorage.setItem('lucaIA_rememberedEmail', formData.email);
    } else {
      localStorage.removeItem('lucaIA_rememberedEmail');
    }
  };

  // Login social
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const res = await signIn(provider, { redirect: false });
    if (res?.error) {
      showMessage('Erro no login social', 'error');
    } else {
      showMessage(`Login com ${provider} realizado!`, 'success');
      onClose();
    }
  };

  const handleCloseModal = () => {
    setCurrentStep(1);
    setIsLoginMode(false);
    setFormData({ email: '', password: '', phone: '', firstName: '', acceptTerms: false, rememberMe: false });
    setIsEmailVerified(false);
    if (openedFromSidebar) setIsRegistrationSidebar(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={handleCloseModal}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={handleCloseModal}>
            <X size={24} />
          </button>

          <div className={styles.modalContent}>
            <div className={styles.rightSection}>
              <div className={styles.contentContainer}>
                <img src="/new-logo.png" alt="Logo" className={styles.logoImage} width={70} height={54} />

                {!isLoginMode ? (
                  <>
                    {currentStep === 1 && (
                      <div className={styles.stepContent}>
                        <h1 className={styles.title}>Cadastre-se e aproveite!</h1>

                        <div className={styles.socialButtons}>
                          <Button
                            className={styles.socialButton}
                            size="small"
                            fullWidth
                            onClick={() => handleSocialLogin('google')}
                            variant="outlined"
                          >
                            Google
                          </Button>
                          <Button
                            className={styles.socialButton}
                            size="small"
                            fullWidth
                            onClick={() => handleSocialLogin('facebook')}
                            variant="outlined"
                          >
                            <Facebook className={styles.socialIcon} width={24} height={24} />
                            Facebook
                          </Button>
                        </div>

                        <Divider plain>ou</Divider>

                        <form onSubmit={e => e.preventDefault()} className={styles.form}>
                          <TextField
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={formData.email}
                            onChange={e => handleInputChange('email', e.target.value)}
                            fullWidth
                            required
                          />
                          <TextField
                            type="password"
                            placeholder="Digite sua senha"
                            value={formData.password}
                            onChange={e => handleInputChange('password', e.target.value)}
                            fullWidth
                            required
                          />

                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.acceptTerms}
                                onChange={e => handleInputChange('acceptTerms', e.target.checked)}
                              />
                            }
                            label="Aceito os termos"
                          />

                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setCurrentStep(2)}
                            disabled={!formData.email || !formData.password || !formData.acceptTerms}
                          >
                            Avançar
                          </Button>
                        </form>

                        <div>
                          <span>Já possui cadastro? </span>
                          <button onClick={() => setIsLoginMode(true)}>Fazer login</button>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className={styles.stepContent}>
                        <Button variant="text" onClick={() => setCurrentStep(1)}>
                          <ArrowLeft size={14} /> Voltar
                        </Button>

                        <TextField
                          type="text"
                          placeholder="Nome completo"
                          value={formData.firstName}
                          onChange={e => handleInputChange('firstName', e.target.value)}
                          fullWidth
                        />
                        <TextField
                          type="text"
                          placeholder="Telefone"
                          value={formData.phone}
                          onChange={e => handleInputChange('phone', e.target.value)}
                          fullWidth
                        />

                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleNextStep}
                          disabled={!formData.firstName || formData.phone.replace(/\D/g, '').length < 10}
                        >
                          Continuar
                        </Button>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className={styles.stepContent}>
                        <h1>Verifique seu email</h1>
                        {isEmailVerified ? (
                          <p>Email verificado com sucesso!</p>
                        ) : (
                          <p>Aguardando confirmação do email...</p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.stepContent}>
                    <h1>Faça login</h1>
                    <form onSubmit={handleLoginSubmit} className={styles.form}>
                      <TextField
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={formData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        fullWidth
                        required
                      />
                      <TextField
                        type="password"
                        placeholder="Digite sua senha"
                        value={formData.password}
                        onChange={e => handleInputChange('password', e.target.value)}
                        fullWidth
                        required
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.rememberMe}
                            onChange={e => handleInputChange('rememberMe', e.target.checked)}
                          />
                        }
                        label="Lembrar-me"
                      />

                      <Button variant="contained" type="submit" fullWidth>
                        Entrar
                      </Button>
                    </form>

                    <div>
                      <span>Não tem conta? </span>
                      <button onClick={() => setIsLoginMode(false)}>Cadastre-se</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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

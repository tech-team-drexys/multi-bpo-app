'use client';

import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Image, Input, message } from 'antd';
import { X, ArrowLeft } from 'lucide-react';
import styles from './RegistrationModal.module.scss';
import { useAuth, usePhoneMask } from '@/hooks';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  const { login } = useAuth();
  const { applyPhoneMask, removePhoneMask } = usePhoneMask();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [otpValidation, setOtpValidation] = useState<'valid' | 'invalid' | ''>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    otpCode: '',
    firstName: '',
    lastName: '',
    nickname: '',
    acceptTerms: false
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Funções de validação para cada step
  const isStep2Valid = () => {
    return formData.email && formData.password && formData.acceptTerms;
  };

  const isStep3Valid = () => {
    const phoneNumbers = removePhoneMask(formData.phone);
    if (!showOtpInput) {
      return phoneNumbers.length >= 10;
    }
    return formData.otpCode && formData.otpCode.length === 6;
  };

  const isStep4Valid = () => {
    return formData.firstName && formData.lastName;
  };

  const isStep5Valid = () => {
    return formData.email && formData.password;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    console.log(field, value);
    if (field === 'otpCode') {
      console.log(value === '123456' ? 'valid' : 'invalid');
      setOtpValidation(value === '123456' ? 'valid' : 'invalid');
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhoneChange = (value: string) => {
    const maskedValue = applyPhoneMask(value);
    handleInputChange('phone', maskedValue);
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.email || !formData.password) {
        message.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }
      if (!formData.acceptTerms) {
        message.error('Você deve aceitar os termos de uso');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const phoneNumbers = removePhoneMask(formData.phone);
      if (phoneNumbers.length < 10) {
        message.error('Por favor, adicione um telefone válido');
        return;
      }
      if (!showOtpInput) {
        handleVerifyPhone();
        return;
      }
      if (!formData.otpCode || formData.otpCode.length < 4) {
        message.error('Por favor, insira o código de verificação completo');
        return;
      }
      // Simular validação do OTP
      if (formData.otpCode === '123456') {
        setCurrentStep(4);
      } else {
        message.error('Código inválido. Tente novamente.');
      }
    }
  };

  const handleVerifyPhone = () => {
    const phoneNumbers = removePhoneMask(formData.phone);
    if (phoneNumbers.length < 10) {
      message.error('Por favor, adicione um telefone válido');
      return;
    }
    setShowOtpInput(true);
    setOtpCountdown(60);
    const interval = setInterval(() => {
      setOtpCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    message.success('Código de verificação enviado!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName) {
      message.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    message.success('Cadastro realizado com sucesso!');
    login();

    // Reset do formulário e fechamento da modal
    setCurrentStep(1);
    setFormData({
      email: '',
      password: '',
      phone: '',
      otpCode: '',
      firstName: '',
      lastName: '',
      nickname: '',
      acceptTerms: false
    });
    setShowOtpInput(false);
    setOtpCountdown(0);

    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      message.error('Por favor, preencha todos os campos');
      return;
    }

    message.success('Login realizado com sucesso!');
    login();

    // Reset do formulário e fechamento da modal
    setCurrentStep(1);
    setIsLoginMode(false);
    setFormData({
      email: '',
      password: '',
      phone: '',
      otpCode: '',
      firstName: '',
      lastName: '',
      nickname: '',
      acceptTerms: false
    });

    onClose();
  };

  const handleSocialLogin = (provider: string) => {
    message.info(`Cadastro com ${provider} em desenvolvimento`);
  };

  const handleEmailSignup = () => {
    setCurrentStep(2);
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
      otpCode: '',
      firstName: '',
      lastName: '',
      nickname: '',
      acceptTerms: false,
    });
    setOtpValidation('');
    setShowOtpInput(false);
    setOtpCountdown(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={resetModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={resetModal}>
          <X size={24} />
        </button>

        <div className={styles.modalContent}>
          <div className={styles.leftSection}>
            <Image src="/alert.png" alt="Alert" preview={false} className={styles.alertImage} />
          </div>

          <div className={styles.rightSection}>
            {currentStep > 1 && (
              <Button
                type="text"
                className={styles.backButton}
                onClick={() => setCurrentStep(currentStep === 5 ? 1 : currentStep - 1)}
                size="small"
                icon={<ArrowLeft size={16} />}
              >
                Voltar
              </Button>
            )}

            <div className={styles.logo}>
              <Image src="/logo.png" alt="Logo" preview={false} className={styles.logoImage} width={130} height={40} />
            </div>

            <h1 className={styles.title}>
              {isLoginMode ? 'Faça login na sua conta' : 'Cadastre-se e tenha acesso à benefícios exclusivos!'}
            </h1>

            {currentStep === 1 && (
              <div className={styles.stepContent}>
                <Button
                  className={styles.socialButton}
                  size="large"
                  block
                  onClick={() => handleSocialLogin('Google')}
                >
                  <Image src="/google-icon.svg" alt="Google" preview={false} className={styles.socialIcon} width={24} height={24} />
                  Cadastre-se com o Google
                </Button>

                <Button
                  className={styles.socialButton}
                  size="large"
                  block
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  <svg className={styles.socialIcon} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Cadastre-se com o Facebook
                </Button>

                <Button
                  className={styles.socialButton}
                  size="large"
                  block
                  onClick={handleEmailSignup}
                >
                  <svg className={styles.socialIcon} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  Cadastre-se com o Email
                </Button>

                <div className={styles.divider}>
                  <span>ou</span>
                </div>

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
            )}

            {currentStep === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>E-mail *</label>
                  <Input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    size="large"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Senha *</label>
                  <Input.Password
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    size="large"
                    required
                  />
                </div>

                <div className={styles.termsCheckbox}>
                  <Checkbox
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                    required
                  >
                    Aceito os{' '}
                    <a href="#" className={styles.link}>Termos de Uso</a>
                    {' '}e{' '}
                    <a href="#" className={styles.link}>Política de Privacidade</a>
                    {' '}*
                  </Checkbox>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.submitButton}
                  size="large"
                  block
                  disabled={!isStep2Valid()}
                >
                  Avançar
                </Button>
              </form>
            )}

            {currentStep === 3 && (
              <div className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Telefone *</label>
                  <Input
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    size="large"
                    maxLength={15}
                    required
                  />
                </div>

                {!showOtpInput ? (
                  <Button
                    type="primary"
                    className={styles.submitButton}
                    size="large"
                    block
                    onClick={handleVerifyPhone}
                    disabled={!isStep3Valid()}
                  >
                    Verificar
                  </Button>
                ) : (
                  <>
                      {console.log("otpValidation", otpValidation)}
                    <div className={styles.inputGroup}>
                      <label>Código de Verificação *</label>
                      <Input.OTP
                        length={6}
                        value={formData.otpCode}
                        onChange={(value) => handleInputChange('otpCode', value)}
                        size="large"
                        className={styles.otpInput}
                        status={otpValidation === 'invalid' ? 'error' : undefined}
                      />
                    </div>

                    {otpCountdown > 0 && (
                      <p className={styles.countdown}>
                        Reenviar código em {otpCountdown}s
                      </p>
                    )}

                    <Button
                      type="primary"
                      className={styles.submitButton}
                      size="large"
                      block
                      onClick={handleNextStep}
                      disabled={!isStep3Valid()}
                    >
                      Avançar
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Step 4: Dados pessoais */}
            {currentStep === 4 && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Nome</label>
                  <Input
                    placeholder="Digite seu nome"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    size="large"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Sobrenome</label>
                  <Input
                    placeholder="Digite seu sobrenome"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    size="large"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Como gostaria de ser chamado?</label>
                  <Input
                    placeholder="Digite como gostaria de ser chamado"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                    size="large"
                  />
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.submitButton}
                  size="large"
                  // block
                  disabled={!isStep4Valid()}
                >
                  Cadastrar-se
                </Button>
              </form>
            )}

            {/* Step 5: Login */}
            {currentStep === 5 && (
              <form onSubmit={handleLoginSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>E-mail *</label>
                  <Input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    size="large"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Senha *</label>
                  <Input.Password
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    size="large"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Captcha *</label>
                  <div className={styles.captchaContainer}>
                    {/* Aqui você pode integrar o Cloudflare Turnstile */}
                    <div className={styles.captchaPlaceholder}>
                      <span>Captcha Cloudflare será integrado aqui</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.submitButton}
                  size="large"
                  block
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 
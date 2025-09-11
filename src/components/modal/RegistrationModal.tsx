'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button, Checkbox, TextField, FormControlLabel, Snackbar, Alert } from '@mui/material';
import { X, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { Divider, Tag } from 'antd';
import styles from './RegistrationModal.module.scss';
import { usePhoneMask } from '@/hooks';
import { useAuthContext } from '@/contexts/AuthProvider';
import { GoogleLogin } from '@react-oauth/google';
import { Turnstile } from '@/components/captcha/turnstile';
import { registerUser, RegisterUserData, loginWithCredentials, LoginCredentials, checkEmailStatus, loginWithGoogle, getUserProfile, loginWithFacebook } from '@/services/api';
import { FacebookButton } from '@/components/social-buttons/FacebookButton';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  openedFromSidebar?: boolean;
  setIsRegistrationSidebar: (e: boolean) => void;
}

export const RegistrationModal = ({ isOpen, onClose, openedFromSidebar, setIsRegistrationSidebar }: RegistrationModalProps) => {
  const { login } = useAuthContext();
  const { applyPhoneMask, removePhoneMask } = usePhoneMask();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    fullName: '',
    acceptTerms: false,
    rememberMe: false
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (currentStep === 3 && !isEmailVerified && isOpen && formData.email) {
      const checkEmailConfirmation = async () => {
        try {
          const response = await checkEmailStatus(formData.email);

          if (!response.success) {
            showMessage("Erro ao verificar email", "error");
            setIsLoading(false);
            return;
          }

          if (response.email_verified) {
            setIsEmailVerified(true);
            setIsLoading(false);
            showMessage("Email verificado com sucesso", "success");
            setInterval(() => {
              setCurrentStep(4);
            }, 2000);
            setFormData({
              email: "",
              password: "",
              phone: "",
              fullName: "",
              acceptTerms: false,
              rememberMe: false,
            });

            clearInterval(pollInterval);
          }
        } catch (error) {
          showMessage("Erro ao verificar email", "error");
          setIsLoading(false);
        }
      };

      checkEmailConfirmation();

      pollInterval = setInterval(checkEmailConfirmation, 10000);

      return () => {
        if (pollInterval) clearInterval(pollInterval);
      };
    }
  }, [currentStep, isEmailVerified, isOpen, formData.email]);

  useEffect(() => {
    if (isOpen && isLoginMode && typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('lucaIA_rememberedEmail');
      const savedPassword = localStorage.getItem('lucaIA_rememberedPassword');

      if (savedEmail && savedPassword) {
        setFormData(prev => ({
          ...prev,
          email: savedEmail,
          password: savedPassword,
          rememberMe: true
        }));
      }
    }
  }, [isOpen, isLoginMode]);

  // O SDK do Facebook agora é carregado no layout.tsx


  const isStep2Valid = () => {
    return formData.email && formData.password && formData.acceptTerms && captchaVerified;
  };

  const isStep2ContactValid = (): boolean => {
    const phoneNumbers: string = removePhoneMask(formData.phone);
    return !!formData.fullName && phoneNumbers.length >= 10;
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

  const handleCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token);
    setCaptchaVerified(true);
    console.log('Captcha verificado com sucesso');
  }, []);

  const handleCaptchaError = useCallback(() => {
    setCaptchaVerified(false);
    showMessage('Erro na verificação do captcha. Tente novamente.', 'error');
  }, []);

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaVerified(false);
    setCaptchaToken("");
  }, []);

  const showMessage = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      if (!formData.fullName) {
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

  const handleRegisterSubmit = async () => {
    if (!formData.email || !formData.password || !formData.fullName || !formData.phone) {
      showMessage('Por favor, preencha todos os campos obrigatórios', 'error');
      return;
    }

    if (!formData.acceptTerms) {
      showMessage('Você deve aceitar os termos de uso', 'error');
      return;
    }

    if (!captchaToken || !captchaVerified) {
      showMessage('Captcha não foi validado. Aguarde um momento e tente novamente.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const userData: RegisterUserData = {
        email: formData.email,
        whatsapp: formData.phone,
        password: formData.password,
        captcha_token: captchaToken,
        accept_terms: formData.acceptTerms,
        full_name: formData.fullName,
        password_confirm: formData.password,
      };

      const response = await registerUser(userData);

      if (response.access && response.refresh) {
        localStorage.setItem('token', response.access);
        localStorage.setItem('refreshToken', response.refresh);
        showMessage('Cadastro realizado com sucesso! Você já está logado.', 'success');
        await login();

        setTimeout(() => {
          setCurrentStep(3);
          setIsLoginMode(false);
        }, 2000);
      } else {
        showMessage('Erro ao realizar cadastro. Tente novamente.', 'error');
        setCurrentStep(3);
      }
    } catch (error: any) {
      let errorMessage = 'Erro ao realizar cadastro. Tente novamente.';

      if (error.response?.data?.email) {
        errorMessage = 'Este email já está cadastrado.';
      } else if (error.response?.data?.whatsapp) {
        errorMessage = 'Este telefone já está cadastrado.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      showMessage(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showMessage('Por favor, preencha todos os campos', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const credentials: LoginCredentials = {
        email: formData.email,
        password: formData.password
      };

      await loginWithCredentials(credentials);

      showMessage('Login realizado com sucesso!', 'success');
      await login();

      setCurrentStep(1);
      setIsLoginMode(false);
      setFormData({
        email: '',
        password: '',
        phone: '',
        fullName: '',
        acceptTerms: false,
        rememberMe: false
      });

      onClose();
    } catch (error: any) {
      let errorMessage = 'Erro ao fazer login. Tente novamente.';

      if (error.response?.status === 401) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.non_field_errors) {
        errorMessage = error.response.data.non_field_errors[0];
      }

      showMessage(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      if (typeof window === 'undefined' || !(window as any).FB) {
        showMessage("SDK do Facebook não carregado", "error");
        return;
      }

      (window as any).FB.login((response: any) => {
        if (response.authResponse) {
          handleFacebookResponse(response.authResponse.accessToken);
        } else {
          showMessage("Login com Facebook cancelado", "info");
        }
      }, { scope: 'email,public_profile' });
    } catch (error) {
      showMessage("Erro ao inicializar login do Facebook", "error");
    }
  };

  const handleFacebookResponse = async (accessToken: string) => {
    try {
      await loginWithFacebook(accessToken);

      showMessage("Login com Facebook realizado com sucesso!", "success");
      await login(true);

      try {
        await getUserProfile();
      } catch (error) {
        showMessage("Tivemos um problema ao buscar seu perfil, tente novamente mais tarde.");
      }

      onClose();
    } catch (err: any) {
      let errorMessage = "Erro ao fazer login com Facebook";
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      showMessage(errorMessage, "error");
    }
  };


  const handleCloseModal = () => {
    setCurrentStep(1);
    setIsLoginMode(false);
    setFormData({
      email: '',
      password: '',
      phone: '',
      fullName: '',
      acceptTerms: false,
      rememberMe: false
    });
    onClose();
  };

  const handleSwitchToLogin = () => {
    setIsRegistrationSidebar(false);
    setIsLoginMode(true);
    setCurrentStep(5);
  };

  const handleSwitchToSignup = () => {
    setIsLoginMode(false);
    setIsRegistrationSidebar(true);
    setCurrentStep(1);
  };

  const resetModal = () => {
    setCurrentStep(1);
    setIsLoginMode(false);
    setFormData({
      email: '',
      password: '',
      phone: '',
      fullName: '',
      acceptTerms: false,
      rememberMe: false
    });
    setIsEmailVerified(false);
    setCaptchaToken("");
    setCaptchaVerified(false);
    if (openedFromSidebar) {
      setIsRegistrationSidebar(false);
    }
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
              {!isLoginMode && currentStep <= 3 && !openedFromSidebar ? (
                <div className={styles.signupImageContainer}>
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
                    <img src="/waves.png" alt="Success Ilustration " className={styles.successIlustration} />
                  </div>
                </>
              ) : openedFromSidebar ? (
                <div className={styles.loginContainer}>
                  <div className={styles.contentMessageLogin}>
                    <h1>Bem-vindo! Faça seu <span>Cadastro</span>!</h1>
                    <p>Crie sua conta e aproveite todas as funcionalidades do sistema!</p>
                  </div>
                  <div className={styles.backgroundLogin}>
                    <img src="/login-background.png" alt="login background" className={styles.successIlustration} />
                  </div>
                </div>
              ) : (
                <div className={styles.loginContainer}>
                  <div className={styles.contentMessageLogin}>
                    <h1>Bem-vindo de volta! <span>Faça login</span> para continuar.</h1>
                    <p>Acesse sua conta e aproveite todas as funcionalidades do sistema!</p>
                  </div>
                  <div className={styles.backgroundLogin}>
                    <img src="/login-background.png" alt="login background" className={styles.successIlustration} />
                  </div>
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
                          <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                              if (!credentialResponse.credential) {
                                showMessage('Token não fornecido pelo Google', 'error');
                                return;
                              }

                              const idToken = credentialResponse.credential;

                              try {
                                await loginWithGoogle(idToken);

                                showMessage('Login com Google realizado com sucesso!', 'success');
                                await login(true);

                                try {
                                  await getUserProfile();
                                } catch (error) {
                                  showMessage('Tivemos um problema ao buscar seu perfil, tente novamente mais tarde.');
                                }

                                onClose();
                              } catch (err: any) {
                                showMessage('Erro ao fazer login com Google');

                                let errorMessage = 'Erro ao fazer login com Google';
                                if (err.response?.data?.detail) {
                                  errorMessage = err.response.data.detail;
                                } else if (err.response?.data?.error) {
                                  errorMessage = err.response.data.error;
                                }

                                showMessage(errorMessage, 'error');
                              }
                            }}
                            onError={() => {
                              showMessage('Erro ao autenticar com Google', 'error');
                            }}
                            text="signup_with"
                            useOneTap={false}
                          />


                          <FacebookButton
                            onClick={handleFacebookLogin}
                            text="Cadastro com Facebook"
                          />
                        </div>

                        <Divider plain>ou</Divider>

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

                          {isOpen && currentStep === 1 && !isLoginMode && (
                            <Turnstile
                              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                              onVerify={handleCaptchaVerify}
                              onError={handleCaptchaError}
                              onExpire={handleCaptchaExpire}
                              theme="light"
                              size="normal"
                              className={styles.captcha}
                            />
                          )}

                          <Button
                            variant="contained"
                            type="submit"
                            className={styles.submitButton}
                            size="large"
                            fullWidth
                            disabled={!isStep2Valid() || isLoading}
                            onClick={() => setCurrentStep(2)}
                          >
                            {isLoading ? 'Processando...' : 'Avançar'}
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
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
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
                          disabled={!isStep2ContactValid() || isLoading}
                          onClick={handleRegisterSubmit}
                        >
                          {isLoading ? 'Cadastrando...' : 'Continuar'}
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

                    <div className={styles.socialButtons}>
                      <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                          if (!credentialResponse.credential) {
                            showMessage('Token não fornecido pelo Google', 'error');
                            return;
                          }

                          const idToken = credentialResponse.credential;

                          try {
                            await loginWithGoogle(idToken);

                            showMessage('Login com Google realizado com sucesso!', 'success');
                            await login(true);

                            try {
                              await getUserProfile();
                            } catch (error) {
                              showMessage('Tivemos um problema ao buscar seu perfil, tente novamente mais tarde.');
                            }

                            onClose();
                          } catch (err: any) {
                            showMessage('Erro ao fazer login com Google');

                            let errorMessage = 'Erro ao fazer login com Google';
                            if (err.response?.data?.detail) {
                              errorMessage = err.response.data.detail;
                            } else if (err.response?.data?.error) {
                              errorMessage = err.response.data.error;
                            }

                            showMessage(errorMessage, 'error');
                          }
                        }}
                        onError={() => {
                          showMessage('Erro ao autenticar com Google', 'error');
                        }}
                        text="signin_with"
                        useOneTap={false}
                      />

                      <FacebookButton
                        onClick={handleFacebookLogin}
                        text="Login com Facebook"
                      />
                    </div>

                    <Divider plain>ou</Divider>

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
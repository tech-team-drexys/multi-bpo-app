import axios from "axios";

// ===== CONFIGURAÇÃO DAS INSTÂNCIAS AXIOS =====

// Instância pública (mantém compatibilidade atual)
const publicApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_TOKEN
    }
});

// Instância autenticada (nova, para JWT)
const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// ===== INTERCEPTORS PARA JWT =====

// Request Interceptor - Adiciona token automaticamente
authApi.interceptors.request.use(
    (config) => {
        const tokens = localStorage.getItem('multibpo_tokens');
        if (tokens) {
            try {
                const { access } = JSON.parse(tokens);
                if (access) {
                    config.headers.Authorization = `Bearer ${access}`;
                }
            } catch (error) {
                console.error('Erro ao parsear tokens:', error);
                localStorage.removeItem('multibpo_tokens');
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor - Refresh automático
authApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const tokens = localStorage.getItem('multibpo_tokens');
                if (tokens) {
                    const { refresh } = JSON.parse(tokens);
                    if (refresh) {
                        const response = await axios.post(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/token/refresh/`,
                            { refresh }
                        );

                        const newTokens = {
                            access: response.data.access,
                            refresh: response.data.refresh || refresh
                        };

                        localStorage.setItem('multibpo_tokens', JSON.stringify(newTokens));
                        localStorage.setItem('multibpo_user', JSON.stringify(response.data.user || {}));
                        
                        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                        return authApi(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.warn('Erro ao renovar token, redirecionando para login:', refreshError);
                localStorage.removeItem('multibpo_tokens');
                localStorage.removeItem('multibpo_user');
                localStorage.removeItem('lucaIA_loggedIn');
                // Não redireciona automaticamente - deixa o AuthContext decidir
            }
        }

        return Promise.reject(error);
    }
);

// ===== FUNÇÕES EXISTENTES (SEM ALTERAÇÃO) =====

export const getNews = async (limit: number) => {
    try {
        const response = await publicApi.get(`/noticias/?limit=${limit}`);
        return response;
    } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        throw error;
    }
};

export const getOneNews = async (id: number) => {
    try {
        const response = await publicApi.get(`/noticias/${id}/`);
        return response;
    } catch (error) {
        console.error("Erro ao buscar a notícia:", error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await publicApi.get("/categorias/");
        return response;
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        throw error;
    }
};

export const getCertificados = async (page: number = 1) => {
    try {
        const response = await publicApi.get(`/certificados/?page=${page}`);
        return response;
    } catch (error) {
        console.error("Erro ao buscar certificados:", error);
        throw error;
    }
};

// ===== FUNÇÕES DE AUTENTICAÇÃO (NOVAS) =====

// Types para melhor tipagem
export interface RegisterUserData {
    email: string;
    whatsapp: string;
    password: string;
    password_confirm: string;
    captcha_token: string;
    accept_terms: boolean;
    firstName?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SocialLoginData {
    provider: 'google' | 'facebook';
    accessToken: string;
    email: string;
    name?: string;
}

export interface UserProfile {
    first_name?: string;
    last_name?: string;
    whatsapp?: string;
}

// Função de registro
export const registerUser = async (userData: RegisterUserData) => {
    try {
        // Mapear campos frontend → backend (baseado nos serializers)
        const backendData = {
            email: userData.email.toLowerCase().trim(),
            whatsapp: userData.whatsapp,
            password: userData.password,
            password_confirm: userData.password_confirm,  // ← Usar o valor que vem do frontend
            captcha_token: userData.captcha_token,        // ← Usar o valor que vem do frontend
            accept_terms: userData.accept_terms,          // ← Usar o valor que vem do frontend
            registration_method: 'email'
        };

        const response = await authApi.post('/api/v1/auth/register/', backendData);
        return response.data;
    } catch (error) {
        console.error("Erro no registro:", error);
        throw error;
    }
};

// Função de login com credenciais (para uso no AuthContext)
export const loginWithCredentials = async (credentials: LoginCredentials) => {
    try {
        // Mapear campos frontend → backend
        const backendData = {
            email: credentials.email.toLowerCase().trim(),
            password: credentials.password,
            captcha_token: 'demo-token-123' // TODO: Implementar Turnstile real
        };

        const response = await authApi.post('/api/v1/auth/login/', backendData);
        
        // Salvar tokens e dados do usuário
        if (response.data.access && response.data.refresh) {
            const tokens = {
                access: response.data.access,
                refresh: response.data.refresh
            };
            localStorage.setItem('multibpo_tokens', JSON.stringify(tokens));
            localStorage.setItem('multibpo_user', JSON.stringify(response.data.user || {}));
            localStorage.setItem('lucaIA_loggedIn', 'true'); // Compatibilidade
        }

        return response.data;
    } catch (error) {
        console.error("Erro no login:", error);
        throw error;
    }
};

// Função de login simples (compatibilidade com Modal atual)
export const loginSimple = (): Promise<{ success: boolean }> => {
    localStorage.setItem('lucaIA_loggedIn', 'true');
    return Promise.resolve({ success: true });
};

// Função de logout
export const logoutUser = (): Promise<{ success: boolean }> => {
    localStorage.removeItem('multibpo_tokens');
    localStorage.removeItem('multibpo_user');
    localStorage.removeItem('lucaIA_loggedIn');
    return Promise.resolve({ success: true });
};

// Confirmação de email
export const confirmEmail = async (token: string) => {
    try {
        const response = await publicApi.post('/api/v1/auth/confirm-email/', { token });
        return response.data;
    } catch (error) {
        console.error("Erro na confirmação de email:", error);
        throw error;
    }
};

// Login social
export const socialLogin = async (data: SocialLoginData) => {
    try {
        const backendData = {
            provider: data.provider,
            access_token: data.accessToken,
            email: data.email.toLowerCase().trim(),
            name: data.name || ''
        };

        const response = await authApi.post('/api/v1/auth/social-login/', backendData);
        
        // Salvar tokens e dados do usuário
        if (response.data.access && response.data.refresh) {
            const tokens = {
                access: response.data.access,
                refresh: response.data.refresh
            };
            localStorage.setItem('multibpo_tokens', JSON.stringify(tokens));
            localStorage.setItem('multibpo_user', JSON.stringify(response.data.user || {}));
            localStorage.setItem('lucaIA_loggedIn', 'true'); // Compatibilidade
        }

        return response.data;
    } catch (error) {
        console.error("Erro no login social:", error);
        throw error;
    }
};

// Buscar perfil do usuário
export const getUserProfile = async () => {
    try {
        const response = await authApi.get('/api/v1/auth/profile/');
        
        // Atualizar dados locais
        localStorage.setItem('multibpo_user', JSON.stringify(response.data));
        
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        throw error;
    }
};

// Atualizar perfil do usuário
export const updateUserProfile = async (userData: UserProfile) => {
    try {
        const response = await authApi.put('/api/v1/auth/profile/', userData);
        
        // Atualizar dados locais
        localStorage.setItem('multibpo_user', JSON.stringify(response.data));
        
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        throw error;
    }
};

// Renovar token manualmente (usado pelos interceptors)
export const refreshAuthToken = async (refreshToken: string) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/token/refresh/`,
            { refresh: refreshToken }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao renovar token:", error);
        throw error;
    }
};

// Verificar status de autenticação
export const checkAuthStatus = (): { 
    isAuthenticated: boolean; 
    user: any | null; 
    tokens: any | null 
} => {
    try {
        const tokens = localStorage.getItem('multibpo_tokens');
        const user = localStorage.getItem('multibpo_user');
        const legacyAuth = localStorage.getItem('lucaIA_loggedIn');

        if (tokens && user) {
            return {
                isAuthenticated: true,
                user: JSON.parse(user),
                tokens: JSON.parse(tokens)
            };
        }

        // Compatibilidade com sistema antigo
        if (legacyAuth === 'true') {
            return {
                isAuthenticated: true,
                user: null,
                tokens: null
            };
        }

        return {
            isAuthenticated: false,
            user: null,
            tokens: null
        };
    } catch (error) {
        console.error('Erro ao verificar status de autenticação:', error);
        return {
            isAuthenticated: false,
            user: null,
            tokens: null
        };
    }
};

// ===== LUCA IA - INTEGRAÇÃO FUTURA =====

// Função para fazer pergunta ao Luca IA (autenticado)
export const askLucaIA = async (question: string, sessionId?: string) => {
    try {
        const data: any = { question };
        if (sessionId) {
            data.session_id = sessionId;
        }

        const response = await authApi.post('/api/v1/auth/luca/question/', data);
        return response.data;
    } catch (error) {
        console.error("Erro na pergunta ao Luca IA:", error);
        throw error;
    }
};

// Status das perguntas do Luca IA
export const getLucaStatus = async () => {
    try {
        const response = await authApi.get('/api/v1/auth/luca/status/');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar status do Luca IA:", error);
        throw error;
    }
};

// ===== MOCK API (MANTIDA PARA COMPATIBILIDADE) =====

export const simulateN8NResponse = async (userMessage: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const map: Record<string, string> = {
        "como funciona o simples nacional?":
            "O Simples Nacional é um regime tributário unificado para micro e pequenas empresas.",
        "quais os prazos para declarações fiscais?":
            "Os prazos variam, mas a DAS do Simples vence geralmente no dia 20 de cada mês.",
        "como emitir nota fiscal eletrônica?":
            "Você pode emitir a nota fiscal eletrônica pelo sistema da prefeitura ou de um emissor integrado.",
        "posso ter mais de uma empresa?":
            "Sim, é possível, mas você deve analisar o regime tributário e o enquadramento correto.",
        "como fazer o planejamento tributário?":
            "É importante entender o faturamento, custos e tributos da empresa para planejar de forma eficiente.",
    };

    return map[userMessage.toLowerCase()] || "Essa é uma resposta simulada da IA.";
};
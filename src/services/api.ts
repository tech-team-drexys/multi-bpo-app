//MOCK API
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

//API
import axios from "axios";

const getAccessToken = () => {
    const tokens = JSON.parse(localStorage.getItem("multibpo_tokens") || "{}");
    return tokens?.access;
};

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_TOKEN
    }
});

// Interceptor para adicionar o token dinamicamente
api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Instância autenticada (nova, para JWT)
const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptor para adicionar o token dinamicamente na authApi também
authApi.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface RegisterUserData {
    email: string;
    whatsapp: string;
    password: string;
    captcha_token: string;
    accept_terms: boolean;
    full_name?: string;
    password_confirm: string;
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
    full_name?: string;
    whatsapp?: string;
}

export const getNews = async (limit: number) => {
    try {
        const response = await api.get(`/noticias/?limit=${limit}`);
        return response;
    } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        throw error;
    }
};

export const getOneNews = async (id: number) => {
    try {
        const response = await api.get(`/noticias/${id}/`);
        return response;
    } catch (error) {
        console.error("Erro ao buscar a notícia:", error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await api.get("/categorias/");
        return response;
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        throw error;
    }
};

export const getCertificados = async (page: number = 1) => {
    try {
        const response = await api.get(`/certificados/?page=${page}`);
        return response;
    } catch (error) {
        console.error("Erro ao buscar certificados:", error);
        throw error;
    }
};

export const registerUser = async (userData: RegisterUserData) => {
    try {
        const data = {
            email: userData.email.toLowerCase().trim(),
            whatsapp: userData.whatsapp,
            password: userData.password,
            captcha_token: userData.captcha_token,
            accept_terms: userData.accept_terms,
            registration_method: 'email',
            password_confirm: userData.password_confirm,
            full_name: userData.full_name
        };

        const response = await authApi.post('/auth/register/', data);

        if (response.data.access && response.data.refresh) {
            const tokens = {
                access: response.data.access,
                refresh: response.data.refresh
            };
            localStorage.setItem('multibpo_tokens', JSON.stringify(tokens));
        }

        return response.data;
    } catch (error) {
        console.error("Erro no registro:", error);
        throw error;
    }
};

export const checkEmailStatus = async (email: string) => {
    try {
        const response = await api.get(`/auth/email-status/?email=${email}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao verificar status de email:", error);
        throw error;
    }
};

export const loginWithCredentials = async (credentials: LoginCredentials) => {
    try {
        const data = {
            email: credentials.email.toLowerCase().trim(),
            password: credentials.password,
            captcha_token: 'dummy-captcha-token'
        };

        const response = await authApi.post('/auth/login/', data);

        if (response.data.access && response.data.refresh) {
            const tokens = {
                access: response.data.access,
                refresh: response.data.refresh
            };
            localStorage.setItem('multibpo_tokens', JSON.stringify(tokens));
        }

        return response.data;
    } catch (error) {
        console.error("Erro no login:", error);
        throw error;
    }
};

export const getUserProfile = async () => {
    try {
        const response = await authApi.get("/auth/profile/");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await authApi.post('/auth/logout/');
        localStorage.removeItem('multibpo_tokens');
        return response.data;
    } catch (error) {
        console.error("Erro ao deslogar usuário:", error);
        throw error;
    }
};

export const loginWithGoogle = async (idToken: string) => {
    try {
        const payloads = [
            { idToken },
            { token: idToken },
            { access_token: idToken },
            { google_token: idToken },
            { credential: idToken }
        ];

        let response;
        let lastError;

        for (const payload of payloads) {
            try {
                response = await api.post("/auth/google-login/", payload);
                break;
            } catch (err: unknown) {
                lastError = err;
                continue;
            }
        }

        if (!response) {
            throw lastError;
        }

        if (response.data.access && response.data.refresh) {
            const tokens = {
                access: response.data.access,
                refresh: response.data.refresh,
            };
            localStorage.setItem("multibpo_tokens", JSON.stringify(tokens));
            localStorage.setItem("multibpo_user", JSON.stringify(response.data.user || {}));
            localStorage.setItem("lucaIA_loggedIn", "true");
        }

        return response.data;
    } catch (error) {
        console.error("Erro no login com Google:", error);
        throw error;
    }
};

export const loginWithFacebook = async (accessToken: string) => {
    try {
        const response = await authApi.post("/auth/social-login/", { access_token: accessToken });

        if (response.data.access && response.data.refresh) {
            const tokens = {
                access: response.data.access,
                refresh: response.data.refresh,
            };
            localStorage.setItem("multibpo_tokens", JSON.stringify(tokens));
            localStorage.setItem("multibpo_user", JSON.stringify(response.data.user || {}));
            localStorage.setItem("lucaIA_loggedIn", "true");
        }

        return response.data;
    } catch (error) {
        console.error("Erro no login com Facebook:", error);
        throw error;
    }
};

export const captchaVerify = async (userToken: string, captchaToken: string) => {
    try {
        const response = await api.post("/auth/confirm-email/", { token: userToken, captcha_token: captchaToken });
        return response.data;
    } catch (error) {
        console.error("Erro no captcha verify:", error);
        throw error;
    }
};

export const createSubscription = async (id: number) => {
    try {
        const response = await authApi.post(`/payments/subscriptions/create/`, { plan_id: id });
        return response;
    } catch (error) {
        console.error("Erro na criação da assinatura:", error);
        throw error;
    }
};

export const getProducts = async () => {
    try {
        const response = await api.get("/payments/products/");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        throw error;
    }
};

export const createOrder = async (id: number) => {
    try {
        const response = await api.post("/payments/orders/create/", { product_id: id });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        throw error;
    }
};

export const applyCoupon = async (id: number, couponCode: string) => {
    try {
        const response = await api.post(`/payments/validate-coupon/`, { coupon_code: couponCode, plan_id: id });
        return response.data;
    } catch (error) {
        console.error("Erro ao aplicar cupom:", error);
        throw error;
    }
};

export const getPlans = async () => {
    try {
        const response = await api.get("/payments/plans/");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar planos:", error);
        throw error;
    }
};

export const createListOrder = async (items: { product_id: string; quantity: number }[]) => {
    try {
        const response = await api.post("/payments/orders/create-multiple/", { items });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        throw error;
    }
};

export const getMySubscriptions = async () => {
    try {
        const response = await api.get("/payments/subscriptions/current/");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        throw error;
    }
};

export const cancelSubscription = async () => {
    try {
        const response = await api.post(`/payments/subscriptions/cancel/`);
        return response.data;
    } catch (error) {
        console.error("Erro ao cancelar assinatura:", error);
        throw error;
    }
};

export const listMyOrders = async () => {
    try {
        const response = await api.get("/payments/orders/");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        throw error;
    }
};

export const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
        const response = await api.post("/auth/password-reset/", { current_password: currentPassword, new_password: newPassword });
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar senha:", error);
        throw error;
    }
};
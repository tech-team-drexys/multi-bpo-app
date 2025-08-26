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

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_TOKEN
    }
});

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
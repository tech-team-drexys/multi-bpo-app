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
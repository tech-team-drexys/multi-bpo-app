'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./page.module.scss";
import { Plus } from 'lucide-react';

interface Idea {
    id: number;
    title: string;
    description: string;
    author: string;
    status: 'nova' | 'em-estudo' | 'desenvolvida';
    likes: number;
    comments: number;
    createdAt: string;
}

const mockExistingIdeas: Idea[] = [
    {
        id: 1,
        title: "Multiempresa: Transferência automática de pedidos entre empresas por forma de envio/frete",
        description: "Gostaria de conseguir configurar a transferência automática de pedidos entre empresas por forma de envio/frete.",
        author: "Linus do Brasil Acessórios LTDA",
        status: "em-estudo",
        likes: 6,
        comments: 3,
        createdAt: "2024-01-15"
    },
    {
        id: 2,
        title: "Transferência entre depósitos: permitir transferência através da importação de planilhas",
        description: "Implementar possibilidade de realizar transferências de estoque através da importação de planilhas.",
        author: "João Silva",
        status: "nova",
        likes: 4,
        comments: 2,
        createdAt: "2024-01-10"
    },
    {
        id: 3,
        title: "Multiempresa: Melhoria na transferência de estoques entre empresas",
        description: "Possibilitar a transferência de estoques entre depósitos de empresas diferentes",
        author: "Maria Santos",
        status: "nova",
        likes: 8,
        comments: 5,
        createdAt: "2024-01-08"
    },
    {
        id: 4,
        title: "Gateway: rotina para transferência automática de valores",
        description: "A partir dos gateways financeiros, adicionar rotina que permita transferir os lançamentos originados por gateway de forma automática.",
        author: "Carlos Lima",
        status: "em-estudo",
        likes: 12,
        comments: 7,
        createdAt: "2024-01-05"
    },
    {
        id: 5,
        title: "Módulo de Perguntas: Resposta automática no Mercado Livre",
        description: "No modulo de perguntas, usar inteligência para identificar as palavras chaves da pergunta e usar resposta automática.",
        author: "Ana Costa",
        status: "nova",
        likes: 15,
        comments: 9,
        createdAt: "2024-01-03"
    },
    {
        id: 6,
        title: "Multiempresa: Manter anexos ao enviar pedidos",
        description: "No envio de pedidos para empresas do grupo os anexos não são mantidos, manter os arquivos ao compartilhar os pedidos.",
        author: "Fernanda Rocha",
        status: "em-estudo",
        likes: 9,
        comments: 4,
        createdAt: "2024-01-01"
    }
];

const AdicionarIdeia = () => {
    const router = useRouter();
    const [ideaTitle, setIdeaTitle] = useState('');
    const [similarIdeas, setSimilarIdeas] = useState<Idea[]>([]);
    const [showForm, setShowForm] = useState<"innovative" | "similar" | "form" | "">("");
    const [ideaDescription, setIdeaDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [attachedImages, setAttachedImages] = useState<File[]>([]);

    useEffect(() => {
        if (ideaTitle.length > 1) {
            const similar = mockExistingIdeas.filter(idea =>
                idea.title.toLowerCase().includes(ideaTitle.toLowerCase()) ||
                idea.description.toLowerCase().includes(ideaTitle.toLowerCase())
            );

            setSimilarIdeas(similar);
            setShowForm(similar.length === 0 ? "innovative" : "similar");

        } else {
            setSimilarIdeas([]);
            setShowForm("");
        }
    }, [ideaTitle]);

    const handleBackToIdeas = () => {
        router.push('/ideias');
    };

    const handleIdeaCardClick = (ideaId: number) => {
        router.push(`/ideias/detalhes/?ideia=${ideaId}`);
    };

    const handleSubmitIdea = () => {
        setShowForm("form");
    };

    const handleSubmitNewIdea = () => {
        alert('Ideia enviada com sucesso!');
        setShowForm("");
        setIdeaDescription('');
        setIdeaTitle('');
        setSelectedCategories([]);
        setAttachedImages([]);
        setSimilarIdeas([]);
        router.push('/ideias');
    };

    const availableCategories = [
        "Contábil e Fiscal",
        "Gestão",
        "Logística",
        "Vendas",
        "Marketing",
        "Suporte ao Cliente",
        "Integrações",
        "Relatórios",
        "Usuários e Permissões",
        "Configurações"
    ];

    const handleCategoryToggle = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(cat => cat !== category));
        } else if (selectedCategories.length < 3) {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setAttachedImages(prev => [...prev, ...files]);
    };

    const removeImage = (index: number) => {
        setAttachedImages(prev => prev.filter((_, i) => i !== index));
    };


    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <div className={styles.pageTitle}>
                    <h1>Adicionar uma nova ideia</h1>
                    <p>Faça a sua sugestão para soluções ainda melhores no nosso Sistema ERP</p>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.formLeft}>
                        <div className={styles.inputGroup}>
                            <label>Título da nova ideia</label>
                            <input
                                type="text"
                                value={ideaTitle}
                                onChange={(e) => setIdeaTitle(e.target.value)}
                                placeholder="Digite o título da sua ideia..."
                                maxLength={100}
                            />
                            <span className={styles.charCount}>{ideaTitle.length}/100</span>
                        </div>

                        {showForm === "similar" ? (
                            <>
                                <div className={styles.similarIdeasSection}>
                                    <h3>Encontramos {similarIdeas.length} ideias parecidas com a sua.....</h3>
                                    <p>Outros usuários cadastraram sugestões semelhantes à sua. Registre seu voto e demonstre seu interesse para ajudar no engajamento deste recurso.</p>

                                    <div className={styles.similarIdeasGrid}>
                                        {similarIdeas.slice(0, 6).map(idea => (
                                            <div
                                                key={idea.id}
                                                className={styles.similarIdeaCard}
                                                onClick={() => handleIdeaCardClick(idea.id)}
                                            >
                                                <div className={styles.cardIcon}>💡</div>
                                                <h4>{idea.title}</h4>
                                                <p>{idea.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : showForm === "innovative" ? (
                            <>
                                <div className={styles.innovativeModal}>
                                    <h3>Uau! Sua ideia é realmente inovadora.</h3>
                                    <p>Não encontramos outras sugestões semelhantes à sua. Por favor, prossiga com o cadastro da sua necessidade!</p>
                                    <button className={styles.addNewIdeaBtn} onClick={handleSubmitNewIdea}>
                                        <span className={styles.plusIcon}>+</span>
                                        adicionar nova ideia
                                    </button>
                                    <div className={styles.modalIllustration}>🐕</div>
                                </div>
                            </>
                        ) : showForm === "form" ? (
                            <>
                                <div className={styles.inputGroup}>
                                    <label>Descreva sua ideia</label>
                                    <textarea
                                        value={ideaDescription}
                                        onChange={(e) => setIdeaDescription(e.target.value)}
                                        placeholder="Descreva em detalhes sua ideia..."
                                        rows={6}
                                        className={styles.textarea}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>+ Adicionar categorias de ideias</label>
                                    <div className={styles.categoriesContainer}>
                                        {availableCategories.map(category => (
                                            <button
                                                key={category}
                                                className={`${styles.categoryChip} ${selectedCategories.includes(category) ? styles.selected : ''
                                                    }`}
                                                onClick={() => handleCategoryToggle(category)}
                                                disabled={!selectedCategories.includes(category) && selectedCategories.length >= 3}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                    <span className={styles.categoryHint}>
                                        {selectedCategories.length}/3 categorias selecionadas
                                    </span>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Imagens da minha ideia</label>
                                    <div className={styles.imageUploadSection}>
                                        <label className={styles.attachButton}>
                                            <span className={styles.paperclipIcon}>📎</span>
                                            anexar imagens
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                            />
                                        </label>

                                        {attachedImages.length > 0 && (
                                            <div className={styles.attachedImages}>
                                                {attachedImages.map((file, index) => (
                                                    <div key={index} className={styles.imagePreview}>
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={`Imagem ${index + 1}`}
                                                        />
                                                        <button
                                                            className={styles.removeImage}
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : ""}
                    </div>

                    <div className={styles.formRight}>
                        <div className={styles.tipBox}>
                            <h4>Dica:</h4>
                            <p>Inclua o módulo específico seguido da solução proposta para facilitar a análise da equipe. Por exemplo: "Módulo Multiempresa: Transferência automática de pedidos"</p>
                        </div>
                    </div>
                </div>

                <div className={styles.actionButtons}>
                    <button className={styles.cancelBtn} onClick={handleBackToIdeas}>
                        cancelar
                    </button>
                    {showForm === "form" ? (
                        <button className={styles.submitBtn} onClick={handleSubmitNewIdea}>
                            Cadastrar ideia
                        </button>
                    ) : (
                        <button className={styles.submitBtn} onClick={handleSubmitIdea}>
                            <Plus size={18} />
                            adicionar nova ideia
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdicionarIdeia;
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import styles from './page.module.scss';
import { getOneNews } from '@/services/api';

interface NewsArticle {
    id: number;
    titulo: string;
    resumo: string;
    conteudo_completo?: string;
    categoria?: string;
    link: string;
    imagem: string | null;
    publicado_em: string;
    fonte: {
        id: number;
        nome: string;
        feed_url: string;
        categoria_padrao: string;
    };
}

function NoticiaIndividualContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        getOneNews(Number(id)).then((newsResponse) => {
            setArticle(newsResponse.data);
        }).catch((error) => {
            console.error("Erro ao buscar a notícia:", error);
            setError(true);
            setLoading(false);
        }).finally(() => {
            setLoading(false);
        });
    }, [id]);

    const extractImageFromResumo = (resumo: string) => {
        const imgMatch = resumo.match(/<img[^>]+src="([^">]+)"/);
        return imgMatch ? imgMatch[1] : null;
    };

    const processContent = (article: NewsArticle) => {
        const rawContent = article.conteudo_completo || article.resumo;

        if (!rawContent) return "Conteúdo não disponível.";

        let processedContent = '';

        if (rawContent.includes('<')) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = rawContent;
            tempDiv.querySelectorAll('script, style, nav, footer, aside, .ads, .advertisement').forEach(el => el.remove());

            const paragraphs = tempDiv.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6');
            const textParts: string[] = [];

            paragraphs.forEach(p => {
                const text = p.textContent?.trim();
                if (text && text.length > 0) {
                    textParts.push(text);
                }
            });

            processedContent = textParts.join('\n\n');
        } else {
            processedContent = rawContent.trim();
        }

        return formatSubtitles(processedContent);
    };

    const formatSubtitles = (content: string) => {
        const lines = content.split('\n\n');

        return lines.map((line, index) => {
            const isSubtitle =
                line.length < 100 &&
                !line.endsWith('.') &&
                index > 0 &&
                line.length > 10 &&
                !/^(O |A |Uma |Um |Para |Com |Segundo |De acordo)/i.test(line);

            if (isSubtitle) {
                return `**${line}**`;
            }
            return line;
        }).join('\n\n');
    };

    const renderFormattedContent = (content: string) => {
        const parts = content.split(/(\*\*[^*]+\*\*)/g);

        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const subtitleText = part.slice(2, -2);
                return (
                    <strong key={index} className={styles.subtitle}>
                        {subtitleText}
                    </strong>
                );
            }
            return part;
        });
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.content}>
                    <div className={styles.loading}>
                        Carregando notícia...
                    </div>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className={styles.page}>
                <div className={styles.content}>
                    <div className={styles.error}>
                        <h2>Notícia não encontrada</h2>
                        <p>A notícia que você está procurando não existe ou foi removida.</p>
                        <button onClick={() => router.push('/noticias')} className={styles.backButton}>
                            <ArrowLeft size={16} />
                            Voltar para Notícias
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const imageUrl = article.imagem || extractImageFromResumo(article.resumo);

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <button onClick={() => router.back()} className={styles.backButton}>
                    <ArrowLeft size={16} />
                    Voltar
                </button>

                <article className={styles.article}>
                    <div className={styles.header}>
                        <div className={styles.categoryTag}>
                            <Tag size={14} />
                            <span>{article.categoria || article.fonte.categoria_padrao}</span>
                        </div>
                        <h1 className={styles.title}>{article.titulo}</h1>
                        <div className={styles.metadata}>
                            <div className={styles.metaItem}>
                                <User size={16} />
                                <span>{article.fonte.nome}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <Calendar size={16} />
                                <span>{new Date(article.publicado_em).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.articleContent}>
                        {imageUrl && (
                            <div className={styles.imageContainer}>
                                <img src={imageUrl} alt={article.titulo} className={styles.articleImage} />
                            </div>
                        )}

                        <div className={styles.summary}>
                            {renderFormattedContent(processContent(article))}
                        </div>

                        <div style={{
                            marginTop: '2rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid var(--border-color)',
                            textAlign: 'center'
                        }}>
                            <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: 'var(--secondary)',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Ler artigo completo na fonte original →
                            </a>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.disclaimer}>
                            <p>Este conteúdo é fornecido por <strong>{article.fonte.nome}</strong> e apresentado apenas para fins informativos.</p>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    )
}

export default function NoticiaIndividual() {
    return (
        <Suspense fallback={
            <div className={styles.page}>
                <div className={styles.content}>
                    <div className={styles.loading}>
                        Carregando notícia...
                    </div>
                </div>
            </div>
        }>
            <NoticiaIndividualContent />
        </Suspense>
    );
}
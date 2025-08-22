'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import styles from './page.module.scss';

interface NewsArticle {
  id: number;
  titulo: string;
  resumo: string;
  conteudo_completo?: string;  // NOVO CAMPO
  categoria?: string;          // NOVO CAMPO
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

export default function NoticiaIndividual() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`https://app-testes.multibpo.com.br/api/v1/noticias/${params.id}/`);
        
        if (!res.ok) {
          setError(true);
          return;
        }

        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.error("Erro ao carregar notícia:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  // Extract image from resumo HTML if no direct image
  const extractImageFromResumo = (resumo: string) => {
    const imgMatch = resumo.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
  };

  // Função corrigida para preservar quebras de parágrafo
// Função aprimorada com formatação de subtítulos
const processContent = (article: NewsArticle) => {
  const rawContent = article.conteudo_completo || article.resumo;
  
  if (!rawContent) return "Conteúdo não disponível.";
  
  // Processar HTML ou texto
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
  
  // Identificar e formatar subtítulos
  return formatSubtitles(processedContent);
};

// Nova função para formatar subtítulos
const formatSubtitles = (content: string) => {
  const lines = content.split('\n\n');
  
  return lines.map((line, index) => {
    // Detectar possíveis subtítulos por padrões
    const isSubtitle = 
      // Linha curta (menos de 100 caracteres)
      line.length < 100 &&
      // Não termina com ponto final
      !line.endsWith('.') &&
      // Não é a primeira linha (título principal)
      index > 0 &&
      // Tem mais de 10 caracteres (não é muito curta)
      line.length > 10 &&
      // Não começa com artigo/conectivo comum
      !/^(O |A |Uma |Um |Para |Com |Segundo |De acordo)/i.test(line);
    
    if (isSubtitle) {
      return `**${line}**`; // Marcar como subtítulo
    }
    return line;
  }).join('\n\n');
};

// Função para renderizar conteúdo com subtítulos formatados
const renderFormattedContent = (content: string) => {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // É um subtítulo - remover ** e aplicar estilo
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
  );
}
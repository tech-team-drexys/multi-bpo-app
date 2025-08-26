'use client';
import { useEffect, useState } from 'react';
import styles from "./page.module.scss";
import { ArrowRight, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCategories, getNews } from '@/services/api';

interface NewsArticle {
  id: number;
  titulo: string;
  resumo: string;
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

export default function Noticias() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(["Todas"]);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      getNews(200),
      getCategories()
    ]).then(([newsResponse, categoriesResponse]) => {
      setNews(newsResponse.data.results);
      setCategories(["Todas", ...categoriesResponse.data.results]);
      setLoading(false);
    });
  }, []);

  const filteredNews = news.filter(article => {
    const matchesCategory = selectedCategory === "Todas" ||
      article.fonte.categoria_padrao === selectedCategory;
    const matchesSearch = article.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.resumo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredNews.find(article => article.id === 1) || filteredNews[0];
  const regularArticles = filteredNews.filter(article => article !== featuredArticle);

  const cleanResumo = (resumo: string) => {
    return resumo.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
  };

  const handleArticleClick = (article: NewsArticle) => {
    router.push(`/noticias/detalhes?id=${article.id}`);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            fontSize: '1.2rem',
            color: '#6b7280'
          }}>
            Carregando notícias...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.headerContent}>
          <h1>Notícias</h1>
          <p>Mantenha-se atualizado com as últimas novidades</p>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Buscar notícias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.categoryFilters}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {featuredArticle && (
          <div className={styles.featuredArticle} onClick={() => handleArticleClick(featuredArticle)}>
            <div className={styles.featuredImage}>
              {featuredArticle.imagem ? (
                <img src={featuredArticle.imagem} alt={featuredArticle.titulo} />
              ) : (
                <div className={styles.noImage}>
                  {featuredArticle.fonte.categoria_padrao}
                </div>
              )}
              <span className={styles.categoryTag}>{featuredArticle.fonte.categoria_padrao}</span>
            </div>
            <div className={styles.featuredContent}>
              <h2>{featuredArticle.titulo}</h2>
              <p>{cleanResumo(featuredArticle.resumo)}</p>
              <div className={styles.articleMeta}>
                <div className={styles.metaItem}>
                  <User size={16} />
                  <span>{featuredArticle.fonte.nome}</span>
                  <Calendar size={16} />
                  <span>{new Date(featuredArticle.publicado_em).toLocaleDateString('pt-BR')}</span>
                </div>
                <button className={styles.readMoreButton}>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.newsGrid}>
          {regularArticles.length > 0 ? (
            regularArticles.map((article) => (
              <div key={article.id} className={styles.newsCard} onClick={() => handleArticleClick(article)}>
                <div className={styles.cardImage}>
                  {article.imagem ? (
                    <img src={article.imagem} alt={article.titulo} />
                  ) : (
                    <div className={styles.noImage}>
                      {article.fonte.categoria_padrao}
                    </div>
                  )}
                  {article.imagem && (
                    <span className={styles.categoryTag}>{article.fonte.categoria_padrao}</span>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h3>{article.titulo}</h3>
                  <p>{cleanResumo(article.resumo)}</p>
                  <div className={styles.cardMeta}>
                    <span>{article.fonte.nome}</span>
                    <span>{new Date(article.publicado_em).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>Nenhuma notícia encontrada para os filtros selecionados.</p>
              <button
                className={styles.clearFiltersButton}
                onClick={() => {
                  setSelectedCategory("Todas");
                  setSearchTerm("");
                }}
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
'use client';
import { useState } from 'react';
import styles from "./page.module.scss";
import { ArrowRight, Calendar, User } from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  image: string;
  featured?: boolean;
}

const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: "Revolução da Inteligência Artificial nas Empresas",
    description: "Como a IA está transformando processos empresariais e aumentando a produtividade em diferentes setores da economia brasileira.",
    category: "Tecnologia",
    author: "Ana Silva",
    date: "14 Ago 2025",
    image: "/ai-news.png",
    featured: true
  },
  {
    id: 2,
    title: "Novas Parcerias Empresariais no Mercado Brasileiro",
    description: "Empresas nacionais fecham acordos estratégicos para expandir presença no mercado interno.",
    category: "Negócios",
    author: "Carlos Mendes",
    date: "13 Ago 2025",
    image: "/drexys.png"
  },
  {
    id: 3,
    title: "Avancos na Medicina Preventiva",
    description: "Novas tecnologias médicas prometem revolucionar o diagnóstico precoce de doenças.",
    category: "Saúde",
    author: "Dr. Maria Santos",
    date: "12 Ago 2025",
    image: "/prev-image.png"
  },
  {
    id: 4,
    title: "Inovação na Educação Digital",
    description: "Plataformas educacionais modernas transformam a forma como estudantes aprendem.",
    category: "Educação",
    author: "Prof. João Costa",
    date: "11 Ago 2025",
    image: "/mock-image.png"
  },
  {
    id: 5,
    title: "Sustentabilidade Empresarial em Alta",
    description: "Empresas brasileiras adotam práticas sustentáveis para reduzir impacto ambiental.",
    category: "Negócios",
    author: "Mariana Lima",
    date: "10 Ago 2025",
    image: "/prev-image.png"
  },
  {
    id: 6,
    title: "Startups Brasileiras no Cenário Global",
    description: "Empresas de tecnologia nacionais ganham destaque internacional com soluções inovadoras.",
    category: "Tecnologia",
    author: "Pedro Alves",
    date: "9 Ago 2025",
    image: "/drexys.png"
  },
  {
    id: 7,
    title: "Transformação Digital no Setor Financeiro",
    description: "Bancos e fintechs revolucionam serviços financeiros com tecnologia avançada.",
    category: "Tecnologia",
    author: "Fernanda Costa",
    date: "8 Ago 2025",
    image: "/mock-image.png"
  },
  {
    id: 8,
    title: "Saúde Mental no Ambiente Corporativo",
    description: "Empresas implementam programas de bem-estar para funcionários.",
    category: "Saúde",
    author: "Dr. Roberto Silva",
    date: "7 Ago 2025",
    image: "/prev-image.png"
  },
  {
    id: 9,
    title: "E-commerce e Vendas Online em Crescimento",
    description: "Vendas digitais batem recordes no primeiro semestre de 2025.",
    category: "Negócios",
    author: "Juliana Santos",
    date: "6 Ago 2025",
    image: "/drexys.png"
  },
  {
    id: 10,
    title: "Educação a Distância e Híbrida",
    description: "Modelos educacionais flexíveis ganham espaço nas instituições de ensino.",
    category: "Educação",
    author: "Prof. Carla Mendes",
    date: "5 Ago 2025",
    image: "/mock-image.png"
  },
  {
    id: 11,
    title: "Inteligência Artificial na Medicina",
    description: "IA auxilia médicos no diagnóstico e tratamento de pacientes.",
    category: "Tecnologia",
    author: "Dr. André Costa",
    date: "4 Ago 2025",
    image: "/ai-news.png"
  },
  {
    id: 12,
    title: "Inovação em Energias Renováveis",
    description: "Brasil investe em fontes de energia limpa e sustentável.",
    category: "Negócios",
    author: "Ricardo Oliveira",
    date: "3 Ago 2025",
    image: "/prev-image.png"
  },
  {
    id: 13,
    title: "Descobertas Científicas Brasileiras",
    description: "Pesquisadores nacionais fazem descobertas importantes em diversas áreas.",
    category: "Ciência",
    author: "Dr. Luiza Ferreira",
    date: "2 Ago 2025",
    image: "/drexys.png"
  },
  {
    id: 14,
    title: "Inovação em Logística e Transporte",
    description: "Novas tecnologias revolucionam o setor de transportes no Brasil.",
    category: "Inovação",
    author: "Marcos Silva",
    date: "1 Ago 2025",
    image: "/mock-image.png"
  },
  {
    id: 15,
    title: "Esportes e Tecnologia",
    description: "Como a tecnologia está transformando o mundo dos esportes.",
    category: "Esportes",
    author: "Roberto Santos",
    date: "31 Jul 2025",
    image: "/prev-image.png"
  }
];

const categories = ["Todas", "Tecnologia", "Negócios", "Saúde", "Educação", "Esportes", "Ciência", "Inovação"];

export default function Noticias() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNews = mockNews.filter(article => {
    const matchesCategory = selectedCategory === "Todas" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredNews.find(article => article.featured);
  const regularArticles = filteredNews.filter(article => !article.featured);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.headerContent}>
          <h1>Notícias</h1>
          <p>Mantenha-se atualizado com as últimas novidades</p>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
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
          <div className={styles.featuredArticle}>
            <div className={styles.featuredImage}>
              <img src={featuredArticle.image} alt={featuredArticle.title} />
              <span className={styles.categoryTag}>{featuredArticle.category}</span>
            </div>
            <div className={styles.featuredContent}>
              <h2>{featuredArticle.title}</h2>
              <p>{featuredArticle.description}</p>
              <div className={styles.articleMeta}>
                <div className={styles.metaItem}>
                  <User size={16} />
                  <span>{featuredArticle.author}</span>
                  <Calendar size={16} />
                  <span>{featuredArticle.date}</span>
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
              <div key={article.id} className={styles.newsCard}>
                <div className={styles.cardImage}>
                  <img src={article.image} alt={article.title} />
                  <span className={styles.categoryTag}>{article.category}</span>
                </div>
                <div className={styles.cardContent}>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <div className={styles.cardMeta}>
                    <span>{article.author}</span>
                    <span>{article.date}</span>
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
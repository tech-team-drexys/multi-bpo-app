'use client';
import { useState, useEffect } from 'react';
import styles from "./page.module.scss";
import { useRouter } from 'next/navigation';
import { IdeaStatus } from '@/enums/index ';

interface Idea {
  id: number;
  title: string;
  description: string;
  author: string;
  status: IdeaStatus;
  likes: number;
  comments: number;
  createdAt: string;
}

const mockIdeas: Idea[] = [
  {
    id: 1,
    title: "Sistema de Cadastro Personalizado",
    description: "Implementar um sistema que permita cadastros personalizados conforme a necessidade de cada cliente, incluindo campos customizáveis e validações específicas.",
    author: "Maria Silva",
    status: IdeaStatus.NEW,
    likes: 12,
    comments: 3,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Integração com Plataformas de Pagamento",
    description: "Adicionar suporte para múltiplas plataformas de pagamento incluindo PIX, cartões e carteiras digitais para facilitar transações.",
    author: "João Santos",
    status: IdeaStatus.STUDY,
    likes: 8,
    comments: 5,
    createdAt: "2024-01-10"
  },
  {
    id: 3,
    title: "Dashboard de Analytics Avançado",
    description: "Criar um painel com métricas detalhadas e visualizações interativas para acompanhar o desempenho em tempo real.",
    author: "Ana Costa",
    status: IdeaStatus.DEVELOPED,
    likes: 25,
    comments: 12,
    createdAt: "2024-01-05"
  },
  {
    id: 4,
    title: "Sistema de Notificações Push",
    description: "Implementar notificações em tempo real para manter usuários informados sobre atualizações importantes.",
    author: "Carlos Lima",
    status: IdeaStatus.NEW,
    likes: 15,
    comments: 7,
    createdAt: "2024-01-12"
  },
  {
    id: 5,
    title: "API de Integração Externa",
    description: "Desenvolver uma API robusta para integração com sistemas externos e parceiros comerciais.",
    author: "Fernanda Rocha",
    status: IdeaStatus.STUDY,
    likes: 18,
    comments: 9,
    createdAt: "2024-01-08"
  }
];

export default function Ideias() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('todas');
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>(mockIdeas);

  const handleSearch = () => {
    let filtered = ideas;
    
    if (activeFilter !== 'todas') {
      switch (activeFilter) {
        case 'novas':
          filtered = filtered.filter(idea => idea.status === IdeaStatus.NEW);
          break;
        case 'minhas':
          filtered = filtered.filter(idea => idea.author === 'Maria Silva');
          break;
        case 'em-estudo':
          filtered = filtered.filter(idea => idea.status === IdeaStatus.STUDY);
          break;
        case 'desenvolvidas':
          filtered = filtered.filter(idea => idea.status === IdeaStatus.DEVELOPED);
          break;
      }
    }
    
    if (searchTerm) {
      filtered = filtered.filter(idea => 
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredIdeas(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [activeFilter, searchTerm, handleSearch]);

  const handleLike = (ideaId: number) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId ? { ...idea, likes: idea.likes + 1 } : idea
    ));
    setFilteredIdeas(prev => prev.map(idea => 
      idea.id === ideaId ? { ...idea, likes: idea.likes + 1 } : idea
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case IdeaStatus.NEW: return styles.statusNew;
      case IdeaStatus.STUDY: return styles.statusStudy;
      case IdeaStatus.DEVELOPED: return styles.statusDeveloped;
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case IdeaStatus.NEW: return 'Nova';
      case IdeaStatus.STUDY: return 'Em estudo';
      case IdeaStatus.DEVELOPED: return 'Desenvolvida';
      default: return '';
    }
  };

  const handleNewIdea = (id: number) => {
    router.push(`/ideias/detalhes/#${id}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrapper}>
            <span className={styles.lightbulbIcon}>💡</span>
          </div>
          <h1>Canal de Ideias</h1>
        </div>
        <button className={styles.newIdeaBtn} onClick={() => window.location.href = '/ideias/adicionar-ideia'}>
          <span className={styles.plusIcon}>+</span>
          Nova Ideia
        </button>
      </div>

      <div className={styles.hero}>
        <h2>Compartilhe suas ideias</h2>
        <p>Colabore com outros usuários, compartilhe sugestões e vote nas melhores ideias para melhorar nossa plataforma.</p>
        <button className={styles.heroBtn} onClick={() => window.location.href = '/ideias/adicionar-ideia'}>
          <span className={styles.plusIcon}>+</span>
          Adicionar Nova Ideia
        </button>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Busque por assunto, descrição ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button className={styles.searchBtn} onClick={handleSearch}>
          Buscar
        </button>
      </div>

      <div className={styles.filters}>
        {[
          { key: 'todas', label: 'Todas as ideias' },
          { key: 'novas', label: 'Novas ideias' },
          { key: 'minhas', label: 'Minhas ideias' },
          { key: 'em-estudo', label: 'Em estudo' },
          { key: 'desenvolvidas', label: 'Desenvolvidas' }
        ].map(filter => (
          <button
            key={filter.key}
            className={`${styles.filterTab} ${activeFilter === filter.key ? styles.active : ''}`}
            onClick={() => {
              setActiveFilter(filter.key);
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={styles.ideasSection}>
        <div className={styles.sectionHeader}>
          <h3>Todas as ideias</h3>
          <span className={styles.ideasCount}>{filteredIdeas.length} ideias encontradas</span>
        </div>

        <div className={styles.ideasGrid}>
          {filteredIdeas.map(idea => (
            <div key={idea.id} className={styles.ideaCard} onClick={() => handleNewIdea(idea.id)}>
              <div className={styles.cardHeader}>
                <h4>{idea.title}</h4>
                <span className={`${styles.statusTag} ${getStatusColor(idea.status)}`}>
                  {getStatusText(idea.status)}
                </span>
              </div>
              <p className={styles.description}>{idea.description}</p>
              <div className={styles.cardFooter}>
                <div className={styles.author}>
                  <span className={styles.userIcon}>👤</span>
                  {idea.author}
                </div>
                <div className={styles.engagement}>
                  <button 
                    className={styles.likeBtn}
                    onClick={() => handleLike(idea.id)}
                  >
                    <span className={styles.heartIcon}>❤️</span>
                    {idea.likes}
                  </button>
                  <div className={styles.comments}>
                    <span className={styles.commentIcon}>💬</span>
                    {idea.comments}
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
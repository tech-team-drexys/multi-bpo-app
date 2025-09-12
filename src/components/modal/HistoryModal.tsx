'use client';

import { useState, useMemo } from 'react';
import { Search, X, SquarePen, Share, Edit, Trash2, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import styles from './HistoryModal.module.scss';

interface Conversation {
  id: number;
  title: string;
  time: string;
  timeAgo: string;
  isActive?: boolean;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONVERSATIONS: Conversation[] = [
  { id: 1, title: 'Saudação amigável e oferta de ajuda', time: 'Hoje', timeAgo: 'Há 1 hora', isActive: true },
  { id: 2, title: 'Luca Accounting Logo Design Prompt', time: 'Hoje', timeAgo: 'Há 5 horas' },
  { id: 3, title: 'Enhanced Resume for Administrative HR Roles', time: 'Hoje', timeAgo: 'Há 8 horas' },
  { id: 4, title: 'Transparent Background Luca.IA Logo', time: 'Ontem', timeAgo: 'Há 26 horas' },
  { id: 5, title: 'Saudação amigável e oferta de ajuda', time: 'Ontem', timeAgo: 'Há 28 horas' },
  { id: 6, title: 'PNG Icon Representing Professional Services', time: 'Últimos 7 dias', timeAgo: 'Há 3 dias' },
  { id: 7, title: 'Clarifying "Teste" Meaning in Context', time: 'Últimos 7 dias', timeAgo: 'Há 4 dias' },
  { id: 8, title: 'Cumprimento amigável em português', time: 'Últimos 7 dias', timeAgo: 'Há 5 dias' },
  { id: 9, title: 'AI Technology Image Factivity Analysis', time: 'Últimos 7 dias', timeAgo: 'Há 6 dias' },
];

export const HistoryModal = ({ isOpen, onClose }: HistoryModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const router = useRouter();

  const { filteredConversations, groupedConversations } = useMemo(() => {
    const filtered = CONVERSATIONS.filter(conv =>
      conv.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = filtered.reduce((groups, conv) => {
      if (!groups[conv.time]) {
        groups[conv.time] = [];
      }
      groups[conv.time].push(conv);
      return groups;
    }, {} as Record<string, Conversation[]>);

    return { filteredConversations: filtered, groupedConversations: grouped };
  }, [searchTerm]);

  const handleConversationClick = (conversationId: number) => {
    setSelectedConversation(conversationId);
    router.push(`/lucaIA?conversation=${conversationId}`);
    onClose();
  };

  const handleNewChatClick = () => {
    router.push('/lucaIA?new=true');
    onClose();
  };

  const handleActionClick = (e: React.MouseEvent, action: string, conversationId: number) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar em chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button onClick={onClose} className={styles.clearButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <Button 
            variant="contained" 
            className={styles.newChatButton} 
            onClick={handleNewChatClick}
            startIcon={<SquarePen size={16} />}
          >
            <span>Criar novo bate-papo</span>
          </Button>

          <div className={styles.historySection}>
            {Object.entries(groupedConversations).map(([timeGroup, convs]) => (
              <div key={timeGroup} className={styles.timeGroup}>
                <h4 className={styles.timeGroupTitle}>{timeGroup}</h4>
                {convs.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`${styles.historyItem} ${selectedConversation === conversation.id ? styles.selected : ''}`}
                    onClick={() => handleConversationClick(conversation.id)}
                  >
                    <div className={styles.historyItemContent}>
                      <p className={styles.historyItemTitle}>
                        <MessageCircle size={16} /> {conversation.title}
                        {conversation.isActive && (
                          <span className={styles.activeTag}>Atual</span>
                        )}
                      </p>
                      <div className={styles.historyItemRight}>
                        <span className={styles.historyItemTime}>{conversation.timeAgo}</span>
                        <div className={styles.actionIcons}>
                          <button 
                            className={styles.actionIcon} 
                            onClick={(e) => handleActionClick(e, 'compartilhar', conversation.id)}
                          >
                            <Share size={14} />
                          </button>
                          <button 
                            className={styles.actionIcon} 
                            onClick={(e) => handleActionClick(e, 'editar', conversation.id)}
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className={styles.actionIcon} 
                            onClick={(e) => handleActionClick(e, 'excluir', conversation.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 
'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.scss';
import { MessageCircle, Paperclip, Heart, StarIcon, Send, X } from 'lucide-react';
import { Chip } from '@mui/material';

interface Comment {
    id: string;
    text: string;
    user: string;
    date: string;
    timestamp: Date;
}

interface IdeaDetails {
    id: string;
    title: string;
    description: string;
    company: string;
    status: 'aberta' | 'em_analise' | 'implementada' | 'rejeitada';
    categories: string[];
    likes: number;
    rating: number;
    comments: Comment[];
}

export default function DetalhesIdeia() {
    const [newComment, setNewComment] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [idea, setIdea] = useState<IdeaDetails>({
        id: '30172',
        title: 'Multiempresa: Transferência automática de pedidos entre empresas por forma de envio/frete',
        description: 'Gostaria de conseguir configurar a transferência automática de pedidos entre empresas por forma de envio/frete.',
        company: 'Usuário LTDA',
        status: 'aberta',
        categories: ['Contábil e Fiscal', 'Gestão', 'Logística'],
        likes: 6,
        rating: 4,
        comments: [
            {
                id: '1',
                text: 'Gostaria de conseguir configurar a transferência automática de pedidos entre empresas por forma de envio/frete.',
                user: 'usuario.ltda',
                date: '18/08/2023',
                timestamp: new Date('2023-08-18T10:30:00')
            }
        ]
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const getRelativeTime = (timestamp: Date): string => {
        const diffInMs = currentTime.getTime() - timestamp.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

        if (diffInMinutes < 1) {
            return 'Agora';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''} atrás`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hora${diffInHours !== 1 ? 's' : ''} atrás`;
        } else {
            return timestamp.toLocaleDateString('pt-BR');
        }
    };

    const handleAddComment = () => {
        if (newComment.trim() || selectedImage) {
            const now = new Date();
            
            const newCommentObj: Comment = {
                id: 'comment-' + Date.now(),
                text: newComment,
                user: 'usuario.ltda',
                date: now.toLocaleDateString('pt-BR'),
                timestamp: now
            };
            
            setIdea(prev => ({
                ...prev,
                comments: [...prev.comments, newCommentObj]
            }));
            setNewComment('');
            setSelectedImage(null);
        }
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            
            if (file.type.startsWith('image/')) {
                const preview = URL.createObjectURL(file);
                setSelectedImage({ file, preview });
            } else {
                alert('Por favor, selecione apenas arquivos de imagem.');
            }
        }
        
        event.target.value = '';
    };

    const handleRemoveImage = () => {
        if (selectedImage) {
            URL.revokeObjectURL(selectedImage.preview);
            setSelectedImage(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aberta':
                return 'warning';
            case 'em_analise':
                return 'info';
            case 'implementada':
                return 'success';
            case 'rejeitada':
                return 'error';
            default:
                return 'warning';
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <div className={styles.ideaHeader}>
                    <h1 className={styles.title}>{idea.title}</h1>
                    <a href={`#${idea.id}`} className={styles.ideaNumber}>
                        Ideia Nº {idea.id}
                    </a>
                    <p className={styles.description}>{idea.description}</p>
                    <div className={styles.company}>
                        <span>Ideia por:</span>
                        <div className={styles.userInfo}>
                            <div className={styles.userIcon}>👤</div>
                            <span>{idea.company}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.metadataGrid}>
                    <div className={styles.metadataColumn}>
                        <h3>situação</h3>
                        <Chip 
                            label={idea.status} 
                            color={getStatusColor(idea.status) as any}
                            variant="outlined"
                        />
                    </div>

                    <div className={styles.metadataColumn}>
                        <h3>categorias</h3>
                        <div className={styles.categories}>
                            {idea.categories.map((category, index) => (
                                <span
                                    key={index}
                                    className={styles.categoryTag}
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.metadataColumn}>
                        <h3>Curtidas</h3>
                        <div className={styles.likesInfo}>
                            <Heart size={25} className={styles.heartIcon} />
                            <span>{idea.likes}</span>
                        </div>
                    </div>

                    <div className={styles.metadataColumn}>
                        <h3>Ideia Genial</h3>
                        <div className={styles.likesInfo}>
                            <StarIcon size={25} className={styles.starIcon} />
                        </div>
                    </div>
                </div>

                <div className={styles.commentsSection}>
                    <div className={styles.commentsContainer}>
                        <div className={styles.commentsHeader}>
                            <h2>Comentários</h2>
                            <p>O que outros usuários estão comentando</p>
                            <span className={styles.commentCount}>
                                {idea.comments.length} comentário{idea.comments.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className={styles.commentsList}>
                            {idea.comments.map((comment) => (
                                <div key={comment.id} className={styles.comment}>
                                    <p className={styles.commentText}>{comment.text}</p>
                                    <div className={styles.commentFooter}>
                                        <div className={styles.commentUser}>
                                            <div className={styles.userIcon}>👤</div>
                                            <span>{comment.user}</span>
                                        </div>
                                        <span className={styles.commentDate}>{getRelativeTime(comment.timestamp)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.addComment}>
                        <div className={styles.commentInput}>
                            {selectedImage && (
                                <div className={styles.imagePreview}>
                                    <img 
                                        src={selectedImage.preview} 
                                        alt="Preview" 
                                        className={styles.previewImage}
                                    />
                                    <button 
                                        className={styles.removeImageButton}
                                        onClick={handleRemoveImage}
                                        title="Remover imagem"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            <MessageCircle size={18} />
                            <input
                                type="text"
                                placeholder="adicionar comentário..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                        </div>
                        <div className={styles.commentActions}>
                            <button 
                                className={styles.actionButton}
                                onClick={handleFileSelect}
                                title="Anexar imagem"
                            >
                                <Paperclip size={18} />
                            </button>
                            <button 
                                className={styles.actionButton} 
                                onClick={handleAddComment}
                                disabled={!newComment.trim() && !selectedImage}
                                title="Enviar comentário"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

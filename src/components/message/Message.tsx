import { Copy, ThumbsUp, ThumbsDown, MoreHorizontal, RotateCcw } from 'lucide-react';
import styles from './Message.module.scss';

interface MessageProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

export const Message = ({ content, isUser, timestamp }: MessageProps) => {
  if (isUser) {
    return (
      <div className={styles.userMessage}>
        <div className={styles.userContent}>
          <div className={styles.userBubble}>
            <p className={styles.userText}>{content}</p>
          </div>
          {timestamp && (
            <div className={styles.userTimestamp}>
              <span className={styles.timestamp}>{timestamp}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.message}>
      <div className={styles.assistantContainer}>
        <div className={styles.avatar}>
          <div className={styles.avatarInner}>
            <div className={styles.avatarDot}></div>
          </div>
        </div>
        
        <div className={styles.content}>
          <div className={styles.assistantBubble}>
            <p className={styles.assistantText}>
              {content}
            </p>
          </div>
          
          <div className={styles.actions}>
            <button className={styles.actionButton} title="Regenerar">
              <RotateCcw className={styles.actionIcon} />
            </button>
            
            <button className={styles.actionButton} title="Copiar">
              <Copy className={styles.actionIcon} />
            </button>
            
            <button className={styles.actionButton} title="Baixar">
              <svg className={styles.actionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </button>
            
            <button className={styles.actionButton} title="Gostei">
              <ThumbsUp className={styles.actionIcon} />
            </button>
            
            <button className={styles.actionButton} title="Não gostei">
              <ThumbsDown className={styles.actionIcon} />
            </button>
            
            <button className={styles.actionButton} title="Mais opções">
              <MoreHorizontal className={styles.actionIcon} />
            </button>
            
            {timestamp && (
              <span className={styles.assistantTimestamp}>{timestamp}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
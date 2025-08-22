'use client';
import { useEffect, useRef, useState } from 'react';
import { Mic, Paperclip, ChevronDown, ArrowUp, Lightbulb } from 'lucide-react';
import { Button, Popover } from 'antd';
import { OneDrive } from '@/icons/onedrive';
import { GoogleDrive } from '@/icons/googledrive';
import styles from './ChatInput.module.scss';
import TextArea from 'antd/es/input/TextArea';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isInitial?: boolean;
  message: string;
  setMessage: (message: string) => void;
  setOpenIdeas: (open: boolean) => void;
  openIdeas: boolean;
}

export const ChatInput = ({
  onSendMessage,
  disabled,
  isInitial = true,
  message,
  setMessage,
  setOpenIdeas,
  openIdeas
}: ChatInputProps) => {
  const [open, setOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const typingInterval = useRef<NodeJS.Timeout | null>(null);

  const placeholderMessages = [
    "O que pode me fazer cair na malha fina?",
    "O que eu preciso para abrir minha empresa?",
    "Qual a diferença de um regime tributário para o outro?",
    "Sou MEI, posso contratar funcionário?",
    "Tem como pagar menos impostos legalmente?",
    "Como funciona a declaração do Imposto de Renda?",
    "Como faço para regularizar minha situação fiscal?",
    "Qual o melhor CNAE para minha atividade?",
    "Preciso de contador sendo MEI?",
    "Como funciona o Simples Nacional?",
    "Quais os prazos para declarações fiscais?",
    "Como emitir nota fiscal eletrônica?",
    "Posso ter mais de uma empresa?",
    "Como fazer o planejamento tributário?",
  ];

  useEffect(() => {
    if (message !== '') {
      setPlaceholder('');
      return;
    }

    if (typingInterval.current) {
      clearInterval(typingInterval.current);
    }

    const currentMessage = placeholderMessages[placeholderIndex];
    let localCharIndex = 0;

    typingInterval.current = setInterval(() => {
      if (localCharIndex <= currentMessage.length) {
        setPlaceholder(currentMessage.slice(0, localCharIndex));
        localCharIndex++;
      } else {
        clearInterval(typingInterval.current!);

        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholderMessages.length);
        }, 2000);
      }
    }, 100);

    return () => {
      if (typingInterval.current) clearInterval(typingInterval.current);
    };
  }, [placeholderIndex, message]);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpenIdeas(newOpen);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.wrapper}>
          <div className={styles.inputRow}>
            <TextArea
              placeholder={isInitial ? placeholder : 'Como o Luca pode te ajudar hoje?'}
              autoSize={{ minRows: 2, maxRows: 15 }}
              className={styles.input}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (message.trim() && !disabled) {
                    onSendMessage(message.trim());
                    setMessage('');
                  }
                }
              }}
            />

            <div className={styles.actions}>
              <div className={styles.actionsContainer}>
                <Popover
                  content={
                    <>
                      <p className={styles.dropdownItem}><Paperclip size={16} /> Anexar arquivo </p>
                      <p className={styles.dropdownItem}><OneDrive /> Conectar com o Google Drive </p>
                      <p className={styles.dropdownItem}><GoogleDrive /> Conectar com o OneDrive </p>
                    </>
                  }
                  trigger="click"
                  open={open}
                  onOpenChange={() => setOpen(!open)}
                  arrow={false}
                >
                  <Button type="primary"
                    className={styles.dropdownToggle}>
                    <Paperclip className={styles.iconSmall} />
                    Anexar
                    <ChevronDown className={styles.chevronIcon} />
                  </Button>
                </Popover>
                {
                  isInitial && (
                    <Button type="primary" className={styles.dropdownToggle} onClick={() => {
                      setOpenIdeas(!openIdeas);
                    }}>
                      <Lightbulb className={styles.iconSmall} /> Ideias
                    </Button>
                  )
                }
              </div>

              <div className={styles.containerActions}>
                <button type="button" className={styles.iconButton}>
                  <Mic className={styles.icon} />
                </button>
                <button className={`${styles.modelCircle} ${message === '' ? styles.disabled : ''}`}>
                  <ArrowUp size={20} className={styles.arrowUp} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

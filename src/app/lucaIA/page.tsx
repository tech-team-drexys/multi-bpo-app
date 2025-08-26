"use client";
import React, { useState, useEffect } from "react";
import { ChatInput } from "@/components/chat-input/ChatInput";
import { Button, Tooltip, Avatar, CircularProgress } from "@mui/material";
import {
    Bot,
    Copy,
    Pencil,
    RefreshCcw,
    Share,
    ThumbsDown,
    ThumbsUp,
    User,
    Search,
} from "lucide-react";
import styles from "./luca.module.scss";
import { simulateN8NResponse } from "@/services/api";
import { HistoryModal } from "@/components/modal/HistoryModal";
import { RegistrationModal } from "@/components/modal/RegistrationModal";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: string;
}

const thinkList = [
    "Como funciona o Simples Nacional?",
    "Quais os prazos para declarações fiscais?",
    "Como emitir nota fiscal eletrônica?",
    "Posso ter mais de uma empresa?",
    "Como fazer o planejamento tributário?",
];

export default function LucaIA() {
    const { isLoggedIn } = useAuth();
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [openIdeas, setOpenIdeas] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

    const MESSAGE_LIMIT = 4;

    const userMessages = messages.filter(msg => msg.isUser);
    const hasReachedLimit = userMessages.length >= MESSAGE_LIMIT;

    const handleSendMessage = async (content: string) => {
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            content,
            isUser: true,
            timestamp: new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages((prev) => [...prev, userMessage]);

        const currentUserMessages = messages.filter(msg => msg.isUser);
        const totalUserMessages = currentUserMessages.length + 1;
        const hasReachedLimitNow = totalUserMessages >= MESSAGE_LIMIT;

        if (hasReachedLimitNow) {
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: "Você atingiu o limite de 4 mensagens sem cadastro. Para continuar usando o LucaIA, faça seu cadastro gratuito agora.",
                isUser: false,
                timestamp: new Date().toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            setMessages((prev) => [...prev, errorMessage]);

            setTimeout(() => {
                setIsRegistrationModalOpen(true);
            }, 500);

            return;
        }

        setIsTyping(true);

        try {
            const response = await simulateN8NResponse(content);
            const words = response.split(" ");
            const typingId = "typing";
            const timestamp = new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            });

            let currentIndex = 0;
            let partial = "";

            const interval = setInterval(() => {
                partial += (currentIndex === 0 ? "" : " ") + words[currentIndex];
                currentIndex++;

                if (currentIndex === 1) {
                    setIsTyping(false);
                }

                setMessages((prevMessages) => {
                    const last = prevMessages[prevMessages.length - 1];
                    if (last && last.id === typingId) {
                        return [...prevMessages.slice(0, -1), { ...last, content: partial }];
                    } else {
                        return [
                            ...prevMessages,
                            {
                                id: typingId,
                                content: partial,
                                isUser: false,
                                timestamp,
                            },
                        ];
                    }
                });

                if (currentIndex >= words.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setMessages((prevMessages) => [
                            ...prevMessages.slice(0, -1),
                            {
                                id: (Date.now() + 1).toString(),
                                content: response,
                                isUser: false,
                                timestamp,
                            },
                        ]);
                    }, 300);
                }
            }, 150);
        } catch (error) {
            console.error("Erro ao simular resposta:", error);
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 2).toString(),
                    content: "Erro ao simular resposta. Tente novamente.",
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);
        }
    };

    return (
        <div
            className={`${styles.chatContainer} ${messages.length === 0 ? styles.empty : ""
                }`}
        >
            {messages.length > 0 && (
                <div className={styles.messages}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.messageGroup} ${msg.isUser ? styles.user : styles.ai}`}
                        >

                            <div className={styles.avatarWrapper}>
                                <Avatar
                                    className={msg.isUser ? styles.userAvatar : styles.aiAvatar}
                                >
                                    {msg.isUser ? <User size={20} /> : <Bot size={20} />}
                                </Avatar>
                            </div>

                            <div className={styles.messageContent}>
                                <div
                                    className={`${styles.messageWrapper} ${msg.isUser ? styles.userMessage : styles.aiMessage
                                        }`}
                                >
                                    <div className={styles.messageText}>{msg.content}</div>
                                </div>
                                <span className={styles.timestamp}>{msg.timestamp}</span>
                                <div className={styles.actionsWrapper}>
                                    <div className={styles.actions}>
                                        {msg.isUser ? (
                                            <>
                                                <Tooltip title="Copiar" className={styles.actionButton}>
                                                    <Button className={styles.actionButton} size="small">
                                                        <Copy size={16} />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Editar" className={styles.actionButton}>
                                                    <Button className={styles.actionButton} size="small">
                                                        <Pencil size={16} />
                                                    </Button>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <>
                                                <Tooltip title="Tentar novamente" className={styles.actionButton}>
                                                    <Button className={styles.actionButton} size="small">
                                                        <RefreshCcw size={16} />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Copiar" className={styles.actionButton}>
                                                    <Button className={styles.actionButton} size="small">
                                                        <Copy size={16} />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Compartilhar" className={styles.actionButton}>
                                                    <Button className={styles.actionButton} size="small">
                                                        <Share size={16} />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Amei" className={styles.actionButton}>
                                                    <Button className={styles.actionButton} size="small">
                                                        <ThumbsUp size={16} />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Precisa de melhorias" className={styles.actionButton}>
                                                    <Button className={styles.actionButton} size="small">
                                                        <ThumbsDown size={16} />
                                                    </Button>
                                                </Tooltip>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className={`${styles.messageGroup} ${styles.ai}`}>
                            <div className={styles.avatarWrapper}>
                                <Avatar className={styles.aiAvatar}>
                                    <Bot size={20} />
                                </Avatar>
                                <div className={styles.typingSpinner}></div>
                            </div>
                            <div className={styles.messageContent}>
                                <div className={styles.messageWrapper}>
                                    <pre className={styles.messageText}>Só um momento, estou pensando sobre o assunto...</pre>
                                </div>
                                <span className={styles.timestamp}>
                                    {new Date().toLocaleTimeString("pt-BR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                    )}

                </div>
            )}


            <div
                className={`${styles.chatInputEmpty} ${messages.length === 0 ? styles.chatInputWrapper : ""
                    }`}
            >
                {messages.length === 0 && <h1>Como posso ajudar você hoje?</h1>}
                <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={isTyping}
                    isInitial={messages.length === 0}
                    message={currentMessage}
                    setMessage={setCurrentMessage}
                    setOpenIdeas={setOpenIdeas}
                    openIdeas={openIdeas}
                />

                {messages.length === 0 && openIdeas && (
                    <div className={styles.think}>
                        <div className={styles.thinkList}>
                            <p className={styles.thinkTitle}>Idéias para você perguntar:</p>
                            {thinkList.map((item, index) => (
                                <div key={index} className={styles.thinkItem} onClick={() => setCurrentMessage(item)}>
                                    <Search size={16} className={styles.searchIcon} />
                                    <span className={styles.questionText}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {messages.length > 0 && !hasReachedLimit && (
                    <div className={styles.chatInputWrapperTextContainer}>
                        <p className={styles.chatInputWrapperText}>
                            O Luca tentará te ajudar com o máximo de precisão possível, mas
                            não se esqueça que ele é uma IA e pode ter algumas limitações.
                        </p>
                    </div>
                )}
            </div>

            <HistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
            />

            <RegistrationModal
                isOpen={isRegistrationModalOpen}
                onClose={() => setIsRegistrationModalOpen(false)}
            />
        </div>
    );
}

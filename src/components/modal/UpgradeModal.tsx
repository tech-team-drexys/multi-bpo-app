"use client";
import React from "react";
import { Button } from "@mui/material";
import { X, MessageCircle, Crown, CreditCard, XCircle, Bot } from "lucide-react";
import styles from "./UpgradeModal.module.scss";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleChatPlan = () => {
        console.log("Contratar Chat do Luca");
    };

    const handleCompletePlan = () => {
        console.log("Ver todos os planos");
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Continue conversando com o Luca</h2>
                    <p className={styles.modalSubtitle}>
                        Você atingiu o limite de mensagens gratuitas. Escolha como deseja continuar:
                    </p>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                <div className={styles.plansContainer}>
                    <div className={styles.planCard}>
                        <div className={styles.planIcon}>
                            <MessageCircle size={32} />
                        </div>
                        <h3 className={styles.planName}>Chat do Luca</h3>
                        <div className={styles.planPrice}>
                            <span className={styles.priceValue}>R$ 19,90</span>
                            <span className={styles.pricePeriod}>/mês</span>
                        </div>
                        <ul className={styles.planFeatures}>
                            <li>
                                <MessageCircle size={16} />
                                Chat ilimitado com o Luca
                            </li>
                            <li>
                                <MessageCircle size={16} />
                                Respostas inteligentes e rápidas
                            </li>
                            <li>
                                <MessageCircle size={16} />
                                Histórico de conversas salvo
                            </li>
                            <li>
                                <MessageCircle size={16} />
                                Suporte técnico
                            </li>
                        </ul>
                        <Button 
                            className={styles.planButton}
                            onClick={handleChatPlan}
                        >
                            Contratar Chat
                        </Button>
                    </div>

                    <div className={styles.planCard}>
                        <div className={styles.popularBadge}>
                            ✨ Mais Vantajoso
                        </div>
                        <div className={styles.planIcon}>
                            <Crown size={32} />
                        </div>
                        <h3 className={styles.planName}>Plano Completo</h3>
                        <div className={styles.planPrice}>
                            <span className={styles.oldPrice}>R$ 89,90</span>
                            <span className={styles.priceValue}>R$ 29,90</span>
                            <span className={styles.pricePeriod}>/mês</span>
                        </div>
                        <ul className={styles.planFeatures}>
                            <li>
                                <Crown size={16} />
                                Tudo do Chat do Luca
                            </li>
                            <li>
                                <Crown size={16} />
                                Certificados digitais ilimitados
                            </li>
                            <li>
                                <Crown size={16} />
                                Gestão completa de contratos
                            </li>
                            <li>
                                <Crown size={16} />
                                Análises e relatórios avançados
                            </li>
                            <li>
                                <Crown size={16} />
                                Suporte prioritário 24/7
                            </li>
                        </ul>
                        <Button 
                            className={styles.planButton}
                            onClick={handleCompletePlan}
                        >
                            Ver Todos os Planos
                        </Button>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <div className={styles.footerItem}>
                        <CreditCard size={16} />
                        <span>Pagamento seguro</span>
                    </div>
                    <div className={styles.footerSeparator}>•</div>
                    <div className={styles.footerItem}>
                        <XCircle size={16} />
                        <span>Cancele quando quiser</span>
                    </div>
                    <div className={styles.footerSeparator}>•</div>
                    <div className={styles.footerItem}>
                        <Bot size={16} />
                        <span>Luca sempre disponível</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


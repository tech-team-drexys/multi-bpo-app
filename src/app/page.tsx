'use client';
import { Button, Col, Row, Calendar, List, Tag } from "antd";
import styles from "./page.module.scss";
import Image from "next/image";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const router = useRouter();

  const agendasDoDia = [
    {
      id: 1,
      titulo: "Reunião com equipe de desenvolvimento",
      horario: "09:00 - 10:30",
      tipo: "reuniao",
      descricao: "Discussão sobre novos recursos do sistema"
    },
    {
      id: 2,
      titulo: "Call com cliente - Projeto ABC",
      horario: "14:00 - 15:00",
      tipo: "cliente",
      descricao: "Apresentação do progresso do projeto"
    },
    {
      id: 3,
      titulo: "Revisão de código",
      horario: "16:00 - 17:00",
      tipo: "tecnico",
      descricao: "Code review do módulo de autenticação"
    },
    {
      id: 4,
      titulo: "Daily Standup",
      horario: "08:30 - 09:00",
      tipo: "reuniao",
      descricao: "Sincronização diária da equipe"
    }
  ];

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'reuniao':
        return 'blue';
      case 'cliente':
        return 'green';
      case 'tecnico':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case 'reuniao':
        return 'Reunião';
      case 'cliente':
        return 'Cliente';
      case 'tecnico':
        return 'Técnico';
      default:
        return 'Outro';
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1>Olá André, seja bem-vindo ao Multi BPO!</h1>
        
        <section className={styles.section}>
          <h2>Novidades</h2>
          <div className={styles.novidadesGrid}>
            <div className={`${styles.card} ${styles.cardLuca}`}>
              <div className={styles.cardIcon}>
                <Image src="/robot.png" alt="Luca IA" width={60} height={60} />
              </div>
              <div className={styles.cardContent}>
                <h3>Fale com o Luca IA</h3>
                <p>Agora você pode falar com o Luca IA para tirar dúvidas, fazer pedidos e muito mais.</p>
                <Button className={styles.button} onClick={() => router.push('/lucaIA')}>Fale com o Luca IA</Button>
              </div>
            </div>

            <div className={`${styles.card} ${styles.cardDashboard}`}>
              <div className={styles.cardIcon}>
                <div className={styles.chartIcon}>📊</div>
              </div>
              <div className={styles.cardContent}>
                <h3>Novo Dashboard Atualizado</h3>
                <p>Visualize métricas em tempo real com nosso dashboard reformulado e mais intuitivo.</p>
                <Button className={styles.button} onClick={() => router.push('/dashboard')}>Acessar Dashboard</Button>
              </div>
            </div>

            <div className={`${styles.card} ${styles.cardLoja}`}>
              <div className={styles.cardIcon}>
                <div className={styles.shopIcon}>🛍️</div>
              </div>
              <div className={styles.cardContent}>
                <h3>Nova Loja Online</h3>
                <p>Explore nossa nova loja com produtos e serviços exclusivos para sua empresa.</p>
                <Button className={styles.button} onClick={() => router.push('/loja')}>Visitar Loja</Button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Agenda</h2>
          <div className={styles.agendaContainer}>
            <div className={styles.calendarioContainer}>
              <h3>Agenda do Dia</h3>
              <Calendar 
                fullscreen={false}
                value={selectedDate}
                onChange={setSelectedDate}
                className={styles.calendar}
              />
            </div>

            <div className={styles.agendasLista}>
              <h3>Agendas de Hoje</h3>
              <List
                dataSource={agendasDoDia}
                renderItem={(item) => (
                  <List.Item className={styles.agendaItem}>
                    <div className={styles.agendaContent}>
                      <div className={styles.agendaHeader}>
                        <h4>{item.titulo}</h4>
                        <Tag color={getTipoColor(item.tipo)}>{getTipoText(item.tipo)}</Tag>
                      </div>
                      <p className={styles.agendaHorario}>{item.horario}</p>
                      <p className={styles.agendaDescricao}>{item.descricao}</p>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Serviços Principais</h2>
          <div className={styles.servicosGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <div className={styles.cloudIcon}>☁️</div>
              </div>
              <h3>Drive</h3>
              <p>Armazene e compartilhe seus arquivos</p>
              <Button className={styles.button} onClick={() => router.push('/drive')}>Acessar Drive</Button>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <div className={styles.headphoneIcon}>🎧</div>
              </div>
              <h3>Central de Atendimento</h3>
              <p>Suporte técnico e atendimento ao cliente</p>
              <Button className={styles.button} onClick={() => router.push('/central-de-atendimento')}>Entrar em contato</Button>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Image src="/robot.png" alt="Luca IA" width={40} height={40} />
              </div>
              <h3>Luca IA</h3>
              <p>Assistente inteligente para suas tarefas</p>
              <Button className={styles.button} onClick={() => router.push('/lucaIA')}>Conversar</Button>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Ferramentas e Recursos</h2>
          <div className={styles.ferramentasGrid}>
            <div className={styles.toolCard}>
              <div className={styles.toolIcon}>
                <div className={styles.peopleIcon}>👥</div>
              </div>
              <h3>Utilitários</h3>
              <p>Ferramentas úteis para o dia a dia</p>
            </div>

            <div className={styles.toolCard}>
              <div className={styles.toolIcon}>
                <div className={styles.newsIcon}>📰</div>
              </div>
              <h3>Notícias</h3>
              <p>Fique por dentro das novidades</p>
            </div>

            <div className={styles.toolCard}>
              <div className={styles.toolIcon}>
                <div className={styles.calendarIcon}>📅</div>
              </div>
              <h3>Agenda</h3>
              <p>Gerencie seus compromissos</p>
            </div>

            <div className={styles.toolCard}>
              <div className={styles.toolIcon}>
                <div className={styles.bellIcon}>🔔</div>
              </div>
              <h3>Notificações</h3>
              <p>Acompanhe alertas importantes</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

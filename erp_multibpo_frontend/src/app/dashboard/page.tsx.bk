'use client';
import { Card, Row, Col, Progress, Button, List, Tag } from 'antd';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from "./page.module.scss";
import { TaskStatus } from '@/enums/index ';

export default function Dashboard() {
  const router = useRouter();
  
  const agendasDoDia = [
    {
      id: 1,
      titulo: "Entregar DCTF (Declaração de Débitos e Créditos Tributários Federais) no e-CAC.",
      date: "15/08/2025",
      tipo: "due_today",
      descricao: "Declaração mensal que informa à Receita Federal os tributos e contribuições apurados e os pagamentos realizados pela empresa."
    },
    {
      id: 2,
      titulo: "Transmitir EFD-Contribuições no SPED.",
      date: "10/08/2025",
      tipo: "due_today",
      descricao: "Escrituração digital com informações de PIS e COFINS, enviada ao SPED para cumprimento de obrigações fiscais federais."
    },
    {
      id: 3,
      titulo: "Entregar DIRF (Declaração do Imposto de Renda Retido na Fonte).",
      date: "05/08/2025",
      tipo: "on_track",
      descricao: "Declaração anual do imposto retido na fonte sobre rendimentos de trabalho com aplicação de benefícios fiscais."
    },
    {
      id: 4,
      titulo: "Enviar RAIS e CAGED (ou eSocial substituto).",
      date: "01/08/2025",
      tipo: "on_track",
      descricao: "Registro mensal que informa à Previdência Social sobre a condição de atividade e pagamento de contribuições para o sistema de benefícios."
    }
  ];

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case TaskStatus.ON_TRACK:
        return 'red';
      case TaskStatus.DUE_TODAY:
        return 'yellow';
    }
  };

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case TaskStatus.ON_TRACK:
        return 'Vencida';
      case TaskStatus.DUE_TODAY:
        return 'Vence hoje';
    }
  };

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  const handleBuyStorage = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/loja');
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1>Dashboard</h1>

        <Row gutter={[24, 24]} className={styles.cardsContainer}>
          <Row gutter={[24, 24]} style={{ width: '100%', marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card 
                title="Certificado digital" 
                className={styles.card}
                onClick={() => handleCardClick('/certificados')}
                style={{ cursor: 'pointer' }}
              >
                <Row gutter={16} justify="space-between" align="middle">
                  <Col>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber} style={{ color: '#fa8c16' }}>5</span>
                      <span className={styles.statLabel}>certificados vencendo</span>
                    </div>
                  </Col>
                  <Col>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber} style={{ color: '#ff4d4f' }}>5</span>
                      <span className={styles.statLabel}>certificados vencido</span>
                    </div>
                  </Col>
                  <Col>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber} style={{ color: '#2463eb' }}>5</span>
                      <span className={styles.statLabel}>certificados ativos</span>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card 
                title="Armazenamento" 
                className={styles.card}
                onClick={() => handleCardClick('/drive')}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.storageContainer}>
                  <Progress
                    percent={78}
                    strokeColor="#1890ff"
                    showInfo={false}
                    className={styles.progressBar}
                  />
                  <div className={styles.storageInfo}>
                    <span>1 de GB utilizados de 5,00 GB</span>
                    <span>78% de 22%</span>
                  </div>
                  <div className={styles.storageRight}>
                    <span>1 de 20</span>
                    <Button
                      type="default"
                      icon={<ShoppingCart size={16} />}
                      className={styles.buyButton}
                      onClick={handleBuyStorage}
                    >
                      comprar armazenamento
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ width: '100%' }}>
            <Col xs={24} lg={12}>
              <Card 
                title="Clientes" 
                className={styles.card}
                onClick={() => handleCardClick('/clientes')}
                style={{ cursor: 'pointer' }}
              >
                <Row gutter={16} align="middle">
                  <Col span={12}>
                    <div className={styles.clientStats}>
                      <div className={styles.statItem}>
                        <span className={styles.statNumber} style={{ color: '#000', fontWeight: 'bold' }}>39</span>
                        <span className={styles.statLabel}>clientes ativos</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statNumber} style={{ color: '#8c8c8c' }}>3</span>
                        <span className={styles.statLabel}>clientes inativos</span>
                      </div>
                    </div>
                  </Col>
                  <Col span={12} className={styles.chartContainer}>
                    <Progress type="circle" percent={75} />
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card 
                title="Tarefas" 
                className={`${styles.card} ${styles.taskCard}`}
                style={{ cursor: 'default' }}
              >
                <Row gutter={16} align="middle">
                  <Col span={24}>
                    <List
                      dataSource={agendasDoDia}
                      renderItem={(item) => (
                        <List.Item 
                          className={styles.agendaItem}
                          onClick={() => handleCardClick('/agenda')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className={styles.agendaContent}>
                            <div className={styles.agendaHeader}>
                              <h4>{item.titulo}</h4>
                              <Tag color={getTipoColor(item.tipo)}>{getTipoText(item.tipo)}</Tag>
                            </div>
                            <p className={styles.agendaHorario}>{item.date}</p>
                            <p className={styles.agendaDescricao}>{item.descricao}</p>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Row>
      </div>
    </div>
  );
} 
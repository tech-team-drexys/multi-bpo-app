'use client';
import { Card, CardContent, CardHeader, LinearProgress, Button, List, ListItem, ListItemText, Chip, Box, Typography } from '@mui/material';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Gauge } from '@mui/x-charts/Gauge';
import styles from "./page.module.scss";
import { TaskStatus } from '@/enums';

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
        return 'error';
      case TaskStatus.DUE_TODAY:
        return 'warning';
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

        <div className={styles.cardsContainer}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                <Card
                  className={styles.card}
                  onClick={() => handleCardClick('/certificados')}
                  style={{ cursor: 'pointer' }}
                >
                  <CardHeader title="Certificado digital" />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                      <div className={styles.statItem}>
                        <span className={styles.statNumber} style={{ color: '#fa8c16' }}>5</span>
                        <span className={styles.statLabel}>certificados vencendo</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statNumber} style={{ color: '#ff4d4f' }}>5</span>
                        <span className={styles.statLabel}>certificados vencido</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statNumber} style={{ color: '#2463eb' }}>5</span>
                        <span className={styles.statLabel}>certificados ativos</span>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                <Card
                  className={styles.card}
                  onClick={() => handleCardClick('/drive')}
                  style={{ cursor: 'pointer' }}
                >
                  <CardHeader title="Armazenamento" />
                  <CardContent>
                    <div className={styles.storageContainer}>
                      <LinearProgress
                        variant="determinate"
                        value={78}
                        className={styles.progressBar}
                        sx={{
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#1890ff'
                          }
                        }}
                      />
                      <div className={styles.storageInfo}>
                        <span>1 de GB utilizados de 5,00 GB</span>
                        <span>78% de 22%</span>
                      </div>
                      <div className={styles.storageRight}>
                        <span>1 de 20</span>
                        <Button
                          variant="outlined"
                          startIcon={<ShoppingCart size={16} />}
                          className={styles.buyButton}
                          onClick={handleBuyStorage}
                        >
                          comprar armazenamento
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                <Card
                  className={styles.card}
                  onClick={() => handleCardClick('/clientes')}
                  style={{ cursor: 'pointer' }}
                >
                  <CardHeader title="Clientes" />
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
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
                      </Box>
                      <Gauge width={150} height={150} value={75} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                <Card
                  className={`${styles.card} ${styles.taskCard}`}
                  style={{ cursor: 'default' }}
                >
                  <CardHeader title="Tarefas" />
                  <CardContent>
                    <List>
                      {agendasDoDia.map((item) => (
                        <ListItem
                          key={item.id}
                          className={styles.agendaItem}
                          onClick={() => handleCardClick('/agenda')}
                          style={{ cursor: 'pointer' }}
                        >
                          <ListItemText
                            primary={
                              <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="h6">{item.titulo}</Typography>
                                  <Chip
                                    label={getTipoText(item.tipo)}
                                    color={getTipoColor(item.tipo) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                                    size="small"
                                  />
                                </Box>
                                <Typography variant="body2" color="text.secondary">{item.date}</Typography>
                                <Typography variant="body2">{item.descricao}</Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
} 
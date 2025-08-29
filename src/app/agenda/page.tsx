'use client';
import React, { useState } from 'react';
import { Card, CardContent, TextField, Select, MenuItem, FormControl, InputLabel, Button, Chip, Typography, Box, Checkbox, Snackbar, Alert } from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { Calendar, Badge } from 'antd';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  Calendar as CalendarIcon,
  Building,
  ChevronDown,
  Filter,
  Eye
} from 'lucide-react';
import styles from "./page.module.scss";
import { TaskStatus } from '@/enums/index ';
interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  city: string;
  category: string;
  status: TaskStatus;
  completed?: boolean;
  completedDate?: string;
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: "ICMS - Apuração Mensal",
    description: "Apuração e recolhimento do ICMS referente ao mês anterior",
    date: "14/08/2025",
    city: "São Paulo",
    category: "Tributos Estaduais",
    status: TaskStatus.COMPLETED,
    completed: true,
    completedDate: "13/08/2025"
  },
  {
    id: 2,
    title: "Relatório Contábil",
    description: "Envio do relatório contábil mensal",
    date: "08/08/2025",
    city: "Brasília",
    category: "Relatórios",
    status: TaskStatus.OVERDUE,
    completed: false
  },
  {
    id: 3,
    title: "Relatório Contábil",
    description: "Envio do relatório contábil mensal",
    date: "13/08/2025",
    city: "Brasília",
    category: "Relatórios",
    status: TaskStatus.ON_TRACK,
    completed: false
  },
  {
    id: 4,
    title: "Auditoria Fiscal",
    description: "Revisão dos documentos fiscais",
    date: "20/08/2025",
    city: "Rio de Janeiro",
    category: "Auditoria",
    status: TaskStatus.ON_TRACK,
    completed: false
  },
  {
    id: 5,
    title: "Documentação Legal",
    description: "Organização da documentação legal",
    date: "21/08/2025",
    city: "Belo Horizonte",
    category: "Documentação",
    status: TaskStatus.ON_TRACK,
    completed: false
  }
];

const getStatusConfig = (status: Task['status']) => {
  switch (status) {
    case TaskStatus.OVERDUE:
      return { color: '#ff4d4f', text: 'Vencida', icon: <AlertTriangle size={16} color="#fff" /> };
    case TaskStatus.ON_TRACK:
      return { color: '#faad14', text: 'Vence hoje', icon: <Clock size={16} color="#fff" /> };
    case TaskStatus.COMPLETED:
      return { color: '#52c41a', text: 'Concluída', icon: <CheckCircle size={16} color="#fff" /> };
    default:
      return { color: '#2463eb', text: 'Em dia', icon: <Clock size={16} color="#fff" /> };
  }
};

const getSummaryData = () => {
  const vencidas = mockTasks.filter(task => task.status === TaskStatus.OVERDUE).length;
  const venceHoje = mockTasks.filter(task => task.status === TaskStatus.ON_TRACK).length;
  const emDia = mockTasks.filter(task => task.status === TaskStatus.DUE_TODAY || task.status === TaskStatus.COMPLETED).length;

  return { vencidas, venceHoje, emDia };
};

export default function Agenda() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(new Date()).locale('pt-br'));
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const notificationRef = React.useRef<Set<number>>(new Set());

  const summaryData = getSummaryData();

  const showNotification = React.useCallback((taskTitle: string) => {
    setSnackbar({
      open: true,
      message: `"${taskTitle}" foi marcada como concluída.`,
      severity: 'success'
    });
  }, []);

  const handleTaskToggle = React.useCallback((taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const wasCompleted = task.completed;
          const newCompleted = !wasCompleted;

          if (!wasCompleted && newCompleted && !notificationRef.current.has(taskId)) {
            notificationRef.current.add(taskId);
            showNotification(task.title);
          }

          if (wasCompleted && !newCompleted) {
            notificationRef.current.delete(taskId);
          }

          return {
            ...task,
            completed: newCompleted,
            status: newCompleted ? TaskStatus.COMPLETED : TaskStatus.ON_TRACK,
            completedDate: newCompleted ? new Date().toLocaleDateString('pt-BR') : undefined
          };
        }
        return task;
      })
    );
  }, [showNotification]);

  const getTasksForDate = (date: Dayjs) => {
    return tasks.filter(task => task.date === date.format('DD/MM/YYYY'));
  };

  const dateCellRender = (date: Dayjs) => {
    const dayTasks = getTasksForDate(date);
    if (dayTasks.length > 0) {
      return (
        <ul className={styles.events}>
          {dayTasks.map((task) => {
            const statusConfig = getStatusConfig(task.status);
            let statusType: 'error' | 'warning' | 'success' | 'processing' = 'processing';

            if (task.status === TaskStatus.OVERDUE) statusType = 'error';
            else if (task.status === TaskStatus.ON_TRACK) statusType = 'warning';
            else if (task.status === TaskStatus.COMPLETED) statusType = 'success';
            else statusType = 'processing';

            return (
              <li key={task.id}>
                <Badge status={statusType} text={task.title} />
              </li>
            );
          })}
        </ul>
      );
    }
    return null;
  };

  const cellRender = (current: Dayjs, info: any) => {
    if (info.type === 'date') {
      return dateCellRender(current);
    }
    return info.originNode;
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Typography variant="h1" className={styles.title}>Agenda</Typography>
        <Typography variant="body2" color="text.secondary">Conteúdo da Agenda será exibido aqui.</Typography>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard} style={{ borderLeft: '4px solid #ff4d4f' }}>
            <div className={styles.summaryContent}>
              <AlertTriangle size={24} color="#ff4d4f" />
              <div>
                <Typography className={styles.summaryNumber} style={{ color: '#ff4d4f' }}>
                  {summaryData.vencidas}
                </Typography>
                <Typography className={styles.summaryLabel}>Vencidas</Typography>
              </div>
            </div>
          </div>

          <div className={styles.summaryCard} style={{ borderLeft: '4px solid #faad14' }}>
            <div className={styles.summaryContent}>
              <Clock size={24} color="#faad14" />
              <div>
                <Typography className={styles.summaryNumber} style={{ color: '#faad14' }}>
                  {summaryData.venceHoje}
                </Typography>
                <Typography className={styles.summaryLabel}>Vence hoje</Typography>
              </div>
            </div>
          </div>

          <div className={styles.summaryCard} style={{ borderLeft: '4px solid #2463eb' }}>
            <div className={styles.summaryContent}>
              <CheckCircle size={24} color="#2463eb" />
              <div>
                <Typography className={styles.summaryNumber} style={{ color: '#2463eb' }}>
                  {summaryData.emDia}
                </Typography>
                <Typography className={styles.summaryLabel}>Em dia</Typography>
              </div>
            </div>
          </div>
        </div>

        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', width: '100%' }} className={styles.mainLayout}>
          <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
            <div className={styles.calendarSection}>
              <Typography variant="h3" className={styles.calendarTitle}>Calendário</Typography>
              <Typography className={styles.currentDate}>
                {selectedDate.locale('pt-br').format('DD [de] MMMM [de] YYYY')}
              </Typography>

              <div className={styles.calendar}>
                <div className={styles.calendarPlaceholder}>
                  <Typography variant="body2" color="text.secondary">
                    <div className={styles.calendarGlobal}>
                      <Calendar
                        value={selectedDate}
                        onSelect={setSelectedDate}
                        cellRender={cellRender}
                        className={styles.calendar}
                        headerRender={({ value, onChange }) => (
                          <div className={styles.calendarHeader}>
                            <Button
                              variant="text"
                              startIcon={<ChevronDown size={16} style={{ transform: 'rotate(90deg)' }} />}
                              onClick={() => {
                                const newDate = value.subtract(1, 'month').locale('pt-br');
                                onChange?.(newDate);
                              }}
                            />
                            <Typography variant="h6" fontWeight="bold">
                              {value.locale('pt-br').format('MMMM YYYY')}
                            </Typography>
                            <Button
                              variant="text"
                              startIcon={<ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />}
                              onClick={() => {
                                const newDate = value.add(1, 'month').locale('pt-br');
                                onChange?.(newDate);
                              }}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </Typography>
                </div>
              </div>

              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ backgroundColor: '#ff4d4f' }}></div>
                  <Typography>Vencida</Typography>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ backgroundColor: '#faad14' }}></div>
                  <Typography>Vence hoje</Typography>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ backgroundColor: '#52c41a' }}></div>
                  <Typography>Concluída</Typography>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ backgroundColor: '#1890ff' }}></div>
                  <Typography>Em dia</Typography>
                </div>
              </div>
            </div>
          </Box>

          <Box sx={{ flex: '2 1 600px', minWidth: 0 }}>
            <div className={styles.filterSection}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '120px' }}>
                  <Filter size={16} />
                  <Typography variant="body1" fontWeight="bold">Filtros:</Typography>
                </Box>

                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <TextField
                    placeholder="Buscar tarefas..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className={styles.searchInput}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <Search size={16} />,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        gap: "8px",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 150px', minWidth: 0 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Prefeitura</InputLabel>
                    <Select
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      label="Prefeitura"
                    >
                      <MenuItem value="">Todas</MenuItem>
                      <MenuItem value="sao-paulo">São Paulo</MenuItem>
                      <MenuItem value="rio-janeiro">Rio de Janeiro</MenuItem>
                      <MenuItem value="belo-horizonte">Belo Horizonte</MenuItem>
                      <MenuItem value="brasilia">Brasília</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: '1 1 150px', minWidth: 0 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="vencida">Vencida</MenuItem>
                      <MenuItem value="vence-hoje">Vence hoje</MenuItem>
                      <MenuItem value="em-dia">Em dia</MenuItem>
                      <MenuItem value="concluida">Concluída</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </div>

            <div className={styles.tasksSection}>
              <div className={styles.tasksHeader}>
                <Typography variant="h3" className={styles.tasksTitle}>
                  Tarefas para {selectedDate.locale('pt-br').format('DD/MM/YYYY')} ({getTasksForDate(selectedDate).length})
                </Typography>
                <Typography className={styles.viewAllTasks}>
                  <Eye size={16} /> Ver todas as tarefas
                </Typography>
              </div>

              <div className={styles.tasksList}>
                {getTasksForDate(selectedDate).map((task) => {
                  const statusConfig = getStatusConfig(task.status);

                  if (!statusConfig) return null;

                  return (
                    <Card
                      key={task.id}
                      className={`${styles.taskCard} ${task.completed ? styles.taskCompleted : ''}`}
                      style={{ borderLeft: `4px solid ${statusConfig.color}` }}
                    >
                      <CardContent>
                        <div className={styles.taskContent}>
                          <Checkbox
                            checked={task.completed}
                            onChange={() => handleTaskToggle(task.id)}
                            className={styles.taskCheckbox}
                          />

                          <div className={styles.taskInfo}>
                            <Typography
                              variant="h5"
                              className={`${styles.taskTitle} ${task.completed ? styles.completedText : ''}`}
                            >
                              {task.title}
                            </Typography>

                            <Typography
                              className={`${styles.taskDescription} ${task.completed ? styles.completedText : ''}`}
                            >
                              {task.description}
                            </Typography>

                            <div className={styles.taskDetails}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CalendarIcon size={14} />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    className={task.completed ? styles.completedText : ''}
                                  >
                                    {task.date}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Building size={14} />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    className={task.completed ? styles.completedText : ''}
                                  >
                                    {task.city}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Clock size={14} className={styles.icon} />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    className={task.completed ? styles.completedText : ''}
                                  >
                                    {task.category}
                                  </Typography>
                                </Box>

                                {task.completed && task.completedDate && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CheckCircle size={14} />
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      className={styles.completedText}
                                    >
                                      Concluída em {task.completedDate}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </div>
                          </div>

                          <Chip
                            label={statusConfig.text}
                            icon={statusConfig.icon}
                            className={styles.statusTag}
                            sx={{ backgroundColor: statusConfig.color, color: 'white' }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </Box>
        </Box>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
} 
'use client';
import React, { useState } from 'react';
import { Card, Input, Select, Button, Tag, Row, Col, Typography, Space, Checkbox, Calendar, Badge, notification } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
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

const { Title, Text } = Typography;
const { Search: SearchInput } = Input;

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
  }
];

const getStatusConfig = (status: Task['status']) => {
  switch (status) {
    case TaskStatus.OVERDUE:
      return { color: '#ff4d4f', text: 'Vencida', icon: <AlertTriangle size={16} /> };
    case TaskStatus.ON_TRACK:
      return { color: '#faad14', text: 'Vence hoje', icon: <Clock size={16} /> };
    case TaskStatus.COMPLETED:
      return { color: '#52c41a', text: 'Concluída', icon: <CheckCircle size={16} /> };
    default:
      return { color: '#2463eb', text: 'Em dia', icon: <Clock size={16} /> };
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
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(new Date()));
  const [api, contextHolder] = notification.useNotification();
  const notificationRef = React.useRef<Set<number>>(new Set());
  
  const summaryData = getSummaryData();

  const showNotification = React.useCallback((taskTitle: string) => {
    api.success({
      message: 'Tarefa Concluída!',
      description: `"${taskTitle}" foi marcada como concluída.`,
      placement: 'bottomRight',
    });
  }, [api]);

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
        <div className={styles.calendarCell}>
          {dayTasks.map(task => (
            <Badge 
              key={task.id} 
              color={getStatusConfig(task.status).color} 
              size="small" 
            />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.page}>
      {contextHolder}
      <div className={styles.content}>
        <Title level={1}>Agenda</Title>
        <Text type="secondary">Conteúdo da Agenda será exibido aqui.</Text>
        
        <div className={styles.summarySection}>
          <div className={styles.summaryCard} style={{ borderLeft: '4px solid #ff4d4f' }}>
            <div className={styles.summaryContent}>
              <AlertTriangle size={24} color="#ff4d4f" />
              <div>
                <Text className={styles.summaryNumber} style={{ color: '#ff4d4f' }}>
                  {summaryData.vencidas}
                </Text>
                <Text className={styles.summaryLabel}>Vencidas</Text>
              </div>
            </div>
          </div>
          
          <div className={styles.summaryCard} style={{ borderLeft: '4px solid #faad14' }}>
            <div className={styles.summaryContent}>
              <Clock size={24} color="#faad14" />
              <div>
                <Text className={styles.summaryNumber} style={{ color: '#faad14' }}>
                  {summaryData.venceHoje}
                </Text>
                <Text className={styles.summaryLabel}>Vence hoje</Text>
              </div>
            </div>
          </div>
          
          <div className={styles.summaryCard} style={{ borderLeft: '4px solid #2463eb' }}>
            <div className={styles.summaryContent}>
              <CheckCircle size={24} color="#2463eb" />
              <div>
                <Text className={styles.summaryNumber} style={{ color: '#2463eb' }}>
                  {summaryData.emDia}
                </Text>
                <Text className={styles.summaryLabel}>Em dia</Text>
              </div>
            </div>
          </div>
        </div>

        <Row gutter={32} className={styles.mainLayout}>
          <Col xs={50 } lg={8}>
            <div className={styles.calendarSection}>
              <Title level={3}>Calendário</Title>
              <Text className={styles.currentDate}>
                {selectedDate.format('DD [de] MMMM [de] YYYY')}
              </Text>
              
              <Calendar 
                value={selectedDate}
                onSelect={setSelectedDate}
                cellRender={dateCellRender}
                className={styles.calendar}
                headerRender={({ value, onChange }) => (
                  <div className={styles.calendarHeader}>
                    <Button 
                      type="text" 
                      icon={<ChevronDown size={16} style={{ transform: 'rotate(90deg)' }} />}
                      onClick={() => {
                        const newDate = value.subtract(1, 'month');
                        onChange?.(newDate);
                      }}
                    />
                    <Text strong>
                      {value.format('MMMM YYYY')}
                    </Text>
                    <Button 
                      type="text" 
                      icon={<ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />}
                      onClick={() => {
                        const newDate = value.add(1, 'month');
                        onChange?.(newDate);
                      }}
                    />
                  </div>
                )}
              />
              
              {/* Legenda */}
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ backgroundColor: '#ff4d4f' }}></div>
                  <Text>Vencidas</Text>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ backgroundColor: '#faad14' }}></div>
                  <Text>Vence hoje</Text>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ backgroundColor: '#52c41a' }}></div>
                  <Text>Em dia</Text>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={16}>
            <div className={styles.filterSection}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={24} md={3}>
                  <Space>
                    <Filter size={16} />
                    <Text strong>Filtros:</Text>
                  </Space>
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <SearchInput
                    placeholder="Buscar tarefas..."
                    prefix={<Search size={16} />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className={styles.searchInput}
                  />
                </Col>
                
                <Col xs={12} sm={6} md={4}>
                  <Select
                    placeholder="Prefeitura"
                    value={cityFilter}
                    onChange={setCityFilter}
                    suffixIcon={<ChevronDown size={16} />}
                    className={styles.filterSelect}
                  >
                    <Select.Option value="">Todas</Select.Option>
                    <Select.Option value="sao-paulo">São Paulo</Select.Option>
                    <Select.Option value="rio-janeiro">Rio de Janeiro</Select.Option>
                    <Select.Option value="belo-horizonte">Belo Horizonte</Select.Option>
                    <Select.Option value="brasilia">Brasília</Select.Option>
                  </Select>
                </Col>
                
                <Col xs={12} sm={6} md={4}>
                  <Select
                    placeholder="Status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    suffixIcon={<ChevronDown size={16} />}
                    className={styles.filterSelect}
                  >
                    <Select.Option value="">Todos</Select.Option>
                    <Select.Option value="vencida">Vencida</Select.Option>
                    <Select.Option value="vence-hoje">Vence hoje</Select.Option>
                    <Select.Option value="em-dia">Em dia</Select.Option>
                    <Select.Option value="concluida">Concluída</Select.Option>
                  </Select>
                </Col>
              </Row>
            </div>

            <div className={styles.tasksSection}>
              <div className={styles.tasksHeader}>
                <Title level={3} className={styles.tasksTitle}>
                  Tarefas para {selectedDate.format('DD/MM/YYYY')} ({getTasksForDate(selectedDate).length})
                </Title>
                <Text className={styles.viewAllTasks}>
                  <Eye size={16} /> Ver todas as tarefas
                </Text>
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
                      <div className={styles.taskContent}>
                        <Checkbox
                          checked={task.completed}
                          onChange={() => handleTaskToggle(task.id)}
                          className={styles.taskCheckbox}
                        />
                        
                        <div className={styles.taskInfo}>
                          <Title 
                            level={5} 
                            className={`${styles.taskTitle} ${task.completed ? styles.completedText : ''}`}
                          >
                            {task.title}
                          </Title>
                          
                          <Text 
                            className={`${styles.taskDescription} ${task.completed ? styles.completedText : ''}`}
                          >
                            {task.description}
                          </Text>
                          
                          <div className={styles.taskDetails}>
                            <Space direction="vertical" size="small" className={styles.detailItem}>
                              <Space>
                                <CalendarIcon size={14} />
                                <Text 
                                  type="secondary" 
                                  className={task.completed ? styles.completedText : ''}
                                >
                                  {task.date}
                                </Text>
                              </Space>
                              
                              <Space>
                                <Building size={14} />
                                <Text 
                                  type="secondary" 
                                  className={task.completed ? styles.completedText : ''}
                                >
                                  {task.city}
                                </Text>
                              </Space>
                              
                              <Space>
                                <Clock size={14} />
                                <Text 
                                  type="secondary" 
                                  className={task.completed ? styles.completedText : ''}
                                >
                                  {task.category}
                                </Text>
                              </Space>
                              
                              {task.completed && task.completedDate && (
                                <Space>
                                  <CheckCircle size={14} />
                                  <Text 
                                    type="secondary" 
                                    className={styles.completedText}
                                  >
                                    Concluída em {task.completedDate}
                                  </Text>
                                </Space>
                              )}
                            </Space>
                          </div>
                        </div>
                        
                        <Tag 
                          color={statusConfig.color} 
                          icon={statusConfig.icon}
                          className={styles.statusTag}
                        >
                          {statusConfig.text}
                        </Tag>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
} 
'use client';

import React, { useState } from 'react';
import styles from './contratos.module.scss';
import { ArrowDownToLine, Calendar, Check, ChevronDown, Clock, Eye, FileText, Plus, Search, User, X } from 'lucide-react';

interface Contract {
  id: string;
  title: string;
  company: string;
  status: 'assinado' | 'pendente' | 'rascunho' | 'cancelado' | 'expirado' | 'finalizado';
  type: string;
  value: number;
  createdDate: string;
  signedDate?: string;
  d4signId: string;
  signatories: number;
  signatoryInitials: string[];
}

const mockContracts: Contract[] = [
  {
    id: '1',
    title: 'Contrato de Prestação de Serviços - Empresa ABC',
    company: 'Empresa ABC Ltda',
    status: 'assinado',
    type: 'Prestação de Serviços',
    value: 150000,
    createdDate: '14/01/2024',
    signedDate: '19/01/2024',
    d4signId: 'd4s_abc123',
    signatories: 2,
    signatoryInitials: ['J', 'M']
  },
  {
    id: '2',
    title: 'Contrato de Terceirização - XYZ Corp',
    company: 'XYZ Corporation',
    status: 'pendente',
    type: 'Terceirização',
    value: 320000,
    createdDate: '09/02/2024',
    d4signId: 'd4s_xyz456',
    signatories: 2,
    signatoryInitials: ['C', 'A']
  },
  {
    id: '3',
    title: 'Contrato de Consultoria - Tech Solutions',
    company: 'Tech Solutions Ltda',
    status: 'rascunho',
    type: 'Consultoria',
    value: 85000,
    createdDate: '19/02/2024',
    d4signId: 'd4s_tech789',
    signatories: 1,
    signatoryInitials: ['R']
  },
  {
    id: '4',
    title: 'Contrato de Compra e Venda - ABC S.A.',
    company: 'ABC S.A.',
    status: 'cancelado',
    type: 'Compra e Venda',
    value: 100000,
    createdDate: '20/02/2024',
    d4signId: 'd4s_abc789',
    signatories: 2,
    signatoryInitials: ['A', 'B']
  },
  {
    id: '5',
    title: 'Contrato de Compra e Venda - ABC S.A.',
    company: 'ABC S.A.',
    status: 'expirado',
    type: 'Compra e Venda',
    value: 100000,
    createdDate: '20/02/2024',
    d4signId: 'd4s_abc789',
    signatories: 2,
    signatoryInitials: ['A', 'B']
  },
  {
    id: '6',
    title: 'Contrato de Compra e Venda - ABC S.A.',
    company: 'ABC S.A.',
    status: 'finalizado',
    type: 'Compra e Venda',
    value: 100000,
    createdDate: '20/02/2024',
    d4signId: 'd4s_abc789',
    signatories: 2,
    signatoryInitials: ['A', 'B']
  }
];

const ContratosPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const totalContracts = mockContracts.length;
  const signedContracts = mockContracts.filter(c => c.status === 'assinado').length;
  const pendingContracts = mockContracts.filter(c => c.status === 'pendente').length;
  const totalValue = mockContracts.reduce((sum, c) => sum + c.value, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assinado': return styles.statusSigned;
      case 'pendente': return styles.statusPending;
      case 'rascunho': return styles.statusDraft;
      case 'cancelado': return styles.statusCancelled;
      case 'expirado': return styles.statusExpired;
      case 'finalizado': return styles.statusFinished;
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assinado': return 'Assinado';
      case 'pendente': return 'Aguardando Assinatura';
      case 'rascunho': return 'Rascunho';
      case 'cancelado': return 'Cancelado';
      case 'expirado': return 'Expirado';
      case 'finalizado': return 'Finalizado';
      default: return status;
    }
  };

  return (
    <div className={styles.container}>
      <h1>Contratos</h1>
      <p className={styles.subtitle}>Gerencie seus contratos de forma eficiente e organize seus documentos.</p>
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
            <h3>Total de Contratos</h3>
            <span className={styles.summaryValue}>{totalContracts}</span>
        </div>

        <div className={styles.summaryCard}>
            <h3>Contratos Assinados</h3>
            <span className={styles.summaryValue}>{signedContracts}</span>
        </div>

        <div className={styles.summaryCard}>
            <h3>Aguardando Assinatura</h3>
            <span className={styles.summaryValue}>{pendingContracts}</span>
        </div>

        <div className={styles.summaryCard}>
            <h3>Valor Total</h3>
            <span className={`${styles.summaryValue} ${styles.totalValue}`}>
              {formatCurrency(totalValue)}
            </span>
        </div>
      </div>

      <div className={styles.mainHeader}>
          <h1>Gestão de Contratos</h1>
        <div className={styles.headerActions}>
          <button className={styles.newContractButton}>
            <Plus size={18}/>
            Novo Contrato
          </button>
        </div>
      </div>

      <div className={styles.searchFilterBar}>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon}/>
          <input
            type="text"
            placeholder="Buscar contratos, clientes ou tipos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${activeFilter === 'todos' ? styles.active : ''}`}
            onClick={() => setActiveFilter('todos')}
          >
            <Eye size={18}/>
            Todos ({totalContracts})
          </button>
          <button
            className={`${styles.filterTab} ${activeFilter === 'rascunhos' ? styles.active : ''}`}
            onClick={() => setActiveFilter('rascunhos')}
          >
            <FileText size={18}/>
            Rascunhos (1)
          </button>
          <button
            className={`${styles.filterTab} ${activeFilter === 'pendentes' ? styles.active : ''}`}
            onClick={() => setActiveFilter('pendentes')}
          >
            <Clock size={18}/>
            Pendentes (2)
          </button>
          <button
            className={`${styles.filterTab} ${activeFilter === 'assinados' ? styles.active : ''}`}
            onClick={() => setActiveFilter('assinados')}
          >
            <Check size={18}/>
            Assinados (2)
          </button>
          <button
            className={`${styles.filterTab} ${activeFilter === 'cancelados' ? styles.active : ''}`}
            onClick={() => setActiveFilter('cancelados')}
          >
            <X size={18}/>
            Cancelados (1)
          </button>
        </div>

        <div className={styles.statusDropdown}>
          Todos os status
          <ChevronDown size={18}/>
        </div>
      </div>

      <div className={styles.contractsGrid}>
        {mockContracts.map((contract) => (
          <div key={contract.id} className={`${styles.contractCard} ${getStatusColor(contract.status)}`}>
            <div className={styles.cardHeader}>
              <ArrowDownToLine size={18}/>
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.contractTitle}>{contract.title}</h3>
              <p className={styles.companyName}>{contract.company}</p>
              
              <div className={styles.statusTags}>
                <span className={`${styles.statusTag} ${getStatusColor(contract.status)}`}>
                  {getStatusText(contract.status)}
                </span>
                <span className={styles.typeTag}>{contract.type}</span>
              </div>

              <div className={styles.contractValue}>
                {formatCurrency(contract.value)}
              </div>

              <div className={styles.contractDates}>
                <div className={styles.dateItem}>
                  <Calendar size={18}/>
                  Criado em {contract.createdDate}
                </div>
                {contract.signedDate && (
                  <div className={`${styles.dateItem} ${styles.signedDate}`}>
                    <Calendar size={18}/>
                    Assinado em {contract.signedDate}
                  </div>
                )}
              </div>

              <div className={styles.d4signId}>
                D4Sign: {contract.d4signId}
              </div>

              <div className={styles.signatories}>
                <User size={18}/>
                {contract.signatories} {contract.signatories === 1 ? 'signatário' : 'signatários'}
              </div>

              <div className={styles.signatoryInitials}>
                {contract.signatoryInitials.map((initial, index) => (
                  <div key={index} className={`${styles.initial} ${contract.status === 'assinado' ? styles.signedInitial : styles.pendingInitial}`}>
                    {initial}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContratosPage;

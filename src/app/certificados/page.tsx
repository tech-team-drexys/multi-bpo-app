'use client';
import { ChevronLeft, ChevronRight, Plus, Download } from 'lucide-react';
import styles from './page.module.scss';
import { PieChart } from '@mui/x-charts';
import { useState, useEffect } from 'react';
import { getCertificados } from '@/services/api';
import { Button } from '@mui/material';
import CertificateModal from '@/components/modal/CertificateModal';

interface Certificado {
  cliente: string;
  id: string;
  statusCertificado: string;
  vencimento: string;
}

interface PaginationResponse {
  data: Certificado[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const Certificados = () => {
  const [allCertificados, setAllCertificados] = useState<Certificado[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const fetchCertificados = async () => {
    setLoading(true);
    try {
      const response = await getCertificados(1);
      setAllCertificados(response.data.data);
    } catch (error) {
      setAllCertificados([
        {
          cliente: "28 680 902 JOSELMA MARIA DE OLIVEIRA MELO",
          id: "28680902000135",
          statusCertificado: "No Prazo",
          vencimento: "10/02/2026"
        },
        {
          cliente: "33 845 062 PAULO FERREIRA BORGES RIBEIRO",
          id: "33845062000153",
          statusCertificado: "No Prazo",
          vencimento: "22/11/2025"
        },
        {
          cliente: "ALAN DOS SANTOS RAMOS",
          id: "40628581858",
          statusCertificado: "Vencido",
          vencimento: "31/01/2025"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificados();
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const totalPages = Math.ceil(allCertificados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCertificados = allCertificados.slice(startIndex, endIndex);

  const totalCertificados = allCertificados.length;
  const noPrazo = allCertificados.filter(c => c.statusCertificado === "No Prazo").length;
  const vencendo = allCertificados.filter(c => {
    const vencimento = new Date(c.vencimento.split('/').reverse().join('-'));
    const hoje = new Date();
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }).length;
  const vencidos = allCertificados.filter(c => c.statusCertificado === "Vencido").length;

  const handleAddCertificate = (certificateData: { file: File; title: string; description: string }) => {
    fetchCertificados();
  };

  return (
    <div className={styles.page}>
      <div className={styles.topSection}>
        <div className={styles.statsContent}>
          <div className={styles.statsLabel}>Certificados no prazo</div>
          <div className={styles.statsValue}>{noPrazo}</div>
          <div className={styles.statsDate}>Atualizado às 20/08/2025 17:49</div>
        </div>

        <div className={styles.statsContent}>
          <div className={styles.statsLabel}>Certificados a vencer</div>
          <div className={styles.statsValue}>{vencendo}</div>
          <div className={styles.statsDate}>19/08/2025 06:06</div>
        </div>
        <div className={styles.statsContent}>
          <div className={styles.statsLabel}>Certificados vencidos</div>
          <div className={styles.statsValue}>{vencidos}</div>
          <div className={styles.statsDate}>20/08/2025 17:49</div>
        </div>

        <div className={styles.statsContent}>
          <div className={styles.statsLabel}>Total de certificados</div>
          <div className={styles.statsValue}>{totalCertificados}</div>
          <div className={styles.statsDate}>20/08/2025 17:49</div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.rightSection}>
          <div className={styles.reportsCard}>
            <div className={styles.reportsHeader}>
              <h1>Certificados Digitais</h1>
              <Button 
                variant="contained" 
                className={styles.reportsActionButton}
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={16} />
                Novo certificado
              </Button>
            </div>

            <div className={styles.tabContent}>
              <div className={styles.clientsContent}>
                <div className={styles.searchBar}>
                  <input
                    type="text"
                    placeholder="Pesquisar"
                    className={styles.searchInput}
                  />
                </div>

                <div className={styles.tableContainer}>

                  <table className={styles.certificatesTable}>
                    <thead>
                      <tr>
                        <th>Clientes</th>
                        <th>Status do Certificado</th>
                        <th>Vencimento</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className={styles.loadingRow}>
                            Carregando...
                          </td>
                        </tr>
                      ) : (
                        currentCertificados.map((certificado, index) => (
                          <tr
                            key={index}
                            className={`${styles.tableRow} ${certificado.statusCertificado === "Vencido" ? styles.expiredRow : ""
                              }`}
                          >
                            <td className={styles.clientName}>
                              <div className={styles.certificateName}>{certificado.cliente}</div>
                              <div className={styles.certificateId}>{certificado.id}</div>
                            </td>
                            <td>
                              <span className={`${styles.statusPill} ${certificado.statusCertificado === "No Prazo" ? styles.validPill : styles.expiredPill
                                }`}>
                                {certificado.statusCertificado}
                              </span>
                            </td>
                            <td>{certificado.vencimento}</td>
                            <td>
                              <Button variant="text" className={styles.reportsActionButton}>
                                <Download size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className={styles.paginationInfo}>
                  Mostrando {startIndex + 1} a {Math.min(endIndex, totalCertificados)} de {totalCertificados} certificados
                </div>

                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={styles.paginationButton}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                      Anterior
                    </button>

                    <div className={styles.paginationNumbers}>
                      {(() => {
                        const maxVisiblePages = 5;
                        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                        if (endPage - startPage < maxVisiblePages - 1) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }

                        const pages = [];

                        if (startPage > 1) {
                          pages.push(
                            <button
                              key={1}
                              className={`${styles.paginationNumber} ${1 === currentPage ? styles.active : ''}`}
                              onClick={() => handlePageChange(1)}
                            >
                              1
                            </button>
                          );
                          if (startPage > 2) {
                            pages.push(<span key="start-ellipsis" className={styles.ellipsis}>...</span>);
                          }
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button
                              key={i}
                              className={`${styles.paginationNumber} ${i === currentPage ? styles.active : ''}`}
                              onClick={() => handlePageChange(i)}
                            >
                              {i}
                            </button>
                          );
                        }

                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(<span key="end-ellipsis" className={styles.ellipsis}>...</span>);
                          }
                          pages.push(
                            <button
                              key={totalPages}
                              className={`${styles.paginationNumber} ${totalPages === currentPage ? styles.active : ''}`}
                              onClick={() => handlePageChange(totalPages)}
                            >
                              {totalPages}
                            </button>
                          );
                        }

                        return pages;
                      })()}
                    </div>

                    <button
                      className={styles.paginationButton}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Próximo
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.leftSection}>
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>Certificados</div>
            <div className={styles.chartValue}>32</div>
            <div className={styles.chartContainer}>
              <PieChart
                series={[
                  {
                    startAngle: -90,
                    endAngle: 90,
                    paddingAngle: 5,
                    innerRadius: 60,
                    outerRadius: 80,
                    cy: '75%',
                    data: [
                      { id: 0, value: 19, color: '#10b981' },
                      { id: 1, value: 2, color: '#f59e0b' },
                      { id: 2, value: 11, color: '#ef4444' },
                    ],
                  },
                ]}
                width={200}
                height={150}
                hideLegend
              />
            </div>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#10b981' }}></div>
                <span>No prazo</span>
                <span>19</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#f59e0b' }}></div>
                <span>Á Vencer</span>
                <span>2</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#ef4444' }}></div>
                <span>Vencidos</span>
                <span>11</span>
              </div>
              <div className={styles.totalCerts}>
                <span>Total de Certificados</span>
                <span>32</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCertificate}
      />
    </div>
  );
};

export default Certificados;
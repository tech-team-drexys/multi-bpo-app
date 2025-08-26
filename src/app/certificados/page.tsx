import { ArrowDownToLine, ChevronDown, Plus, Search, Settings } from 'lucide-react';
import styles from './page.module.scss';

const Certificados = () => {
  const certificados = [
    {
      cliente: "JOSELMA MARIA DE OLIVEIRA MELO",
      certCadastrado: "No Prazo",
      statusCertificado: "Sucesso",
      configSaida: "Sim",
      statusConfigSaida: "Sucesso",
      vencimento: "10/02/2026"
    },
    {
      cliente: "PAULO FERREIRA BORGES RIBEIRO",
      certCadastrado: "Vencido",
      statusCertificado: "Vencido",
      configSaida: "Não",
      statusConfigSaida: "-",
      vencimento: "22/11/2025"
    },
    {
      cliente: "ALAN DOS SANTOS RAMOS",
      certCadastrado: "No Prazo",
      statusCertificado: "Sucesso",
      configSaida: "Sim",
      statusConfigSaida: "Sucesso",
      vencimento: "31/01/2025"
    },
    {
      cliente: "ANDREI LUIZ LOPES DA SILVA",
      certCadastrado: "No Prazo",
      statusCertificado: "Sucesso",
      configSaida: "Sim",
      statusConfigSaida: "Sucesso",
      vencimento: "15/07/2025"
    },
    {
      cliente: "ANK MODA FEMININA LTDA",
      certCadastrado: "No Prazo",
      statusCertificado: "Sucesso",
      configSaida: "Sim",
      statusConfigSaida: "Sucesso",
      vencimento: "19/03/2026"
    },
    {
      cliente: "ATOM SHOP LTDA",
      certCadastrado: "Vencido",
      statusCertificado: "Vencido",
      configSaida: "Não",
      statusConfigSaida: "-",
      vencimento: "18/12/2025"
    },
    {
      cliente: "CARLA DOS SANTOS POGGI CARDOSO",
      certCadastrado: "No Prazo",
      statusCertificado: "Sucesso",
      configSaida: "Sim",
      statusConfigSaida: "Sucesso",
      vencimento: "25/06/2025"
    }
  ];

  const totalCertificados = certificados.length;
  const noPrazo = certificados.filter(c => c.certCadastrado === "No Prazo").length;
  const vencendo = certificados.filter(c => {
    const vencimento = new Date(c.vencimento.split('/').reverse().join('-'));
    const hoje = new Date();
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }).length;
  const vencidos = certificados.filter(c => c.certCadastrado === "Vencido").length;

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Total</div>
            <div className={styles.summaryValue}>{totalCertificados}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Válidos</div>
            <div className={`${styles.summaryValue} ${styles.valid}`}>{noPrazo}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Vencendo</div>
            <div className={`${styles.summaryValue} ${styles.expiring}`}>{vencendo}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Vencidos</div>
            <div className={`${styles.summaryValue} ${styles.expired}`}>{vencidos}</div>
          </div>
        </div>

        <h1 className={styles.mainTitle}>Certificados Digitais</h1>

        <div className={styles.actionBar}>
          <div className={styles.searchContainer}>
            <div className={styles.searchIcon}>
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar por nome ou assunto..." 
              className={styles.searchInput}
            />
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.exportButton}>
              <span className={styles.downloadIcon}>
                <ArrowDownToLine size={16} />
              </span>
              Exportar
            </button>
            <button className={styles.newCertificateButton}>
              <span className={styles.plusIcon}>
                <Plus size={16} />
              </span>
              Novo Certificado
            </button>
          </div>
          <div className={styles.filterContainer}>
            <select className={styles.filterSelect}>
              <option>Todos os status</option>
              <option>No Prazo</option>
              <option>Vencendo</option>
              <option>Vencido</option>
            </select>
            <div className={styles.filterArrow}>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.certificatesTable}>
            <thead>
              <tr>
                <th>Clientes</th>
                <th>Cert. Cadastrado</th>
                <th>Status do Certificado</th>
                <th>Config. de Saída</th>
                <th>Status da Config. de Saída</th>
                <th>Vencimento</th>
              </tr>
            </thead>
            <tbody>
              {certificados.map((certificado, index) => (
                <tr 
                  key={index} 
                  className={`${styles.tableRow} ${
                    certificado.certCadastrado === "Vencido" ? styles.expiredRow : ""
                  }`}
                >
                  <td className={styles.clientName}>
                    <div className={styles.certificateName}>{certificado.cliente}</div>
                    <div className={styles.certificateSubline}>
                      CN={certificado.cliente}, O=Multi BPO
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusPill} ${
                      certificado.certCadastrado === "No Prazo" ? styles.validPill : 
                      certificado.certCadastrado === "Vencido" ? styles.expiredPill : styles.expiringPill
                    }`}>
                      {certificado.certCadastrado}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusPill} ${
                      certificado.statusCertificado === "Sucesso" ? styles.validPill : styles.expiredPill
                    }`}>
                      {certificado.statusCertificado}
                    </span>
                  </td>
                  <td>{certificado.configSaida}</td>
                  <td>
                    {certificado.statusConfigSaida !== "-" ? (
                      <span className={`${styles.statusPill} ${styles.validPill}`}>
                        {certificado.statusConfigSaida}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{certificado.vencimento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Certificados;
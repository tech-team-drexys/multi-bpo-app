'use client';
import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import styles from './CertificateModal.module.scss';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (certificateData: any) => void;
}

const CertificateModal = ({ isOpen, onClose, onSubmit }: CertificateModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    cliente: '',
    cnpj: '',
    vencimento: ''
  });

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.pfx') || file.name.endsWith('.p12'))) {
      setSelectedFile(file);
    } else {
      alert('Selecione um arquivo .pfx ou .p12');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert('Selecione um arquivo de certificado');
      return;
    }

    onSubmit({
      ...formData,
      arquivo: selectedFile
    });

    // Reset form
    setSelectedFile(null);
    setFormData({
      cliente: '',
      cnpj: '',
      vencimento: ''
    });
    onClose();
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setFormData({
      cliente: '',
      cnpj: '',
      vencimento: ''
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Novo Certificado Digital</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.uploadSection}>
            <div className={styles.uploadIcon}>
              <Upload size={32} />
            </div>
            <h3>Importar Certificado PFX</h3>
            <p>Selecione um arquivo .pfx ou .p12 para importar automaticamente os dados</p>
            
            <input
              type="file"
              accept=".pfx,.p12"
              onChange={handleFileSelect}
              className={styles.fileInput}
              id="certificateFile"
            />
            <label htmlFor="certificateFile" className={styles.selectFileButton}>
              Selecionar Arquivo
            </label>

            {selectedFile && (
              <div className={styles.selectedFile}>
                <span>📄 {selectedFile.name}</span>
              </div>
            )}
          </div>

          <div className={styles.formSection}>
            <div className={styles.inputGroup}>
              <label>Cliente</label>
              <input
                type="text"
                value={formData.cliente}
                onChange={(e) => handleInputChange('cliente', e.target.value)}
                placeholder="Nome do cliente"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>CNPJ/CPF</label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => handleInputChange('cnpj', e.target.value)}
                placeholder="00.000.000/0000-00"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Data de Vencimento</label>
              <input
                type="date"
                value={formData.vencimento}
                onChange={(e) => handleInputChange('vencimento', e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancelar
          </button>
          <button className={styles.submitButton} onClick={handleSubmit}>
            Adicionar Certificado
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;

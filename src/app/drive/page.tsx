'use client';
import { useState } from 'react';
import { Input, Button, Popover, Progress } from 'antd';
import { Search, Upload, MoreVertical, FileText, FileImage, FileVideo, FileAudio, FileArchive, FileSpreadsheet, Presentation } from 'lucide-react';
import styles from "./page.module.scss";

interface FileItem {
  id: string;
  name: string;
  size: string;
  date: string;
  modified: string;
  type: 'pdf' | 'pptx' | 'jpg' | 'mp4' | 'xlsx' | 'mp3' | 'docx' | 'zip';
}

const files: FileItem[] = [
  { id: '1', name: 'Relatório Mensal.pdf', size: '2.4 MB', date: '15/01/2024', modified: '10:30', type: 'pdf' },
  { id: '2', name: 'Apresentação Cliente.pptx', size: '5.7 MB', date: '14/01/2024', modified: '16:45', type: 'pptx' },
  { id: '3', name: 'Banner Campanha.jpg', size: '1.2 MB', date: '13/01/2024', modified: '14:20', type: 'jpg' },
  { id: '4', name: 'Video Institucional.mp4', size: '45.8 MB', date: '12/01/2024', modified: '09:15', type: 'mp4' },
  { id: '5', name: 'Planilha Vendas.xlsx', size: '892 KB', date: '11/01/2024', modified: '11:30', type: 'xlsx' },
  { id: '6', name: 'Audio Reunião.mp3', size: '12.3 MB', date: '10/01/2024', modified: '15:45', type: 'mp3' },
  { id: '7', name: 'Contrato Fornecedor.docx', size: '456 KB', date: '09/01/2024', modified: '13:20', type: 'docx' },
  { id: '8', name: 'Fotos Evento.zip', size: '78.2 MB', date: '08/01/2024', modified: '17:10', type: 'zip' },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
    case 'docx':
      return <FileText size={20} />;
    case 'pptx':
      return <Presentation size={20} />;
    case 'jpg':
      return <FileImage size={20} />;
    case 'mp4':
      return <FileVideo size={20} />;
    case 'xlsx':
      return <FileSpreadsheet size={20} />;
    case 'mp3':
      return <FileAudio size={20} />;
    case 'zip':
      return <FileArchive size={20} />;
    default:
      return <FileText size={20} />;
  }
};

export default function Drive() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (fileId: string) => {
    console.log('Editar arquivo:', fileId);
    // Implementar lógica de edição
  };

  const handleDownload = (fileId: string) => {
    console.log('Baixar arquivo:', fileId);
    // Implementar lógica de download
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popoverContent = (fileId: string) => (
    <div className={styles.popoverContent}>
      <button onClick={() => handleEdit(fileId)} className={styles.popoverOption}>
        Editar
      </button>
      <button onClick={() => handleDownload(fileId)} className={styles.popoverOption}>
        Baixar documento
      </button>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Drive</h1>
          <p className={styles.subtitle}>Conteúdo do Drive será exibido aqui</p>
        </div>
        <div className={styles.headerActions}>
          <Input
            placeholder="Buscar documentos..."
            prefix={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <Button type="primary" icon={<Upload size={16} />} className={styles.uploadButton}>
            Upload de arquivo
          </Button>
        </div>
      </div>

      <div className={styles.filesGrid}>
        {filteredFiles.map((file) => (
          <div key={file.id} className={styles.fileCard}>
            <div className={styles.fileHeader}>
              <div className={styles.fileIcon}>
                {getFileIcon(file.type)}
              </div>
              <Popover
                content={popoverContent(file.id)}
                trigger="click"
                placement="bottomRight"
                overlayClassName={styles.popover}
              >
                <button className={styles.moreButton}>
                  <MoreVertical size={16} />
                </button>
              </Popover>
            </div>
            <div className={styles.fileInfo}>
              <h3 className={styles.fileName}>{file.name}</h3>
              <div className={styles.fileDetails}>
                <p>Tamanho: {file.size}</p>
                <p>Data: {file.date}</p>
                <p>Modificado: {file.modified}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.storageSection}>
        <h3 className={styles.storageTitle}>Armazenamento</h3>
        <div className={styles.storageInfo}>
          <span>Usado</span>
          <Progress 
            percent={14.72} 
            showInfo={false} 
            strokeColor="#2463eb"
            className={styles.progressBar}
          />
          <span className={styles.storageText}>147.2 GB de 1 TB</span>
        </div>
      </div>
    </div>
  );
}
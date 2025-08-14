'use client';
import { useState } from 'react';
import { Input, Button, Progress, Breadcrumb } from 'antd';
import { Search, Upload, Folder, FileText, FileImage, FileVideo, FileAudio, FileArchive, FileSpreadsheet, Presentation, Home, ChevronRight, Download } from 'lucide-react';
import styles from "./page.module.scss";
import { DriveItemType } from '@/enums/index ';

interface FileItem {
  id: string;
  name: string;
  size: string;
  date: string;
  modified: string;
  type: 'pdf' | 'pptx' | 'jpg' | 'mp4' | 'xlsx' | 'mp3' | 'docx' | 'zip';
}

interface DirectoryItem {
  id: string;
  name: string;
  type: DriveItemType;
  date: string;
  modified: string;
}

type DriveItem = FileItem | DirectoryItem;

const mockData = {
  months: [
    { id: '1', name: 'Janeiro 2024', type: DriveItemType.MONTH, date: '31/01/2024', modified: '18:30' },
    { id: '2', name: 'Fevereiro 2024', type: DriveItemType.MONTH, date: '29/02/2024', modified: '19:15' },
    { id: '3', name: 'Março 2024', type: DriveItemType.MONTH, date: '31/03/2024', modified: '20:00' },
  ],
  clients: {
    '1': [
      { id: 'c1', name: 'Empresa ABC Ltda', type: DriveItemType.CLIENT, date: '31/01/2024', modified: '18:30' },
      { id: 'c2', name: 'Comércio XYZ S.A.', type: DriveItemType.CLIENT, date: '30/01/2024', modified: '17:45' },
      { id: 'c3', name: 'Indústria 123 Ltda', type: DriveItemType.CLIENT, date: '29/01/2024', modified: '16:20' },
    ],
    '2': [
      { id: 'c4', name: 'Loja Virtual Pro', type: DriveItemType.CLIENT, date: '29/02/2024', modified: '19:15' },
      { id: 'c5', name: 'Consultoria Tech', type: DriveItemType.CLIENT, date: '28/02/2024', modified: '18:30' },
    ],
    '3': [
      { id: 'c6', name: 'Startup Inovação', type: DriveItemType.CLIENT, date: '31/03/2024', modified: '20:00' },
    ]
  },
  services: {
    'c1': [
      { id: 's1', name: 'Notas Fiscais', type: DriveItemType.SERVICE, date: '31/01/2024', modified: '18:30' },
      { id: 's2', name: 'Planilhas', type: DriveItemType.SERVICE, date: '31/01/2024', modified: '18:30' },
      { id: 's3', name: 'Contratos', type: DriveItemType.SERVICE, date: '31/01/2024', modified: '18:30' },
    ],
    'c2': [
      { id: 's4', name: 'Relatórios', type: DriveItemType.SERVICE, date: '30/01/2024', modified: '17:45' },
      { id: 's5', name: 'Documentos', type: DriveItemType.SERVICE, date: '30/01/2024', modified: '17:45' },
    ],
    'c3': [
      { id: 's6', name: 'Faturamento', type: DriveItemType.SERVICE, date: '29/01/2024', modified: '16:20' },
    ]
  },
  files: {
    's1': [
      { id: 'f1', name: 'NF-001-2024.pdf', size: '2.4 MB', date: '15/01/2024', modified: '10:30', type: 'pdf' as const },
      { id: 'f2', name: 'NF-002-2024.pdf', size: '1.8 MB', date: '22/01/2024', modified: '14:15', type: 'pdf' as const },
    ],
    's2': [
      { id: 'f3', name: 'Vendas-Q1-2024.xlsx', size: '892 KB', date: '11/01/2024', modified: '11:30', type: 'xlsx' as const },
      { id: 'f4', name: 'Controle-Estoque.xlsx', size: '1.2 MB', date: '13/01/2024', modified: '14:20', type: 'xlsx' as const },
    ],
    's3': [
      { id: 'f5', name: 'Contrato-Fornecedor.docx', size: '456 KB', date: '09/01/2024', modified: '13:20', type: 'docx' as const },
    ]
  }
} as const;

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
  const [currentPath, setCurrentPath] = useState<Array<{id: string, name: string, type: string}>>([]);
  const [currentLevel, setCurrentLevel] = useState<DriveItemType>(DriveItemType.MONTH);

  const handleDirectoryClick = (item: DirectoryItem) => {
    if (item.type === DriveItemType.MONTH) {
      setCurrentPath([{ id: item.id, name: item.name, type: item.type }]);
      setCurrentLevel(DriveItemType.CLIENT);
    } else if (item.type === DriveItemType.CLIENT) {
      setCurrentPath(prev => [...prev, { id: item.id, name: item.name, type: item.type }]);
      setCurrentLevel(DriveItemType.SERVICE);
    } else if (item.type === DriveItemType.SERVICE) {
      setCurrentPath(prev => [...prev, { id: item.id, name: item.name, type: item.type }]);
      setCurrentLevel(DriveItemType.FILE);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setCurrentPath([]);
      setCurrentLevel(DriveItemType.MONTH);
    } else if (index === 1) {
      setCurrentPath(prev => prev.slice(0, 1));
      setCurrentLevel(DriveItemType.CLIENT);
    } else if (index === 2) {
      setCurrentPath(prev => prev.slice(0, 2));
      setCurrentLevel(DriveItemType.SERVICE);
    }
  };

  const getCurrentItems = () => {
    if (currentLevel === DriveItemType.MONTH) {
      return mockData.months;
    } else if (currentLevel === DriveItemType.CLIENT) {
      const monthId = currentPath[0]?.id;
      return monthId ? mockData.clients[monthId as keyof typeof mockData.clients] || [] : [];
    } else if (currentLevel === DriveItemType.SERVICE) {
      const clientId = currentPath[1]?.id;
      return clientId ? mockData.services[clientId as keyof typeof mockData.services] || [] : [];
    } else if (currentLevel === DriveItemType.FILE) {
      const serviceId = currentPath[2]?.id;
      return serviceId ? mockData.files[serviceId as keyof typeof mockData.files] || [] : [];
    }
    return [];
  };

  const getBreadcrumbItems = () => {
    const items = [
      {
        title: (
          <button className={styles.breadcrumbHome} onClick={() => handleBreadcrumbClick(0)}>
            <Home size={16} />
            Drive
          </button>
        )
      }
    ];

    currentPath.forEach((item, index) => {
      items.push({
        title: (
          <button 
            className={styles.breadcrumbItem} 
            onClick={() => handleBreadcrumbClick(index + 1)}
          >
            {item.name}
          </button>
        )
      });
    });

    return items;
  };

  const handleDownload = (file: FileItem) => {
    console.log('Baixar arquivo:', file.name);
    const link = document.createElement('a');
    link.href = `#download-${file.id}`;
    link.download = file.name;
    link.click();
  };

  const renderContent = () => {
    const items = getCurrentItems();

    if (currentLevel === DriveItemType.FILE) {
      return (
        <div className={styles.filesGrid}>
          {items.map((item: DriveItem) => {
            if ('size' in item) {
              const file = item as FileItem;
              return (
                <div key={file.id} className={styles.fileCard}>
                  <div className={styles.fileHeader}>
                    <div className={styles.fileIcon}>
                      {getFileIcon(file.type)}
                    </div>
                    <button 
                      className={styles.downloadButton}
                      onClick={() => handleDownload(file)}
                      title="Baixar arquivo"
                    >
                      <Download size={16} />
                    </button>
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
              );
            }
            return null;
          })}
        </div>
      );
    }

    return (
      <div className={styles.directoriesGrid}>
        {items.map((item: DriveItem) => {
          if (!('size' in item)) {
            const directory = item as DirectoryItem;
            return (
              <div 
                key={directory.id} 
                className={styles.directoryCard}
                onClick={() => handleDirectoryClick(directory)}
              >
                <div className={styles.directoryIcon}>
                  <Folder size={24} />
                </div>
                <div className={styles.directoryInfo}>
                  <h3 className={styles.directoryName}>{directory.name}</h3>
                  <p className={styles.directoryType}>
                    {directory.type === DriveItemType.MONTH ? 'Mês' : 
                     directory.type === DriveItemType.CLIENT ? 'Cliente' : 'Serviço'}
                  </p>
                  <div className={styles.directoryDetails}>
                    <p>Data: {directory.date}</p>
                    <p>Modificado: {directory.modified}</p>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Drive</h1>
            <p className={styles.subtitle}>Documentos organizados por mês, cliente e categoria</p>
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

        {currentPath.length > 0 && (
          <div className={styles.breadcrumbSection}>
            <Breadcrumb 
              items={getBreadcrumbItems()}
              separator={<ChevronRight size={16} />}
              className={styles.breadcrumb}
            />
          </div>
        )}

        {renderContent()}

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
    </div>
  );
}
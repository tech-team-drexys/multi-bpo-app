import React from 'react';
import styles from './galeria.module.scss';

const images = [
  {
    id: 1,
    url: '/images/image1.jpg',
    title: 'Imagem 1',
    description: 'Descrição da imagem 1'
  },
  {
    id: 2,
    url: '/images/image2.jpg',
    title: 'Imagem 2',
    description: 'Descrição da imagem 2'
  },
  {
    id: 3,
    url: '/images/image3.jpg',
    title: 'Imagem 3',
    description: 'Descrição da imagem 3'
  },
  {
    id: 4,
    url: '/images/image3.jpg',
    title: 'Imagem 3',
    description: 'Descrição da imagem 3'
  },
];

export const Galeria = () => {
  return (
    <div className={styles.galeriaContainer}>
      <div className={styles.galeriaContent}>
        <h1>Galeria</h1>
        <div className={styles.galeriaGrid}>
          {images.map((image, key) => (
            <div className={styles.galeriaItem} key={key}>
              <div className={styles.galeriaPlaceholder}>
                <span>{image.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
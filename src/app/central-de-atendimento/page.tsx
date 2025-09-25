'use client';
import styles from "./page.module.scss";

export default function CentralDeAtendimento() {
  return (
    <div className={styles.page}>
      <h1>Central de Atendimento</h1>
      <iframe src="https://consultor.multibpo.com.br/" width="100%" height="100%"/>
    </div>
  );
} 
'use client';
import { useState } from 'react';
import { Check, X, Zap, Star, Crown, ArrowRight, ArrowLeft } from 'lucide-react';
import styles from './page.module.scss';

export default function PlansPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      subtitle: 'Ideal para pequenas empresas',
      price: billingPeriod === 'monthly' ? 29 : 290,
      period: billingPeriod === 'monthly' ? '/mês' : '/ano',
      icon: Zap,
      features: [
        'Até 50 certificados',
        '5 contratos por mês',
        'Suporte por email',
        'Armazenamento de 1GB',
        'Relatórios básicos'
      ],
      buttonText: 'Fazer Upgrade',
      popular: false,
      color: 'blue'
    },
    {
      id: 'premium',
      name: 'Premium',
      subtitle: 'Para empresas em crescimento',
      price: billingPeriod === 'monthly' ? 79 : 790,
      period: billingPeriod === 'monthly' ? '/mês' : '/ano',
      icon: Star,
      features: [
        'Certificados ilimitados',
        '50 contratos por mês',
        'Suporte prioritário',
        'Armazenamento de 10GB',
        'Relatórios avançados',
        'Integração D4Sign',
        'API de terceiros'
      ],
      buttonText: 'Fazer Upgrade',
      popular: true,
      color: 'purple'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      subtitle: 'Para grandes organizações',
      price: billingPeriod === 'monthly' ? 199 : 1990,
      period: billingPeriod === 'monthly' ? '/mês' : '/ano',
      icon: Crown,
      features: [
        'Recursos ilimitados',
        'Contratos ilimitados',
        'Suporte 24/7',
        'Armazenamento ilimitado',
        'Dashboard personalizado',
        'White label',
        'Gerente de conta dedicado',
        'SLA garantido'
      ],
      buttonText: 'Fazer Upgrade',
      popular: false,
      color: 'yellow'
    }
  ];

  const comparisonFeatures = [
    {
      name: 'Certificados',
      basic: 'Até 50',
      premium: 'Ilimitados',
      enterprise: 'Ilimitados'
    },
    {
      name: 'Contratos/mês',
      basic: '5',
      premium: '50',
      enterprise: 'Ilimitados'
    },
    {
      name: 'Armazenamento',
      basic: '1GB',
      premium: '10GB',
      enterprise: 'Ilimitado'
    },
    {
      name: 'Suporte',
      basic: 'Email',
      premium: 'Prioritário',
      enterprise: '24/7'
    },
    {
      name: 'API de terceiros',
      basic: false,
      premium: true,
      enterprise: true
    },
    {
      name: 'White label',
      basic: false,
      premium: false,
      enterprise: true
    }
  ];

  const handleUpgrade = (planId: string) => {
    console.log(`Upgrade para plano: ${planId}`);
  };

  return (
    <div className={styles.pricingPage}>
      <div className={styles.pricingHeader}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Multi BPO" />
          </div>
          <button
            className={styles.backButton}
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} /> Voltar
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Escolha o plano ideal para sua empresa</h1>
          <p className={styles.subtitle}>Gerencie seu escritório de contabilidade com mais eficiência</p>

          <div className={styles.billingToggle}>
            <button
              className={`${styles.toggleButton} ${billingPeriod === 'monthly' ? styles.active : ''}`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Mensal
            </button>
            <div className={styles.toggleButtonContainer}>
              <button
                className={`${styles.toggleButtonAnnual} ${billingPeriod === 'annual' ? styles.active : ''}`}
                onClick={() => setBillingPeriod('annual')}
              >
                Anual
              </button>
              <span className={`${styles.freeMonths} ${billingPeriod === 'annual' ? styles.active : ''}`}>2 meses grátis</span>
            </div>
          </div>
        </div>

        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <div key={plan.id} className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`}>
              {plan.popular && (
                <div className={styles.popularBadge}>Mais Popular</div>
              )}

              <div className={styles.planIcon}>
                <plan.icon className={`${styles.icon} ${styles[plan.color]}`} />
              </div>

              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.planSubtitle}>{plan.subtitle}</p>

              <div className={styles.price}>
                <span className={styles.priceValue}>R$ {plan.price}</span>
                <span className={styles.pricePeriod}>{plan.period}</span>
              </div>

              <ul className={styles.features}>
                {plan.features.map((feature, index) => (
                  <li key={index} className={styles.feature}>
                    <Check className={styles.checkIcon} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`${styles.upgradeButton} ${styles[plan.color]}`}
                onClick={() => handleUpgrade(plan.id)}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.comparisonSection}>
          <h2 className={styles.comparisonTitle}>Compare todos os recursos</h2>

          <div className={styles.comparisonTable}>
            <div className={styles.tableHeader}>
              <div className={styles.featureColumn}>Recursos</div>
              <div className={styles.planColumn}>Básico</div>
              <div className={styles.planColumn}>Premium</div>
              <div className={styles.planColumn}>Enterprise</div>
            </div>

            {comparisonFeatures.map((feature, index) => (
              <div key={index} className={styles.tableRow}>
                <div className={styles.featureColumn}>{feature.name}</div>
                <div className={styles.planColumn}>
                  {typeof feature.basic === 'boolean' ? (
                    feature.basic ? <Check className={styles.checkIcon} /> : <X className={styles.xIcon} />
                  ) : (
                    feature.basic
                  )}
                </div>
                <div className={styles.planColumn}>
                  {typeof feature.premium === 'boolean' ? (
                    feature.premium ? <Check className={styles.checkIcon} /> : <X className={styles.xIcon} />
                  ) : (
                    feature.premium
                  )}
                </div>
                <div className={styles.planColumn}>
                  {typeof feature.enterprise === 'boolean' ? (
                    feature.enterprise ? <Check className={styles.checkIcon} /> : <X className={styles.xIcon} />
                  ) : (
                    feature.enterprise
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.helpSection}>
          <p className={styles.helpQuestion}>Precisa de ajuda para escolher o plano ideal?</p>
          <button className={styles.expertButton}>
            Falar com especialista
            <ArrowRight className={styles.arrowIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}

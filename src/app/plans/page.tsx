'use client';
import { useEffect, useState } from 'react';
import { Check, X, Zap, Star, Crown, ArrowRight, ArrowLeft } from 'lucide-react';
import styles from './page.module.scss';
import { createSubscription, getPlans } from '@/services/api';
import { Alert, Snackbar } from '@mui/material';
import { formatPrice, usePlanColor } from '@/hooks';

export default function PlansPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [plans, setPlans] = useState<any[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<any[]>([]);

  // const plans = [
  //   {
  //     id: 0,
  //     name: 'Básico',
  //     subtitle: 'Ideal para pequenas empresas',
  //     price: billingPeriod === 'monthly' ? 29 : 290,
  //     period: billingPeriod === 'monthly' ? '/mês' : '/ano',
  //     icon: Zap,
  //     features: [
  //       'Até 50 certificados',
  //       '5 contratos por mês',
  //       'Suporte por email',
  //       'Armazenamento de 1GB',
  //       'Relatórios básicos'
  //     ],
  //     buttonText: 'Fazer Upgrade',
  //     popular: false,
  //     color: 'blue'
  //   },
  //   {
  //     id: 1,
  //     name: 'Premium',
  //     subtitle: 'Para empresas em crescimento',
  //     price: billingPeriod === 'monthly' ? 79 : 790,
  //     period: billingPeriod === 'monthly' ? '/mês' : '/ano',
  //     icon: Star,
  //     features: [
  //       'Certificados ilimitados',
  //       '50 contratos por mês',
  //       'Suporte prioritário',
  //       'Armazenamento de 10GB',
  //       'Relatórios avançados',
  //       'Integração D4Sign',
  //       'API de terceiros'
  //     ],
  //     buttonText: 'Fazer Upgrade',
  //     popular: true,
  //     color: 'purple'
  //   },
  //   {
  //     id: 2,
  //     name: 'Enterprise',
  //     subtitle: 'Para grandes organizações',
  //     price: billingPeriod === 'monthly' ? 199 : 1990,
  //     period: billingPeriod === 'monthly' ? '/mês' : '/ano',
  //     icon: Crown,
  //     features: [
  //       'Recursos ilimitados',
  //       'Contratos ilimitados',
  //       'Suporte 24/7',
  //       'Armazenamento ilimitado',
  //       'Dashboard personalizado',
  //       'White label',
  //       'Gerente de conta dedicado',
  //       'SLA garantido'
  //     ],
  //     buttonText: 'Fazer Upgrade',
  //     popular: false,
  //     color: 'yellow'
  //   }
  // ];

  // Função para extrair recursos únicos de todos os planos
  const extractUniqueFeatures = (plans: any[]) => {
    const allFeatures = new Set<string>();
    plans.forEach(plan => {
      if (plan.features && Array.isArray(plan.features)) {
        plan.features.forEach((feature: string) => allFeatures.add(feature));
      }
    });
    return Array.from(allFeatures);
  };

  // Função para gerar tabela de comparação baseada apenas nas features do Enterprise
  const generateComparisonTable = (plans: any[]) => {
    if (!plans || plans.length === 0) return [];

    const monthlyPlans = plans.filter(plan => plan.billing_cycle === 'monthly');
    
    // Encontrar o plano Enterprise para usar suas features como referência
    const enterprisePlan = monthlyPlans.find(plan => plan.plan_type === 'enterprise');
    if (!enterprisePlan || !enterprisePlan.features) return [];
    
    // Usar apenas as features do Enterprise como base para comparação
    return enterprisePlan.features.map((feature: string) => {
      const comparison: any = { name: feature };
      
      monthlyPlans.forEach(plan => {
        const hasFeature = plan.features && plan.features.includes(feature);
        comparison[plan.plan_type] = hasFeature;
      });
      
      return comparison;
    });
  };

  const getSpecificComparisons = (plans: any[]) => {
    if (!plans || plans.length === 0) return [];

    const monthlyPlans = plans.filter(plan => plan.billing_cycle === 'monthly');
    const comparisons = [];

    const lucaComparison: any = { name: 'Luca IA' };
    monthlyPlans.forEach(plan => {
      if (plan.luca_questions_limit) {
        lucaComparison[plan.plan_type] = plan.luca_questions_limit === -1 ? 'Ilimitado' : plan.luca_questions_limit.toString();
      } else {
        lucaComparison[plan.plan_type] = 'Não especificado';
      }
    });
    comparisons.push(lucaComparison);

    const usersComparison: any = { name: 'Máximo de usuários' };
    monthlyPlans.forEach(plan => {
      if (plan.max_users) {
        usersComparison[plan.plan_type] = plan.max_users === -1 ? 'Ilimitado' : plan.max_users.toString();
      } else {
        usersComparison[plan.plan_type] = 'Não especificado';
      }
    });
    comparisons.push(usersComparison);

    return comparisons;
  };

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await getPlans();
      setPlans(response.plans);
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (plans.length > 0) {
      console.log('Todos os planos:', plans);
      console.log('Período selecionado:', billingPeriod);
      
      const billingCycles = [...new Set(plans.map(plan => plan.billing_cycle))];
      console.log('Tipos de billing_cycle encontrados:', billingCycles);
      
      const filtered = plans.filter(plan => {
        if (billingPeriod === 'monthly') {
          return plan.billing_cycle === 'monthly' || plan.billing_cycle === 'month';
        } else {
          return plan.billing_cycle === 'annual' || plan.billing_cycle === 'year' || plan.billing_cycle === 'yearly';
        }
      });
      
      const planOrder = { 'basic': 1, 'premium': 2, 'enterprise': 3 };
      const sortedPlans = filtered.sort((a, b) => {
        return (planOrder[a.plan_type as keyof typeof planOrder] || 999) - 
               (planOrder[b.plan_type as keyof typeof planOrder] || 999);
      });
      
      console.log('Planos filtrados e ordenados:', sortedPlans);
      setFilteredPlans(sortedPlans);
    }
  }, [plans, billingPeriod]);

  const handleUpgrade = async (planId: number) => {
    console.log(`Upgrade para plano: ${planId}`);
    const response = await createSubscription(Number(planId));
    console.log(response);

    if (response.data.success) {
      window.open(response.data.checkout_url, '_blank');
    } else {
      setSnackbar({
        open: true,
        message: response.data.message,
        severity: 'error'
      });
    }
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
        {filteredPlans.map((plan) => (
            <div key={plan.id} className={`${styles.planCard} ${plan.billing_cycle === 'monthly' && plan.plan_type === 'premium' ? styles.popular : ''}`}>
              {plan.billing_cycle === 'monthly' && plan.plan_type === 'premium' && (
                <div className={styles.popularBadge}>Mais Popular</div>
              )}

              <div className={styles.planIcon}>
                {plan.plan_type === 'basic' && (
                  <Zap className={`${styles.icon} ${styles[usePlanColor(plan.plan_type)]}`} />
                )}
                {plan.plan_type === 'premium' && (
                  <Star className={`${styles.icon} ${styles[usePlanColor(plan.plan_type)]}`} />
                )}
                {plan.plan_type === 'enterprise' && (
                  <Crown className={`${styles.icon} ${styles[usePlanColor(plan.plan_type)]}`} />
                )}
              </div>

              <h3 className={styles.planName}>{plan.plan_type === 'basic' ? 'Básico' : plan.plan_type === 'premium' ? 'Premium' : plan.plan_type === 'enterprise' ? 'Enterprise' : plan.name}</h3>
              <p className={styles.planSubtitle}>{plan.description}</p>

              <div className={styles.price}>
                <span className={styles.priceValue}>{formatPrice(plan.price)}</span>
                <span className={styles.pricePeriod}>{plan.billing_cycle === 'monthly' ? '/mês' : '/ano'}</span>
              </div>

              <ul className={styles.features}>
                {plan.features?.map((feature: string, index: number) => (
                  <li key={index} className={styles.feature}>
                    <Check className={styles.checkIcon} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`${styles.upgradeButton} ${styles[usePlanColor(plan.plan_type)]}`}
                onClick={() => handleUpgrade(plan.id)}
              >
                Fazer Upgrade
              </button>
            </div>
          ))}
        </div>

        <div className={styles.comparisonSection}>
          <h2 className={styles.comparisonTitle}>Compare todos os recursos</h2>

          <div className={styles.comparisonTable}>
            <div className={styles.tableHeader}>
              <div className={styles.featureColumn}>Recursos</div>
              {filteredPlans
                .filter(plan => plan.billing_cycle === 'monthly')
                .sort((a, b) => {
                  const order = { 'basic': 1, 'premium': 2, 'enterprise': 3 };
                  return (order[a.plan_type as keyof typeof order] || 999) - 
                         (order[b.plan_type as keyof typeof order] || 999);
                })
                .map(plan => (
                  <div key={plan.id} className={styles.planColumn}>
                    {plan.plan_type === 'basic' ? 'Básico' : 
                     plan.plan_type === 'premium' ? 'Premium' : 
                     plan.plan_type === 'enterprise' ? 'Enterprise' : plan.name}
                  </div>
                ))}
            </div>

            {getSpecificComparisons(filteredPlans).map((comparison, index) => (
              <div key={`specific-${index}`} className={styles.tableRow}>
                <div className={styles.featureColumn}>{comparison.name}</div>
                {filteredPlans
                  .filter(plan => plan.billing_cycle === 'monthly')
                  .sort((a, b) => {
                    const order = { 'basic': 1, 'premium': 2, 'enterprise': 3 };
                    return (order[a.plan_type as keyof typeof order] || 999) - 
                           (order[b.plan_type as keyof typeof order] || 999);
                  })
                  .map(plan => (
                    <div key={plan.id} className={styles.planColumn}>
                      {comparison[plan.plan_type] || 'N/A'}
                    </div>
                  ))}
              </div>
            ))}

            {generateComparisonTable(filteredPlans).map((feature: any, index: number) => (
              <div key={`feature-${index}`} className={styles.tableRow}>
                <div className={styles.featureColumn}>{feature.name}</div>
                {filteredPlans
                  .filter(plan => plan.billing_cycle === 'monthly')
                  .sort((a, b) => {
                    const order = { 'basic': 1, 'premium': 2, 'enterprise': 3 };
                    return (order[a.plan_type as keyof typeof order] || 999) - 
                           (order[b.plan_type as keyof typeof order] || 999);
                  })
                  .map(plan => (
                    <div key={plan.id} className={styles.planColumn}>
                      {typeof feature[plan.plan_type] === 'boolean' ? (
                        feature[plan.plan_type] ? <Check className={styles.checkIcon} /> : <X className={styles.xIcon} />
                      ) : (
                        feature[plan.plan_type] || <X className={styles.xIcon} />
                      )}
                    </div>
                  ))}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

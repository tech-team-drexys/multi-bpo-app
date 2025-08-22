'use client';
import { useState } from "react";
import { ArrowRightIcon, ShoppingBagIcon, Trash2Icon } from "lucide-react";
import styles from "./page.module.scss";
import { Button, Radio, RadioChangeEvent, Drawer, List, Typography, Space, Divider, notification } from "antd";

const { Text, Title } = Typography;

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface CartItem extends Service {
  quantity: number;
}

const services: Service[] = [
  {
    id: '1',
    title: 'Terceirização do Departamento Contábil',
    description: 'Escrituração completa e auditoria por IA para mais segurança e produtividade.',
    category: 'Terceirização'
  },
  {
    id: '2',
    title: 'Terceirização do Departamento Fiscal / Tributário',
    description: 'Apuração e entrega fiscal sem erros e sem atrasos, com confiabilidade garantida por IA.',
    category: 'Terceirização'
  },
  {
    id: '3',
    title: 'Terceirização do Departamento Pessoal (DP)',
    description: 'Gestão automatizada da folha, admissões, férias e e-Social com agilidade total.',
    category: 'Terceirização'
  },
  {
    id: '4',
    title: 'Terceirização do Departamento Paralegal / Legalização',
    description: 'Abertura, alteração e regularização de empresas com rapidez e sem burocracia.',
    category: 'Terceirização'
  },
  {
    id: '5',
    title: 'BPO Financeiro com Inteligência e Precisão',
    description: 'Terceirize toda a rotina financeira com controle, fluxo de caixa e cobrança automatizada. Gestão financeira eficiente.',
    category: 'Terceirização',

  },
  {
    id: '6',
    title: 'Planejamento Tributário Inteligente',
    description: 'Reduza impostos com estratégias legais e tecnologia de análise tributária. Elisão Fiscal com inteligência.',
    category: 'Consultoria & Assessoria',

  },
  {
    id: '7',
    title: 'Acessoria Tributária e Regularização Fiscal',
    description: 'Regularize CNPJs, reenquadre empresas e recupere créditos com apoio técnico e jurídico.',
    category: 'Consultoria & Assessoria',

  },
  {
    id: '8',
    title: 'Cursos e Treinamentos para Equipes Contábeis',
    description: 'Capacitação prática e atualizada para elevar o desempenho técnico da sua equipe.',
    category: 'Consultoria & Assessoria',

  },
  {
    id: '9',
    title: 'Consultoria Técnica com IA (Web + WhatsApp)',
    description: 'Tire dúvidas técnicas com IA treinada e suporte humano especializado.',
    category: 'Consultoria & Assessoria',

  },
  {
    id: '10',
    title: 'Estruturação de Holdings',
    description: 'Organize o patrimônio do seu cliente com proteção, sucessão e economia tributária.',
    category: 'Consultoria & Assessoria',

  },
  {
    id: '11',
    title: 'Emissão de certificados Digitais e-CPF e e-CNPJ',
    description: 'Certificação digital com agilidade e validade jurídica garantida.',
    category: 'Serviços Digitais',

  },
  {
    id: '12',
    title: 'Habilitação no RADAR da Receita Federal',
    description: 'Libere o comércio exterior dos seus clientes com agilidade e segurança.',
    category: 'Serviços Digitais',

  },
  {
    id: '13',
    title: 'Registro de Marca no INPI',
    description: 'Proteja o nome e a identidade do seu cliente antes que alguém registre primeiro.',
    category: 'Serviços Digitais',

  },
  {
    id: '14',
    title: 'Atendimento ao Cliente com IA (WhatsApp)',
    description: 'Atendimento automatizado e humanizado com IA que atendem seus clientes 24h com eficiência e empatia.',
    category: 'Serviços Digitais',

  },
  {
    id: '15',
    title: 'Endereço fiscal em Alphaville',
    description: 'Domicílio fiscal seguro para empresas, em um endereço de alto padrão e prestígio, com incentivos fiscais.',
    category: 'Serviços Digitais',

  },
  {
    id: '16',
    title: 'Recrutamento e Seleção com IA',
    description: 'Encontre talentos com mais agilidade, precisão e assertividade usando Inteligência Artificial.',
    category: 'Serviços Digitais',

  },
  {
    id: '17',
    title: 'Marketing Digital para Escritórios Contábeis, gestão de redes sociais e criação de conteúdo',
    description: 'Fortaleça a sua marca contábil, atraia clientes e se destaque online, tenha presença digital e alcance mais pessoas.',
    category: 'Serviços Digitais',

  },
  {
    id: '18',
    title: 'Criação e otmização de sites contábeis',
    description: 'Sites profissionais com foco em autoridade, conversão e presença no Google.',
    category: 'Serviços Digitais',

  },
];

export default function Loja() {
  const [value, setValue] = useState("todos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const clearFilters = () => {
    setValue("todos");
  };

  const addToCart = (service: Service) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === service.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...service, quantity: 1 }];
    });
    
    api.success({
      message: 'Produto adicionado no carrinho',
      description: `${service.title} foi adicionado ao seu carrinho`,
      placement: 'bottomRight',
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== serviceId));
  };

  const updateQuantity = (serviceId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === serviceId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (100 * item.quantity), 0);
  };

  const finalizePurchase = () => {
    alert('Compra finalizada com sucesso!');
    setCart([]);
    setCartDrawerOpen(false);
  };

  const getFilteredServices = () => {
    if (value === "todos") {
      return services;
    }

    const categoryMap = {
      "terceirização": "Terceirização",
      "consultoria-assessoria": "Consultoria & Assessoria",
      "servicos-digitais": "Serviços Digitais"
    };

    return services.filter(service => service.category === categoryMap[value as keyof typeof categoryMap]);
  };

  const renderServiceCard = (service: Service) => (
    <div
      key={service.id}
      className={`${styles.serviceCard}`}
    >
      <div className={styles.cardContent}>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <div className={styles.priceSection}>
          <div className={styles.discountTag}>19% off</div>
          <div className={styles.pricing}>
            <span className={styles.currentPrice}>R$ 100,00</span>
            <span className={styles.oldPrice}>R$ 150,00</span>
          </div>
        </div>
        <button
          className={styles.learnMoreBtn}
          onClick={() => addToCart(service)}
        >
          Adicionar ao Carrinho <ArrowRightIcon size={16} className={styles.arrowIcon} />
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      {contextHolder}
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <div className={styles.header}>
            <h1>Loja</h1>
            <p>Descubra nossos serviços especializados</p>
          </div>
          <Button
            className={styles.shoppingBagBtn}
            onClick={() => setCartDrawerOpen(true)}
          >
            <ShoppingBagIcon size={25} className={styles.shoppingBagIcon} />
            {cart.length > 0 && (
              <span className={styles.cartBadge}>{cart.length}</span>
            )}
          </Button>
        </div>

        <div className={styles.contentEcommerce}>
          <div className={styles.contentFilter}>
            <div className={styles.filterHeader}>
              <p>Escolha por categoria:</p>
              <button onClick={clearFilters} className={styles.clearFiltersBtn}>
                Limpar filtros
              </button>
            </div>
            <Radio.Group
              value={value}
              onChange={onChange}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
              options={[
                { value: "todos", label: 'Todos' },
                { value: "terceirização", label: 'Terceirização' },
                { value: "consultoria-assessoria", label: 'Consultoria & Assessoria' },
                { value: "servicos-digitais", label: 'Serviços Digitais' },
              ]}
            />
          </div>

          <div className={styles.servicesGrid}>
            {getFilteredServices().map(renderServiceCard)}
          </div>
        </div>
      </div>

      <Drawer
        title="Carrinho de Compras"
        placement="right"
        onClose={() => setCartDrawerOpen(false)}
        open={cartDrawerOpen}
        width={400}
        className={styles.cartDrawer}
        footer={
          <div style={{ textAlign: 'center' }}>
            {cart.length > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '1rem',
                padding: '0 1rem'
              }}>
                <Text strong style={{ fontSize: '1.1rem' }}>Total:</Text>
                <Text strong style={{ fontSize: '1.1rem' }}>
                  R$ {getCartTotal().toFixed(2).replace('.', ',')}
                </Text>
              </div>
            )}
            <Button
              type="primary"
              size="large"
              block
              onClick={finalizePurchase}
              disabled={cart.length === 0}
            >
              Finalizar Compra
            </Button>
          </div>
        }
      >
        {cart.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <ShoppingBagIcon size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <Text type="secondary">Seu carrinho está vazio</Text>
          </div>
        ) : (
          <>
            <List
              dataSource={cart}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      key="remove"
                      type="text"
                      danger
                      icon={<Trash2Icon size={16} />}
                      onClick={() => removeFromCart(item.id)}
                    />
                  ]}
                >
                  <List.Item.Meta
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">{item.description}</Text>
                        <Space>
                          <Text>Quantidade:</Text>
                          <Button
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <Text>{item.quantity}</Text>
                          <Button
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </Space>
                        <Text strong>R$ {(100 * item.quantity).toFixed(2).replace('.', ',')}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Drawer>
    </div>
  );
} 
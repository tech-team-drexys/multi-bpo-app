import { Badge, Select, Modal } from "antd";
import {
    Building2,
    Calendar,
    FileText,
    Globe,
    FolderOpen,
    Building,
    Image,
    BarChart3,
    Palette,
    Download,
    X,
    ExternalLink,
    Landmark,
    Map,
    Scale
} from "lucide-react";
import { useState } from "react";
import styles from "./utilities.module.scss";

interface ModalData {
    isOpen: boolean;
    title: string;
    icon: React.ReactNode;
    color: string;
    options: Array<{
        id: string;
        label: string;
        url: string;
        description?: string;
    }>;
}

export default function UtilitiesGrid() {
    const [selectedState, setSelectedState] = useState("SP");
    const [modalData, setModalData] = useState<ModalData>({
        isOpen: false,
        title: "",
        icon: null,
        color: "",
        options: []
    });

    const states = [
        { value: "AC", label: "Acre" },
        { value: "AL", label: "Alagoas" },
        { value: "AP", label: "Amapá" },
        { value: "AM", label: "Amazonas" },
        { value: "BA", label: "Bahia" },
        { value: "CE", label: "Ceará" },
        { value: "DF", label: "Distrito Federal" },
        { value: "ES", label: "Espírito Santo" },
        { value: "GO", label: "Goiás" },
        { value: "MA", label: "Maranhão" },
        { value: "MT", label: "Mato Grosso" },
        { value: "MS", label: "Mato Grosso do Sul" },
        { value: "MG", label: "Minas Gerais" },
        { value: "PA", label: "Pará" },
        { value: "PB", label: "Paraíba" },
        { value: "PR", label: "Paraná" },
        { value: "PE", label: "Pernambuco" },
        { value: "PI", label: "Piauí" },
        { value: "RJ", label: "Rio de Janeiro" },
        { value: "RN", label: "Rio Grande do Norte" },
        { value: "RS", label: "Rio Grande do Sul" },
        { value: "RO", label: "Rondônia" },
        { value: "RR", label: "Roraima" },
        { value: "SC", label: "Santa Catarina" },
        { value: "SP", label: "São Paulo" },
        { value: "SE", label: "Sergipe" },
        { value: "TO", label: "Tocantins" }
    ];

    const categories = [
        {
            id: 1,
            name: "Órgãos Federais",
            icon: <Landmark size={24} />,
            count: 5,
            items: [
                {
                    id: 1,
                    name: "e-CAC",
                    description: "Centro Virtual de Atendimento ao Contribuinte",
                    icon: <Calendar size={24} />,
                    color: "#4CAF50",
                    options: [
                        { id: "ecac", label: "Acessar e-CAC", url: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/ecac", description: "Portal principal do e-CAC" },
                        { id: "extrato", label: "Extrato IRPF", url: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/extrato", description: "Consulta extrato do imposto de renda" },
                        { id: "malha", label: "Malha Fiscal", url: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/malha-fiscal", description: "Consulta malha fiscal" },
                        { id: "situacao", label: "Consulta Situação", url: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/consulta-situacao", description: "Consulta situação cadastral" }
                    ]
                },
                {
                    id: 2,
                    name: "SPED",
                    description: "Sistema Público de Escrituração Digital",
                    icon: <FileText size={24} />,
                    color: "#9C27B0",
                    options: [
                        { id: "sped", label: "Acessar SPED", url: "https://www.gov.br/receitafederal/pt-br/assuntos/sped", description: "Portal principal do SPED" },
                        { id: "spedfiscal", label: "SPED Fiscal", url: "https://www.gov.br/receitafederal/pt-br/assuntos/sped/sped-fiscal", description: "SPED Fiscal ICMS/IPI" },
                        { id: "spedcontabil", label: "SPED Contábil", url: "https://www.gov.br/receitafederal/pt-br/assuntos/sped/sped-contabil", description: "SPED Contábil" },
                        { id: "spedcontribuicoes", label: "SPED Contribuições", url: "https://www.gov.br/receitafederal/pt-br/assuntos/sped/sped-contribuicoes", description: "SPED Contribuições" }
                    ]
                },
                {
                    id: 3,
                    name: "FGTS",
                    description: "Caixa Econômica Federal - FGTS",
                    icon: <Globe size={24} />,
                    color: "#2196F3",
                    options: [
                        { id: "fgts", label: "Acessar FGTS", url: "https://www.gov.br/fgts/pt-br", description: "Portal principal do FGTS" },
                        { id: "consultafgts", label: "Consulta FGTS", url: "https://www.gov.br/fgts/pt-br/consulta", description: "Consulta saldo FGTS" },
                        { id: "extratofgts", label: "Extrato FGTS", url: "https://www.gov.br/fgts/pt-br/extrato", description: "Extrato FGTS" },
                        { id: "calendariofgts", label: "Calendário FGTS", url: "https://www.gov.br/fgts/pt-br/calendario", description: "Calendário de vencimentos" }
                    ]
                },
                {
                    id: 4,
                    name: "INSS",
                    description: "Instituto Nacional do Seguro Social",
                    icon: <FolderOpen size={24} />,
                    color: "#FFC107",
                    options: [
                        { id: "inss", label: "Acessar INSS", url: "https://www.gov.br/inss/pt-br", description: "Portal principal do INSS" },
                        { id: "consultainss", label: "Consulta INSS", url: "https://www.gov.br/inss/pt-br/consulta", description: "Consulta benefícios INSS" },
                        { id: "extratoinss", label: "Extrato INSS", url: "https://www.gov.br/inss/pt-br/extrato", description: "Extrato INSS" },
                        { id: "calendarioinss", label: "Calendário INSS", url: "https://www.gov.br/inss/pt-br/calendario", description: "Calendário de vencimentos" }
                    ]
                },
                {
                    id: 5,
                    name: "Receita Federal",
                    description: "Secretaria da Receita Federal",
                    icon: <Building size={24} />,
                    color: "#FF5722",
                    options: [
                        { id: "receita", label: "Acessar Receita", url: "https://www.gov.br/receitafederal/pt-br", description: "Portal principal da Receita Federal" },
                        { id: "cnpj", label: "Consulta CNPJ", url: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/cnpj", description: "Consulta CNPJ" },
                        { id: "cpf", label: "Consulta CPF", url: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/cpf", description: "Consulta CPF" },
                        { id: "certidao", label: "Certidão Negativa", url: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/certidoes", description: "Certidão Negativa de Débitos" }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: "Simples Nacional",
            icon: <Map size={24} />,
            count: 2,
            items: [
                {
                    id: 1,
                    name: "Simples Nacional",
                    description: "Portal do Simples Nacional",
                    icon: <Map size={24} />,
                    color: "#E91E63",
                    options: [
                        { id: "simples", label: "Acessar Simples", url: "https://www.gov.br/simplesnacional", description: "Portal principal do Simples Nacional" },
                        { id: "consultasimples", label: "Consulta Simples", url: "https://www.gov.br/simplesnacional/consulta", description: "Consulta situação Simples" },
                        { id: "extratosimples", label: "Extrato Simples", url: "https://www.gov.br/simplesnacional/extrato", description: "Extrato Simples Nacional" },
                        { id: "calendariosimples", label: "Calendário Simples", url: "https://www.gov.br/simplesnacional/calendario", description: "Calendário de vencimentos" }
                    ]
                },
                {
                    id: 2,
                    name: "eSocial",
                    description: "Sistema de Escrituração Digital das Obrigações Fiscais",
                    icon: <BarChart3 size={24} />,
                    color: "#2196F3",
                    options: [
                        { id: "esocial", label: "Acessar eSocial", url: "https://www.gov.br/esocial", description: "Portal principal do eSocial" },
                        { id: "consultasocial", label: "Consulta eSocial", url: "https://www.gov.br/esocial/consulta", description: "Consulta situação eSocial" },
                        { id: "extratosocial", label: "Extrato eSocial", url: "https://www.gov.br/esocial/extrato", description: "Extrato eSocial" },
                        { id: "calendariosocial", label: "Calendário eSocial", url: "https://www.gov.br/esocial/calendario", description: "Calendário de vencimentos" }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: "Órgãos Estaduais",
            icon: <Building2 size={24} />,
            count: 2,
            items: [
                {
                    id: 1,
                    name: "SEFAZ",
                    description: "Secretaria da Fazenda Estadual",
                    icon: <Scale size={24} />,
                    color: "#FF9800",
                    options: [
                        { id: "sefaz", label: "Acessar SEFAZ", url: getStateUrl("SEFAZ", selectedState), description: "Portal da SEFAZ estadual" },
                        { id: "consultasefaz", label: "Consulta SEFAZ", url: getStateUrl("SEFAZ", selectedState) + "consulta", description: "Consulta situação SEFAZ" },
                        { id: "extratosefaz", label: "Extrato SEFAZ", url: getStateUrl("SEFAZ", selectedState) + "extrato", description: "Extrato SEFAZ" },
                        { id: "calendariosefaz", label: "Calendário SEFAZ", url: getStateUrl("SEFAZ", selectedState) + "calendario", description: "Calendário de vencimentos" }
                    ]
                },
                {
                    id: 2,
                    name: "Junta Comercial",
                    description: "Registro de empresas e atos societários",
                    icon: <Download size={24} />,
                    color: "#4CAF50",
                    options: [
                        { id: "junta", label: "Acessar Junta", url: getStateUrl("Junta", selectedState), description: "Portal da Junta Comercial estadual" },
                        { id: "consultajunta", label: "Consulta Junta", url: getStateUrl("Junta", selectedState) + "consulta", description: "Consulta situação Junta" },
                        { id: "extratojunta", label: "Extrato Junta", url: getStateUrl("Junta", selectedState) + "extrato", description: "Extrato Junta Comercial" },
                        { id: "calendariojunta", label: "Calendário Junta", url: getStateUrl("Junta", selectedState) + "calendario", description: "Calendário de vencimentos" }
                    ]
                }
            ]
        }
    ];

    function getStateUrl(service: string, state: string): string {
        const stateUrls = {
            "SP": {
                "SEFAZ": "https://www.fazenda.sp.gov.br/",
                "Junta": "https://www.jucesp.sp.gov.br/"
            },
            "RJ": {
                "SEFAZ": "https://www.fazenda.rj.gov.br/",
                "Junta": "https://www.jucerja.rj.gov.br/"
            },
            "MG": {
                "SEFAZ": "https://www.fazenda.mg.gov.br/",
                "Junta": "https://www.jucemg.mg.gov.br/"
            },
            "RS": {
                "SEFAZ": "https://www.fazenda.rs.gov.br/",
                "Junta": "https://www.jucesrs.rs.gov.br/"
            },
            "PR": {
                "SEFAZ": "https://www.fazenda.pr.gov.br/",
                "Junta": "https://www.jucepar.pr.gov.br/"
            },
            "SC": {
                "SEFAZ": "https://www.fazenda.sc.gov.br/",
                "Junta": "https://www.jucesc.sc.gov.br/"
            },
            "BA": {
                "SEFAZ": "https://www.fazenda.ba.gov.br/",
                "Junta": "https://www.juceb.ba.gov.br/"
            },
            "CE": {
                "SEFAZ": "https://www.sefaz.ce.gov.br/",
                "Junta": "https://www.jucec.ce.gov.br/"
            },
            "PE": {
                "SEFAZ": "https://www.sefaz.pe.gov.br/",
                "Junta": "https://www.jucepe.pe.gov.br/"
            },
            "GO": {
                "SEFAZ": "https://www.fazenda.go.gov.br/",
                "Junta": "https://www.juceg.go.gov.br/"
            },
            "MT": {
                "SEFAZ": "https://www.fazenda.mt.gov.br/",
                "Junta": "https://www.jucemg.mt.gov.br/"
            },
            "MS": {
                "SEFAZ": "https://www.fazenda.ms.gov.br/",
                "Junta": "https://www.jucems.ms.gov.br/"
            },
            "ES": {
                "SEFAZ": "https://www.sefaz.es.gov.br/",
                "Junta": "https://www.jucees.es.gov.br/"
            },
            "PA": {
                "SEFAZ": "https://www.sefaz.pa.gov.br/",
                "Junta": "https://www.jucepa.pa.gov.br/"
            },
            "PB": {
                "SEFAZ": "https://www.sefaz.pb.gov.br/",
                "Junta": "https://www.jucepb.pb.gov.br/"
            },
            "PI": {
                "SEFAZ": "https://www.sefaz.pi.gov.br/",
                "Junta": "https://www.jucepi.pi.gov.br/"
            },
            "RN": {
                "SEFAZ": "https://www.sefaz.rn.gov.br/",
                "Junta": "https://www.jucern.rn.gov.br/"
            },
            "RO": {
                "SEFAZ": "https://www.sefaz.ro.gov.br/",
                "Junta": "https://www.jucer.ro.gov.br/"
            },
            "RR": {
                "SEFAZ": "https://www.sefaz.rr.gov.br/",
                "Junta": "https://www.jucer.rr.gov.br/"
            },
            "TO": {
                "SEFAZ": "https://www.sefaz.to.gov.br/",
                "Junta": "https://www.jucet.to.gov.br/"
            },
            "AC": {
                "SEFAZ": "https://www.sefaz.ac.gov.br/",
                "Junta": "https://www.juceac.ac.gov.br/"
            },
            "AL": {
                "SEFAZ": "https://www.sefaz.al.gov.br/",
                "Junta": "https://www.juceal.al.gov.br/"
            },
            "AP": {
                "SEFAZ": "https://www.sefaz.ap.gov.br/",
                "Junta": "https://www.juceap.ap.gov.br/"
            },
            "AM": {
                "SEFAZ": "https://www.sefaz.am.gov.br/",
                "Junta": "https://www.juceam.am.gov.br/"
            },
            "DF": {
                "SEFAZ": "https://www.fazenda.df.gov.br/",
                "Junta": "https://www.jucedf.df.gov.br/"
            },
            "MA": {
                "SEFAZ": "https://www.sefaz.ma.gov.br/",
                "Junta": "https://www.jucema.ma.gov.br/"
            },
            "SE": {
                "SEFAZ": "https://www.sefaz.se.gov.br/",
                "Junta": "https://www.jucese.se.gov.br/"
            }
        };

        return stateUrls[state as keyof typeof stateUrls]?.[service as keyof typeof stateUrls["SP"]] || stateUrls["SP"][service as keyof typeof stateUrls["SP"]];
    }

    const handleCardClick = (item: any) => {
        setModalData({
            isOpen: true,
            title: item.name,
            icon: item.icon,
            color: item.color,
            options: item.options
        });
    };

    const handleOptionClick = (url: string) => {
        window.open(url, '_blank');
    };

    const closeModal = () => {
        setModalData(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.stateSelector}>
                <label htmlFor="state-select">Selecione o Estado:</label>
                <Select
                    id="state-select"
                    value={selectedState}
                    onChange={setSelectedState}
                    options={states}
                    placeholder="Selecione um estado"
                    style={{ width: 200 }}
                />
            </div>

            {categories.map((category) => (
                <div key={category.id} className={styles.categorySection}>
                    <div className={styles.categoryHeader}>
                        <div className={styles.categoryIcon}>{category.icon}</div>
                        <h2>{category.name}</h2>
                        <Badge count={category.count} color="#c7c5c5" />
                    </div>
                    <div className={styles.cardsGrid}>
                        {category.items.map((item) => (
                            <div
                                key={item.id}
                                className={styles.card}
                                onClick={() => handleCardClick(item)}
                            >
                                <div
                                    className={styles.cardIcon}
                                    style={{ backgroundColor: item.color }}
                                >
                                    {item.icon}
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <Modal
                open={modalData.isOpen}
                onCancel={closeModal}
                footer={null}
                width={600}
                className={styles.utilityModal}
                closeIcon={<X size={20} />}
                zIndex={999999}
            >
                <div className={styles.modalHeader}>
                    <div
                        className={styles.modalIcon}
                        style={{ backgroundColor: modalData.color }}
                    >
                        {modalData.icon}
                    </div>
                    <h2>{modalData.title}</h2>
                </div>

                <div className={styles.modalContent}>
                    <p className={styles.modalSubtitle}>
                        Escolha a opção que deseja acessar:
                    </p>

                    <div className={styles.optionsList}>
                        {modalData.options.map((option) => (
                            <div
                                key={option.id}
                                className={styles.optionItem}
                                onClick={() => handleOptionClick(option.url)}
                            >
                                <ExternalLink size={24} />
                                <div className={styles.optionContent}>
                                    <h4>{option.label}</h4>
                                    {option.description && (
                                        <p>{option.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
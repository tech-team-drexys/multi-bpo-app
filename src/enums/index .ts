export enum DriveItemType {
    MONTH = 'months',
    CLIENT = 'clients',
    SERVICE = 'services',
    FILE = 'files',
}

export enum TaskStatus {
    OVERDUE = 'overdue',
    ON_TRACK = 'on_track',
    DUE_TODAY = 'due_today',
    COMPLETED = 'completed',
}

export enum IdeaStatus {
    NEW = 'nova',
    STUDY = 'em-estudo',
    DEVELOPED = 'desenvolvida',
}

export enum IdeaType {
    FEATURE = 'feature',
    BUG = 'bug',
}

export enum ProductCategory {
    TERCEIRIZACAO = 'outsource',
    PREMIUM_FEATURE = 'premium_feature', 
    SERVICOS_DIGITAIS = 'digital_services',
}

export const ProductCategoryLabels = {
    [ProductCategory.TERCEIRIZACAO]: 'Terceirização',
    [ProductCategory.PREMIUM_FEATURE]: 'Consultoria & Assessoria',
    [ProductCategory.SERVICOS_DIGITAIS]: 'Serviços Digitais',
} as const;

export enum PaymentMethod {
    BOLETO = 'BOLETO',
    PIX = 'PIX',
    CREDIT_CARD = 'Cartão de crédito',
}

export enum CreditCardBrand {
    VISA = '@/public/cards/visa.svg',
    MASTERCARD = '@/public/cards/mastercard.svg',
    AMERICAN_EXPRESS = '@/public/cards/amex.svg',
    DINERS = '@/public/cards/diners.svg',
    ELO = '@/public/cards/elo.svg',
    BANES_CARD = '@/public/cards/banescard.svg',
    CABAL = '@/public/cards/cabal.svg',
    CREDSYSTEM = '@/public/cards/credsystem.svg',
    CREDZ = '@/public/cards/credz.svg',
    DISCOVER = '@/public/cards/discover.svg',
    SOROCRED = '@/public/cards/sorocred.svg',
    UCB = '@/public/cards/ucb.svg',
}

export enum MenuOption {
    CONTA = 'conta',
    SEGURANCA = 'seguranca',
    ASSINATURAS = 'assinaturas',
    HISTORICO_COMPRAS = 'historico-compras',
    FINANCEIRO = 'financeiro',
}
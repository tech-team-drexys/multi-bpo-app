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
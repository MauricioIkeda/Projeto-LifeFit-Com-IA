export const Sexo = {
    MASCULINO: 0,
    FEMININO: 1,
} as const;

export const NivelAtividade = {
    SEDENTARIO: 0,
    LEVE: 1,
    MODERADO: 2,
    ALTO: 3,
} as const;

export const Objetivo = {
    PERDA_PESO: 0,
    SAUDE: 1,
    GANHO_MASSA: 2,
} as const;

export const Foco = {
    PEITO: 0,
    COSTAS: 1,
    PERNAS: 2,
    OMBROS: 3,
    BICEPS: 4,
    TRICEPS: 5,
    FULL_BODY: 6,
    GERAL_CARDIO: 7
} as const;

export interface UserData {
    sexo: number;
    idade: string;
    altura: string;
    peso: string;
    nivelAtividadeFisica: number;
    objetivo: number;
    foco: number;
}

export interface FinalProfile {
    nome: string;
    sexo: number;
    idade: number;
    altura: number;
    peso: number;
    nivelAtividadeFisica: number;
    objetivo: number;
    foco: number;
}

export interface Sugestoes {
    perfilUsuarioId: number;
    exercicioId: number;
    requisicaoId: number;
    pontosPerfil: number;
    id: number;
}

export interface RequisicaoSugestao {
    perfilUsuarioId: number;
    sugestoes: Sugestoes[];
    focoMuscular: number;
    codigoRetorno: number;
    id: number;
}
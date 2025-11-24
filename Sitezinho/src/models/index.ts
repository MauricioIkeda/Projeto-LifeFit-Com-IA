export const Sexo = {
    MASCULINO: 1,
    FEMININO: 2,
} as const;

export const NivelAtividade = {
    SEDENTARIO: 1,
    LEVE: 2,
    MODERADO: 3,
    ALTO: 4,
} as const;

export const Objetivo = {
    PERDA_PESO: 1,
    GANHO_MASSA: 2,
    SAUDE: 3,
} as const;

export const Foco = {
    PEITO: 1,
    COSTAS: 2,
    PERNAS: 3,
    OMBROS: 4,
    BICEPS: 5,
    TRICEPS: 6,
    FULL_BODY: 7,
    GERAL_CARDIO: 8
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
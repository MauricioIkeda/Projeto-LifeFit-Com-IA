from Mapeamento import (
    ID_ATIVIDADE,
    ID_GENERO,
    ID_OBJETIVO,
    TAMANHO_ENTRADA, 
    NUM_EXERCICIOS, 
    LISTA_EXERCICIOS, 
    GRUPOS_MUSCULARES, 
)

print([ex for ex in LISTA_EXERCICIOS if ex['grupo'] == 'Costas'])
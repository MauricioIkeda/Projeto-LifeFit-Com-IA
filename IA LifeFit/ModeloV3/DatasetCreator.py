import pandas as pd
import numpy as np

# Constantes de configuração do dataset
DATA_FOLDER = "ModeloV3/Dados"
ARQUIVO_EXERCICIOS = f"{DATA_FOLDER}/exerciciosV3.csv"
ARQUIVO_SAIDA = f"{DATA_FOLDER}/DatasetLindo.csv"
NUM_LINHAS = 100000

FOCO_MUSCULAR = {
    0: 'Peito', 1: 'Costas', 2: 'Pernas', 3: 'Ombros', 
    4: 'Braços', 5: 'Core', 6: 'Cardio'
}

LOCAL_TREINO = {
    0: 'loc_0_pc',       # Casa (Peso Corporal)
    1: 'loc_1_halteres', # Casa (Halteres/Livres)
    2: 'loc_2_maquina'   # Academia (Máquinas)
}

LIMITACOES = {
    0: 'Nenhuma', 1: 'Joelho', 2: 'Lombar', 3: 'Ombro'
}

# Nivel de dificuldade do exercicio com base no nivel de atividade
NIVEL_DIFICULDADE = {
    0: ['Iniciante'],                           # Sedentário
    1: ['Iniciante'],                           # Leve
    2: ['Iniciante', 'Intermediário'],          # Moderado
    3: ['Iniciante', 'Intermediário', 'Avançado'] # Intenso
}

OBJETIVO = {
    0: 'Emagrecer/Cardio',
    1: 'Hipertrofia',
    2: 'Condicionamento'
}

# Carregamento do arquivo de exercícios
try:
    df_ex = pd.read_csv(ARQUIVO_EXERCICIOS)
except FileNotFoundError:
    print(f"ERRO: Arquivo '{ARQUIVO_EXERCICIOS}' não encontrado.")
    exit()
    
combinacaoes = [] # Combinações já salvas (para evitar duplicatas)
data = [] # Lista para armazenar as linhas do dataset
falhas = 0 # Contador de falhas na geração de linhas

for _ in range(NUM_LINHAS):
    idade = np.random.randint(18, 65)  # Idade entre 18 e 65 anos
    genero = np.random.choice([0, 1])  # 0: Masculino, 1: Feminino
    altura = round(np.random.uniform(145.0, 200.0), 1)  # Altura entre 145cm e 200cm
    peso = round(np.random.uniform(30.0, 150.0), 1)  # Peso entre 30kg e 150kg
    tempo_disponivel = np.random.choice([30, 45, 60, 90])  # Tempo disponivel em minutos
    
    # Calcula o IMC
    altura_m = altura / 100.0
    imc = peso / (altura_m ** 2)
    
    if imc < 18.5:
        objetivo = 1  # Ganho de massa muscular
    elif imc >= 25.0:
        objetivo = 0  # Perda de peso
    else:
        objetivo = np.random.choice(list(OBJETIVO.keys()))  # 0: Perda de peso, 1: Ganho de massa muscular, 2: Condicionamento fisico
    
    nivel_atividade = np.random.choice(list(NIVEL_DIFICULDADE.keys()))  # 0: Sedentario, 1: Leve, 2: Moderado, 3: Intenso
    foco_muscular = np.random.choice(list(FOCO_MUSCULAR.keys()))  # 0: Peito, 1: Costas, 2: Pernas, 3: Ombros, 4: Bracos, 5: Core, 6: Cardio
    local_treino = np.random.choice(list(LOCAL_TREINO.keys()))  # 0: Casa peso corporal, 1: Casa halteres/livres, 2: Academia maquinas
    limitacoes = np.random.choice(list(LIMITACOES.keys()))  # 0: Nenhuma, 1: Joelho, 2: Lombar, 3: Ombro
    
    # Aplicando os filtros para selecionar exercícios
    df_ex_filtrado = df_ex.copy()
    
    # Filtrando por nivel de dificuldade
    niveis_permitidos = NIVEL_DIFICULDADE[nivel_atividade]
    df_ex_filtrado = df_ex_filtrado[df_ex_filtrado['dificuldade'].isin(niveis_permitidos)]
    
    # Filtrando por foco muscular
    foco_muscular_nome = FOCO_MUSCULAR[foco_muscular]
    df_ex_filtrado = df_ex_filtrado[df_ex_filtrado['foco_muscular'] == foco_muscular_nome]
    
    # Filtrando por local de treino
    local_treino_nome = LOCAL_TREINO[local_treino]
    df_ex_filtrado = df_ex_filtrado[df_ex_filtrado[local_treino_nome] == 1]
    
    # Filtrando por limitações
    limitacao_nome = LIMITACOES[limitacoes]
    if limitacao_nome != 'Nenhuma':
        df_ex_filtrado = df_ex_filtrado[~df_ex_filtrado['risco_limitacao'].str.contains(limitacao_nome)]
    
    # Obtendo a lista de IDs dos exercícios filtrados unicos
    lista_id_exercicios = df_ex_filtrado['exercise_id'].unique().tolist()
    
    # Verifica se há exercícios suficientes após os filtros
    if len(lista_id_exercicios) < 5:
        falhas += 1
        continue
    else:
        # Seleciona os 5 primeiros exercícios (após ordenar)
        lista_id_exercicios.sort()
        exercicios_finais = lista_id_exercicios[0:5]
        
        # Monta a linha do dataset
        linha = {
            'idade': idade, 'genero': genero, 'peso': peso, 'altura': altura,
            'tempo_sessao': tempo_disponivel, 'objetivo': objetivo, 'nivel': nivel_atividade,
            'foco_muscular': foco_muscular, 'local_treino': local_treino, 'limitacoes': limitacoes,
            'ex1': exercicios_finais[0],
            'ex2': exercicios_finais[1],
            'ex3': exercicios_finais[2],
            'ex4': exercicios_finais[3],
            'ex5': exercicios_finais[4],
        }
        data.append(linha)

# Criando o DataFrame final e salvando em CSV
df_final = pd.DataFrame(data)

if len(df_final) == 0:
    print("Nenhuma linha de dados válida foi gerada.")
else:
    for i in range(1, 6):
        df_final[f'ex{i}'] = df_final[f'ex{i}'].astype(int)
        
    df_final.to_csv(ARQUIVO_SAIDA, index=False)
    print("\nDataset Gerado Com Sucesso!")
    print(f"Arquivo salvo: {ARQUIVO_SAIDA}")
    print(f"Total de linhas geradas: {len(df_final)} (de {NUM_LINHAS} tentativas)")
    print(f"Falhas: {falhas}")
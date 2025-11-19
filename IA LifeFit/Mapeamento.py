import csv
import os

GRUPOS_MUSCULARES = ["Peito", "Costas", "Pernas", "Ombros", "Biceps", "Triceps", "Cardio/Geral"]
OBJETIVOS = ["Perda de Peso", "Manutenção", "Hipertrofia"]
ATIVIDADES = ["Sedentario", "Leve", "Moderado", "Alto"]
ARQUIVO_CSV = "exercicios.csv"

def carregar_exercicios():
    exercicios = []
    try:
        with open(ARQUIVO_CSV, newline='', encoding='utf-8') as f:
            leitor = csv.DictReader(f)
            for linha in leitor:
                exercicios.append({
                    "id": int(linha["id"]),
                    "nome": linha["nome"],
                    "grupo": linha["grupo_muscular"]
                })
        return exercicios
    except FileNotFoundError:
        print(f"ERRO: Crie o arquivo '{ARQUIVO_CSV}' antes de rodar!")
        exit()
        
LISTA_EXERCICIOS = carregar_exercicios()

TAMANHO_ENTRADA = 4 + len(ATIVIDADES) + len(OBJETIVOS) + len(GRUPOS_MUSCULARES)

NUM_EXERCICIOS = len(LISTA_EXERCICIOS)

def carregar_nomes_exercicios():
    nomes = []
    if not os.path.exists(ARQUIVO_CSV):
        print(f"ERRO: Nao foi encontrado o arquivo '{ARQUIVO_CSV}'!")
        exit()
        
    try:
        with open(ARQUIVO_CSV, newline='', encoding='utf-8') as f:
            leitor = csv.DictReader(f)
            for linha in leitor:
                nomes.append(linha["nome"])
        return nomes
    except Exception as e:
        print(f"ERRO: Nao foi possivel ler o arquivo '{ARQUIVO_CSV}': {e}")
        exit()

LISTA_NOMES_EXERCICIOS = carregar_nomes_exercicios()

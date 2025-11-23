import csv
import os

GRUPOS_MUSCULARES = ["Peito", "Costas", "Pernas", "Ombros", "Biceps", "Triceps", "Cardio", "Geral"]
OBJETIVOS = ["Perda de Peso", "Manutenção", "Hipertrofia"]
ATIVIDADES = ["Sedentario", "Leve", "Moderado", "Alto"]

ARQUIVO_CSV = "exercicios.csv"

ID_GENERO = {0: "Masculino", 1: "Feminino"}
ID_ATIVIDADE = {0: "Sedentario", 1: "Leve", 2: "Moderado", 3: "Alto"}
ID_OBJETIVO = {0: "Perda de Peso", 1: "Manutenção", 2: "Hipertrofia"}

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
        return []
        
LISTA_EXERCICIOS = carregar_exercicios()

EXERCICIO_LOOKUP = {ex['id']: ex for ex in LISTA_EXERCICIOS}

TAMANHO_ENTRADA = 4 + len(ATIVIDADES) + len(OBJETIVOS) + len(GRUPOS_MUSCULARES) - 1

NUM_EXERCICIOS = len(LISTA_EXERCICIOS)

LISTA_NOMES_EXERCICIOS = [ex["nome"] for ex in LISTA_EXERCICIOS]

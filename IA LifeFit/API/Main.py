from fastapi import FastAPI
from contextlib import asynccontextmanager

import torch
import joblib
import pandas as pd
import numpy as np

from ModeloV3.Modelo import FitnessModel
from API.Modelos import UserProfile

# Para rodar o aplicativo FastAPI use o comando: uvicorn API.Main:app --reload

assets = {}

# Definindo o contexto de vida útil do aplicativo
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Código a ser executado na inicialização do aplicativo
    assets["device"] = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Usando: {assets['device']}")
    
    # Carregando modelo
    try:
        assets["model"] = FitnessModel().to(assets["device"])
        assets["model"].load_state_dict(torch.load("ModeloV3/Dados/modelo_lindo_final.pth", map_location=assets["device"]))
        assets["model"].eval()
        print("Modelo carregado com sucesso.")
    except Exception as e:
        print(f"Erro ao carregar modelo: {e}")
        assets["model"] = None
    
    # Carregando Scaler 
    try :
        assets["scaler"] = joblib.load("ModeloV3/Dados/scaler_lindo.joblib")
        print("Scaler carregado com sucesso.")
    except FileNotFoundError:
        print("ERRO: 'scaler_lindo.joblib' não encontrado!")
        assets["scaler"] = None
        
    # Carregando Exercicios para mapear IDs para nomes
    try:
        df_exercises = pd.read_csv("ModeloV3/Dados/exerciciosV3.csv")
        assets["mapa_nomes"] = df_exercises.set_index('exercise_id')['nome_exercicio'].to_dict()
        print(f"Exercícios carregados com sucesso. Total de exercícios: {len(assets['mapa_nomes'])}")
    except FileNotFoundError:
        print("ERRO: 'exerciciosV2.csv' não encontrado!")
        assets["mapa_nomes"] = None
    
    yield
    
    print("Finalizando o aplicativo FastAPI.")
    assets.clear()
    
app = FastAPI(
    lifespan=lifespan,
    title="LifeFit IA - API de Recomendação de Exercícios",
    version="1.0.0",
    description="API para recomendações de exercícios do projeto LifeFit."
)

@app.post("/recomendar/", tags=["Recomendações"])
async def get_recommendations(user_profile: UserProfile):
    # verifica se o Scaler, Modelo e Mapa de Nomes dos exercicios foram carregados corretamente
    if not assets.get("scaler") or not assets.get("model") or not assets.get("mapa_nomes"):
        return {"Erro": "Serviço indisponível. Tente novamente mais tarde."}
    
    # Preparando os dados de entrada para o modelo
    try:
        # Dados numericos
        dados_numericos = np.array([[
            user_profile.idade,
            user_profile.peso,
            user_profile.altura,
            user_profile.tempo_disponivel
        ]])

        # Dados categoricos
        dados_categoricos = torch.tensor([[
            user_profile.genero,
            user_profile.objetivo,
            user_profile.nivel_atividade_fisica,
            user_profile.foco_muscular,
            user_profile.local_treino,
            user_profile.limitacoes
        ]], dtype=torch.float32)
        
        # Normalizando os dados numericos e convertendo para tensor
        dados_numericos_normalizados = assets["scaler"].transform(dados_numericos)
        dados_numericos_tensor = torch.tensor(dados_numericos_normalizados, dtype=torch.float32)
        
        # Concatenando dados numericos e categoricos para formar a entrada do modelo
        entrada_modelo = torch.cat((dados_numericos_tensor, dados_categoricos), dim=1).to(assets["device"])
        
        # Fazendo a predição com o modelo
        with torch.no_grad():
            output = assets["model"](entrada_modelo)
            predicao = output["topk_indices"].cpu().numpy().flatten()
            
        # Mapeando IDs dos exercicios para nomes
        nomes_exercicios = [assets["mapa_nomes"].get(ex_id, "Exercício Desconhecido") for ex_id in predicao]

        # Retornando as recomendações
        return {
            "recomendacoes": nomes_exercicios
        }
    except Exception as e:
        return {"Erro": f"Ocorreu um erro ao processar a solicitação: {e}"}

# Rota raiz para verificar se a API está funcionando
@app.get("/")
async def read_root():
    return {"message": "Bem-vindo à API de Recomendação de Exercícios Fitness!"}
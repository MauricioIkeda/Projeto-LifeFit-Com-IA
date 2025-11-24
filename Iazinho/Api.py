from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal, List, Union
from contextlib import asynccontextmanager
import torch
import uvicorn
import os

from Modelo import Modelinho
from Mapeamento import (
    ID_ATIVIDADE,
    ID_GENERO,
    ID_OBJETIVO,
    TAMANHO_ENTRADA, 
    NUM_EXERCICIOS, 
    GRUPOS_MUSCULARES, 
    EXERCICIO_LOOKUP
)
from TratamentoDados import enconde_profile

# Variável global do modelo
modelo_ia = None
ARQUIVO_MODELO = "modelo_treinado.pth"

# Chamado ao iniciar o app FastAPI
@asynccontextmanager
async def lifespan(app: FastAPI):
    global modelo_ia
    modelo_ia = Modelinho(input_size=TAMANHO_ENTRADA, num_exercises=NUM_EXERCICIOS)
    if os.path.exists(ARQUIVO_MODELO):
        try:
            modelo_ia.load_state_dict(torch.load(ARQUIVO_MODELO, map_location=torch.device('cpu')))
            modelo_ia.eval()
            print(f"Modelo carregado com sucesso!")
        except Exception as e:
            print(f"Erro ao carregar modelo: {e}")
    else:
        print(f"Modelo não encontrado. Treine-o antes de usar.")
    yield

app = FastAPI(
    title="LifeFit AI API",
    version="1.1",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic para validação de dados
class UserProfile(BaseModel):
    idade: int = Field(..., ge=10, le=100)
    peso: float = Field(..., gt=0)
    altura: float = Field(..., gt=0)
    genero: Literal["Masculino", "Feminino"]
    atividade: Literal["Sedentario", "Leve", "Moderado", "Alto"]
    objetivo: Literal["Perda de Peso", "Manutenção", "Hipertrofia"]
    foco_muscular: str

class UserProfileInt(BaseModel):
    idade: int = Field(..., ge=10, le=100)
    peso: float = Field(..., gt=0)
    altura: float = Field(..., gt=0)
    genero: int
    atividade: int
    objetivo: int
    foco_muscular: int 

class RecommendationResponse(BaseModel):
    rank: int
    exercicio_nome: str
    exercicio_id: int
    grupo_muscular: str
    grupo_muscular_id: int
    match_score: str

# Endpoint de recomendação de exercícios
@app.post("/api/v1/recommend", response_model=List[RecommendationResponse])
def recommend_workout(perfil: Union[UserProfile, UserProfileInt]):
    global modelo_ia

    # Converte ProfileInt para Profile
    if isinstance(perfil, UserProfileInt):
        try:
            perfil = UserProfile(
                idade=perfil.idade,
                peso=perfil.peso,
                altura=perfil.altura,
                genero=ID_GENERO[perfil.genero],
                atividade=ID_ATIVIDADE[perfil.atividade],
                objetivo=ID_OBJETIVO[perfil.objetivo],
                foco_muscular=GRUPOS_MUSCULARES[perfil.foco_muscular]
            )
        except (IndexError):
            raise HTTPException(status_code=400, detail="Dados inválidos no perfil numérico.")

    if modelo_ia is None:
        raise HTTPException(status_code=503, detail="Modelo não carregado.")

    QTD_POR_GRUPO_GERAL = 3

    try:
        perfil_dict = perfil.model_dump()
        resultados = []
        rank_global = 1

        # caso a foco_muscular for GERAL
        if "Geral" in perfil.foco_muscular:
            
            # Filtra para pegar todos os grupos exceto o próprio "Geral"
            grupos_alvo = [g for g in GRUPOS_MUSCULARES if "Geral" not in g]

            for grupo in grupos_alvo:
                # Modificamos o perfil temporariamente para "enganar" o modelo
                # e pedir exercícios específicos daquele grupo
                perfil_temp = perfil_dict.copy()
                perfil_temp["foco_muscular"] = grupo
                
                tensor_entrada = enconde_profile(perfil_temp)
                
                with torch.no_grad():
                    scores = modelo_ia(tensor_entrada)
                    
                    # Pegamos os Top K exercícios (ex: Top 3)
                    values, indices = torch.topk(scores, k=QTD_POR_GRUPO_GERAL, dim=1)
                    
                    # Iteramos sobre os 3 resultados retornados
                    for i in range(len(indices[0])):
                        idx_exercicio = indices[0][i].item()
                        score = values[0][i].item()
                        
                        ex_data = EXERCICIO_LOOKUP.get(idx_exercicio)
                        
                        # Adiciona à lista se o exercício existir e for do grupo correto
                        if ex_data and ex_data['grupo'] == grupo:
                            resultados.append({
                                "rank": rank_global,
                                "exercicio_nome": ex_data['nome'],
                                "exercicio_id": idx_exercicio,
                                "grupo_muscular": ex_data['grupo'],
                                "grupo_muscular_id": GRUPOS_MUSCULARES.index(ex_data['grupo']),
                                "match_score": f"{min(score * 100, 99.9):.1f}%"
                            })
                            rank_global += 1

            return resultados

        # caso a foco_muscular for específico (Ex: Só Peito)
        else:
            tensor_entrada = enconde_profile(perfil_dict)
            with torch.no_grad():
                scores = modelo_ia(tensor_entrada)
                # Aqui usamos sort para garantir que vamos achar os do grupo certo
                values, indices = torch.sort(scores, descending=True)
                
                for i, idx in enumerate(indices[0]):
                    id_ex = idx.item()
                    score = values[0][i].item()
                    ex_data = EXERCICIO_LOOKUP.get(id_ex)
                    
                    if ex_data and ex_data['grupo'] == perfil.foco_muscular:
                        resultados.append({
                            "rank": len(resultados) + 1,
                            "exercicio_nome": ex_data['nome'],
                            "exercicio_id": id_ex,
                            "grupo_muscular": ex_data['grupo'],
                            "grupo_muscular_id": GRUPOS_MUSCULARES.index(ex_data['grupo']),
                            "match_score": f"{min(score * 100, 99.9):.1f}%"
                        })
            
            return resultados

    except Exception as e:
        print(f"Erro interno: {e}")
        raise HTTPException(status_code=500, detail="Erro ao processar recomendação.")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
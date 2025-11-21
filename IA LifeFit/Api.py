from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal, List, Union
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
    LISTA_EXERCICIOS, 
    GRUPOS_MUSCULARES, 
)
from TratamentoDados import enconde_profile

# Configurando a aplicação FastAPI
app = FastAPI(
    title="LifeFit AI API",
    description="Recomenda exercícios personalizados usando Depp Learning, treinado com dados sintéticos, porem, depois refinado com feedback real dos usuários.",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite que qualquer site acesse (em produção, coloque a URL do site)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de Entrada (Validação com Pydantic)
class UserProfile(BaseModel):
    idade: int = Field(..., ge=10, le=100, description="Idade do usuário")
    peso: float = Field(..., gt=0, description="Peso em KG")
    altura: float = Field(..., gt=0, description="Altura em CM")
    genero: Literal["Masculino", "Feminino"]
    atividade: Literal["Sedentario", "Leve", "Moderado", "Alto"]
    objetivo: Literal["Perda de Peso", "Manutenção", "Hipertrofia"]
    foco_muscular: str

class UserProfileInt(BaseModel):
    idade: int = Field(..., ge=10, le=100, description="Idade do usuário")
    peso: float = Field(..., gt=0, description="Peso em KG")
    altura: float = Field(..., gt=0, description="Altura em CM")
    genero: Literal[0, 1]
    atividade: Literal[0, 1, 2, 3]
    objetivo: Literal[0, 1, 2]
    foco_muscular: Literal[0, 1, 2, 3, 4, 5, 6]

# Modelo de Saída (Resposta formatada)
class RecommendationResponse(BaseModel):
    rank: int
    exercicio_nome: str
    exercicio_id: int
    grupo_muscular: str
    grupo_muscular_id: int
    match_score: str

# Carrega o modelo treinado na inicialização da API
ARQUIVO_MODELO = "modelo_treinado.pth"
modelo_ia = None

@app.on_event("startup")
def load_model():
    """
    Esta função roda apenas UMA vez quando a API liga.
    Ela carrega o modelo na memória RAM para ficar rápido.
    """
    global modelo_ia
    
    # Instancia o modelo
    modelo_ia = Modelinho(input_size=TAMANHO_ENTRADA, num_exercises=NUM_EXERCICIOS)
    
    # Carrega os pesos/mente do modelo treinado
    if os.path.exists(ARQUIVO_MODELO):
        try:
            modelo_ia.load_state_dict(torch.load(ARQUIVO_MODELO))
            modelo_ia.eval() # Coloca o modelo em modo de avaliação
            print(f"Modelo '{ARQUIVO_MODELO}' carregado com sucesso!")
        except Exception as e:
            print(f"Erro ao carregar o modelo: {e}")
    else:
        print(f"Arquivo '{ARQUIVO_MODELO}' não encontrado. O modelo não foi carregado.")

# Endpoint de Recomendação
@app.post("/api/v1/recommend", response_model=List[RecommendationResponse])
def recommend_workout(perfil : Union[UserProfile, UserProfileInt]):
    """
    Recebe os dados do usuário e retorna o Top 3 exercícios.
    """
    global modelo_ia

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
        except IndexError:
            raise HTTPException(status_code=400, detail="Índice inválido enviado no UserProfileInt.")
        except KeyError as e:
            raise HTTPException(status_code=400, detail=f"Valor inválido para campo: {e}")
    
    # Valida foco muscular para ver se é válido
    if perfil.foco_muscular not in GRUPOS_MUSCULARES:
        raise HTTPException(status_code=400, detail=f"Foco muscular inválido. Opções: {GRUPOS_MUSCULARES}")
    
    # Verifica se o modelo está carregado
    if modelo_ia is None:
        raise HTTPException(status_code=503, detail="Modelo de IA não está carregado no servidor.")

    try:
        # Transforma o objeto Pydantic em dicionário para sua função encode_profile funcionar
        perfil_dict = perfil.model_dump() 
        
        tensor_entrada = enconde_profile(perfil_dict)
        
        # Gera a predição com o modelo carregado
        with torch.no_grad():
            scores = modelo_ia(tensor_entrada)
            
            # Pega os 3 maiores scores
            values, indices = torch.topk(scores, k=3)
            
            resultados = []
            for i, idx in enumerate(indices[0]):
                id_ex = idx.item()
                score = values[0][i].item()
                
                # Verifica o exercício pelo ID para pegar nome e grupo muscular
                exercicio_encontrado = None
                for ex in LISTA_EXERCICIOS:
                    if ex['id'] == id_ex:
                        exercicio_encontrado = ex
                        break
                
                if exercicio_encontrado:
                    nome = exercicio_encontrado['nome']
                    grupo = exercicio_encontrado['grupo']
                    grupo_id = GRUPOS_MUSCULARES.index(grupo)
                else:
                    nome = "Desconhecido"
                    grupo = "N/A"
                    grupo_id = -1

                # Formata a resposta
                resultados.append({
                    "rank": i + 1,
                    "exercicio_nome": nome,
                    "exercicio_id": id_ex,
                    "grupo_muscular": grupo,
                    "grupo_muscular_id": grupo_id,
                    "match_score": f"{min(score * 100, 99.9):.1f}%"
                })
            
            return resultados

    except Exception as e:
        print(f"Erro interno: {e}")
        raise HTTPException(status_code=500, detail="Erro ao processar a recomendação neural.")

# Bloco para rodar via terminal diretamente
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 
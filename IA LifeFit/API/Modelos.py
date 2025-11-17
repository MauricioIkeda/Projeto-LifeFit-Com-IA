from pydantic import BaseModel

# Dados a serem coletados
# (Valores numericos)
# - Idade
# - Peso (Em kg)
# - Altura (Em cm)
# - Tempo disponivel (30, 45, 60, 90 minutos)
# (Categoricas representadas por embeddings)
# - Genero (Masculino, Feminino)
# - Objetivo (Emagrecer/Cardio, Hipertrofia, Condicionamento Fisico)
# - Nivel de atividade fisica (Sedentario, Leve, Moderado, Intenso)
# - Foco Muscular (Peito, Costas, Pernas, Ombros, Bracos, Core, Cardio)
# - Local de treino (Casa peso corporal, Casa halteres/livres, Academia maquinas)
# - Limitacoes (Nenhuma, Joelho, Lombar, Ombro)

class UserProfile(BaseModel):
    # Atributos Numericos
    idade: int
    peso: float # em kg
    altura: float # em cm
    tempo_disponivel: float # (30, 45, 60, 90) minutos
    
    # Atributos Categóricos
    genero: int # (0: Masculino, 1: Feminino)
    objetivo: int # (0: Emagrecer/Cardio, 1: Hipertrofia, 2: Condicionamento Fisico)
    nivel_atividade_fisica: int # (0: Sedentario, 1: Leve, 2: Moderado, 3: Intenso)
    foco_muscular: int # (0: Peito, 1: Costas, 2: Pernas, 3: Ombros, 4: Bracos, 5: Core, 6: Cardio)
    local_treino: int # (0: Casa peso corporal, 1: Casa halteres/livres, 2: Academia maquinas)
    limitacoes: int # (0: Nenhuma, 1: Joelho, 2: Lombar, 3: Ombro)
    
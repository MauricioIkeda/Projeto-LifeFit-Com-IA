import torch

from Mapeamento import ATIVIDADES, OBJETIVOS, GRUPOS_MUSCULARES

def enconde_profile(profile : dict) -> torch.tensor:
    # Normalização dos dados numéricos
    inputs = [
        profile["idade"] / 100,
        profile["peso"] / 200,
        profile["altura"] / 220,
        1.0 if profile["genero"] == "Masculino" else 0.0
    ]
    
    # One-Hot Encoding para dados categóricos
    
    '''Basicamente uma representação binária para cada categoria
    Ele pega o índice da categoria e marca como 1, o resto fica 0
    Assim toda categoria é representada de forma única no vetor de entrada'''
    
    ativ_hot = [0] * len(ATIVIDADES)
    if profile["atividade"] in ATIVIDADES: 
        ativ_hot[ATIVIDADES.index(profile["atividade"])] = 1
    inputs.extend(ativ_hot)
    
    obj_hot = [0] * len(OBJETIVOS)
    if profile["objetivo"] in OBJETIVOS: 
        obj_hot[OBJETIVOS.index(profile["objetivo"])] = 1
    inputs.extend(obj_hot)
    
    foco_hot = [0] * (len(GRUPOS_MUSCULARES)-1)
    if profile["foco_muscular"] in GRUPOS_MUSCULARES: 
        foco_hot[GRUPOS_MUSCULARES.index(profile["foco_muscular"])] = 1
    else: 
        foco_hot[-1] = 1
    inputs.extend(foco_hot)
    
    return torch.tensor([inputs], dtype=torch.float32)
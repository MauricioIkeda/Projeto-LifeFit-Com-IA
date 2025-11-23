import random

from Mapeamento import GRUPOS_MUSCULARES, OBJETIVOS, ATIVIDADES, LISTA_EXERCICIOS

def GeradorDadosSinteticos(quantidade=5000):
    dados = []
    
    for _ in range(quantidade):
        foco_escolhido = random.choice(GRUPOS_MUSCULARES)
        
        perfil = {
            "idade": random.randint(18, 60),
            "peso": random.randint(50, 100),
            "altura": random.randint(150, 200),
            "genero": random.choice(["Masculino", "Feminino"]),
            "atividade": random.choice(ATIVIDADES),
            "objetivo": random.choice(OBJETIVOS),
            "foco_muscular": foco_escolhido
        }
        
        # Pega todos os IDs de exercícios que correspondem ao foco muscular escolhido
        ids_ex_correspondentes = [ex['id'] for ex in LISTA_EXERCICIOS if ex['grupo'] == foco_escolhido]
        
        # Se não encontrar nenhum exercício específico, usa os de "Cardio/Geral"
        if not ids_ex_correspondentes:
            ids_ex_correspondentes = [ex['id'] for ex in LISTA_EXERCICIOS if ex['grupo'] == "Cardio/Geral"]
            
        # Adiciona nos dados um treino positivo para os exercícios correspondentes
        for id_ex in ids_ex_correspondentes:
            dados.append((perfil, id_ex, 1.0))
        
        # Adiciona treinos negativos para exercícios aleatórios que não correspondem ao foco
        # E que não estão na lista de exercícios correspondentes
        ids_ex_errados = [ex['id'] for ex in LISTA_EXERCICIOS if ex['id'] not in ids_ex_correspondentes]
        
        if ids_ex_errados:
            # Treina negativo para 3 exercicios com foco errado, para reforçar o que NÃO fazer
            for _ in range(3):
                id_ex_errado = random.choice(ids_ex_errados)
                dados.append((perfil, id_ex_errado, 0.0))
                
    return dados
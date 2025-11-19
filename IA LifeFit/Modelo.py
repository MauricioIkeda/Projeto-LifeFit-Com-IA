import torch
import torch.nn as nn

class Modelinho(nn.Module):
    # Inicialização do modelo, passando o tamanho da entrada e o número de exercícios
    def __init__(self, input_size, num_exercises):
        super().__init__()
        
        # Rede Neural Simples com 2 Camadas Ocultas e ReLU como Ativação 
        self.network = nn.Sequential(
            nn.Linear(input_size, 128), # Camada de entrada para 128 neurônios 
            nn.ReLU(), # Função de ativação ReLU, serve para introduzir não-linearidade
            nn.Linear(128, 64), # Camada oculta de 128 para 64 neurônios
            nn.ReLU(), # Outra ReLU
            nn.Linear(64, num_exercises) # Camada de saída para o número de exercícios
        )
    
    # Definição do método forward (propagação para frente)
    def forward(self, x):
        return self.network(x) # Passa a entrada pela rede definida acima e retorna a saída
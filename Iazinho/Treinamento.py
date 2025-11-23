import torch
import torch.nn as nn
import torch.optim as optim

from Modelo import Modelinho
from Mapeamento import TAMANHO_ENTRADA, NUM_EXERCICIOS
from TratamentoDados import enconde_profile
from GeradorDadoSintetico import GeradorDadosSinteticos

# 1. DEFINIÇÃO DO MODELO, CRITÉRIO E OTIMIZADOR
modelo = Modelinho(TAMANHO_ENTRADA, NUM_EXERCICIOS) # Instancia o modelo com o tamanho de entrada e número de exercícios

criterio = nn.MSELoss() # Função de perda: Mean Squared Error

otimizador = optim.Adam(modelo.parameters(), lr=0.005) # Otimizador Adam com taxa de aprendizado de 0.005
    
def TreinarModelo(perfil, id_exercicio, feedback):
    entrada = enconde_profile(perfil) # Função para codificar o perfil em tensor
    pred = modelo(entrada) # Passa o perfil codificado pelo modelo para obter a predição
    score = pred[0][id_exercicio] # Obtém a predição específica para o exercício dado pelo ID
    label = torch.tensor(float(feedback), dtype=torch.float32) # Converte o feedback em tensor float32
    
    perda = criterio(score, label) # Calcula a perda entre a predição e o feedback real
    
    otimizador.zero_grad() # Zera os gradientes acumulados
    perda.backward() # Propaga o erro para calcular os gradientes
    otimizador.step() # Atualiza os pesos do modelo com base nos gradientes calculados
    return perda.item() # Retorna o valor da perda como número float

# 2. GERAÇÃO DE DADOS SINTÉTICOS E TREINAMENTO DO MODELO
# Gera dados sintéticos para treinamento
dados = GeradorDadosSinteticos()

# Treina o modelo com os dados sintéticos gerados
for i, (perfil, id_ex, label) in enumerate(dados):
    loss = TreinarModelo(perfil, id_ex, label)
    if i % 1000 == 0: print(f"Progress: {i}/{len(dados)} | Loss: {loss:.4f}")

# Salva o modelo treinado em um arquivo
torch.save(modelo.state_dict(), "modelo_treinado.pth")
print("Treinamento concluído e modelo salvo como 'modelo_treinado.pth'")
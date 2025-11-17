import torch
import torch.nn as nn
from torch.optim.lr_scheduler import ReduceLROnPlateau
from torch.utils.data import DataLoader

from Modelo import FitnessModel
from Dataset import FitnessDatasetColdStartTrain

# Configurando o dispositivo para treino, GPU se disponível senão CPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Parâmetros de configuração constantes
DATA_FOLDER = "ModeloV3/Dados"

DATASET_CSV = f"{DATA_FOLDER}/DatasetLindo.csv"
SCALER_PATH = f"{DATA_FOLDER}/scaler_lindo.joblib"
NOME_MODELO_SALVO = f"{DATA_FOLDER}/modelo_lindo_final.pth"
NUM_EXERCICIOS = 76
NUM_EPOCHS = 100
BATCH_SIZE = 64

# Instanciando o dataset de treino para Cold Start
dataset = FitnessDatasetColdStartTrain(
    csv_path=DATASET_CSV,
    scaler_path=SCALER_PATH,
    fit_scaler=True,
    number_of_exercices=NUM_EXERCICIOS
)

# Criando o DataLoader para o dataset de treino, com shuffle ativado para melhor generalização
train_loader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

# Instanciando o modelo
model = FitnessModel(number_of_exercices=NUM_EXERCICIOS, input_size=36).to(device)
model.train() # Coloca o modelo em modo de treino (ativa Dropout, BatchNorm, etc.)

# Definindo a função de perda, otimizador e scheduler
loss_rank = nn.BCEWithLogitsLoss() # Função de perda para ranking
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3) # Otimizador Adam com taxa de aprendizagem 0.001
scheduler = ReduceLROnPlateau(optimizer, 'max', factor=0.1, patience=10) # Scheduler para reduzir a taxa de aprendizagem quando a métrica parar de melhorar

print("Iniciando Treinamento Cold Start")

# Loop de treinamento
for epoch in range(NUM_EPOCHS):
    
    total_loss_epoch = 0
    total_win_epoch = 0
    
    for batch in train_loader:
        
        # Movendo os dados para o dispositivo configurado (GPU ou CPU)
        # Separando os inputs e alvos do batch criados pelo DataSet
        # Usando DataLoader para obter batches
        input = batch["input"].to(device)
        exercice_target_multihot = batch["target_multihot"].to(device)
        exercice_target_original = batch["target_original"].to(device)
        
        output_dict = model(input) # Output do modelo para o batch atual
        logits_ranking = output_dict["logits_ranking"] # Logits para ranking de exercícios
        
        loss = loss_rank(logits_ranking, exercice_target_multihot) # Calculando a perda de ranking usando BCEWithLogitsLoss
        
        optimizer.zero_grad() # Zerando os gradientes antes do backward pass
        loss.backward() # Backpropagation para calcular os gradientes
        optimizer.step() # Atualizando os pesos do modelo com os gradientes calculados
        
        # Acumulando a perda total do epoch
        total_loss_epoch += loss.item()
        
        # Calculando acertos (hits) para métricas
        preds = output_dict["topk_indices"].cpu() # Índices previstos dos top-k exercícios
        targets = exercice_target_original.cpu() # Índices reais dos exercícios alvo
        
        batch_wins = 0
        for i in range(preds.shape[0]):
            preds_set = set(preds[i].numpy())
            targets_set = set(targets[i].numpy())
            batch_wins += len(preds_set.intersection(targets_set))
            
        total_win_epoch += batch_wins
        
    # Fim do epoch - calculando métricas médias
    num_batches = len(train_loader) # Número de batches no epoch
    total_possible_hits = len(dataset) * 5 # Cada amostra tem 5 exercícios alvo
    avg_accuracy = total_win_epoch / total_possible_hits # Acurácia média do epoch
    avg_loss = total_loss_epoch / num_batches # Perda média do epoch
    
    print(f"Epoch [{epoch+1}/{NUM_EPOCHS}] - Loss: {avg_loss:.4f}, Accuracy: {avg_accuracy:.4f}")
    
    scheduler.step(avg_accuracy) # Atualizando o scheduler com a acurácia média do epoch
    
# Salvando o modelo treinado após o treinamento completo
torch.save(model.state_dict(), NOME_MODELO_SALVO)
print(f"Modelo salvo como {NOME_MODELO_SALVO}!")
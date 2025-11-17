import torch
import torch.nn as nn

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

class FitnessModel(nn.Module):
    def __init__(self, number_of_exercices=52, input_size=36, dropout_rate=0.3):
        super().__init__()
        
        # Iniciando variaveis
        self.number_of_exercices = number_of_exercices
        self.input_size = input_size
        self.dropout_rate = dropout_rate
        
        # Embeddings para variaveis categoricas
        self.gender_emb = nn.Embedding(2, 4)  # Masculino, Feminino
        self.objective_emb = nn.Embedding(3, 6)  # Emagrecer/Cardio, Hipertrofia, Condicionamento Fisico
        self.activity_level_emb = nn.Embedding(4, 6)  # Sedentario, Leve, Moderado, Intenso
        self.muscle_focus_emb = nn.Embedding(7, 6)  # Peito, Costas, Pernas, Ombros, Braços, Core, Cardio
        self.training_location_emb = nn.Embedding(3, 4)  # Casa (Peso Corporal), Casa (Halteres/Livres), Academia (Máquinas)
        self.limitations_emb = nn.Embedding(4, 6)  # Nenhuma, Joelho, Lombar, Ombro
        
        self.exercices_emb = nn.Embedding(number_of_exercices, 64)
        
        self.backbone = nn.Sequential(
            nn.Linear(self.input_size, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(self.dropout_rate),
            
            nn.Linear(128, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(self.dropout_rate),
            
            nn.Linear(64, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(self.dropout_rate)
        )
        
        self.ranking_head = nn.Sequential(
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 1)
        )
        
    def treat_data(self, x):
        # Dividindo os dados de entrada
        
        # Dados numericos
        x_numeric = x[:, :4]
        
        # Dados categoricos
        gender = x[:, 4].long()
        objective = x[:, 5].long()
        activity_level = x[:, 6].long()
        muscle_focus = x[:, 7].long()
        training_location = x[:, 8].long()
        limitations = x[:, 9].long()
        
        # Aplicando embeddings nas variaveis categoricas
        gender_embedded = self.gender_emb(gender)
        objective_embedded = self.objective_emb(objective)
        activity_level_embedded = self.activity_level_emb(activity_level)
        muscle_focus_embedded = self.muscle_focus_emb(muscle_focus)
        training_location_embedded = self.training_location_emb(training_location)
        limitations_embedded = self.limitations_emb(limitations)
        
        # Concatenando todas as features
        user_features = torch.cat((
            x_numeric,
            gender_embedded,
            objective_embedded,
            activity_level_embedded,
            muscle_focus_embedded,
            training_location_embedded,
            limitations_embedded
        ), dim=1)
        
        return user_features
        
    def forward(self, x):
        # Processando os dados de entrada, separando numericos e categoricos e aplicando embeddings
        user_features = self.treat_data(x)
        # Extraindo o vetor de perfil do usuario
        user_profile_vector = self.backbone(user_features)

        # Expandindo o vetor de perfil do usuario para combinar com todos os exercicios, ou seja, clonando para cada exercicio
        user_profile_vector_expanded = user_profile_vector.unsqueeze(1).expand(-1, self.number_of_exercices, -1)
        
        # Obtendo os vetores de todos os exercicios e deixando no formato adequado para concatenacao
        all_exercices_vectors = self.exercices_emb.weight.unsqueeze(0).expand(user_profile_vector.shape[0], -1, -1)
        
        # Concatenando o vetor do usuario com os vetores de todos os exercicios
        features = torch.cat((user_profile_vector_expanded, all_exercices_vectors), dim=2)
        
        # Transformando para o formato adequado para a rede de ranking, 2 dimensoes ( batch_size * number_of_exercices, features_dim )
        features_flat = features.reshape(user_profile_vector.shape[0]*self.number_of_exercices, -1)
        
        # Obtendo os logits de ranking para todos os exercicios
        logits_ranking = self.ranking_head(features_flat).reshape(user_profile_vector.shape[0], self.number_of_exercices)
        
        # Selecionando os top k exercicios com maiores logits de ranking
        topk_logits, topk_indices = torch.topk(logits_ranking, k=5, dim=1) 
        
        return {
            "logits_ranking": logits_ranking, # Logits de ranking para todos os exercicios
            "topk_logits": topk_logits, # Logits dos top k exercicios
            "topk_indices": topk_indices # Indices dos top k exercicios
        }
import torch
from torch.utils.data import Dataset
import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib
import numpy as np 

class FitnessDatasetColdStartTrain(Dataset):
    def __init__(self, csv_path, scaler_path="scaler_lindo.joblib", fit_scaler=True, number_of_exercices=52):
        
        # Carregar o dataset do CSV
        try:
            df = pd.read_csv(csv_path)
        except FileNotFoundError:
            print(f"ERRO: Dataset '{csv_path}' não encontrado!")
            exit()
        
        # Definir colunas numericas, categóricas e de alvo
        self.number_of_exercices = number_of_exercices
        self.numeric_cols = ["idade", "peso", "altura", "tempo_sessao"]
        self.categoric_cols = ["genero", "objetivo", "nivel", "foco_muscular", "local_treino", "limitacoes"]
        self.target_cols = [f"ex{i}" for i in range(1, 6)]
        
        # Normalizar dados numéricos e salvar/carregar o scaler
        if fit_scaler:
            self.scaler = StandardScaler()
            
            df[self.numeric_cols] = self.scaler.fit_transform(df[self.numeric_cols])
            joblib.dump(self.scaler, scaler_path)
        else:
            self.scaler = joblib.load(scaler_path)
            df[self.numeric_cols] = self.scaler.transform(df[self.numeric_cols])
        
        # Prepara tensores de input (x) e alvo (targets)
        self.x_data = torch.tensor(df[self.numeric_cols + self.categoric_cols].values, dtype=torch.float32)
        self.exercises_original = torch.tensor(df[self.target_cols].values, dtype=torch.long)

        # Transforma alvos em multi-hot encoding
        self.exercices_multihot = torch.zeros(len(df), self.number_of_exercices, dtype=torch.float32)
        self.exercices_multihot.scatter_(1, self.exercises_original.long(), 1.0)
        
    def __len__(self):
        return len(self.x_data)
    
    def __getitem__(self, idx):
        return {
            "input": self.x_data[idx],
            "target_original": self.exercises_original[idx],
            "target_multihot": self.exercices_multihot[idx]
        }
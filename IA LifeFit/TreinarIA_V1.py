from sqlalchemy import create_engine
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import torch
import torch.nn as nn
import torch.optim as optim

user = "postgres"
password = "1234"
host = "localhost"
port = "5432"
dbname = "TreinamentoIA"

engine = create_engine(f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{dbname}")

df = pd.read_sql("""
    SELECT d.*, e.nome AS exercicio_nome
    FROM dadinhos d
    JOIN exercicios e ON d.exercicio = e.id
""", engine)

num_cols = ['idade', 'peso', 'altura']
cat_cols = ['nivel_atividade', 'objetivo', 'genero', 'experiencia', 'exercicio']

preprocess = ColumnTransformer([
    ('num', MinMaxScaler(), num_cols),
    ('cat', OneHotEncoder(handle_unknown='ignore'), cat_cols)
])

X_proc = preprocess.fit_transform(df[num_cols + cat_cols])
y = torch.tensor(df['avaliacao'].values, dtype=torch.float32).unsqueeze(1).to('cuda')

X = torch.tensor(X_proc.toarray() if hasattr(X_proc, "toarray") else X_proc, dtype=torch.float32).to('cuda')

class RecomendadorExercicios(nn.Module):
    def __init__(self, input_size, hidden_size=64):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.Sigmoid()
        )


    def forward(self, x):
        return self.net(x)

input_size = X.shape[1]
model = RecomendadorExercicios(input_size).to('cuda')
criterion = nn.BCELoss()
optimizer = optim.Adam(model.parameters(), lr=0.0005)

print("\nInicio do treinamento do modelo...\n")
for epoch in range(4000):
    optimizer.zero_grad()
    output = model(X)
    loss = criterion(output, y)
    loss.backward()
    optimizer.step()

    if epoch % 100 == 0:
        print(f"Época {epoch:04d} | Loss = {loss.item():.6f}")

print("\nTreinamento finalizado!")

torch.save(model.state_dict(), "modelo_recomendador.pt")
print("Modelo salvo")

import joblib
joblib.dump(preprocess, "preprocess.pkl")
print("Preprocessador salvo\n")
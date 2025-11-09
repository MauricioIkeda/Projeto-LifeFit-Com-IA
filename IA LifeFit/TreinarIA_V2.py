from sqlalchemy import create_engine
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
import torch
import torch.nn as nn
import torch.optim as optim
import joblib

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

print(f"Dados carregados: {len(df)} registros")

num_cols = ['idade', 'peso', 'altura']
cat_cols = ['nivel_atividade', 'objetivo', 'genero', 'experiencia', 'exercicio']

preprocess = ColumnTransformer([
    ('num', MinMaxScaler(), num_cols),
    ('cat', OneHotEncoder(handle_unknown='ignore'), cat_cols)
])

X_proc = preprocess.fit_transform(df[num_cols + cat_cols])
y = df['avaliacao'].values

# Divide em treino e validação (80/20)
X_train, X_val, y_train, y_val = train_test_split(
    X_proc, y, test_size=0.2, random_state=42, stratify=y
)

def to_tensor(data, target):
    data_t = torch.tensor(
        data.toarray() if hasattr(data, "toarray") else data,
        dtype=torch.float32
    ).to('cuda')
    target_t = torch.tensor(target, dtype=torch.float32).unsqueeze(1).to('cuda')
    return data_t, target_t

X_train_t, y_train_t = to_tensor(X_train, y_train)
X_val_t, y_val_t = to_tensor(X_val, y_val)

# Modelinho da rede neural
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

input_size = X_train_t.shape[1]
model = RecomendadorExercicios(input_size).to('cuda')
criterion = nn.BCELoss()
optimizer = optim.Adam(model.parameters(), lr=0.0005)

patience = 15
best_val_loss = float('inf')
patience_counter = 0
max_epochs = 4000

print("\nIniciando Treino\n")
for epoch in range(max_epochs):
    # Treino
    model.train()
    optimizer.zero_grad()
    output = model(X_train_t)
    loss = criterion(output, y_train_t)
    loss.backward()
    optimizer.step()

    # Validação
    model.eval()
    with torch.no_grad():
        val_output = model(X_val_t)
        val_loss = criterion(val_output, y_val_t)
        preds = (val_output > 0.5).float()
        acc = (preds == y_val_t).float().mean()

    # Early Stopping
    if val_loss.item() < best_val_loss:
        best_val_loss = val_loss.item()
        patience_counter = 0
        torch.save(model.state_dict(), "modelo_recomendador.pt")
    else:
        patience_counter += 1

    # Debugging
    if epoch % 100 == 0:
        print(f"Época {epoch:04d} | "
              f"Loss Treino: {loss.item():.6f} | "
              f"Loss Val: {val_loss.item():.6f} | "
              f"Acurácia: {acc.item()*100:.2f}% | "
              f"Patience: {patience_counter}/{patience}")

    # Parada quando atingir a paciência máxima
    if patience_counter >= patience:
        print(f"\nParada ativada na época {epoch}. Melhor Loss de Validação: {best_val_loss:.6f}")
        break

print("\nTreinamento finalizado!")

joblib.dump(preprocess, "preprocess.pkl")
print("Modelo e preprocessador salvos com sucesso!")
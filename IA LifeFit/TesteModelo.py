from sqlalchemy import create_engine
import pandas as pd
import torch
import torch.nn as nn
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

preprocess = joblib.load("preprocess.pkl")
print("Preprocessador carregado")

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

dummy_X = preprocess.transform(df[num_cols + cat_cols])
input_size = dummy_X.shape[1]

model = RecomendadorExercicios(input_size).to('cuda')
model.load_state_dict(torch.load("modelo_recomendador.pt"))
model.eval()

def sugerir_exercicios(perfil_dict, exercicios_df, model, preprocess, threshold=0):
    recomendados = []
    for _, ex in exercicios_df.iterrows():
        linha = perfil_dict.copy()
        linha['exercicio'] = ex["ID"]
        linha_df = pd.DataFrame([linha])

        entrada_proc = preprocess.transform(linha_df)
        entrada_tensor = torch.tensor(entrada_proc.toarray(), dtype=torch.float32).to('cuda')

        prob = model(entrada_tensor).item()
        if prob >= threshold:
            recomendados.append((ex["Treino"], round(prob, 3)))

    recomendados.sort(key=lambda x: x[1], reverse=True)
    return recomendados

perfil_teste = {
    "idade": 21,          # anos
    "peso": 127,          # kg
    "altura": 185,        # cm
    "nivel_atividade": 1, # (ex: 0=sedentário, 1=leve, 2=moderado, 3=intenso)
    "objetivo": 0,        # (ex: 0=perda de peso, 1=manutenção, 2=ganho muscular)
    "genero": 0,          # (ex: 0=masculino, 1=feminino)
    "experiencia": 1      # (ex: 0=iniciante, 1=intermediário, 2=avançado)
}

exercicios_df = pd.read_csv("treinos_completo.csv")

recs = sugerir_exercicios(perfil_teste, exercicios_df, model, preprocess, threshold=0)

if len(recs) == 0:
    print("Nenhum exercício recomendado")
else:
    print("Exercícios recomendados:")
    for nome, prob in recs[:10]:
        print(f" - {nome}: {prob*100:.1f}% de recomendação")
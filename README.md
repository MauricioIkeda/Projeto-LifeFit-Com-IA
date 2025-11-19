# 🧠 LifeFit – Recomendador Inteligente de Exercícios

O LifeFit é um sistema fitness acadêmico composto por três módulos que trabalham juntos:

1. **API ASP.NET C#**  
   - controla o banco **PostgreSQL**  
   - gerencia perfis, exercícios e feedbacks  
   - envia dados para a IA via FastAPI

2. **IA em Python (PyTorch)**  
   - recebe um perfil já estruturado pela API  
   - aplica **normalização manual** e **one-hot encoding manual**  
   - calcula recomendações de exercícios via rede neural

3. **FastAPI (Python)**  
   - age como ponte HTTP entre a API ASP.NET e o módulo de IA

---

## 🌐 Visão Geral da Arquitetura

```
flowchart LR
    U[Usuario] --> API[API ASP.NET]
    API --> DB[(PostgreSQL)]
    API --> FA[FastAPI - Comunicacao]
    FA --> IA[Modelo PyTorch (Python)]
    IA --> FA
    FA --> API
    API --> U
````

Fluxo resumido:

1. O usuário interage com o a API (futuramente front react).
2. A API ASP.NET grava/consulta o PostgreSQL.
3. Quando é preciso gerar recomendações, a API ASP.NET envia um perfil para a **FastAPI**.
4. A FastAPI prepara os dados e envia para o módulo de IA em PyTorch.
5. A IA retorna as probabilidades de recomendação para cada exercício.
6. A API responde ao cliente com a recomendação final.

---

## 🧠 IA (Python + PyTorch)

A pasta **`IA LifeFit/`** contém:

* Rede neural em PyTorch
* Normalização manual (mín–máx)
* One-Hot Encoding manual
* Scripts de treino/teste
* Servidor FastAPI para exposição do modelo

---

## 🛠 Tecnologias

### Módulo IA (Python)

* Python 3.11+
* PyTorch
* FastAPI
* Uvicorn (servidor)
* Estruturas próprias de normalização e encoding
  *(nenhuma dependência scikit-learn)*

### API ASP.NET (C#)

* ASP.NET Core
* Banco de dados PostgreSQL
* Comunicação HTTP com a FastAPI

---

## 📁 Estrutura do Repositório

```text
LifeFit/
├── IA LifeFit/
│   ├── FastAPI/                # Ponte entre a API ASP.NET e a IA
│   ├── Modelinho.py            # Rede neural em PyTorch
│   ├── Mapeamento.py           # Dados gerais
│   ├── treino.py               # Treinador do modelo
│   ├── teste.py                # Testes de recomendação
│   ├── modelo_recomendador.pt  # Pesos salvos
│   └── ...
│
├── Fitzinho/                   # Projeto API asp net
│   └── Fitzinho/
│       ├── Controllers/
│       ├── Models/
│       ├── Services/
│       └── ...
│
├── LICENSE
└── README.md
```
---

## 🤖 Como Rodar a IA

### 1. Instalar dependências

```bash
pip install torch fastapi uvicorn
```

### 2. Rodar o servidor FastAPI

```bash
uvicorn Main:app --reload
```

A FastAPI expõe endpoints como:

```
POST /recomendar
```

Que recebem um perfil e retornam uma lista de exercícios com probabilidades.

### 3. Treinar o modelo

```bash
python treino.py
```

Isso gera:

* `modelo_recomendador.pt`

---

## 💻 ASP.NET C# – API + PostgreSQL

A API ASP.NET é responsável por:

* cadastrar perfis
* registrar treinos
* salvar feedbacks
* consultar exercícios
* preparar o payload da IA
* enviar a requisição HTTP para a FastAPI

Exemplo simplificado de fluxo:

```csharp
var perfil = GetPerfil(id);
var response = await http.PostAsJsonAsync("http://localhost:8000/recomendar", perfil);
var recomendacoes = await response.Content.ReadFromJsonAsync<List<ExercicioRecomendado>>();
```

---

## 🔮 Próximos Passos

* Treinamento incremental com novos feedbacks
* Front-end (React ou MAUI)

---

## 📄 Licença

MIT License – disponível em `LICENSE`.
---

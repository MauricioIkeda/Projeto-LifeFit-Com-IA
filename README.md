# 🧠 LifeFit — Recomendador Inteligente de Exercícios

O **LifeFit** é um sistema de recomendação de exercícios físicos baseado em **Inteligência Artificial**, desenvolvido em **Python + PyTorch** e integrado a um banco de dados **PostgreSQL**.  
Ele aprende a partir de perfis de usuários e feedbacks de treinos, sugerindo exercícios personalizados com base em **idade, peso, altura, nível de atividade, objetivo, gênero e experiência**.

---

## 🚀 Tecnologias Utilizadas

| Categoria | Tecnologias |
|------------|--------------|
| Linguagem | 🐍 Python 3.14 |
| Machine Learning | 🧠 PyTorch |
| Banco de Dados | 🐘 PostgreSQL + SQLAlchemy |
| Pré-processamento | 🧩 Scikit-learn (`MinMaxScaler`, `OneHotEncoder`, `ColumnTransformer`) |
| Persistência | 💾 Joblib (para salvar o preprocessador) |
| GPU (opcional) | ⚡ CUDA (treinamento acelerado) |

---

## ⚙️ Estrutura do Projeto

```

IA-LifeFit/
│
├── TreinarIA.py              # Script original de treino do modelo
├── TreinarIA2.py             # Versão aprimorada com validação e early stopping
├── TestarModelo.py           # Script para carregar o modelo e gerar recomendações
│
├── modelo_recomendador.pt    # Pesos treinados do modelo PyTorch
├── preprocess.pkl            # Preprocessador salvo (scaler + encoder)
│
└── treinos_completo.csv      # Base de dados com lista de exercícios

````

---

## 🏋️ Como Funciona

1. **Coleta de Dados**
   - Os perfis e feedbacks de treinos são salvos no banco `TreinamentoIA`, nas tabelas:
     - `perfil`
     - `exercicios`
     - `feedback`
     - `feedback_exercicio` (contém os relacionamentos feedback → perfil → exercício)

2. **Pré-processamento**
   - As colunas numéricas (idade, peso, altura) são normalizadas com `MinMaxScaler`.
   - As categóricas (nível de atividade, objetivo, gênero, experiência e exercício) são codificadas com `OneHotEncoder`.

3. **Treinamento**
   - O modelo é uma **rede neural densa (feedforward)**:
     ```
     [Input] → 64 → 32 → 16 → [Sigmoid Output]
     ```
   - Função de perda: `BCELoss`
   - Otimizador: `Adam`
   - Treinamento com **validação (80/20)** e **Early Stopping** automático.

4. **Recomendações**
   - O modelo gera uma **probabilidade de recomendação (0–1)** para cada exercício.
   - O sistema exibe as sugestões acima de um `threshold` de 0.5, mas pode ser configurado para sem.

---

## 🧩 Exemplo de Uso

### 🔹 Treinar o Modelo
```bash
python TreinarIA2.py
````

Saída esperada:

```
Iniciando Treino

Época 0000 | Loss Treino: 0.57 | Loss Val: 0.56 | Acurácia: 97.5%
Época 0800 | Loss Treino: 0.01 | Loss Val: 0.02 | Acurácia: 99.1%
Parada ativada na época 1200. Melhor Loss de Validação: 0.018432

Treinamento finalizado!
Modelo e preprocessador salvos com sucesso!
```

---

### 🔹 Testar Recomendações

```python
perfil_teste = {
    "idade": 21,          # anos
    "peso": 127,          # kg
    "altura": 185,        # cm
    "nivel_atividade": 1, # (ex: 0=sedentário, 1=leve, 2=moderado, 3=intenso)
    "objetivo": 0,        # (ex: 0=perda de peso, 1=manutenção, 2=ganho muscular)
    "genero": 0,          # (ex: 0=masculino, 1=feminino)
    "experiencia": 1      # (ex: 0=iniciante, 1=intermediário, 2=avançado)
}

Exercícios recomendados:
 - bicicleta ergométrica: 94.9% de recomendação
 - mountain climbers: 94.2% de recomendação
 - polichinelo: 91.0% de recomendação
 - remada curvada: 49.6% de recomendação
 - burpee: 47.3% de recomendação
 - elevação de quadril: 46.4% de recomendação
 - supino reto: 26.0% de recomendação
 - agachamento livre: 9.7% de recomendação
 - abdominal tradicional: 8.8% de recomendação
 - leg press: 8.5% de recomendação
```

---

## 📊 Estrutura do Banco de Dados

```sql
CREATE TABLE exercicios (
	id SERIAL PRIMARY KEY NOT NULL,
	nome VARCHAR(50) NOT NULL
);

CREATE TABLE perfil (
	id SERIAL PRIMARY KEY NOT NULL,
	idade INT NOT NULL,
	peso INT NOT NULL,
	altura INT NOT NULL,
	nivel_atividade INT NOT NULL,
	objetivo INT NOT NULL,
	genero INT NOT NULL,
	experiencia INT NOT NULL
);

CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    id_perfil INT NOT NULL,
    objetivo INT NOT NULL,
    CONSTRAINT fk_perfil FOREIGN KEY (id_perfil)
        REFERENCES perfil (id)
        ON DELETE CASCADE
);

CREATE TABLE feedback_exercicio (
    id_feedback INT NOT NULL,
    id_exercicio INT NOT NULL,
    avaliacao INT NOT NULL,
    PRIMARY KEY (id_feedback, id_exercicio),
    FOREIGN KEY (id_feedback) REFERENCES feedback (id) ON DELETE CASCADE,
    FOREIGN KEY (id_exercicio) REFERENCES exercicios (id) ON DELETE CASCADE
);
```

---

## 🧠 Lógica de Aprendizado

Cada linha da tabela `dadinhos` representa um **exemplo de treino**:

```
perfil → exercício → avaliação (0 = não recomendado | 1 = recomendado)
```

Com o tempo, quanto mais feedbacks forem inseridos, mais o modelo aprende os padrões:

* perfis com sobrepeso → priorizam cardio e alta intensidade;
* perfis magros → priorizam força e compostos (supino, agachamento etc.);
* perfis iniciantes → recebem sugestões seguras e progressivas.

---

## 🧩 Funcionalidades em Desenvolvimento

* [ ] Interface Web com React e ASP.NET API CRUD.
* [ ] Feedback contínuo para retreinar o modelo em tempo real.
* [ ] Módulos extras como sugestões de alimentação e intensidade de treinos.

---

## 💻 Requisitos

* Python 3.11+
* PostgreSQL 14+
* CUDA Toolkit (opcional)
* Bibliotecas:

  ```bash
  pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu126
  ```

---

## 🧾 Licença

Este projeto está sob a licença MIT.
Sinta-se livre para usar, estudar e aprimorar o IA LifeFit 🚀

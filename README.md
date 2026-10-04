# Atividade 02 · Aula 05 · CRUD de Notas (API + Front-end)

**Disciplina:** Frameworks Front-end · ADS SENAI · 2026-2
**Aluno:** Amós Santos

Aplicação de notas com **back-end em Express.js** (API REST com CRUD completo, dados em `data.json`) e **front-end em React (Vite)** que consome essa API.

## Links

| Item | Link |
|------|------|
| Repositório | https://github.com/AmosSantos02/Aula-5-Atividade-2-CRUD-Notas |
| Deploy do back-end (Render) | _preencher depois do deploy_ |
| Deploy do front-end (Vercel) | _preencher depois do deploy_ |

## Estrutura

```text
Aula-5-Atividade-2-CRUD-Notas/
├── backend/                 API Express (deploy no Render)
│   ├── server.js            configuração do app (CORS, JSON, erros)
│   ├── routes/notes.js      rotas do CRUD e validação
│   ├── services/notesStore.js   leitura e escrita do data.json
│   ├── test/notes.test.js   testes automáticos
│   ├── data.json            armazenamento das notas
│   └── package.json
├── frontend/                React + Vite (deploy na Vercel)
│   ├── src/App.jsx          tela e estado
│   ├── src/api.js           chamadas à API
│   ├── src/App.css
│   ├── .env.example         modelo da variável VITE_API_URL
│   └── package.json
└── prints/                  prints para o documento da atividade
```

## Rotas da API

| Método | Rota | Descrição | Resposta |
|--------|------|-----------|----------|
| GET | `/api/notes` | Lista todas as notas | 200 |
| GET | `/api/notes/:id` | Busca uma nota | 200 ou 404 |
| POST | `/api/notes` | Cria nota (`titulo` e `texto` obrigatórios) | 201 ou 400 |
| PUT | `/api/notes/:id` | Atualiza nota (`titulo` e `texto` obrigatórios) | 200, 400 ou 404 |
| DELETE | `/api/notes/:id` | Remove nota | 204 ou 404 |

Exemplo de nota:

```json
{ "id": "1791153394001", "titulo": "Estudar", "texto": "Revisar Express" }
```

## Como rodar localmente

Back-end (porta 3000):

```bash
cd backend
npm install
npm start        # ou npm run dev para reiniciar ao salvar
npm test         # roda os testes do CRUD
```

Front-end (porta 5173):

```bash
cd frontend
npm install
cp .env.example .env     # aponta para http://localhost:3000
npm run dev
```

## Deploy

Ordem recomendada: back-end primeiro (precisa da URL dele no front).

### 1. Back-end no Render

1. Render > **New** > **Web Service** e conecte o repositório `Aula-5-Atividade-2-CRUD-Notas`.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Depois que o front estiver no ar, adicione a variável de ambiente `CORS_ORIGIN` com a URL da Vercel (sem barra no final) para liberar só o seu front.
6. Teste abrindo `https://SEU-APP.onrender.com/api/notes` (deve devolver `[]`).

### 2. Front-end na Vercel

1. Vercel > **Add New** > **Project** e importe o mesmo repositório.
2. **Root Directory:** `frontend`
3. **Framework Preset:** Vite (detecta sozinho).
4. Em **Environment Variables**, crie `VITE_API_URL` com a URL do Render (sem barra no final).
5. Deploy. Se mudar a variável depois, faça um novo deploy, porque o Vite grava o valor durante o build.

> No plano gratuito do Render a API "dorme" após alguns minutos parada, então a primeira requisição pode demorar uns 30 a 60 segundos. Além disso o disco é temporário: as notas do `data.json` voltam ao estado do repositório quando o serviço reinicia ou faz novo deploy. Isso entra na reflexão 2.

## Prints (para o documento da atividade)

Salve os prints na pasta `prints/` com estes nomes e inclua no documento final:

- [ ] `codigo-server.png` (server.js)
- [ ] `codigo-rotas.png` (routes/notes.js)
- [ ] `codigo-front.png` (App.jsx)
- [ ] `app-lista.png` (notas listadas)
- [ ] `app-criar.png` (criando uma nota)
- [ ] `app-editar.png` (editando uma nota)
- [ ] `app-excluir.png` (depois de excluir)
- [ ] `render-deploy.png` (serviço no ar no Render)
- [ ] `vercel-deploy.png` (projeto no ar na Vercel)

## Questões para refletir

### 1. Quais são os riscos de segurança desse projeto e como poderiam ser eliminados ou mitigados?

| Risco | Como mitigar |
|-------|--------------|
| **Sem autenticação nem autorização.** Qualquer pessoa com a URL cria, edita e apaga qualquer nota. | Login (JWT ou sessão) e vincular cada nota a um usuário, validando no back-end que só o dono altera. |
| **CORS aberto (`*`).** Qualquer site pode chamar a API pelo navegador do visitante. | Restringir à origem do front com `CORS_ORIGIN` (já suportado no código). |
| **Sem limite de requisições.** Dá para encher o `data.json` de lixo ou derrubar o serviço. | `express-rate-limit`, limite de tamanho do corpo e limite de notas por usuário. |
| **Entrada sem validação** poderia gravar texto malicioso (XSS armazenado) que outro front, menos cuidadoso que o React, exibiria como HTML. | Validar e sanitizar no back-end (Zod, Joi), manter os limites de tamanho e nunca renderizar texto como HTML. |
| **IDs previsíveis** (`Date.now()`) permitem adivinhar IDs de outras notas. | Usar `crypto.randomUUID()` e checar permissão por nota. |
| **Cabeçalhos de segurança ausentes e dados em arquivo sem controle de acesso.** | `helmet`, HTTPS (o Render já entrega) e dados em um banco com usuário e senha próprios. |

### 2. Usar um arquivo JSON (`data.json`) para armazenar notas é uma boa prática em produção? Vantagens e desvantagens?

**Não.** Serve para protótipo e para aprender CRUD.

- **Vantagens:** zero configuração e zero dependência, fácil de ler e editar à mão, ótimo para estudar e para demonstrações.
- **Desvantagens:**
  - **Concorrência.** Duas requisições simultâneas leem o mesmo estado, e a última a gravar sobrescreve a alteração da outra.
  - **Sem transações, índices ou consultas.** Não há busca, filtro, ordenação nem relacionamento eficientes.
  - **Disco efêmero em hospedagens como o Render.** Os dados se perdem em reinício ou novo deploy.
  - **Não escala.** Com mais de uma instância do servidor cada uma teria o seu próprio arquivo.
  - **Sem backup, controle de acesso ou auditoria.**

### 3. Quais limitações um servidor baseado em arquivo JSON teria com 10.000 registros?

- A cada requisição o arquivo inteiro é lido e convertido (`readFileSync` + `JSON.parse`). Isso **bloqueia o event loop** do Node e deixa todas as outras requisições esperando.
- Toda criação, edição ou exclusão **reescreve o arquivo completo**, então o custo cresce junto com o número de notas e aumenta a chance de conflito entre escritas.
- `GET /api/notes` devolve as 10.000 notas de uma vez. Falta **paginação**, e a resposta fica pesada para o servidor, a rede e o navegador.
- Buscar por ID percorre o array inteiro (custo proporcional ao tamanho), sem índice.
- O arquivo e o array ficam inteiros na memória, e o plano gratuito tem pouca RAM.
- Não existe busca por texto, filtro nem ordenação eficiente.

Caminho natural: migrar para um banco (SQLite, PostgreSQL ou MongoDB) e adicionar paginação (`?page=1&limit=20`).

### 4. O código atual está todo em `server.js`. Por que isso é problemático e como você melhoraria a organização da lógica?

**Problemas de um arquivo só:**

- Mistura responsabilidades (configuração, rotas, validação e acesso a dados), o que dificulta a leitura e a manutenção.
- É difícil de testar: não dá para testar a regra de uma rota sem subir o servidor e mexer no arquivo de dados real.
- Trocar o `data.json` por um banco exigiria alterar todas as rotas.
- Em equipe, todo mundo edita o mesmo arquivo e gera conflitos no Git.
- Não cresce: cada nova funcionalidade deixa o arquivo maior e mais confuso.

**O que foi feito neste projeto:**

- `server.js` cuida só da configuração do app.
- `routes/notes.js` cuida das rotas e da validação.
- `services/notesStore.js` é a única parte que sabe que os dados vivem em um arquivo JSON.
- Existem testes automáticos (`npm test`) porque agora o `app` pode ser importado sem subir o servidor.

**Próximos passos possíveis:** separar `controllers/`, mover a validação para `middlewares/` ou para um schema (Zod), centralizar variáveis em `config/` e trocar o `notesStore` por um banco sem tocar nas rotas.

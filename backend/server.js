// Ponto de entrada da API de notas.
// A logica de rotas e de armazenamento fica em outras pastas (routes e services).
const express = require('express');
const cors = require('cors');
const notesRouter = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS: em producao, defina CORS_ORIGIN com a URL do front-end (ex.: https://meu-front.vercel.app)
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// Le o corpo das requisicoes em JSON (substitui o body-parser no Express 5)
app.use(express.json());

// Rota de saude, util para o Render saber que a API esta no ar
app.get('/', (req, res) => {
  res.json({ status: 'ok', mensagem: 'API de Notas no ar', rotas: '/api/notes' });
});

app.use('/api/notes', notesRouter);

// Rota nao encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Tratamento de erros (JSON invalido no corpo, falhas inesperadas)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido' });
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

// So sobe o servidor quando o arquivo e executado direto (permite importar o app nos testes)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;

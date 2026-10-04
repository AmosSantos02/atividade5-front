// Rotas do CRUD de notas, montadas em /api/notes
const express = require('express');
const store = require('../services/notesStore');

const router = express.Router();

const MAX_TITULO = 100;
const MAX_TEXTO = 2000;

// Valida e limpa os dados recebidos. Retorna { erro } ou { dados }.
function validar(body) {
  const titulo = typeof body?.titulo === 'string' ? body.titulo.trim() : '';
  const texto = typeof body?.texto === 'string' ? body.texto.trim() : '';

  if (!titulo || !texto) {
    return { erro: 'Os campos titulo e texto são obrigatórios' };
  }
  if (titulo.length > MAX_TITULO) {
    return { erro: `O titulo pode ter no máximo ${MAX_TITULO} caracteres` };
  }
  if (texto.length > MAX_TEXTO) {
    return { erro: `O texto pode ter no máximo ${MAX_TEXTO} caracteres` };
  }
  return { dados: { titulo, texto } };
}

// GET /api/notes - lista todas as notas
router.get('/', (req, res) => {
  res.json(store.list());
});

// GET /api/notes/:id - busca uma nota
router.get('/:id', (req, res) => {
  const nota = store.getById(req.params.id);
  if (!nota) return res.status(404).json({ erro: 'Nota não encontrada' });
  res.json(nota);
});

// POST /api/notes - cria uma nota
router.post('/', (req, res) => {
  const { erro, dados } = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  res.status(201).json(store.create(dados));
});

// PUT /api/notes/:id - atualiza uma nota
router.put('/:id', (req, res) => {
  const { erro, dados } = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const nota = store.update(req.params.id, dados);
  if (!nota) return res.status(404).json({ erro: 'Nota não encontrada' });
  res.json(nota);
});

// DELETE /api/notes/:id - remove uma nota (204 = sucesso sem corpo)
router.delete('/:id', (req, res) => {
  const removida = store.remove(req.params.id);
  if (!removida) return res.status(404).json({ erro: 'Nota não encontrada' });
  res.status(204).end();
});

module.exports = router;

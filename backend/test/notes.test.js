// Testes automaticos do CRUD. Rode com: npm test
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Usa um arquivo temporario para nao mexer no data.json real
const tmpFile = path.join(os.tmpdir(), `notas-test-${Date.now()}.json`);
process.env.DATA_FILE = tmpFile;

const app = require('../server');
let server;
let base;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://localhost:${server.address().port}`;
});

after(() => {
  server.close();
  fs.rmSync(tmpFile, { force: true });
});

const json = (method, url, body) =>
  fetch(base + url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

test('fluxo completo do CRUD', async () => {
  // lista vazia
  let res = await json('GET', '/api/notes');
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(await res.json(), []);

  // cria
  res = await json('POST', '/api/notes', { titulo: 'Estudar', texto: 'Express' });
  assert.strictEqual(res.status, 201);
  const nota = await res.json();
  assert.strictEqual(nota.titulo, 'Estudar');
  assert.ok(nota.id);

  // busca por id
  res = await json('GET', `/api/notes/${nota.id}`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual((await res.json()).texto, 'Express');

  // atualiza
  res = await json('PUT', `/api/notes/${nota.id}`, { titulo: 'Estudar mais', texto: 'CRUD' });
  assert.strictEqual(res.status, 200);
  assert.strictEqual((await res.json()).titulo, 'Estudar mais');

  // remove
  res = await json('DELETE', `/api/notes/${nota.id}`);
  assert.strictEqual(res.status, 204);

  // confirma que sumiu
  res = await json('GET', `/api/notes/${nota.id}`);
  assert.strictEqual(res.status, 404);
});

test('rejeita dados invalidos', async () => {
  let res = await json('POST', '/api/notes', { titulo: '', texto: 'x' });
  assert.strictEqual(res.status, 400);

  res = await json('POST', '/api/notes', { titulo: 'x'.repeat(101), texto: 'x' });
  assert.strictEqual(res.status, 400);

  res = await fetch(`${base}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{quebrado',
  });
  assert.strictEqual(res.status, 400);
});

test('retorna 404 para nota inexistente e rota desconhecida', async () => {
  let res = await json('PUT', '/api/notes/nao-existe', { titulo: 'a', texto: 'b' });
  assert.strictEqual(res.status, 404);

  res = await json('DELETE', '/api/notes/nao-existe');
  assert.strictEqual(res.status, 404);

  res = await json('GET', '/rota-qualquer');
  assert.strictEqual(res.status, 404);
});

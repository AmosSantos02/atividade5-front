// Camada de armazenamento: unica parte do projeto que sabe que os dados vivem em um arquivo JSON.
// Se um dia trocar por um banco de dados, so este arquivo muda.
const fs = require('fs');
const path = require('path');

const FILE = process.env.DATA_FILE || path.join(__dirname, '..', 'data.json');

function readNotes() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  // Escreve em um arquivo temporario e renomeia, para nao corromper o JSON se a escrita for interrompida
  const tmp = `${FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(notes, null, 2));
  fs.renameSync(tmp, FILE);
}

function list() {
  return readNotes();
}

function getById(id) {
  return readNotes().find((n) => n.id === id) || null;
}

function create({ titulo, texto }) {
  const notes = readNotes();
  const nota = { id: Date.now().toString(), titulo, texto };
  notes.push(nota);
  saveNotes(notes);
  return nota;
}

function update(id, { titulo, texto }) {
  const notes = readNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index < 0) return null;
  notes[index] = { ...notes[index], titulo, texto };
  saveNotes(notes);
  return notes[index];
}

function remove(id) {
  const notes = readNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index < 0) return false;
  notes.splice(index, 1);
  saveNotes(notes);
  return true;
}

module.exports = { list, getById, create, update, remove };

import { useEffect, useState } from 'react';
import { listarNotas, criarNota, atualizarNota, excluirNota } from './api.js';

const FORM_VAZIO = { id: null, titulo: '', texto: '' };

export default function App() {
  const [notas, setNotas] = useState([]);
  const [form, setForm] = useState(FORM_VAZIO);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      setNotas(await listarNotas());
      setErro('');
    } catch {
      setErro('Não foi possível carregar as notas. A API pode estar iniciando, tente de novo em alguns segundos.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const dados = { titulo: form.titulo, texto: form.texto };
    try {
      if (form.id) {
        await atualizarNota(form.id, dados);
      } else {
        await criarNota(dados);
      }
      setForm(FORM_VAZIO);
      await carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await excluirNota(id);
      if (form.id === id) setForm(FORM_VAZIO);
      await carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <main className="container">
      <h1>Notas</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
          maxLength={100}
          required
        />
        <textarea
          name="texto"
          placeholder="Texto"
          value={form.texto}
          onChange={handleChange}
          maxLength={2000}
          rows={4}
          required
        />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {form.id ? 'Atualizar nota' : 'Criar nota'}
          </button>
          {form.id && (
            <button type="button" className="btn" onClick={() => setForm(FORM_VAZIO)}>
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      {erro && <p className="erro" role="alert">{erro}</p>}
      {carregando && <p className="aviso">Carregando notas...</p>}
      {!carregando && !erro && notas.length === 0 && (
        <p className="aviso">Nenhuma nota ainda. Crie a primeira acima.</p>
      )}

      <section className="notas-grid">
        {notas.map((nota) => (
          <article key={nota.id} className="nota">
            <h2>{nota.titulo}</h2>
            <p>{nota.texto}</p>
            <div className="nota-actions">
              <button className="btn" onClick={() => setForm(nota)}>Editar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(nota.id)}>Excluir</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

// Funcoes que conversam com a API. O endereco vem da variavel de ambiente VITE_API_URL.
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
const API_URL = `${BASE_URL}/api/notes`;

async function request(url, options) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let mensagem = 'Algo deu errado. Tente novamente.';
    try {
      const corpo = await res.json();
      if (corpo.erro) mensagem = corpo.erro;
    } catch {
      // resposta sem JSON, mantem a mensagem padrao
    }
    throw new Error(mensagem);
  }

  // DELETE responde 204 (sem corpo)
  return res.status === 204 ? null : res.json();
}

export const listarNotas = () => request(API_URL);

export const criarNota = (nota) =>
  request(API_URL, { method: 'POST', body: JSON.stringify(nota) });

export const atualizarNota = (id, nota) =>
  request(`${API_URL}/${id}`, { method: 'PUT', body: JSON.stringify(nota) });

export const excluirNota = (id) => request(`${API_URL}/${id}`, { method: 'DELETE' });

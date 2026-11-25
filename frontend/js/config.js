// O único arquivo que sabe onde a API mora.
// No seu notebook, a API local; publicado, a API do Render.
const LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname);

export const API_URL = LOCAL
  ? 'http://localhost:3000'
  : 'https://p1-leticia-clinica-api.onrender.com';   // sem barra no final

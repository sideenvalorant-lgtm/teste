const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
// ===============================
// INÍCIO
// ===============================
console.log("INICIANDO SERVIDOR...");

// ===============================
// IMPORTAÇÕES
// ===============================
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');

//VERIFICAO CARACTERES ESPECIAIS EMAIL//
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// ===============================
// APP
// ===============================
const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'public')));


// ===============================
// BANCO DE DADOS
// ===============================
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) // garante que seja número
});
// ===============================
// TESTE DE CONEXÃO COM BANCO
// ===============================
pool.connect()
  .then(() => console.log("PostgreSQL conectado com sucesso"))
  .catch(err => console.error("Erro ao conectar no banco:", err));

// ===============================
// ROTA TESTE
// ===============================
app.get('/', (req, res) => {
  res.send('Servidor de login funcionando');
});

// ===============================
// CADASTRO
// ===============================
app.post('/register', async (req, res) => {
  const { username, email, senha } = req.body;

  if (!username || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }

  if (senha.length < 7) {
  return res.status(400).json({ erro: 'A senha deve ter no mínimo 7 caracteres' });
}
if (!emailRegex.test(email)) {
return res.status(400).json({erro: 'Email inválido'})
}
  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query(
      'INSERT INTO usuarios (username, email, senha_hash) VALUES ($1,$2,$3)',
      [username, email, senhaHash]
    );

    res.json({ mensagem: 'Usuário cadastrado com sucesso' });

  } catch (err) {
    console.error(err);
    res.status(400).json({ erro: 'Usuário ou email já existe' });
  }
});

// ===============================
// LOGIN
// ===============================
app.post('/login', async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }

  const result = await pool.query(
    'SELECT id, senha_hash FROM usuarios WHERE username=$1 OR email=$1',
    [login]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ erro: 'Usuário não encontrado' });
  }

  const usuario = result.rows[0];
  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

  if (!senhaValida) {
    return res.status(401).json({ erro: 'Senha incorreta' });
  }

  res.json({
    mensagem: 'Login realizado com sucesso',
  });
});

// ===============================
// INICIAR SERVIDOR
// ===============================
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

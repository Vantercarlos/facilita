const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'cliente',
  password: 'Elporgxa',
  port: 5432,
});

client.connect();

// Endpoint para listar clientes
app.get('/clientes', async (req, res) => {
  const result = await client.query('SELECT * FROM clientes');
  res.json(result.rows);
});

// Endpoint para cadastrar clientes
app.post('/clientes', async (req, res) => {
  const { nome, email, telefone } = req.body;

  // Verifica se o cliente já existe pelo e-mail
  const existingClient = await client.query('SELECT * FROM clientes WHERE email = $1', [email]);

  if (existingClient.rows.length > 0) {
    return res.status(409).json({ error: 'Cliente com o mesmo e-mail já cadastrado.' });
  }

  // Se não existir, insere o novo cliente
  const result = await client.query(
    'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
    [nome, email, telefone]
  );

  res.json(result.rows[0]);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

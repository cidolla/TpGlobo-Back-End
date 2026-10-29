const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do teleprompter funcionando');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    horario: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({
    mensagem: 'Rota não encontrada.'
  });
});

module.exports = app;
//server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Nuevo: Para manejar rutas de archivos
const compression = require('compression'); // Nuevo: Para compresión gzip
const { poolConnect, sql } = require('./db');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Configuración CORS (mantén tu configuración actual)
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'https://todolist-yessi-c021cb750183.herokuapp.com/'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

// Middlewares
app.use(cors(corsOptions));
app.use(compression()); // Nuevo: Compresión gzip para mejor rendimiento
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de API (DEBEN ir antes del static)
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Endpoint de verificación
app.get('/health', async (req, res) => {
  try {
    await poolConnect;
    const result = await sql.query`SELECT 1 AS status`;
    res.status(200).json({
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
});

// =============================================
// SERVIR FRONTEND REACT (solo en producción)
// =============================================
if (process.env.NODE_ENV === 'production') {
  // 1. Servir archivos estáticos del build de React
  app.use(express.static(path.join(__dirname, '../todo-app/build'), {
    maxAge: '1y',
    setHeaders: function (res, filePath) {
      if (filePath.includes('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));
  // 2. Manejar todas las rutas no definidas devolviendo el index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../todo-app/build/index.html'));
  });
}

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌐 Accesible en: http://localhost:${PORT}`);
});
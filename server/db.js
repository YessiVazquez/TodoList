// server/db.js
const sql = require("mssql");

// Configuración de conexión a Azure SQL
const config = {
  user: process.env.DB_USER || 'sistemas',
  password: process.env.DB_PASSWORD || 'Inge1234',
  server: process.env.DB_SERVER || 'todobackend-server.database.windows.net',
  database: process.env.DB_NAME || 'TodoApp',
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on('error', err => {
  console.error('Error en la conexión al pool:', err);
});

module.exports = {
  sql,
  pool,
  poolConnect,
  getRequest: async () => {
    await poolConnect;
    return pool.request();
  }
};


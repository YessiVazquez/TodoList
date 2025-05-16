//server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  console.error('ERROR: La variable de entorno JWT_SECRET no está definida.');
  // Opcional: lanzar error para detener la app en desarrollo
  // throw new Error('JWT_SECRET no está definida');
}

const authenticate = (req, res, next) => {
  // Obtener token de varios lugares posibles
  const token = req.header('Authorization')?.replace('Bearer ', '') || 
                req.headers.authorization?.replace('Bearer ', '') || 
                req.query.token;
  
  if (!token) {
    return res.status(401).json({ 
      error: true,
      message: 'Acceso denegado. No hay token proporcionado.'
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (!decoded.id) {
      return res.status(401).json({
        error: true,
        message: 'Token inválido: falta id del usuario.'
      });
    }

    req.user = {
      id: Number(decoded.id),  // Convertir a número explícitamente
      username: decoded.username
    };
    next();
  } catch (err) {
    console.error('Error de autenticación:', err);
    res.status(401).json({
      error: true,
      message: 'Token inválido o expirado.'
    });
  }
};

module.exports = authenticate;

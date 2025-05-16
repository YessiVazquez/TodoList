// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, pool, poolConnect } = require('../db');


// Configuración JWT con valores por defecto para desarrollo
const JWT_SECRET = process.env.JWT_SECRET || 'development_secret';
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES || '1h';

// Registro
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ 
                error: true,
                message: "Todos los campos son requeridos",
                required: ['username', 'email', 'password']
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                error: true,
                message: "La contraseña debe tener al menos 6 caracteres" 
            });
        }

        await poolConnect;

        const userExists = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .query('SELECT id FROM users WHERE username = @username OR email = @email');
        
        if (userExists.recordset.length > 0) {
            return res.status(400).json({ 
                error: true,
                message: "El usuario o email ya existe" 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertResult = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('password_hash', sql.NVarChar, hashedPassword)
            .query(`
                INSERT INTO users (username, email, password_hash)
                OUTPUT INSERTED.id, INSERTED.username, INSERTED.email
                VALUES (@username, @email, @password_hash)
            `);

        const newUser = insertResult.recordset[0];

        const token = jwt.sign(
            { 
                id: newUser.id, 
                username: newUser.username 
            }, 
            JWT_SECRET, 
            { expiresIn: TOKEN_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            },
            token,
            expiresIn: TOKEN_EXPIRES_IN
        });
    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ 
            error: true,
            message: "Error en el registro",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});


// Login
// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ 
                error: true,
                message: "Usuario y contraseña son requeridos" 
            });
        }

        await poolConnect;  // Esperamos que la conexión esté lista
        const request = pool.request();

        const result = await request
            .input('username', sql.NVarChar, username)
            .query('SELECT id, username, email, password_hash FROM users WHERE username = @username');

        if (result.recordset.length === 0) {
            return res.status(400).json({ 
                error: true,
                message: "Credenciales inválidas" 
            });
        }

        const user = result.recordset[0];

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ 
                error: true,
                message: "Credenciales inválidas" 
            });
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username 
            }, 
            JWT_SECRET, 
            { expiresIn: TOKEN_EXPIRES_IN }
        );

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token,
            expiresIn: TOKEN_EXPIRES_IN
        });

    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ 
            error: true,
            message: "Error en el login",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});


// Verificar token
router.get('/verify', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ 
            error: true,
            message: 'Token no proporcionado' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({
            valid: true,
            user: {
                id: decoded.id,
                username: decoded.username
            },
            expiresIn: decoded.exp 
        });
    } catch (err) {
        res.status(401).json({
            error: true,
            message: 'Token inválido o expirado',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router;

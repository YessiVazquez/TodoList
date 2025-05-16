// server/routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const { sql, pool, poolConnect } = require('../db');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

// GET todos del usuario actual con sus categorías
router.get('/', async (req, res) => {
  try {
    await poolConnect;

    const result = await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query(`
        SELECT 
          t.id, 
          t.title, 
          t.content,
          t.completed,
          t.created_at,
          t.category_id,
          c.name AS category_name
        FROM todos t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = @user_id
        ORDER BY t.created_at DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener todos:', err);
    res.status(500).send('Error al obtener las notas');
  }
});

// POST nueva nota
router.post('/', async (req, res) => {
  const { title, content = '', category_id } = req.body;

  if (!title || !category_id) {
    return res.status(400).send('Título y categoría son requeridos');
  }

  try {
    await poolConnect;

    const request = pool.request();

    // Validar categoría
    const categoryCheck = await request
      .input('category_id', sql.Int, category_id)
      .input('user_id', sql.Int, req.user.id)
      .query(`
        SELECT id FROM categories 
        WHERE id = @category_id AND (user_id IS NULL OR user_id = @user_id)
      `);

    if (categoryCheck.recordset.length === 0) {
      return res.status(403).send('Categoría no válida');
    }

    // Insertar nota
    const insertResult = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('content', sql.NVarChar, content)
      .input('completed', sql.Bit, 0)
      .input('user_id', sql.Int, req.user.id)
      .input('category_id', sql.Int, category_id)
      .query(`
        INSERT INTO todos (title, content, completed, user_id, category_id)
        OUTPUT INSERTED.id
        VALUES (@title, @content, @completed, @user_id, @category_id)
      `);

    const newId = insertResult.recordset[0].id;

    const newNote = await pool.request()
      .input('id', sql.Int, newId)
      .query(`
        SELECT 
          t.id, t.title, t.content, t.completed, t.created_at, t.category_id, 
          c.name AS category_name
        FROM todos t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = @id
      `);

    res.status(201).json(newNote.recordset[0]);
  } catch (err) {
    console.error('Error al crear nota:', err);
    res.status(500).send('Error al crear la nota');
  }
});

// PATCH toggle completado
router.patch('/:id/toggle', async (req, res) => {
  const { id } = req.params;

  try {
    await poolConnect;

    const request = pool.request()
      .input('id', sql.Int, id)
      .input('user_id', sql.Int, req.user.id);

    const noteCheck = await request.query(`
      SELECT completed FROM todos WHERE id = @id AND user_id = @user_id
    `);

    if (noteCheck.recordset.length === 0) {
      return res.status(404).send('Nota no encontrada');
    }

    const current = noteCheck.recordset[0].completed;
    const newStatus = current ? 0 : 1;

    await request
      .input('completed', sql.Bit, newStatus)
      .query(`
        UPDATE todos SET completed = @completed WHERE id = @id AND user_id = @user_id
      `);

    const updatedNote = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          t.id, t.title, t.content, t.completed, t.created_at, t.category_id, 
          c.name AS category_name
        FROM todos t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = @id
      `);

    res.json(updatedNote.recordset[0]);
  } catch (err) {
    console.error('Error al actualizar nota:', err);
    res.status(500).send('Error al actualizar la nota');
  }
});

// DELETE notas completadas
router.delete('/completed', async (req, res) => {
  try {
    await poolConnect;

    await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query(`
        DELETE FROM todos WHERE completed = 1 AND user_id = @user_id
      `);

    res.sendStatus(204);
  } catch (err) {
    console.error('Error al eliminar notas completadas:', err);
    res.status(500).send('Error al eliminar notas completadas');
  }
});

// DELETE nota por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await poolConnect;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('user_id', sql.Int, req.user.id)
      .query(`
        DELETE FROM todos OUTPUT DELETED.id 
        WHERE id = @id AND user_id = @user_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).send('Nota no encontrada');
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('Error al eliminar nota:', err);
    res.status(500).send('Error al eliminar la nota');
  }
});

// GET categorías
router.get('/categories', async (req, res) => {
  try {
    await poolConnect;

    const result = await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query(`
        SELECT id, name 
        FROM categories 
        WHERE user_id IS NULL OR user_id = @user_id
        ORDER BY name
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).send('Error al obtener categorías');
  }
});

// POST nueva categoría
router.post('/categories', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send('Nombre de categoría es requerido');
  }

  try {
    await poolConnect;

    const insertResult = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('user_id', sql.Int, req.user.id)
      .query(`
        INSERT INTO categories (name, user_id)
        OUTPUT INSERTED.id, INSERTED.name
        VALUES (@name, @user_id)
      `);

    res.status(201).json(insertResult.recordset[0]);
  } catch (err) {
    console.error('Error al crear categoría:', err);
    res.status(500).send('Error al crear categoría');
  }
});

module.exports = router;

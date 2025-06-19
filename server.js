const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();

const PORT = process.env.PORT || 1000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Solo esta línea

// POST /registro
app.post('/registro', (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  const insertQuery = `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`;
  db.run(insertQuery, [nombre, email, password], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ message: "Este email ya está registrado." });
      }
      return res.status(500).json({ message: "Error al registrar el usuario." });
    }
    res.json({ message: "Usuario registrado exitosamente." });
  });
});

// GET /datos
app.get('/datos', (req, res) => {
  const selectQuery = `SELECT id, nombre, email FROM usuarios`;
  db.all(selectQuery, [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error al obtener los datos." });
    res.json(rows);
  });
});

// DELETE /eliminar/:id
app.delete('/eliminar/:id', (req, res) => {
  const { id } = req.params;

  const deleteQuery = `DELETE FROM usuarios WHERE id = ?`;
  db.run(deleteQuery, [id], function (err) {
    if (err) return res.status(500).json({ message: "Error al eliminar el usuario." });

    if (this.changes === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json({ message: "Usuario eliminado correctamente." });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

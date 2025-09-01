require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// CORS: allow local React dev server
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ---- DB POOL (more robust than single connection) ----
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_marks',
  waitForConnections: true,
  connectionLimit: 10,
});

// Simple helper to run queries with placeholders
const q = (sql, params = []) =>
  new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });

// ---- Health check ----
app.get('/health', async (req, res) => {
  try {
    await q('SELECT 1');
    res.json({ ok: true });
  } catch (err) {
    console.error('DB health error:', err);
    res.status(500).json({ ok: false, error: err.code || 'DB_ERROR' });
  }
});

// ---- List marks ----
app.get('/list', async (req, res) => {
  try {
    const rows = await q('SELECT id, name, marks FROM marks ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('LIST error:', err);
    res.status(500).json({ error: 'Failed to fetch list', details: err.code || err.message });
  }
});

// ---- Add marks ----
app.post('/add', async (req, res) => {
  try {
    let { name, marks } = req.body;

    // Basic validation
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    // Convert to integer
    marks = Number(marks);
    if (!Number.isInteger(marks)) {
      return res.status(400).json({ error: 'Marks must be an integer' });
    }
    if (marks < 0 || marks > 100) {
      return res.status(400).json({ error: 'Marks must be between 0 and 100' });
    }

    const result = await q('INSERT INTO marks (name, marks) VALUES (?, ?)', [name.trim(), marks]);
    res.status(201).json({ message: 'Student Added', id: result.insertId });
  } catch (err) {
    console.error('ADD error:', err);
    res.status(500).json({ error: 'Failed to add marks', details: err.code || err.message });
  }
});

// ---- Delete by id ----
app.delete('/delete/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const result = await q('DELETE FROM marks WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE error:', err);
    res.status(500).json({ error: 'Failed to delete entry', details: err.code || err.message });
  }
});

// ---- 404 + error handlers ----
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});

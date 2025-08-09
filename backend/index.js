const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',       //enter your password for MySQL
    database: 'student_marks'
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected!");
});

app.post('/add', (req, res) => {
    const { name, marks } = req.body;
    db.query('INSERT INTO marks (name, marks) VALUES (?, ?)', [name, marks], (err) => {
        if (err) return res.send(err);
        res.send('Student Added');
    });
});

app.get('/list', (req, res) => {
    db.query('SELECT * FROM marks', (err, results) => {
        if (err) return res.send(err);
        res.json(results);
    });
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM marks WHERE id = ?', [id], (err) => {
        if (err) return res.send(err);
        res.send('Deleted successfully');
    });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));

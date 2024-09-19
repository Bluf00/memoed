const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware to handle JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (like HTML, CSS, JS)
app.use(express.static('../public'));

// Path to your db.json
const dbPath = path.join(__dirname, 'db.json');

// Helper function to read the db.json file
const readNotes = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write to the db.json file
const writeNotes = (notes) => {
  fs.writeFileSync(dbPath, JSON.stringify(notes, null, 2));
};
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
});
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/notes.html'))
});
// API route to get all notes
app.get('/api/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// API route to add a new note
app.post('/api/notes', (req, res) => {
  const notes = readNotes();
  const newNote = {
    id: notes.length ? notes[notes.length - 1].id + 1 : 1, // Generate unique ID
    title: req.body.title,
    text: req.body.text,
  };
  notes.push(newNote);
  writeNotes(notes);
  res.json(newNote);
});

// API route to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const notes = readNotes();
  const updatedNotes = notes.filter((note) => note.id != req.params.id);
  writeNotes(updatedNotes);
  res.json({ success: true });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

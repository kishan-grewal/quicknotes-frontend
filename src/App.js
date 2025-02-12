import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch notes from the Flask API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/notes');
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  // Handle form submission to add a new note
  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/notes', {
        title,
        content,
      });
      setNotes([...notes, response.data]); // Update the notes state with the new note
      setTitle('');  // Clear the input fields
      setContent('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>QuickNotes</h1>
      
      <form onSubmit={handleAddNote} style={{ marginBottom: '20px' }}>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <input
            type="text"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button type="submit" style={{ padding: '5px 10px' }}>Add Note</button>
        </div>
      </form>

      {notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <strong>{note.title}:</strong> {note.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

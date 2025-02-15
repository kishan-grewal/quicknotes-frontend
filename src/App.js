import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Your backend URL (already set to Render):
  const backendURL = 'https://quicknotes-backend-c2da.onrender.com';

  // Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/notes`);
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, [backendURL]);

  // Add a new note
  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendURL}/api/notes`, {
        title,
        content,
      });
      setNotes([...notes, response.data]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Clear all notes (DELETE each note by ID)
  const handleClearNotes = async () => {
    try {
      // Loop over notes and delete them one by one
      for (const note of notes) {
        await axios.delete(`${backendURL}/api/notes/${note.id}`);
      }
      // Then clear the notes in local state
      setNotes([]);
    } catch (error) {
      console.error('Error clearing notes:', error);
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
        <>
          <ul>
            {notes.map((note) => (
              <li key={note.id}>
                <strong>{note.title}:</strong> {note.content}
              </li>
            ))}
          </ul>
          {/* NEW BUTTON BELOW THE LIST */}
          <button onClick={handleClearNotes} style={{ marginTop: '10px' }}>
            Clear All Notes
          </button>
        </>
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './App.module.css'; // Import the CSS module

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Your backend URL
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

  // Clear all notes (calls DELETE for each note)
  const handleClearNotes = async () => {
    try {
      for (const note of notes) {
        await axios.delete(`${backendURL}/api/notes/${note.id}`);
      }
      setNotes([]);
    } catch (error) {
      console.error('Error clearing notes:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>QuickNotes</h1>
      
      <form onSubmit={handleAddNote} className={styles.form}>
        <div>
          <input
            className={styles.formInput}
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className={styles.formInput}
            type="text"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className={styles.button}>
            Add Note
          </button>
        </div>
      </form>

      {notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <>
          <ul className={styles.notesList}>
            {notes.map((note) => (
              <li key={note.id} className={styles.noteItem}>
                <strong>{note.title}:</strong> {note.content}
              </li>
            ))}
          </ul>
          <button onClick={handleClearNotes} className={styles.clearButton}>
            Clear All Notes
          </button>
        </>
      )}
    </div>
  );
}

export default App;

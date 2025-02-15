import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './App.module.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [darkMode, setDarkMode] = useState(false); // <-- Add darkMode state

  const backendURL = 'https://quicknotes-backend-c2da.onrender.com';

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

  // Toggles dark mode on and off
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    // Apply darkMode class conditionally
    <div className={`${styles.container} ${darkMode ? styles.darkMode : ''}`}>
      {/* Top bar with heading and dark mode button */}
      <div className={styles.topBar}>
        <h1 className={styles.header}>QuickNotes</h1>
        <button onClick={toggleDarkMode} className={styles.darkModeButton}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Main content area */}
      <div className={styles.mainArea}>
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
    </div>
  );
}

export default App;

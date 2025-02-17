import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';
import { Snippet } from '../types';
import { styles } from '../styles';

function SnippetList() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract current snippet id from URL if present
  const currentSnippetId = location.pathname.startsWith('/snippet/')
    ? location.pathname.split('/snippet/')[1]
    : '';

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : '';
        fetch(API_ENDPOINTS.SNIPPETS, {
            headers: {
            'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch snippets');
            }
            return res.json();
            })
            .then(setSnippets)
            .catch(error => console.error("Error fetching snippets:", error));
        }, [location]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const snippetId = e.target.value;
    if (snippetId) {
      navigate(`/snippet/${snippetId}`);
    }
  };

  return (
    <div style={styles.snippetListContainer}>
      <label htmlFor="snippet-select">Your Snippets:</label>
      <select
        id="snippet-select"
        onChange={handleSelect}
        value={currentSnippetId}  // Use controlled value here
      >
        <option value="" disabled>
          Select a snippet
        </option>
        {snippets.map(snippet => (
          <option key={snippet.id} value={snippet.id}>
            {snippet.title}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SnippetList;

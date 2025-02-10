import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { Snippet } from '../types';
import { styles } from '../styles';
import { API_ENDPOINTS } from '../config';

const languages = {
  typescript: javascript({ typescript: true }),
  javascript: javascript(),
  python: python(),
  java: java(),
  cpp: cpp()
};

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState<Snippet>({
    title: '',
    content: '',
    language: 'typescript'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(API_ENDPOINTS.SNIPPET(id))
        .then(res => res.json())
        .then(setSnippet);
    }
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:3000/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snippet),
      });
      const savedSnippet = await response.json();
      navigate(`/snippet/${savedSnippet.id}`);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSnippet(prev => ({
          ...prev,
          content: e.target?.result as string
        }));
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={styles.editorContainer}>
      <div style={styles.controls}>
        <input
          style={styles.input}
          type="text"
          placeholder="Title"
          value={snippet.title}
          onChange={(e) => setSnippet(prev => ({ ...prev, title: e.target.value }))}
        />
        <select
          style={styles.select}
          value={snippet.language}
          onChange={(e) => setSnippet(prev => ({ ...prev, language: e.target.value }))}
        >
          {Object.keys(languages).map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <label style={styles.fileLabel}>
          Upload File
          <input
            style={styles.fileInput}
            type="file"
            onChange={handleFileUpload}
          />
        </label>
        <button 
          style={styles.button}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      
      <div style={styles.editorWrapper}>
        <CodeMirror
          value={snippet.content}
          height="600px"
          theme="dark"
          extensions={[languages[snippet.language as keyof typeof languages]]}
          onChange={(value) => setSnippet(prev => ({ ...prev, content: value }))}
        />
      </div>
    </div>
  );
}

export default Editor;
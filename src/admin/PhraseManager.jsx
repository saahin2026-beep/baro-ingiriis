import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const CATEGORIES = ['feedback', 'encouragement', 'celebration'];

export default function PhraseManager() {
  const [phrases, setPhrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('feedback');
  const [editing, setEditing] = useState(null);

  const fetchPhrases = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('phrases')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error) setPhrases(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPhrases(); }, []);

  const filtered = phrases.filter((p) => p.category === category);

  const handleSave = async (phrase) => {
    const payload = {
      category: phrase.category,
      text_so: phrase.text_so,
      emoji: phrase.emoji,
      sort_order: phrase.sort_order,
      is_active: phrase.is_active,
    };

    if (phrase.id) {
      await supabase.from('phrases').update(payload).eq('id', phrase.id);
    } else {
      await supabase.from('phrases').insert({ ...payload, sort_order: filtered.length + 1 });
    }
    setEditing(null);
    fetchPhrases();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this phrase?')) return;
    await supabase.from('phrases').delete().eq('id', id);
    fetchPhrases();
  };

  const toggleActive = async (phrase) => {
    await supabase.from('phrases').update({ is_active: !phrase.is_active }).eq('id', phrase.id);
    fetchPhrases();
  };

  if (loading) return <p style={{ textAlign: 'center', color: '#999', fontFamily: 'Nunito, sans-serif' }}>Loading...</p>;

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 12 }}>
        Phrases
      </h2>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: 'none',
              background: category === cat ? '#0891B2' : '#E0E0E0',
              color: category === cat ? 'white' : '#666',
              fontSize: 12, fontWeight: 700, fontFamily: 'Nunito, sans-serif',
              cursor: 'pointer', textTransform: 'capitalize',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button onClick={() => setEditing({
          category, text_so: '', emoji: '', sort_order: filtered.length + 1, is_active: true,
        })} style={{
          background: '#0891B2', border: 'none', borderRadius: 6, padding: '6px 14px',
          fontSize: 12, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
        }}>
          + Add Phrase
        </button>
      </div>

      {filtered.map((phrase) => (
        <div key={phrase.id} style={{
          background: 'white', borderRadius: 10, padding: '10px 12px', marginBottom: 6,
          border: '1px solid #EEE', opacity: phrase.is_active ? 1 : 0.5,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>{phrase.emoji}</span>
          <span style={{ flex: 1, fontSize: 13, color: '#333', fontFamily: 'Nunito, sans-serif' }}>
            {phrase.text_so}
          </span>
          <button onClick={() => setEditing({ ...phrase })} style={miniBtn('#1E88E5')}>Edit</button>
          <button onClick={() => toggleActive(phrase)} style={miniBtn(phrase.is_active ? '#FF9800' : '#0891B2')}>
            {phrase.is_active ? 'Hide' : 'Show'}
          </button>
          <button onClick={() => handleDelete(phrase.id)} style={miniBtn('#E53935')}>Del</button>
        </div>
      ))}

      {filtered.length === 0 && (
        <p style={{ fontSize: 13, color: '#999', fontFamily: 'Nunito, sans-serif', textAlign: 'center', padding: 20 }}>
          No phrases in this category yet.
        </p>
      )}

      {editing && (
        <PhraseEditModal phrase={editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function miniBtn(color) {
  return {
    background: 'none', border: `1px solid ${color}`, borderRadius: 4, padding: '2px 6px',
    fontSize: 10, fontWeight: 700, color, fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
  };
}

function PhraseEditModal({ phrase, onSave, onClose }) {
  const [form, setForm] = useState({ ...phrase });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const fieldStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0E0E0',
    fontSize: 14, fontFamily: 'Nunito, sans-serif', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 380,
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 16 }}>
          {phrase.id ? 'Edit Phrase' : 'New Phrase'}
        </h3>
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#666', fontFamily: 'Nunito, sans-serif', display: 'block', marginBottom: 4 }}>
            Text (Somali)
          </label>
          <input value={form.text_so} onChange={(e) => setForm({ ...form, text_so: e.target.value })} style={{ ...fieldStyle, marginBottom: 12 }} />

          <label style={{ fontSize: 12, fontWeight: 700, color: '#666', fontFamily: 'Nunito, sans-serif', display: 'block', marginBottom: 4 }}>
            Emoji
          </label>
          <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} style={{ ...fieldStyle, marginBottom: 12 }} placeholder="e.g. Fire, Crown, Trophy" />

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '12px 0', borderRadius: 10, border: '2px solid #E0E0E0',
              background: 'white', fontSize: 14, fontWeight: 700, color: '#666',
              fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            }}>Cancel</button>
            <button type="submit" style={{
              flex: 1, padding: '12px 0', borderRadius: 10, border: 'none',
              background: '#0891B2', fontSize: 14, fontWeight: 700, color: 'white',
              fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function ExerciseEditor({ lessonId }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchExercises = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('sort_order', { ascending: true });
    if (!error) setExercises(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchExercises(); }, [lessonId]);

  const handleSave = async (exercise) => {
    const payload = {
      lesson_id: lessonId,
      type: exercise.type,
      instruction: exercise.instruction,
      prompt: exercise.prompt || null,
      options: exercise.options || null,
      correct_index: exercise.correct_index ?? null,
      sentence: exercise.sentence || null,
      blank_index: exercise.blank_index ?? null,
      correct_sentence: exercise.correct_sentence || null,
      words: exercise.words || null,
      scenario: exercise.scenario || null,
      sort_order: exercise.sort_order,
      is_active: exercise.is_active,
    };

    if (exercise.id) {
      await supabase.from('exercises').update(payload).eq('id', exercise.id);
    } else {
      await supabase.from('exercises').insert({ ...payload, sort_order: exercises.length + 1 });
    }
    setEditing(null);
    fetchExercises();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this exercise?')) return;
    await supabase.from('exercises').delete().eq('id', id);
    fetchExercises();
  };

  const toggleActive = async (ex) => {
    await supabase.from('exercises').update({ is_active: !ex.is_active }).eq('id', ex.id);
    fetchExercises();
  };

  if (loading) return <p style={{ fontSize: 12, color: '#999', fontFamily: 'Nunito, sans-serif' }}>Loading exercises...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#666', fontFamily: 'Nunito, sans-serif' }}>
          Exercises ({exercises.length})
        </span>
        <button onClick={() => setEditing({
          type: 'choose', instruction: '', prompt: '', options: [], correct_index: 0,
          sentence: null, blank_index: null, correct_sentence: null, words: null, scenario: null,
          sort_order: exercises.length + 1, is_active: true,
        })} style={{
          background: '#1E88E5', border: 'none', borderRadius: 6, padding: '4px 12px',
          fontSize: 11, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
        }}>
          + Add
        </button>
      </div>

      {exercises.map((ex) => (
        <div key={ex.id} style={{
          background: '#FAFAFA', borderRadius: 8, padding: '8px 10px', marginBottom: 6,
          border: '1px solid #EEE', opacity: ex.is_active ? 1 : 0.5,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
            background: typeColor(ex.type), borderRadius: 4, padding: '2px 6px',
          }}>
            {ex.type}
          </span>
          <span style={{ flex: 1, fontSize: 12, color: '#666', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {ex.instruction}
          </span>
          <button onClick={() => setEditing({ ...ex })} style={miniBtn('#1E88E5')}>Edit</button>
          <button onClick={() => toggleActive(ex)} style={miniBtn(ex.is_active ? '#FF9800' : '#0891B2')}>
            {ex.is_active ? 'Hide' : 'Show'}
          </button>
          <button onClick={() => handleDelete(ex.id)} style={miniBtn('#E53935')}>Del</button>
        </div>
      ))}

      {editing && (
        <ExerciseEditModal exercise={editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function typeColor(type) {
  const colors = { choose: '#1E88E5', fillgap: '#8E24AA', order: '#FF9800', listen: '#00897B', scenario: '#E53935' };
  return colors[type] || '#666';
}

function miniBtn(color) {
  return {
    background: 'none', border: `1px solid ${color}`, borderRadius: 4, padding: '2px 6px',
    fontSize: 10, fontWeight: 700, color, fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
  };
}

function ExerciseEditModal({ exercise, onSave, onClose }) {
  const [form, setForm] = useState({
    ...exercise,
    options: Array.isArray(exercise.options) ? JSON.stringify(exercise.options) : (exercise.options || '[]'),
    words: Array.isArray(exercise.words) ? JSON.stringify(exercise.words) : (exercise.words || '[]'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = {
      ...exercise,
      type: form.type,
      instruction: form.instruction,
      sort_order: form.sort_order,
      is_active: form.is_active,
    };

    if (form.type === 'choose' || form.type === 'listen') {
      result.prompt = form.prompt;
      result.correct_index = parseInt(form.correct_index) || 0;
      result.options = JSON.parse(form.options || '[]');
    } else if (form.type === 'fillgap') {
      result.sentence = form.sentence;
      result.blank_index = parseInt(form.blank_index) || 0;
      result.correct_index = parseInt(form.correct_index) || 0;
      result.options = JSON.parse(form.options || '[]');
    } else if (form.type === 'order') {
      result.correct_sentence = form.correct_sentence;
      result.words = JSON.parse(form.words || '[]');
    } else if (form.type === 'scenario') {
      result.scenario = form.scenario;
      result.correct_index = parseInt(form.correct_index) || 0;
      result.options = JSON.parse(form.options || '[]');
    }

    onSave(result);
  };

  const fieldStyle = {
    width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #E0E0E0',
    fontSize: 13, fontFamily: 'Nunito, sans-serif', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 460,
        maxHeight: '90vh', overflowY: 'auto',
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 16 }}>
          {exercise.id ? 'Edit Exercise' : 'New Exercise'}
        </h3>
        <form onSubmit={handleSubmit}>
          <Label text="Type" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }}>
            <option value="choose">Choose</option>
            <option value="fillgap">Fill Gap</option>
            <option value="order">Order</option>
            <option value="listen">Listen</option>
            <option value="scenario">Scenario</option>
          </select>

          <Label text="Instruction" />
          <input value={form.instruction} onChange={(e) => setForm({ ...form, instruction: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />

          {(form.type === 'choose' || form.type === 'listen') && (
            <>
              <Label text="Prompt" />
              <input value={form.prompt || ''} onChange={(e) => setForm({ ...form, prompt: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
              <Label text="Options (JSON array)" />
              <textarea value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} rows={2} style={{ ...fieldStyle, marginBottom: 10, resize: 'vertical' }} />
              <Label text="Correct Index" />
              <input type="number" value={form.correct_index ?? 0} onChange={(e) => setForm({ ...form, correct_index: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
            </>
          )}

          {form.type === 'fillgap' && (
            <>
              <Label text="Sentence (JSON array)" />
              <input value={form.sentence || ''} onChange={(e) => setForm({ ...form, sentence: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
              <Label text="Blank Index" />
              <input type="number" value={form.blank_index ?? 0} onChange={(e) => setForm({ ...form, blank_index: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
              <Label text="Options (JSON array)" />
              <textarea value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} rows={2} style={{ ...fieldStyle, marginBottom: 10, resize: 'vertical' }} />
              <Label text="Correct Index" />
              <input type="number" value={form.correct_index ?? 0} onChange={(e) => setForm({ ...form, correct_index: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
            </>
          )}

          {form.type === 'order' && (
            <>
              <Label text="Correct Sentence" />
              <input value={form.correct_sentence || ''} onChange={(e) => setForm({ ...form, correct_sentence: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
              <Label text="Words (JSON array)" />
              <textarea value={form.words} onChange={(e) => setForm({ ...form, words: e.target.value })} rows={2} style={{ ...fieldStyle, marginBottom: 10, resize: 'vertical' }} />
            </>
          )}

          {form.type === 'scenario' && (
            <>
              <Label text="Scenario" />
              <input value={form.scenario || ''} onChange={(e) => setForm({ ...form, scenario: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
              <Label text="Options (JSON array)" />
              <textarea value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} rows={2} style={{ ...fieldStyle, marginBottom: 10, resize: 'vertical' }} />
              <Label text="Correct Index" />
              <input type="number" value={form.correct_index ?? 0} onChange={(e) => setForm({ ...form, correct_index: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
            </>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '10px 0', borderRadius: 8, border: '2px solid #E0E0E0',
              background: 'white', fontSize: 13, fontWeight: 700, color: '#666',
              fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            }}>Cancel</button>
            <button type="submit" style={{
              flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
              background: '#1E88E5', fontSize: 13, fontWeight: 700, color: 'white',
              fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Label({ text }) {
  return (
    <label style={{ fontSize: 11, fontWeight: 700, color: '#999', fontFamily: 'Nunito, sans-serif', display: 'block', marginBottom: 3 }}>
      {text}
    </label>
  );
}

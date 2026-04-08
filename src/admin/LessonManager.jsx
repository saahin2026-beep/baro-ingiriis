import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import ExerciseEditor from './ExerciseEditor';

export default function LessonManager() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);

  const fetchLessons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error) setLessons(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLessons(); }, []);

  const handleSave = async (lesson) => {
    const payload = {
      title_so: lesson.title_so,
      title_en: lesson.title_en,
      ability: lesson.ability,
      explanation: lesson.explanation,
      chunks: lesson.chunks,
      sort_order: lesson.sort_order,
      is_active: lesson.is_active,
    };

    if (lesson.id) {
      await supabase.from('lessons').update(payload).eq('id', lesson.id);
    } else {
      await supabase.from('lessons').insert({ ...payload, sort_order: lessons.length + 1 });
    }
    setEditing(null);
    fetchLessons();
  };

  const handleReorder = async (index, direction) => {
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= lessons.length) return;

    const a = lessons[index];
    const b = lessons[swapIndex];
    await supabase.from('lessons').update({ sort_order: b.sort_order }).eq('id', a.id);
    await supabase.from('lessons').update({ sort_order: a.sort_order }).eq('id', b.id);
    fetchLessons();
  };

  const toggleActive = async (lesson) => {
    await supabase.from('lessons').update({ is_active: !lesson.is_active }).eq('id', lesson.id);
    fetchLessons();
  };

  if (loading) return <p style={{ textAlign: 'center', color: '#999', fontFamily: 'Nunito, sans-serif' }}>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif' }}>
          Lessons ({lessons.length})
        </h2>
        <button onClick={() => setEditing({
          title_so: '', title_en: '', ability: '', explanation: [], chunks: [], sort_order: lessons.length + 1, is_active: true,
        })} style={{
          background: '#0891B2', border: 'none', borderRadius: 8, padding: '8px 16px',
          fontSize: 13, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
        }}>
          + Add Lesson
        </button>
      </div>

      {lessons.map((lesson, i) => (
        <div key={lesson.id} style={{
          background: 'white', borderRadius: 12, padding: '12px 14px', marginBottom: 8,
          border: '1px solid #E0E0E0', opacity: lesson.is_active ? 1 : 0.5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#999', fontFamily: 'Nunito, sans-serif', width: 24 }}>
              {lesson.sort_order}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#333', fontFamily: 'Nunito, sans-serif' }}>
                {lesson.title_so}
              </p>
              <p style={{ fontSize: 12, color: '#999', fontFamily: 'Nunito, sans-serif' }}>
                {lesson.title_en}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <SmallBtn label="▲" onClick={() => handleReorder(i, -1)} disabled={i === 0} />
              <SmallBtn label="▼" onClick={() => handleReorder(i, 1)} disabled={i === lessons.length - 1} />
              <SmallBtn label="Edit" onClick={() => setEditing({ ...lesson })} />
              <SmallBtn
                label={lesson.is_active ? 'Hide' : 'Show'}
                onClick={() => toggleActive(lesson)}
                color={lesson.is_active ? '#FF9800' : '#0891B2'}
              />
              <SmallBtn
                label="Exercises"
                onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                color="#1E88E5"
              />
            </div>
          </div>
          {expandedLesson === lesson.id && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #F0F0F0' }}>
              <ExerciseEditor lessonId={lesson.id} />
            </div>
          )}
        </div>
      ))}

      {/* Edit modal */}
      {editing && (
        <LessonEditModal
          lesson={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function SmallBtn({ label, onClick, disabled, color = '#666' }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: 'none', border: `1px solid ${disabled ? '#E0E0E0' : color}`,
      borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 700,
      color: disabled ? '#CCC' : color, fontFamily: 'Nunito, sans-serif',
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}>
      {label}
    </button>
  );
}

function LessonEditModal({ lesson, onSave, onClose }) {
  const [form, setForm] = useState({
    ...lesson,
    explanation: Array.isArray(lesson.explanation) ? lesson.explanation.join('\n') : (lesson.explanation || ''),
    chunks: Array.isArray(lesson.chunks) ? JSON.stringify(lesson.chunks, null, 2) : (lesson.chunks || '[]'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...lesson,
      title_so: form.title_so,
      title_en: form.title_en,
      ability: form.ability,
      explanation: form.explanation.split('\n').filter(Boolean),
      chunks: JSON.parse(form.chunks || '[]'),
      sort_order: form.sort_order,
      is_active: form.is_active,
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 500,
        maxHeight: '90vh', overflowY: 'auto',
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 16 }}>
          {lesson.id ? 'Edit Lesson' : 'New Lesson'}
        </h3>
        <form onSubmit={handleSubmit}>
          <FormField label="Title (Somali)" value={form.title_so} onChange={(v) => setForm({ ...form, title_so: v })} />
          <FormField label="Title (English)" value={form.title_en} onChange={(v) => setForm({ ...form, title_en: v })} />
          <FormField label="Ability" value={form.ability} onChange={(v) => setForm({ ...form, ability: v })} />
          <FormField label="Explanation (one line per item)" value={form.explanation} onChange={(v) => setForm({ ...form, explanation: v })} multiline />
          <FormField label="Chunks (JSON array)" value={form.chunks} onChange={(v) => setForm({ ...form, chunks: v })} multiline />

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
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

function FormField({ label, value, onChange, multiline }) {
  const shared = {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0E0E0',
    fontSize: 14, fontFamily: 'Nunito, sans-serif', outline: 'none', boxSizing: 'border-box',
  };
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#666', fontFamily: 'Nunito, sans-serif', display: 'block', marginBottom: 4 }}>
        {label}
      </label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} style={{ ...shared, resize: 'vertical' }} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} style={shared} />
      )}
    </div>
  );
}

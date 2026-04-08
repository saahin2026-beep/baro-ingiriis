import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const EXERCISE_TYPES = ['choose', 'fillgap', 'scenario', 'scramble', 'sentenceBuilder'];

export default function PracticeManager() {
  const [features, setFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [editingExercise, setEditingExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadFeatures(); }, []);

  const loadFeatures = async () => {
    setLoading(true);
    const { data } = await supabase.from('practice_features').select('*').order('sort_order');
    if (data) setFeatures(data);
    setLoading(false);
  };

  const loadExercises = async (featureKey) => {
    const { data } = await supabase.from('practice_exercises').select('*').eq('feature_key', featureKey).order('sort_order');
    if (data) setExercises(data);
  };

  const selectFeature = (feature) => {
    setSelectedFeature(feature);
    setEditingExercise(null);
    loadExercises(feature.key);
  };

  const saveFeature = async (feature) => {
    const { error } = await supabase.from('practice_features').upsert(feature, { onConflict: 'key' });
    if (!error) loadFeatures();
    return !error;
  };

  const saveExercise = async (exercise) => {
    if (exercise.id) {
      const { error } = await supabase.from('practice_exercises').update(exercise).eq('id', exercise.id);
      if (!error) loadExercises(selectedFeature.key);
      return !error;
    } else {
      const { error } = await supabase.from('practice_exercises').insert({ ...exercise, feature_key: selectedFeature.key });
      if (!error) loadExercises(selectedFeature.key);
      return !error;
    }
  };

  const deleteExercise = async (id) => {
    if (!confirm('Delete this exercise?')) return;
    const { error } = await supabase.from('practice_exercises').delete().eq('id', id);
    if (!error) loadExercises(selectedFeature.key);
  };

  // Feature list view
  if (!selectedFeature) {
    return (
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 16 }}>
          Practice Features ({features.length})
        </h2>
        {features.map((f) => (
          <div key={f.key} onClick={() => selectFeature(f)} style={{
            background: 'white', borderRadius: 14, padding: '14px 16px', marginBottom: 8,
            border: '1px solid #EEEEEE', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: f.bg || '#ECFEFF',
              border: `2px solid ${f.color || '#0891B2'}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: f.color || '#0891B2',
            }}>
              {f.sort_order}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#333', fontFamily: 'Nunito, sans-serif', margin: 0 }}>{f.title}</p>
              <p style={{ fontSize: 12, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', margin: '2px 0 0' }}>{f.title_en} — {f.key}</p>
            </div>
            <div style={{
              padding: '4px 10px', borderRadius: 8, background: f.color || '#0891B2',
              fontSize: 11, fontWeight: 700, color: 'white',
            }}>
              EDIT
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Exercise list + editor for selected feature
  return (
    <div>
      <button onClick={() => { setSelectedFeature(null); setEditingExercise(null); }} style={{
        background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700,
        color: '#0891B2', fontFamily: 'Nunito, sans-serif', padding: 0, marginBottom: 12,
      }}>
        ← Back to features
      </button>

      <div style={{
        background: selectedFeature.bg || '#ECFEFF', borderRadius: 14, padding: '14px 16px',
        border: `2px solid ${selectedFeature.color}`, marginBottom: 16,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
          {selectedFeature.title}
        </h2>
        <p style={{ fontSize: 12, color: '#757575', fontFamily: 'Nunito, sans-serif', margin: '4px 0 0' }}>
          {selectedFeature.title_en} — {exercises.length} exercises
        </p>
      </div>

      {/* Feature settings */}
      <FeatureEditor feature={selectedFeature} onSave={saveFeature} />

      {/* Exercise list */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
          Exercises ({exercises.length})
        </h3>
        <button onClick={() => setEditingExercise({ type: 'choose', sort_order: exercises.length })} style={{
          background: selectedFeature.color, color: 'white', border: 'none', borderRadius: 10,
          padding: '8px 16px', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
        }}>
          + ADD
        </button>
      </div>

      {exercises.map((ex, idx) => (
        <div key={ex.id} style={{
          background: 'white', borderRadius: 12, padding: '12px 14px', marginBottom: 6,
          border: editingExercise?.id === ex.id ? `2px solid ${selectedFeature.color}` : '1px solid #EEEEEE',
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
        }} onClick={() => setEditingExercise(ex)}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: selectedFeature.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 12, fontWeight: 800,
          }}>
            {idx + 1}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#333', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
              {ex.instruction || ex.prompt || 'No instruction'}
            </p>
            <p style={{ fontSize: 11, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', margin: '2px 0 0' }}>
              Type: {ex.type}
            </p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); deleteExercise(ex.id); }} style={{
            background: '#FFEBEE', border: 'none', borderRadius: 8, padding: '4px 10px',
            fontSize: 11, fontWeight: 700, color: '#F44336', cursor: 'pointer',
          }}>
            DELETE
          </button>
        </div>
      ))}

      {/* Exercise editor */}
      {editingExercise && (
        <PracticeExerciseEditor
          exercise={editingExercise}
          featureColor={selectedFeature.color}
          onSave={saveExercise}
          onCancel={() => setEditingExercise(null)}
        />
      )}
    </div>
  );
}

function FeatureEditor({ feature, onSave }) {
  const [title, setTitle] = useState(feature.title);
  const [titleEn, setTitleEn] = useState(feature.title_en || '');
  const [color, setColor] = useState(feature.color || '#0891B2');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...feature, title, title_en: titleEn, color });
    setSaving(false);
  };

  return (
    <div style={{ background: '#F9F9F9', borderRadius: 12, padding: 14, marginBottom: 8 }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 8 }}>FEATURE SETTINGS</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Somali title"
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif' }} />
        <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="English title"
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 40, height: 32, border: 'none', borderRadius: 6, cursor: 'pointer' }} />
        <button onClick={handleSave} disabled={saving} style={{
          background: '#0891B2', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px',
          fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: saving ? 0.6 : 1,
        }}>
          {saving ? 'SAVING...' : 'SAVE'}
        </button>
      </div>
    </div>
  );
}

function PracticeExerciseEditor({ exercise, featureColor, onSave, onCancel }) {
  const [form, setForm] = useState({ ...exercise });
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave(form);
    setSaving(false);
    if (success) onCancel();
  };

  return (
    <div style={{
      background: 'white', borderRadius: 14, padding: 16, marginTop: 12,
      border: `2px solid ${featureColor}`, boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    }}>
      <p style={{ fontSize: 14, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 12 }}>
        {exercise.id ? 'Edit Exercise' : 'New Exercise'}
      </p>

      {/* Type selector */}
      <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>TYPE</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {EXERCISE_TYPES.map((t) => (
          <button key={t} onClick={() => update('type', t)} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
            border: form.type === t ? `2px solid ${featureColor}` : '1px solid #E0E0E0',
            background: form.type === t ? `${featureColor}15` : 'white',
            color: form.type === t ? featureColor : '#999', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Instruction */}
      <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>INSTRUCTION</p>
      <input value={form.instruction || ''} onChange={(e) => update('instruction', e.target.value)}
        placeholder="e.g. Dooro jawaabta saxda ah"
        style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif', marginBottom: 12, boxSizing: 'border-box' }} />

      {/* Prompt (for choose/fillgap) */}
      {(form.type === 'choose' || form.type === 'fillgap') && (
        <>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>PROMPT</p>
          <input value={form.prompt || ''} onChange={(e) => update('prompt', e.target.value)}
            placeholder="e.g. 'Hello' macneheedu waa..."
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif', marginBottom: 12, boxSizing: 'border-box' }} />
        </>
      )}

      {/* Scenario (for scenario type) */}
      {form.type === 'scenario' && (
        <>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>SCENARIO</p>
          <textarea value={form.scenario || ''} onChange={(e) => update('scenario', e.target.value)}
            placeholder="Describe the situation..."
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif', marginBottom: 12, minHeight: 60, boxSizing: 'border-box', resize: 'vertical' }} />
        </>
      )}

      {/* Options (for choose/fillgap/scenario) */}
      {(form.type === 'choose' || form.type === 'fillgap' || form.type === 'scenario') && (
        <>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>OPTIONS (JSON array)</p>
          <input value={JSON.stringify(form.options || [])} onChange={(e) => { try { update('options', JSON.parse(e.target.value)); } catch {} }}
            placeholder='["option1", "option2", "option3"]'
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'monospace', marginBottom: 8, boxSizing: 'border-box' }} />
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>CORRECT INDEX (0-based)</p>
          <input type="number" value={form.correct_index ?? 0} onChange={(e) => update('correct_index', parseInt(e.target.value))}
            style={{ width: 80, padding: '8px 12px', borderRadius: 8, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif', marginBottom: 12 }} />
        </>
      )}

      {/* Scramble fields */}
      {form.type === 'scramble' && (
        <>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>LETTERS (JSON array)</p>
          <input value={JSON.stringify(form.letters || [])} onChange={(e) => { try { update('letters', JSON.parse(e.target.value)); } catch {} }}
            placeholder='["H","E","L","L","O"]'
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'monospace', marginBottom: 8, boxSizing: 'border-box' }} />
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>CORRECT ANSWER</p>
          <input value={form.correct_answer || ''} onChange={(e) => update('correct_answer', e.target.value)}
            placeholder="HELLO"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif', marginBottom: 12, boxSizing: 'border-box' }} />
        </>
      )}

      {/* Sentence builder fields */}
      {form.type === 'sentenceBuilder' && (
        <>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>WORDS (JSON array)</p>
          <input value={JSON.stringify(form.words || [])} onChange={(e) => { try { update('words', JSON.parse(e.target.value)); } catch {} }}
            placeholder='["I","am","fine"]'
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'monospace', marginBottom: 8, boxSizing: 'border-box' }} />
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>CORRECT SENTENCE</p>
          <input value={form.correct_sentence || ''} onChange={(e) => update('correct_sentence', e.target.value)}
            placeholder="I am fine"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif', marginBottom: 12, boxSizing: 'border-box' }} />
        </>
      )}

      {/* Sort order */}
      <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>SORT ORDER</p>
      <input type="number" value={form.sort_order ?? 0} onChange={(e) => update('sort_order', parseInt(e.target.value))}
        style={{ width: 80, padding: '8px 12px', borderRadius: 8, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif', marginBottom: 16 }} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSave} disabled={saving} style={{
          flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: featureColor,
          color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
          opacity: saving ? 0.6 : 1,
        }}>
          {saving ? 'SAVING...' : 'SAVE EXERCISE'}
        </button>
        <button onClick={onCancel} style={{
          padding: '12px 20px', borderRadius: 10, border: '1px solid #E0E0E0', background: 'white',
          color: '#757575', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
        }}>
          CANCEL
        </button>
      </div>
    </div>
  );
}

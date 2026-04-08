import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function ProfileSetupManager() {
  const [steps, setSteps] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadSteps(); }, []);

  const loadSteps = async () => {
    setLoading(true);
    const { data } = await supabase.from('profile_setup_content').select('*').order('sort_order');
    if (data) setSteps(data);
    setLoading(false);
  };

  const saveStep = async (step) => {
    if (step.id) {
      const { error } = await supabase.from('profile_setup_content').update(step).eq('id', step.id);
      if (!error) { loadSteps(); setEditing(null); }
    } else {
      const { error } = await supabase.from('profile_setup_content').insert(step);
      if (!error) { loadSteps(); setEditing(null); }
    }
  };

  const deleteStep = async (id) => {
    if (!confirm('Delete this step?')) return;
    await supabase.from('profile_setup_content').delete().eq('id', id);
    loadSteps();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
          Profile Setup Steps ({steps.length})
        </h2>
        <button onClick={() => setEditing({ step: steps.length, field_type: 'text', required: false })} style={{
          background: '#0891B2', color: 'white', border: 'none', borderRadius: 10,
          padding: '8px 16px', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
        }}>
          + ADD STEP
        </button>
      </div>

      {steps.map((s) => (
        <div key={s.id} onClick={() => setEditing(s)} style={{
          background: 'white', borderRadius: 14, padding: '14px 16px', marginBottom: 8,
          border: editing?.id === s.id ? '2px solid #0891B2' : '1px solid #EEEEEE',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: '#ECFEFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 800, color: '#0891B2',
          }}>
            {s.step}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#333', fontFamily: 'Nunito, sans-serif', margin: 0 }}>{s.title_so}</p>
            <p style={{ fontSize: 11, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', margin: '2px 0 0' }}>
              {s.title_en} — {s.field_type} — {s.field_key} {s.required ? '(required)' : ''}
            </p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); deleteStep(s.id); }} style={{
            background: '#FFEBEE', border: 'none', borderRadius: 8, padding: '4px 10px',
            fontSize: 11, fontWeight: 700, color: '#F44336', cursor: 'pointer',
          }}>
            DELETE
          </button>
        </div>
      ))}

      {editing && (
        <ProfileStepEditor step={editing} onSave={saveStep} onCancel={() => setEditing(null)} />
      )}
    </div>
  );
}

function ProfileStepEditor({ step, onSave, onCancel }) {
  const [form, setForm] = useState({ ...step });
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const fieldTypes = ['text', 'date', 'city_select', 'phone', 'email', 'select'];

  return (
    <div style={{
      background: 'white', borderRadius: 14, padding: 16, marginTop: 12,
      border: '2px solid #0891B2', boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    }}>
      <p style={{ fontSize: 14, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 12 }}>
        {step.id ? 'Edit Step' : 'New Step'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>TITLE (SOMALI)</p>
          <input value={form.title_so || ''} onChange={(e) => update('title_so', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif', boxSizing: 'border-box' }} />
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>TITLE (ENGLISH)</p>
          <input value={form.title_en || ''} onChange={(e) => update('title_en', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>SUBTITLE (SOMALI)</p>
          <input value={form.subtitle_so || ''} onChange={(e) => update('subtitle_so', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif', boxSizing: 'border-box' }} />
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>SUBTITLE (ENGLISH)</p>
          <input value={form.subtitle_en || ''} onChange={(e) => update('subtitle_en', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>FIELD TYPE</p>
          <select value={form.field_type || 'text'} onChange={(e) => update('field_type', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif' }}>
            {fieldTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>FIELD KEY</p>
          <input value={form.field_key || ''} onChange={(e) => update('field_key', e.target.value)} placeholder="userName"
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif', boxSizing: 'border-box' }} />
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>STEP #</p>
          <input type="number" value={form.step ?? 0} onChange={(e) => update('step', parseInt(e.target.value))}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E0E0E0', fontSize: 13, fontFamily: 'Nunito, sans-serif', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <input type="checkbox" checked={form.required || false} onChange={(e) => update('required', e.target.checked)} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#333', fontFamily: 'Nunito, sans-serif' }}>Required field</span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSave} disabled={saving} style={{
          flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: '#0891B2',
          color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
          opacity: saving ? 0.6 : 1,
        }}>
          {saving ? 'SAVING...' : 'SAVE STEP'}
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

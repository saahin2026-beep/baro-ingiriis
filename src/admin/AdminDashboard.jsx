import { useState } from 'react';
import LessonManager from './LessonManager';
import PhraseManager from './PhraseManager';
import OnboardingManager from './OnboardingManager';

const TABS = [
  { key: 'lessons', label: 'Lessons' },
  { key: 'phrases', label: 'Phrases' },
  { key: 'onboarding', label: 'Onboarding' },
];

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('lessons');

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ background: '#4CAF50', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>Baro Admin</span>
          <div style={{ display: 'flex', gap: 4, marginLeft: 24 }}>
            {TABS.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'transparent',
                color: 'white', fontSize: 14, fontWeight: activeTab === tab.key ? 800 : 600,
                fontFamily: 'Nunito, sans-serif',
              }}>{tab.label}</button>
            ))}
          </div>
        </div>
        <button onClick={onLogout} style={{
          padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.4)',
          background: 'transparent', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'Nunito, sans-serif',
        }}>Logout</button>
      </div>
      <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
        {activeTab === 'lessons' && <LessonManager />}
        {activeTab === 'phrases' && <PhraseManager />}
        {activeTab === 'onboarding' && <OnboardingManager />}
      </div>
    </div>
  );
}

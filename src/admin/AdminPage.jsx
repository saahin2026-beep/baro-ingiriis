import { useState } from 'react';
import AdminAuth from './AdminAuth';
import AdminDashboard from './AdminDashboard';

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('hadaling-admin') === 'true');

  const handleLogout = () => {
    sessionStorage.removeItem('hadaling-admin');
    setAuthed(false);
  };

  if (!authed) return <AdminAuth onLogin={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={handleLogout} />;
}

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import AdminAuth from './AdminAuth';
import AdminDashboard from './AdminDashboard';
import { isAdminEmail } from './adminConfig';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setIsAdmin(isAdminEmail(data?.user?.email));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setIsAdmin(isAdminEmail(session?.user?.email));
    });

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isAdmin === null) return null;
  if (!isAdmin) return <AdminAuth />;
  return <AdminDashboard onLogout={handleLogout} />;
}

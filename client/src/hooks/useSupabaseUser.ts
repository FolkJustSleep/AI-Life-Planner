import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export function useSupabaseUser() {
  const [user, setUser] = useState<{ email: string | null; displayName: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function fetchUser() {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (!ignore) {
        if (error) {
          setUser(null);
        } else {
          setUser({
            email: data.user?.email || null,
            displayName: data.user?.user_metadata?.full_name || data.user?.email || null,
          });
        }
        setLoading(false);
      }
    }
    fetchUser();
    return () => { ignore = true; };
  }, []);

  return { user, loading };
}

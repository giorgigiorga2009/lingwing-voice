import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@utils/store';

const SessionHandler = () => {
  const { data: session, status } = useSession();
  const setToken = useUserStore((state) => state.SetToken);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.accessToken) {
      setToken(session.user.accessToken);
    } else {
      setToken('');
    }
  }, [status, session, setToken]);

  return null;
};

export default SessionHandler
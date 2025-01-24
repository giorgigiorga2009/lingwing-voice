import { useSession } from 'next-auth/react';

export const useAuthentication = () => {
  const { data: session, status } = useSession();
  return { session, status };
};

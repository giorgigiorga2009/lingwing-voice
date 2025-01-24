import { useEffect } from 'react';
import axios from 'axios';
import { useModalStore } from '@utils/store';

export const useFetchModals = () => {
  const { setModals } = useModalStore();

  useEffect(() => {
    async function fetchModals() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_DEFAULT_URL}/public/modal?active=true`
        );

        setModals(response.data.data);
      } catch (error) {
        console.error('Failed to fetch modals:', error);
      }
    }
    fetchModals();
  }, [setModals]);
};

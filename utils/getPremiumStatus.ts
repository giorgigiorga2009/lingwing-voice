import axios from "axios"
import { useEffect } from 'react';
import { useUserStore, useUserTypeStore } from '@utils/store';


export const getPremiumStatus = async (authToken: string) => {
    try {
        const res = await axios.get(
          `${
            process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
          }/user/user/premiumInfo`,
          {
            headers: {
              Authorization: authToken ?? '',
            },
          },
        )
        return res.data.data
    } catch (error) {
        console.error('Could not get premium status', error)
    }
}


export const AssignPremiumStatus = () => {
  const Token = useUserStore.getState().Token;

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      if (Token) {
        try {
          const res = await getPremiumStatus(Token);
          useUserTypeStore.getState().SetPremiumStatus(res.isPremium, res.isAdmin);
        } catch (error) {
          console.error('Error fetching premium status:', error);
        }
      }
    };
    fetchPremiumStatus();
  }, [Token]);
};
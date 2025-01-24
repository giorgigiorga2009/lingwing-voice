import axios from 'axios';
import { useQuery } from 'react-query';
import { LOCALES_TO_LANGUAGES } from './languages';
import React from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
//const { process.env } = getConfig()

interface Props {
  htmlContent: string;
}

export const fetchData = async (API: string) => {
  try {
    const res = await axios.get(API);
    const data = res.data.data;
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data.');
  }
};

export const HTMLRenderer: React.FC<Props> = ({ htmlContent }) => {
  return (
    <div>
      {React.createElement('div', {
        dangerouslySetInnerHTML: { __html: htmlContent },
      })}
    </div>
  );
};

// Custom hook for fetching data based on the selected locale
export const useLocalizedData = (endpoint: string) => {
  const router = useRouter();
  const localeKey = router.locale;
  const local =
    LOCALES_TO_LANGUAGES[localeKey as keyof typeof LOCALES_TO_LANGUAGES];

  return useQuery(
    `${endpoint}-${local}`,
    () =>
      fetchData(
        `${
          process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
        }/${endpoint}?lang=${local}`
      ), // Update this line
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
};

// Usage of the custom hook for fetching licensing agreement data
export const useLicencingAgreementData = () => {
  return useLocalizedData(`public/licensing-agreement`);
};

// Usage of the custom hook for fetching privacy policy data
export const usePrivacyPolicyData = () => {
  return useLocalizedData('public/privacy-policy');
};

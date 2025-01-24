import { NextPage } from 'next';
import style from './privacy-policy.module.scss';
import { Header } from '@components/header/Header';
import React, { useEffect, useState } from 'react';
import { Footer } from '@components/wizard/Footer';

import { useTranslation } from '@utils/useTranslation';
import { FollowButtons } from '@components/home/FollowButtons';
import { usePrivacyPolicyData, HTMLRenderer } from '@utils/htmlRenderer';
import { HomeFooter } from '@components/reusables/footer/HomeFooter';

const PrivacyPolicy: NextPage = () => {
  const { t } = useTranslation();
  const { isLoading, isError, data: fetchedData } = usePrivacyPolicyData();
  const [data, setData] = useState<string | null>(null);
  useEffect(() => {
    if (!isLoading && !isError && fetchedData) {
      setData(fetchedData);
    }
  }, [isLoading, isError, fetchedData]);

  return (
    <div className={style.background}>
      <Header 
        size="s"
        loginClassName={style.loginModal}
        setShowTopScores={() => false}
        showTopScores={false}
      />
      <div className={style.wrapper}>
          <h1 className={style.title}>{t('menuPrivacyPolicy')}</h1>
        <div className={style.container}>
          <div className={style.content}>
            <HTMLRenderer htmlContent={data || ''} />
          </div>
        </div>
        <HomeFooter isCustomPage={true} />
      </div>
      <div className={style.footer}>
        <FollowButtons color="grey" isContactUs={true}/>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

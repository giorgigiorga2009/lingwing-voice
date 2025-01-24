import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { Header } from '@components/header/Header';
import { Footer } from '@components/wizard/Footer';
import style from './licensing-agreement.module.scss';
import { useTranslation } from '@utils/useTranslation';
import { FollowButtons } from '@components/home/FollowButtons';
import { useLicencingAgreementData, HTMLRenderer } from '@utils/htmlRenderer';
import { HomeFooter } from '@components/reusables/footer/HomeFooter';

const LicencingAgreement: NextPage = () => {
  const { t } = useTranslation();
  const { isLoading, isError, data: fetchedData } = useLicencingAgreementData();
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
        <h1 className={style.title}>{t('menuLicenseAgreement')}</h1>
      <div className={style.container}>
        <div className={style.content}>
          <HTMLRenderer htmlContent={data || ''} />
        </div>
      </div>
        <HomeFooter isCustomPage={true} />
      </div>
      <div className={style.footer}>
        <FollowButtons color="grey" isContactUs={true} />
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default LicencingAgreement;

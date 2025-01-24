import React from 'react';
import { NextPage } from 'next';
import { Reviews } from '@components/Reviews';
import style from './packages-info.module.scss';
import { Header } from '@components/header/Header';
import { Footer } from '@components/wizard/Footer';
import { useTranslation } from '@utils/useTranslation';
import { FollowButtons } from '@components/home/FollowButtons';
import PlanSelection from '@components/packages-info/planSelection';
import { UserInfo, useUserStore, useUserTypeStore } from '@utils/store';
import { HomeFooter } from '@components/reusables/footer/HomeFooter';

const PackagesInfo: NextPage = () => {
  const { t } = useTranslation();
  const getUserToken = (state: UserInfo) => ({
    Token: state.Token,
  });
  const { Token } = useUserStore(getUserToken);
  const UserType = useUserTypeStore.getState().UserType;

  return (
    <div className={style.container}>
      <Header
        size="s"
        loginClassName={style.loginModal}
        setShowTopScores={() => false}
        showTopScores={false}
      />
      <div className={style.planSelectionContainer}>
        <h1 className={style.header}>{t('PACKAGES_INFO_HEADER')}</h1>

        {UserType === 'free' && (
          <PlanSelection
            header={t('PACKAGES_INFO_FREE_TRIAL_HEADER')}
            paragraph={t('PACKAGES_INFO_FREE_TRIAL_PARAGRAPH')}
            buttonText={t('PACKAGES_INFO_CHOOSE')}
            index={0}
          />
        )}
        <PlanSelection
          header={t('PACKAGES_INFO_FREE_LEARNING_HEADER')}
          paragraph={t('PACKAGES_INFO_FREE_LEARNING_PARAGRAPH')}
          buttonText={t('PACKAGES_INFO_CHOOSE')}
          index={1}
          token={Token}
        />
        <PlanSelection
          header={t('PACKAGES_INFO_PREMIUM_HEADER')}
          paragraph={t('PACKAGES_INFO_PREMIUM_PARAGRAPH')}
          buttonText={t('PREMIUM')}
          index={2}
          fromGelText={t('PACKAGES_INFO_FROM_GEL')}
        />
      </div>
      <Reviews />
      <FollowButtons color="grey" />
      {/* <Footer /> */}
      <HomeFooter />
    </div>
  );
};

export default PackagesInfo;

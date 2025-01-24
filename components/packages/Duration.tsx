import { FC } from 'react';
import style from './Duration.module.scss';
import { useTranslation } from '../../utils/useTranslation';
import classNames from 'classnames';

interface Duration {
  duration: number;
  isFreeTrial?: boolean;
  isMostPopular?: boolean
}

interface PackageTitles {
  title: string;
  isFreeTrial?: boolean;
}

interface SaveAmount {
  title: string;
}


export const FreePackageName: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={style.freePackageName}>{t('APP_PACKAGE_LIFETIME')} </div>
  );
};

export const Duration: FC<Duration> = ({ duration, isFreeTrial = false, isMostPopular }) => {
  const { t } = useTranslation();

  return (
    <div className={classNames(style.duration, { [style.duration__freeTrial]: isFreeTrial })}>
      {duration}
      <span className={classNames(style.months, { [style.months__freeTrial]: isFreeTrial })}>{t('APP_PACKAGE_MONTHS')}</span>
      {isMostPopular 
        && 
        <>
        <span className={style.plus_symbol}>+</span>
        <span className={style.plus_one_month}>{t('APP_PACKAGE_MONTHS_PLUS_ONE_MONTH')}</span>
      </>}
    </div>
  );
};

export const PackageTitles: FC<PackageTitles> = ({ title = '', isFreeTrial = false }) => {
  const { t } = useTranslation();

  return (
    <div className={classNames(style.packageTitles, { [style.packageTitles__freeTrial]: isFreeTrial })}>
      <span className={classNames(style.titleText, { [style.titleText__freeTrial]: isFreeTrial })}>{title}</span>
    </div>
  );
};


export const SaveAmount: FC<SaveAmount> = ({ title = '' }) => { 
  const { t } = useTranslation();
 
  return (
    <div className={style.saveAmount} style = {{ visibility: title !== '' ? 'visible' : 'hidden'}}>
     <span className={style.titleText}>{title}</span>
    </div>
  );
};
import React from 'react';
import style from './TryForFree.module.scss';
import { useTranslation } from '@utils/useTranslation';
const TryForFree = ({ section }: { section: number }) => {
  const { t } = useTranslation();
  return (
    <div className={`${style.tryForFree} ${ section == 1 ? style.secondSection : '' }`}>
      <span>{t('TRY_FOR_FREE')}</span>
      <span>{t('WITHOUT_REGISTRATION')}</span>
    </div>
  );
};

export default TryForFree;
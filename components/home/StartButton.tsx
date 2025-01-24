import { useTranslation } from '@utils/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import style from './StartButton.module.scss';
import TryForFree from './TryForFree';
import { getUsersAmount } from '@utils/getUsersAmount';
import { relative } from 'path';

export const StartButton: FC<{
  currentSection: number;
  startAnimation: boolean;
}> = ({ currentSection, startAnimation }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [usersAmount, setUsersAmount] = useState<number | null>(null);
  const numbersBucket = usersAmount ? usersAmount.toString().split('') : [];

  

  useEffect(() => {
    getUsersAmount()
      .then((response) => {
        setUsersAmount(response);
        return response;
      })
      .catch((error) => {
        console.error('Failed to fetch users amount: ', error);
      });
  }, []);

  const handleClick = () => {
    const section = currentSection;
  };

  return (
    <div className={style.container}>
      <div className={style.title}>
        <span>{t('join')}</span>
        <span className={style.usersAmount}>
          {Array.isArray(numbersBucket) &&
            numbersBucket.map((num, i) => (
              <span key={`num-${i}-key`} className={style.digit}>
                {num}
              </span>
            ))}
        </span>
        <span>{t('users')}</span>
      </div>
      <Link
        data-landing-main-cta-button={currentSection}
        onClick={handleClick}
        className={style.link}
        locale={router.locale}
        href="/wizard"
      >



        <div className={`${style.button} ${style.fixedButton}`}>
          {currentSection === 1 && startAnimation && (
            <div className={style.startArrow}></div>
          )}
          <span className={style.bubbleUp} />
          <span className={style.text}>{t('homeStartButton')}</span>
          <span className={style.bubbleDown} />
        </div>

        <TryForFree section={currentSection}/>

      </Link>
    </div>
  );
};

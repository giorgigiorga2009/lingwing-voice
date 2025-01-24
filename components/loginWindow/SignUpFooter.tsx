import { FC } from 'react';
import style from './SignUpFooter.module.scss';
import { useTranslation } from '@utils/useTranslation';
import { SIGN_UP_FOOTER_LINKS } from '@utils/const';
import Link from 'next/link';

export const SignUpFooter: FC = () => {
  const { t } = useTranslation();
  type Links = keyof typeof SIGN_UP_FOOTER_LINKS;
  const LINKS = Object.keys(SIGN_UP_FOOTER_LINKS) as Links[];

  return (
    <div className={style.footer}>
      <span>{t('AUTH_FOOTER1')}</span>
      <span className={style.link}>
        <Link href={SIGN_UP_FOOTER_LINKS['signUpFooterLicenseAgreement']}>
          {t('signUpFooterLicenseAgreement')}
        </Link>
      </span>
      <span>{t('AUTH_FOOTER3')}</span>
      <span className={style.link}>
        <Link href={SIGN_UP_FOOTER_LINKS['signUpFooterPrivacyPolicy']}>
          {t('signUpFooterPrivacyPolicy')}
        </Link>
      </span>
    </div>
  );
};

import { FC } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import style from './UserDropdown.module.scss';
import { useTranslation } from '@utils/useTranslation';
import { UserInfo, useUserStore } from '@utils/store';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const setUserToken = (state: UserInfo) => ({
  SetToken: state.SetToken,
  SetLastName: state.SetLastName,
  SetFirstName: state.SetFirstName,
  SetEmail: state.SetEmail,
  SetAvatar: state.SetAvatar,
});

export const UserDropdown: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { SetToken  , SetLastName, SetFirstName, SetEmail, SetAvatar} = useUserStore(setUserToken);

  return (
    <div className={style.dropdownContent}>
      <Link
        href={{ pathname: `/dashboard` }}
        locale={router.locale}
        as="/dashboard"
        className={style.link}
      >
        <div className={classNames(style.dashboard_btn, style.button)}>
          {t('APP_DASHBOARD')}
        </div>
      </Link>
      <Link
        href={{ pathname: `/profile` }}
        locale={router.locale}
        as="/profile"
        className={style.link}
      >
        <div className={classNames(style.button)}>
          {t('APP_HEADER_MENU_ITEM14')}
        </div>
      </Link>
      <Link
        href={{ pathname: `/packages` }}
        locale={router.locale}
        as="/packages"
        className={style.link}
      >
        <div className={classNames(style.button)}>{t('APP_BUY_A_PACKAGE')}</div>
      </Link>
      <Link
        href={{
          pathname: `/payments`,
        }}
        locale={router.locale}
        as="/payments"
        className={style.link}
      >
        <div className={classNames(style.button)}>
          {t('APP_HEADER_PAYMENTS')}
        </div>
      </Link>
      <Link
        href={{ pathname: `/packages`, query: { scrollTo: 'coupon' } }}
        locale={router.locale}
        as="/packages"
        className={style.link}
      >
        <div className={classNames(style.button, style.coupon_link)}>
          {t('APP_HEADER_MENU_ITEM19')}
        </div>
      </Link>

      <Link
        href="#"
        onClick={async (e) => {
          e.preventDefault();
          SetToken('');
          SetFirstName('');
          SetLastName('');
          SetEmail('');
          SetAvatar('');
          sessionStorage.removeItem('userId');
          localStorage.removeItem('user');
          localStorage.removeItem('progressType');
          localStorage.setItem('logout', Date.now().toString());
          await signOut({ redirect: false })

          router.push('/logout');

          signOut({
            callbackUrl: process.env.NEXT_PUBLIC_BASE_URL + '/logout',
            redirect: false,
          });
        }}
      >
        <div className={classNames(style.log_out_btn, style.button)}>
          {t('APP_HEADER_MENU_ITEM13')}
        </div>
      </Link>
    </div>
  );
};

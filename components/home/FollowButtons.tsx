import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { FOLLOW_NETWORKS } from '@utils/const';
import style from './FollowButtons.module.scss';
import { useTranslation } from '@utils/useTranslation';

type Networks = keyof typeof FOLLOW_NETWORKS;
const KEY_NETWORKS = Object.keys(FOLLOW_NETWORKS) as Networks[];

interface Props {
  color?: 'white' | 'grey';
  dashboard?: boolean;
  isCustomPage?: boolean;
  isContactUs?: boolean;
  isProfile?: boolean;
}

export const FollowButtons: FC<Props> = ({
  color = 'white',
  dashboard,
  isCustomPage,
  isContactUs,
  isProfile
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        style.wrap,
        { [style.isDashboard]: dashboard || isProfile },
        // { [style.isDashboard]: isProfile },
        // style.isDashboard,
        style[dashboard ? 'grey' : color],
        { [style.customWrap]: isCustomPage },
        { [style.contactUsWrap]: isContactUs }
      )}
    >
        <div className={style.text}>{t('followUs')}</div>
        <div className={style.container}>
          {KEY_NETWORKS.map((label) => (
            <a
              href={FOLLOW_NETWORKS[label]}
              key={`networks-${label}`}
              className={classNames(style.followButton, style[label])}
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
            </a>
          ))}
        </div>
    </div>
  );
};

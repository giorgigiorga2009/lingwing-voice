import { FC } from 'react'
import style from './MostPopular.module.scss'
import { useTranslation } from '@utils/useTranslation'
import classNames from 'classnames';

interface MostPopularProps {
  isFreeTrial?: boolean;
}

export const MostPopular: FC<MostPopularProps> = ({ isFreeTrial = false }) => {
  const { t } = useTranslation()

  return (
    <div className={classNames(style.mostPopular__text, { [style.mostPopular__text__freeTrial]: isFreeTrial })}>
      {t('APP_PACKAGE_MOST_POPULAR')}
    </div>
  )
}

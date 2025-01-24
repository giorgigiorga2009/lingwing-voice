import React, { FC } from 'react'
import style from './NoCourses.module.scss'
import { useTranslation } from '../../utils/useTranslation'
import { AddLanguageBtn } from './AddLanguageBtn'

const NoCourses: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={style.container}>
      <img src="/themes/images/v1/svg/nodrown.svg" alt="No course Parrot" />
      <h3>{t('APP_DASHBOARD_EMPTY_PARAGRAPH_1')}</h3>
      <h3 className={style.instruction}>
        {t('APP_DASHBOARD_EMPTY_PARAGRAPH_2')}
      </h3>
      <div className={style.add_lang}>
        <AddLanguageBtn />
      </div>
    </div>
  )
}

export default NoCourses

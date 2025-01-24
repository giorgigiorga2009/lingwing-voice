import { FC } from 'react'
import style from './AboutTabs.module.scss'
import { useTranslation } from '@utils/useTranslation'
import { IMAGES_FOR_PARTNERS_PAGE } from '@utils/const'

const Certificate: FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <h2 className={style.subTitle}>{t('APP_ABOUT_US__OUR_PARTNERS')}</h2>
      <div className={style.imageWrapper}>
        {IMAGES_FOR_PARTNERS_PAGE.map((image, id) => (
          <div className={style.imageContainer} key={id}>
            <img
              className={style.imagePartner}
              src={image}
              alt={image.match(/\/([^/]*)\.[^.]*$/)?.[1] || ''}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default Certificate

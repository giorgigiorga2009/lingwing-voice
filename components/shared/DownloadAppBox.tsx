import React from 'react'
import Image from 'next/image'
import { useTranslation } from '../../utils/useTranslation'
import style from './DownloadAppBox.module.scss'

const DownloadAppBox: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div className={style.wrapper}>
      <h3>{t('APP_DASHBORD_INSTALL_MOBILE')}</h3>
      <h3>
        <strong>{t('APP_DASHBORD_APPS')}</strong>
      </h3>

      <div className={style.store_box}>
      <a href="https://apps.apple.com/kn/app/lingwing-language-learning-app/id1217989755" target="_blank">
          <Image
            src="/assets/images/apple-store.png"
            width={160}
            height={48}
            alt="Apple store"
          />
        </a>
        <a href="https://play.google.com/store/apps/details?id=org.android.lingwing.app&pli=1" target="_blank">
          <Image
            src="/assets/images/google_play.png"
            width={160}
            height={48}
            alt="Google play"
          />
        </a>
      </div>
    </div>
  )
}

export default DownloadAppBox

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslation } from '@utils/useTranslation'
import style from './DownloadApp.module.scss'

const DownloadAppBox: React.FC = () => {
  const { t } = useTranslation()
  const [isIOS, setIsIOS] = useState<boolean | null>(null)
  const [isAndroid, setIsAndroid] = useState<boolean | null>(null)

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

    if (/android/i.test(userAgent)) {
      setIsAndroid(true)
      setIsIOS(false)
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setIsIOS(true)
      setIsAndroid(false)
    } else {
      setIsIOS(false)
      setIsAndroid(false)
    }
  }, [])

  return (
    <div className={style.wrapper}>
      <div className={style.store_box}>
        {isIOS && (
          <a href="https://apps.apple.com/kn/app/lingwing-language-learning-app/id1217989755">
            <Image
              src="/assets/images/apple_store.svg"
              width={160}
              height={48}
              alt="Apple store"
            />
          </a>
        )}

        {isAndroid && (
          <a href="https://play.google.com/store/apps/details?id=org.android.lingwing.app&pli=1">
            <Image
              src="/assets/images/google_play.png"
              width={160}
              height={48}
              alt="Google Play"
            />
          </a>
        )}
      </div>
    </div>
  )
}

export default DownloadAppBox

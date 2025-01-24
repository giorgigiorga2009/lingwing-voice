import { FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import style from './AddLanguageBtn.module.scss'
import { useTranslation } from '../../utils/useTranslation'

export const AddLanguageBtn: FC = () => {
  const router = useRouter()
  const locale = router.locale ?? 'en'
  const { t } = useTranslation()

  return (
    <Link href={`/${locale}/wizard`} className={style.link}>
      <button className={style.button}>
        {t('APP_GENERAL_ADD_NEW_LANGUAGE')}
      </button>
    </Link>
  )
}

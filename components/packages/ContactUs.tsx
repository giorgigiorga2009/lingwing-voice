import { FC } from 'react'
import style from './ContactUs.module.scss'
import { useTranslation } from '../../utils/useTranslation'

const ContactUs: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={style.contactUs}>
      <span className={style.moreInfo}>{t('APP_PACKAGE_CONTACT_US')}</span>
      <a className={style.phoneNumber} href="tel:995591810099">
        591-810-099
      </a>
    </div>
  )
}

export default ContactUs

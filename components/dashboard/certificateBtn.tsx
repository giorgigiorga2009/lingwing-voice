import React from 'react'
import style from '@components/dashboard/certificateBtn.module.scss'
import { useTranslation } from '@utils/useTranslation'
import Image from 'next/image'
import certificateImage from '@public/themes/images/v1/svg/gold-certificate.svg'
import purpleCertificate from '@public/themes/images/v1/svg/purple-certicicate.svg'
import classNames from 'classnames'

type CertificateBtnProps = {
  userCourseId?: string
  indexOfSubCourse: number
}

const CertificateBtn: React.FC<CertificateBtnProps> = ({
  userCourseId,
  indexOfSubCourse,
}) => {
  const { t } = useTranslation()

  return (
    <div className={style.container}>
      <a
        href={`/certificate?userCourseId=${userCourseId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button
          className={classNames(style.certificateButton, {
            [style.thirdButton]: indexOfSubCourse === 2,
          })}
        >
          {t('Certificate')}
        </button>
        <div className={style.imgContainer}>
          {indexOfSubCourse === 2 ? (
            <Image
              className={style.img}
              src={purpleCertificate}
              alt=""
              height={1000}
              width={1000}
            />
          ) : (
            <Image
              className={style.img}
              src={certificateImage}
              alt=""
              height={1000}
              width={1000}
            />
          )}
        </div>
      </a>
    </div>
  )
}

export default CertificateBtn

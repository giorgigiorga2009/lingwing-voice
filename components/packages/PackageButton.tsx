import { FC, useState } from 'react'
import Link from 'next/link'
import style from './PackageButton.module.scss'
import { useTranslation } from '@utils/useTranslation'
import { couponValue } from './Coupon'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useUserStore } from '@utils/store'
import { LoginModal } from '@components/loginWindow/LoginModal'


interface Props {
  type: 'mostPopularBtn' | 'regularPackageBtn' | 'couponBtn'
  onClick?: VoidFunction | undefined
  index: number
  packageId: string
  isFreeTrial?: boolean
  isActive?: boolean;
}

export const PackageButton: FC<Props> = ({
  type,
  onClick,
  packageId,
  index,
  isFreeTrial = false,
  isActive = false,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [openLogin, setOpenLogin] = useState(false)
  const token = useUserStore((state) => state.Token)
  const isAuthorized = token && token.length > 10

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthorized && index !== 0) {
      e.preventDefault()
      setOpenLogin(true)
      return
    }
    onClick?.()
  }

  if (isFreeTrial) {
    return (
      <button
        onClick={onClick}
        className={classNames(style[type], {
          [style.regularPackageBtnFreeTrial]: isFreeTrial,
          [style.active]: isActive,
        })}
      >
        {t('APP_PACKAGE_SELECT')}
      </button>
    );
  }

  return (
    <>
      <Link
        href={{
          pathname: index === 0 ? '/packages-info' : '/payment',
          ...(index !== 0 && {
            query: {
              id: packageId,
              ...(couponValue ? { coupon: couponValue } : {}),
            },
          }),
        }}
      >
        <button
          onClick={handleClick}
          className={classNames(style[type], {
            [style.regularPackageBtnFreeTrial]: isFreeTrial,
            [style.active]: isActive,
          })}
        >
          {t('APP_PACKAGE_SELECT')}
        </button>
      </Link>
      {openLogin && (
        <LoginModal
          openLogin={openLogin}
          setOpenLogin={setOpenLogin}
          onClick={() => setOpenLogin(false)}
          redirectPath={router.asPath}
        />
      )}
    </>
  )
}

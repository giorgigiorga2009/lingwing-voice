import { FC } from 'react'
import style from './CouponButton.module.scss'
import { useTranslation } from '@utils/useTranslation'

interface CouponProps {
  type: 'mostPopularBtn' | 'regularPackageBtn' | 'couponBtn'
  onClick: VoidFunction | undefined
  value: string,
  limitForSixSymbol?: boolean
}

export const CouponButton: FC<CouponProps> = ({ type, onClick, value, limitForSixSymbol }) => {
  const { t } = useTranslation()

  const sixSymbolValue = value.length == 6 && limitForSixSymbol;

  return (
    <button onClick={onClick} className={`${style[type]} ${ sixSymbolValue && limitForSixSymbol ? style.limitForSixSymbol : ''}`} disabled={limitForSixSymbol ? !sixSymbolValue : !value}>
      {t('APP_PACKAGE_SELECT')}
    </button>
  )
}

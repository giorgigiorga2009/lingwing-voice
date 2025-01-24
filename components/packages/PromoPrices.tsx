// import { FC } from 'react'
// import Image from 'next/image'
// import style from './PromoPrices.module.scss'
// import { CurrencySymbol } from './CurrencySymbol'
// import discountImg from '@public/themes/images/V2/Packages/discountCircle.png'

// interface DiscountedTotalPrice {
//   oldPrice: number
//   symbol: string
//   totalPrice: number
// }

// interface ShowDiscountLabel {
//   discount: number
// }

// export const DiscountedTotalPrice: FC<DiscountedTotalPrice> = ({
//   oldPrice,
//   symbol,
//   totalPrice,
// }) => {
//   return (
//     <div className={style.totalPrice}>
//       <span className={style.old__totalPrice}>{oldPrice}</span>
//       <CurrencySymbol symbol={symbol} />
//       <span className={style.discounted__totalPrice}>
//         {totalPrice}
//         <CurrencySymbol symbol={symbol} />
//       </span>
//     </div>
//   )
// }

// export const ShowDiscountLabel: FC<ShowDiscountLabel> = ({ discount }) => {
//   return (
//     <div className={style.discount__label}>
//       <Image src={discountImg} alt={'Discount Label'} width={75} height={75} />
//       <div className={style.discount__label__amount}>{discount}%</div>
//     </div>
//   )
// }

import { FC } from 'react'
import Image from 'next/image'
import style from './PromoPrices.module.scss'
import { CurrencySymbol } from './CurrencySymbol'
import discountImg from '@public/themes/images/v2/packages/discountCircle.png'
import classNames from 'classnames'

interface DiscountedTotalPrice {
  oldPrice: number
  symbol: string
  totalPrice: number
  onPaymentPage?: boolean
}

interface ShowDiscountLabel {
  discount: number
}

export const DiscountedTotalPrice: FC<DiscountedTotalPrice> = ({
  oldPrice,
  symbol,
  totalPrice,
  onPaymentPage: onPaymentPage = false,
}) => {
  return (
    <div
      className={classNames(style.totalPrice, {
        [style.selected]: onPaymentPage,
      })}
    >
      <span className={style.old__totalPrice}>{oldPrice}</span>
      <CurrencySymbol symbol={symbol} />
      <span className={style.discounted__totalPrice}>
        {totalPrice}
        <CurrencySymbol symbol={symbol} />
      </span>
    </div>
  )
}

export const ShowDiscountLabel: FC<ShowDiscountLabel> = ({ discount }) => {
  return (
    <div className={style.discount__label}>
      <Image src={discountImg} alt={'Discount Label'} width={75} height={75} />
      <div className={style.discount__label__amount}>{discount}%</div>
    </div>
  )
}

// import { FC, useState } from 'react'
// import style from './Coupon.module.scss'
// import { PackageButton } from './PackageButton'
// import { useTranslation } from '../../utils/useTranslation'

// interface Props {
//   onClick: (coupon: string) => void
// }

// const Coupon: FC<Props> = ({ onClick }) => {
//   const { t } = useTranslation()
//   const [couponInputText, setCouponInputText] = useState('')

//   return (
//     <div className={style.coupon__container}>
//       <p className={style.coupon__title}>{t('COUPON_DO_YOU_HAVE_COUPON?')}</p>
//       <input
//         className={style.coupon__input}
//         placeholder={t('COUPON_PLACEHOLDER')}
//         onChange={event => setCouponInputText(event.target.value)}
//       ></input>
//       <span className={style.coupon__button}>
//         <PackageButton
//           type={'couponBtn'}
//           onClick={() => onClick(couponInputText)}
//         />
//       </span>
//     </div>
//   )
// }

// export default Coupon

import { FC, useState } from 'react';
import style from './Coupon.module.scss';
import { CouponButton } from './CouponButton';
import { useTranslation } from '../../utils/useTranslation';

interface Props {
  onClick: (coupon: string) => void;
}
export let couponValue: string;

const Coupon: FC<Props> = ({ onClick }) => {
  const { t } = useTranslation();
  const [couponInputText, setCouponInputText] = useState('');
  couponValue = couponInputText;

  const isSixChars = couponInputText.length === 6;

  return (
    <div className={style.coupon__container}>
      <p className={style.coupon__title}>{t('COUPON_DO_YOU_HAVE_COUPON?')}</p>
      <input
        className={`${style.coupon__input} ${isSixChars ? style.isSixChars : ''}`}
        placeholder={t('COUPON_PLACEHOLDER')}
        onChange={(event) => setCouponInputText(event.target.value)}
        maxLength={6}
      ></input>
      <span className={style.coupon__button}>
        <CouponButton
          type={'couponBtn'}
          onClick={() => onClick(couponInputText)}
          value={couponInputText}
          limitForSixSymbol={true}
        />
      </span>
    </div>
  );
};

export default Coupon;

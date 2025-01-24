import { FC } from 'react';
import style from './Prices.module.scss';
import { CurrencySymbol } from './CurrencySymbol';
import { useTranslation } from '@utils/useTranslation';
import classNames from 'classnames';
import { logHandler } from '@utils/lessons/taskUtils';

interface ReccuringPrice {
  whereTo?: number;
  price: number;
  duration: number;
  symbol: string;
  isFreeTrial?: boolean;
  sale?: number;
}

interface TotalPrice {
  totalPrice: number;
  symbol: string;
}

export const FreePackagePrice: FC = () => {
  const { t } = useTranslation();

  return <div className={style.freePackage}>{t('APP_PACKAGE_FREE')}</div>;
};

export const ReccuringPrice: FC<ReccuringPrice> = ({
  whereTo,
  price,
  duration,
  symbol,
  isFreeTrial = false,
  sale = 0, 
}) => {
  const { t } = useTranslation();

  const basePrice = isFreeTrial ? Number(price) : price / duration;
  const originalPrice = basePrice.toFixed(2);
  const discountedPrice = (sale > 0 ? basePrice * (1 - sale / 100) : basePrice).toFixed(2);

  return (
    <div
      className={classNames(style.monthPrice, {
        [style.monthPriceForFlowPopUp]: whereTo === 1,
        [style.monthPriceFreeTrial]: isFreeTrial,
        [style.monthPriceForLastTwo]: duration !== 6,
      })}
    >
      <span className={style.price}>{sale > 0 ? discountedPrice : originalPrice} </span>
      <CurrencySymbol symbol={symbol} whereTo={whereTo} />

      <div className={classNames(style.monthAndTotal, {
        [style.monthAndTotalFreeTrial]: isFreeTrial,
      })}>
        {sale > 0 && <del className={style.price}>{originalPrice}</del>}
        {whereTo !== 1 &&  '/ ' +  (isFreeTrial && duration > 1? duration : '') + '  '  +  t('APP_PACKAGE_MONTH_ge')}
      </div>
    </div>
  );
};

export const TotalPrice: FC<TotalPrice> = ({ totalPrice, symbol }) => {
  const { t } = useTranslation();

  return (
    <div className={style.totalPrice}>
      {totalPrice}
      <CurrencySymbol symbol={symbol} />
      <span className={style.monthAndTotal}>  {t('APP_PACKAGE_TOTAL')}</span>
    </div>
  );
};

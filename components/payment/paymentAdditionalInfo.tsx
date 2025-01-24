import React, { useState } from 'react';
import style from './paymentAdditionalInfo.module.scss';
import { useTranslation } from '@utils/useTranslation';
import Link from 'next/link';
import PaymentButton from './paymentButton';
import { handlePackageBuy } from '@utils/getPayments';

interface LanguageProgressProps {
  text: string;
  rightside: any;
}

interface PaymentInfoProps {
    currentPackage?: any;
    selectedCurrency?: any;
    payWithOptions?: any;
    accessToken?: any;
    checkedPackageOrderId?: any;
    payWithOption: string;
}

const PaymentAdditonalInfo: React.FC<PaymentInfoProps> = ({
  currentPackage,
  selectedCurrency,
  payWithOptions,
  accessToken,
  checkedPackageOrderId,
  payWithOption,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const price = currentPackage?.currency[selectedCurrency]?.price || 0;
  const duration = currentPackage?.duration || 1; 
  const { t, locale } = useTranslation();

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  const formatLongDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthNames = [
      t('MONTH_JANUARY'),
      t('MONTH_FEBRUARY'),
      t('MONTH_MARCH'),
      t('MONTH_APRIL'),
      t('MONTH_MAY'),
      t('MONTH_JUNE'),
      t('MONTH_JULY'),
      t('MONTH_AUGUST'),
      t('MONTH_SEPTEMBER'),
      t('MONTH_OCTOBER'),
      t('MONTH_NOVEMBER'),
      t('MONTH_DECEMBER')
    ];

    const shortMonthName = monthNames[month].slice(0, 3);

    return `${day} ${shortMonthName}. ${year}`;
  };

  const currentDate = new Date();
  const endDate = new Date(currentDate);
  endDate.setMonth(endDate.getMonth() + duration);

  const formattedCurrentDate = formatDate(currentDate);
  const formattedEndDate = formatDate(endDate);
  const formattedEndDateAlt = formatLongDate(endDate);


  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);
  };

  const currencyValue: string = selectedCurrency === 0 ? 'GEL' : 'USD';

  const paramsObject = currentPackage
    ? {
        packageId: checkedPackageOrderId,
        currency: currencyValue,
        recurring: false,
        payWith: payWithOption,
        sale: currentPackage.sale
      }
    : {
        packageId: '',
        currency: '',
        recurring: false,
        payWith: '',
      };

  const handlePackageButtonClick = () => {
    if (isChecked) {
      handlePackageBuy(
        checkedPackageOrderId,
        false,
        payWithOption,
        currencyValue,
        accessToken,
        currentPackage.sale,
        currentPackage._id
      );
    }
  };

  return (
    <div className={style.container}>
      <PaymentInfoLine text={`${t('APP_PACKAGE_DURATION')} - ${duration} ${t('APP_PACKAGE_MONTH')}`} rightside={`${formattedCurrentDate} - ${formattedEndDate}`} />
      <PaymentInfoLine text={`${t('APP_PACKAGE_RENEW')}`} rightside={formattedEndDateAlt} />
      <Label text={`${t('PAYMENTS_RECURRING_HAVE_TO_PAY')}`} value={price} />
      <div className={style.agreement}>
        <label className={style.checkLabel}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxClick}
          />
          <span className={style.checkmark}></span>
        </label>
        <p>
          {t('APP_AGREE_LICENSE_1') + ' '}
          <Link href="/licensing-agreement">{t('loginFooter4')}</Link>
          {' ' + t('APP_AGREE_LICENSE_2')}
          {' ' + t('APP_AGREE_LICENSE_3')}
        </p>
      </div>
      <PaymentButton
        selectedOption="Pay at once"
        payWithOption={payWithOption}
        paramsObject={paramsObject}
        accessToken={accessToken}
        handlePackageBuy={handlePackageButtonClick}
        isDisabled={!isChecked}
      />
    </div>
  );
};

const PaymentInfoLine: React.FC<LanguageProgressProps> = ({
  text,
  rightside,
}) => {
  return (
    <div className={style.wrapper}>
      <p>{text}</p>
      <div>{rightside}</div>
    </div>
  );
};

interface LabelProps {
  text: string;
  value: number;
}

const Label: React.FC<LabelProps> = ({ text, value }) => {
  return (
    <div className={style.labelContainer}>
      <span className={style.labelText}>{text}</span>
      <span className={style.labelValue}>{value}</span>
    </div>
  );
};
export default PaymentAdditonalInfo;

/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import style from './freeTrialPackages.module.scss';
import { useTranslation } from '@utils/useTranslation';
import { PackageData, getPackages } from '@utils/getPackages';
import Link from 'next/link';
import close from '@public/themes/images/v2/gram-clos-p.png';
import Image from 'next/image';
import PackageCard from '@components/reusables/PackageCard';
import { useUserStore } from '@utils/store';
import PayWithMethod from '@components/payment/payWithMethod';
import { PaymentMethod, getPayWithList, handleFreeTrial, handlePackageBuy } from '@utils/getPayments';
import PaymentButton from '@components/payment/paymentButton';
import { useRouter } from 'next/router';

interface FreeTrialPackagesProps {
  currentPackage?: any;
  selectedCurrency?: any;
  payWithOptions?: any;
  accessToken?: any;
  checkedPackageOrderId?: any;
  // payWithOption: string;
}

const FreeTrialPackages: React.FC<FreeTrialPackagesProps> = ({
  // currentPackage,
  selectedCurrency,
  accessToken,
  // checkedPackageOrderId,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const { t } = useTranslation();
  const [data, setData] = useState<PackageData>();
  const [packageId, setPackageId] = useState<string>('');
  const token = useUserStore((state) => state.Token);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [payWithOptions, setPayWithOptions] = useState<PaymentMethod[]>([]);
  const [payWithOption, setPayWithOption] = useState<string>('');
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  // const [currency, setCurrency] = useState<string>("GEL");
  // const [openLogin, setOpenLogin] = useState(false);
  const router = useRouter(); 
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [isAgreementVisible, setIsAgreementVisible] = useState(false);
  const [isPaymentButtonActive, setIsPaymentButtonActive] = useState(false);
  

  useEffect(() => {
    if (router.pathname.includes('free-trial')) {
      setIsFreeTrial(true); 
    }
  }, [router.pathname]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPackages('');
        setData(response);
      } catch (err) {
        console.error('An error occurred:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPayWithOptions = async () => {
      try {
        const options = await getPayWithList();
        setPayWithOptions(options);
      } catch (error) {
        console.error('Error fetching payWithOptions:', error);
      }
    };

    if (selectedPackageId) {
      fetchPayWithOptions();
    }
  }, [selectedPackageId]);

  const packages = data?.packages ?? [];
  const filteredPackages = packages.filter((_, index) => index !== 0);
  const mostPopular = filteredPackages.find(pkg => pkg.mostPopular);
  const otherPackages = filteredPackages.filter(pkg => !pkg.mostPopular);

  const sortedPackages = [
    otherPackages[1],
    mostPopular,
    otherPackages[0]
  ].filter(Boolean);

  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);
    setIsPaymentButtonActive(!isChecked);
  };

  const handlePackageId = (id: string) => {
    if (selectedPackageId === id) {
      setPackageId('');
      setSelectedPackageId(null);
      setPayWithOption('');
      setIsAgreementVisible(false);
      setIsChecked(false);
      setIsPaymentButtonActive(false);
    } else {
      setPackageId(id);
      setSelectedPackageId(id);
      setIsAgreementVisible(false);
      setIsChecked(false);
      setIsPaymentButtonActive(false);
    }
  };

  const currencyValue: string = selectedCurrency === "GEL" ? 'GEL' : 'USD';

  const handlePackageButtonClick = () => {
    if (isChecked) {
      handleFreeTrial(
        payWithOption,
        packageId,
        currencyValue,
        accessToken,
      );
    }
  };

  const handlePayWithOptionChange = (option: string) => {
    setPayWithOption(option);
    setShowAdditionalInfo(option !== "");
    setIsChecked(false);
    setIsPaymentButtonActive(false);
  }

  return (
    <div className={style.trialPackagesContainer}>
      <h2 className={style.title}>{t('APP_FREE_TRIAL2_TITLE')}</h2>
      <Link href="/dashboard">
        <Image
          className={style.close}
          src={close.src}
          alt="close"
          width={20}
          height={20}
        />
      </Link>
      <div className={style.packagesWrapper}>
        {sortedPackages.map((item, index) => (
    <div key={index} className={style.packageItem}>
      <PackageCard
        item={item!}
        index={index + 1}
        packageIdSetter={handlePackageId}
        isFreeTrial={true}
        isActive={selectedPackageId === item?._id}
      />
    </div>
        ))}
      </div>

      {selectedPackageId && (
        <div className={style.payWithMethodContainer}>
          <PayWithMethod
            options={payWithOptions}
            selectedOptionIndex={0} 
            payWithOption={payWithOption}
            setPayWithOption={handlePayWithOptionChange}
            isFreeTrialPage={true}
          />
        </div>
      )}

      {payWithOption && (
        <div className={style.agreement}>
          <label className={style.checkLabel} htmlFor="checkboxInput">
          <input
            type="checkbox"
            id="checkboxInput"
            checked={isChecked}
            onChange={handleCheckboxClick}
          />
          <span
            className={style.checkmark}
            style={{
              border: !isChecked ? '2px solid red' : '',
            }}
          ></span>
        </label>
        <p>
          {t('APP_AGREE_LICENSE_1') + ' '}
          <Link href="/licensing-agreement">{t('loginFooter4')}</Link>
          {' ' + t('APP_AGREE_LICENSE_2')}
          {' ' + t('APP_AGREE_LICENSE_3')}
        </p>
      </div> 
      )}
      <PaymentButton
        selectedOption="Pay at once"
        payWithOption={payWithOption}
        accessToken={accessToken}
        handlePackageBuy={handlePackageButtonClick}
        isDisabled={!isPaymentButtonActive}
      />
    </div>
  );
};

export default FreeTrialPackages;

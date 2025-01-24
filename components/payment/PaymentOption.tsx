// import React, { useState } from 'react';
// import classNames from 'classnames';
// import Image from 'next/image';
// import { useTranslation } from '@utils/useTranslation';
// import styles from './PaymentOption.module.scss';
// import purple_tick from '@public/assets/images/tick-check/bon-check-purple.png';
// import { handlePackageBuy, PaymentOptionProps } from '@utils/getPayments';
// import { paymentSelection } from '@utils/const';
// import { DiscountedTotalPrice } from '@components/packages/PromoPrices';
// import PayWithMethod from './payWithMethod';
// import PaymentButton from './paymentButton';

// const PaymentOption: React.FC<PaymentOptionProps> = ({
//   currentPackage,
//   monthlyPayment,
//   selectedCurrency,
//   payWithOptions,
//   accessToken,
//   checkedPackageOrderId
// }) => {
//   const { t } = useTranslation();
//   const [selectedOption, setSelectedOption] = useState<string>('');
//   const [payWithOption, setPayWithOption] = useState<string>('');
//   const [recurring, setRecurring] = useState<boolean>(false);
//   const {
//     oldPrice,
//     price,
//     _id: { symbol = '' } = {},
//   } = currentPackage?.currency[selectedCurrency] || {};
//   let currencyValue: string;

//   if (selectedCurrency === 0) {
//     currencyValue = 'GEL';
//   } else {
//     currencyValue = 'USD';
//   }
//   const defaultParamsObject = {
//     packageId: '',
//     currency: '',
//     recurring: false,
//     payWith: '',
//   };

//   const paramsObject = currentPackage
//     ? {
//         packageId: checkedPackageOrderId,
//         currency: currencyValue,
//         recurring: recurring,
//         payWith: payWithOption,
//         sale: currentPackage.sale
//       }
//     : defaultParamsObject;

//   let duration: number | null = null;

//   if (typeof window !== 'undefined') {
//     const getFromLocalStorage = (key: string) => {
//       const data = localStorage.getItem(key);
//       return data && data !== 'undefined' ? JSON.parse(data) : null;
//     };
//     duration = getFromLocalStorage('duration');
//   }

//   const handleOptionChange = (option: string) => {
//     const isRecurring = option === 'Monthly Payment';
//     setRecurring(isRecurring);
//     setSelectedOption(option);
//     if (payWithOptions && payWithOptions.length >= 0) {
//       setPayWithOption(payWithOptions[0].nameCode);
//     }
//   };


//   return (
//     <div>
//       {paymentSelection.map((option) => (
//         <div key={option.value} className={styles.optionsWrapper}>
//           <div
//             className={
//               selectedOption === option.value ? styles.optionContainer : ''
//             }
//           >
//             <div className={styles.radio} key={option.value}>
//               <input
//                 id={option.value}
//                 type="radio"
//                 name="pay"
//                 value={option.value}
//                 checked={selectedOption === option.value}
//                 onChange={() => handleOptionChange(option.value)}
//                 className={styles.radioInput}
//               />
//               <label htmlFor={option.value} className={styles.radioLabel}>
//                 {selectedOption === option.value && (
//                   <Image
//                     className={styles.purple_tick}
//                     src={purple_tick}
//                     width={20}
//                     height={20}
//                     alt=""
//                   />
//                 )}
//                 <div
//                   className={classNames(styles.priceWrapper, {
//                     [styles.checked]: selectedOption === option.value,
//                   })}
//                 >
//                   <span
//                     className={classNames(styles.labelText, {
//                       [styles.checked]: selectedOption === option.value,
//                     })}
//                   >
//                     {option.index === 0
//                       ? t('PAYMENT_PAY_AT_ONCE')
//                       : t('PAYMENT_MONTHLY_PAYMENT')}
//                   </span>
//                   <span>
//                     {currentPackage?.sale > 0 && option.index === 0 ? (
//                       <DiscountedTotalPrice
//                         oldPrice={oldPrice}
//                         symbol={symbol}
//                         totalPrice={price}
//                         onPaymentPage={selectedOption === option.value}
//                       />
//                     ) : (
//                       <>
//                         {option.index === 0
//                           ? price
//                           : monthlyPayment?.toFixed(1)}{' '}
//                         {symbol}
//                       </>
//                     )}
//                   </span>
//                 </div>
//               </label>
//             </div>
//             {selectedOption === option.value && (
//               <PayWithMethod
//                 options={payWithOptions ?? []}
//                 selectedOptionIndex={option.index}
//                 payWithOption={payWithOption}
//                 setPayWithOption={setPayWithOption}
//               />
//             )}
//           </div>
//         </div>
//       ))}

//       <PaymentButton
//         selectedOption={selectedOption}
//         payWithOption={payWithOption}
//         duration={duration}
//         paramsObject={paramsObject}
//         accessToken={accessToken}
//         handlePackageBuy={() =>
//           handlePackageBuy(
//             checkedPackageOrderId,
//             recurring,
//             payWithOption,
//             currencyValue,
//             accessToken,
//             currentPackage.sale,
//           )
//         }
//       />
//     </div>
//   );
// };

// export default PaymentOption;
import React, { useState } from 'react';
import { useTranslation } from '@utils/useTranslation';
import styles from './PaymentOption.module.scss';
import { handlePackageBuy, PaymentOptionProps } from '@utils/getPayments';
import PayWithMethod from './payWithMethod';
import PaymentButton from './paymentButton';
import { DiscountedTotalPrice } from '@components/packages/PromoPrices';
import PaymentAdditionalInfo from './paymentAdditionalInfo';
import PaymentInfo from './paymentInfo';

const PaymentOption: React.FC<PaymentOptionProps> = ({
  currentPackage,
  selectedCurrency,
  payWithOptions,
  accessToken,
  checkedPackageOrderId
}) => {
  const { t } = useTranslation();
  const [payWithOption, setPayWithOption] = useState<string>('');
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const {
    price,
    _id: { symbol = '' } = {},
  } = currentPackage?.currency[selectedCurrency] || {};

  const currencyValue: string = selectedCurrency === 0 ? 'GEL' : 'USD';
  const duration = currentPackage?.duration || 1;

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
   const handlePayWithOptionChange = (option: string) => {
        setPayWithOption(option)
        setShowAdditionalInfo(option !== "")
      }
  return (
    <div>
      <div className={styles.optionsWrapper}>
        <div className={styles.optionContainer}>
          <div className={styles.radio}>
            <label htmlFor="payAtOnce" className={styles.radioLabel}>
              <div className={styles.priceWrapper}>
                <span className={styles.labelText}>
                  {` ${duration} ${" "} ${t('APP_PACKAGE_PRICE')}`}
                </span>
                <span>
                  {currentPackage?.sale > 0 ? (
                    <DiscountedTotalPrice
                      oldPrice={currentPackage.currency[selectedCurrency].oldPrice}
                      symbol={symbol}
                      totalPrice={price}
                      onPaymentPage={true}
                    />
                  ) : (
                    <>
                      {price} {symbol}
                    </>
                  )}
                </span>
              </div>
            </label>
          </div>
        </div>
          <PayWithMethod
            options={payWithOptions ?? []}
            selectedOptionIndex={0}
            payWithOption={payWithOption}
            setPayWithOption={handlePayWithOptionChange}
          />
      </div>
      <PaymentInfo isPaymentMethodChosen={payWithOption !== ''} />
      {showAdditionalInfo && (
        <PaymentAdditionalInfo
        currentPackage={currentPackage}
        selectedCurrency={selectedCurrency}
        payWithOptions={payWithOptions}
        accessToken={accessToken}
        checkedPackageOrderId={checkedPackageOrderId}
        payWithOption={payWithOption}
        />
      )}
      {/* <PaymentButton
        selectedOption="Pay at once"
        payWithOption={payWithOption}
        paramsObject={paramsObject}
        accessToken={accessToken}
        handlePackageBuy={() =>
          handlePackageBuy(
            checkedPackageOrderId,
            false,
            payWithOption,
            currencyValue,
            accessToken,
            currentPackage.sale,
          )
        }
      /> */}
    </div>
  );
};

export default PaymentOption;
import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from '@utils/useTranslation';
import classNames from 'classnames';
import style from './paymentButton.module.scss';
import { getRecurringStatus, PaymentButtonProps } from '@utils/getPayments';
import createSwalHtml from '@components/payments/paymentsSwal';
import Swal from 'sweetalert2';
import conversationIcon from "../../public/themes/images/v1/icon-conversation.png";

const PaymentButton: React.FC<PaymentButtonProps> = ({
  selectedOption,
  duration,
  handlePackageBuy,
  paramsObject,
  accessToken,
  isDisabled
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const isFreeTrial = router.pathname === '/free-trial';

  const handleButtonClick = async () => {
    if (selectedOption === 'Monthly Payment') {
      const getActiveRecurring = await getRecurringStatus(accessToken);
      if (getActiveRecurring.stack === "RECURRING") {
        const userPrompt = await Swal.fire({
          html: createSwalHtml(
            t('PAYMENTS_INNER_PAYMENTS_ACTIVE_RECURRING'),
            t('PAYMENTS_RECURRING_CONTINUE_POSSIBLE_AFTER'),
            {
              paymentImageSrc: conversationIcon.src,
              paymentText: t('PAYMENTS_CURRENT_RECURRING_END_DATE'),
              price: getActiveRecurring.data.split("T")[0],
              imageWidth: 65,
              imageHeight: 65,
            }
          ),
          confirmButtonText: t('SWAL_RESET_CLOSE_BUTTON'),
          showCloseButton: true,
          customClass: {
            confirmButton: style.swalConfirmButton,
            popup: style.swalPopup,
          },
        });
      } else {
        const recurringString = paramsObject?.recurring ? "true" : "false";
        const sale = paramsObject?.sale?.toString()
        const params = new URLSearchParams({
          packageId: paramsObject?.packageId || "",
          currency: paramsObject?.currency || "",
          recurring: recurringString,
          payWith: paramsObject?.payWith || "",
          sale: sale || ''
        });
        router.push({
          pathname: "/paymentSchedule",
          query: { period: duration },
          search: params.toString()
        });
      }
    } else if (selectedOption === 'Pay at once') {
      await handlePackageBuy();
    }
  };

  const buttonClass = classNames({
    [style.paymentButton]: !isFreeTrial,
    [style.freeTrialButton]: isFreeTrial,
    [style.enabled]: !isDisabled,
  });

  const buttonText = isFreeTrial ? t('APP_FREE_TRIAL23_START_FREE_TRIAL') : t('APP_GENERAL_CONTINUE');

  return (
    <div className={classNames(style.buttonContainer, {
      [style.freeTrialButtonContainer]: isFreeTrial
    })}>
      <button
        className={buttonClass}
        onClick={handleButtonClick}
        disabled={selectedOption === ''}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PaymentButton;

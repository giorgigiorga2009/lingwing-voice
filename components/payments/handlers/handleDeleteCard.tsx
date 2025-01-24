import {
  deleteCreditCard,
  disableRecurring,
  pauseRecurring,
  PaymentsProps,
} from '@utils/getUserPayemnts';
import Swal from 'sweetalert2';
import createSwalHtml from '../paymentsSwal';
import style from '../../../pages/payments.module.scss';
import timeTable from '../../../public/themes/images/v2/timetable.png';
import paymentImage from '../../../public/themes/images/v2/payment.png';
import { Session } from 'next-auth';

const deleteCard = async (
  t: (key: string) => string,
  session: Session,
  paymentsData: PaymentsProps,
  setPaymentsData: React.Dispatch<React.SetStateAction<PaymentsProps | null>>,
  isDelettion?: boolean
) => {
  const failedText = isDelettion
    ? t('PAYMENTS_RECURRING_AND_CARD_FAILED')
    : t('PAYMENTS_TRANSACTION_NO_FUNDS');
  const text = isDelettion
    ? t('PAYMENTS_STATS_CARD_DELETE_SUCCESS')
    : t('PAYMENTS_RECURRING_DISABLE_SUCCESS');
  try {
    if (session) {
      const removeCard = isDelettion
        ? await deleteCreditCard(session.user.accessToken)
        : await disableRecurring(session.user.accessToken);

      if (removeCard.data === 'OK') {
        if (isDelettion) {
          setPaymentsData({
            ...paymentsData,
            creditCard: { isAttached: false, number: '', type: '' },
          });
        }
        await Swal.fire({
          text,
          icon: 'success',
          showConfirmButton: true,
          confirmButtonColor: 'rgb(105 46 150)',
          confirmButtonText: t('SWAL_RESET_BTN_OK'),
          customClass: {
            popup: style.swalPopup,
          },
        });
      } else {
        await Swal.fire({
          text: t('PAYMENTS_SWAL_TITLE_ERROR'),
          icon: 'warning',
          showConfirmButton: true,
          confirmButtonColor: 'rgb(105 46 150)',
          confirmButtonText: t('SWAL_RESET_BTN_OK'),
          customClass: {
            popup: style.swalPopup,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error deleting card:', error);
    await Swal.fire({
      text: failedText,
      icon: 'error',
      showConfirmButton: true,
      confirmButtonColor: 'rgb(105 46 150)',
      confirmButtonText: t('SWAL_RESET_BTN_OK'),
      customClass: {
        popup: style.swalPopup,
      },
    });
  }
};

export const handleDeleteCard = async (
  session: Session,
  isActiveRecurring: boolean,
  t: (key: string) => string,
  paymentsData: PaymentsProps,
  setPaymentsData: React.Dispatch<React.SetStateAction<PaymentsProps | null>>,
  randomNumbers: string[],
  isSubscription: boolean
) => {
  try {
    if (session) {
      if (isActiveRecurring && !isSubscription) {
        const userPrompt = await Swal.fire({
          html: createSwalHtml(
            t('PAYMENTS_CANCEL_RECURRING'),
            t('PAYMENTS_YOU_HAVE_TO_PAY_RECURRING_TO_DELETE_CARD'),
            {
              paymentImageSrc: paymentImage.src,
              paymentText: t('PAYMENTS_RECURRING_HAVE_TO_PAY'),
              price: paymentsData?.activeRecurring?.slice(-1)[0]?.amount || 0,
              currency:
                paymentsData?.activeRecurring?.slice(-1)[0]?.currency || '',
            }
          ),
          confirmButtonText: t('PAYMENTS_CANCEL_RECURRING'),
          showCloseButton: true,
          customClass: {
            confirmButton: style.swalConfirmButton,
            popup: style.swalPopup,
          },
        });

        if (userPrompt.isConfirmed) {
          await deleteCard(t, session, paymentsData, setPaymentsData, true);
        }
      } else if (!isActiveRecurring || isSubscription) {
        const result = await Swal.fire({
          title: t('SWAL_RESET_COUSE_TITLE'),
          text: t('PAYMENTS_STATS_SWAL_DELETE_CARD_TEXT'),
          icon: 'warning',
          showConfirmButton: true,
          showCloseButton: true,
          cancelButtonColor: 'rgb(105 46 150)',
          showCancelButton: true,
          confirmButtonColor: 'rgb(110 120 129)',
          confirmButtonText: t('SWAL_RESET_BTN_OK'),
          cancelButtonText: t('SWAL_RESET_CLOSE_BUTTON'),
          customClass: {
            popup: style.swalPopup,
          },
        });

        if (result.isConfirmed) {
          const finalWarning = await Swal.fire({
            title: t('ENTER_NUMBERS'),
            html: `
              <p>${t('ENTER_FOLLOWING_NUMBERS')}: ${randomNumbers}</p>
            <input id="swal-input" type="text" placeholder="Type numbers">
          `,
            showCancelButton: true,
            confirmButtonText: t('SWAL_RESET_BTN_OK'),
            confirmButtonColor: 'rgb(110 120 129)',
            cancelButtonText: t('SWAL_RESET_CLOSE_BUTTON'),
            cancelButtonColor: 'rgb(105 46 150)',
            focusConfirm: false,
            customClass: {
              container: style.customSwalHeight,
              popup: `${style.swalPopup} `,
            },
            preConfirm: () => {
              const inputValue = (
                document.getElementById('swal-input') as HTMLInputElement
              )?.value;

              if (inputValue === randomNumbers[0]) {
                return true;
              } else {
                Swal.showValidationMessage(t('SWAL_VALIDATION_ERROR'));
                return false;
              }
            },
          });

          if (finalWarning.isConfirmed) {
            await deleteCard(t, session, paymentsData, setPaymentsData, true);
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed order', error);
  }
};

export const handleCancelRecurring = async (
  session: Session,
  isActiveRecurring: boolean,
  t: (key: string) => string,
  paymentsData: PaymentsProps,
  setPaymentsData: React.Dispatch<React.SetStateAction<PaymentsProps | null>>,
  isPaypalSubscription?: boolean,
  isSubscription?: boolean,
  isPauseUsed?: boolean
) => {
  try {
    if (session && isActiveRecurring) {
      const swalOptions = {
        html: createSwalHtml(
          t('PAYMENTS_CANCEL_RECURRING'),
          (isPaypalSubscription || isSubscription) && !isPauseUsed
            ? t('PAYMENTS_SUBSCRIPTION_CANCEL_TEXT')
            : (isPaypalSubscription || isSubscription) && isPauseUsed
            ? t('PAYMENTS_SUBSCRIPTION_CANCEL_NO_PAUSE_OFFERING_TEXT')
            : t('PAYMENTS_YOU_HAVE_TO_PAY_RECURRING_TO_DELETE_CARD'),
          {
            paymentImageSrc: timeTable.src,
            paymentText:
              !isPaypalSubscription && !isSubscription
                ? t('PAYMENTS_RECURRING_HAVE_TO_PAY')
                : '',
            price:
              !isPaypalSubscription && !isSubscription
                ? paymentsData?.activeRecurring?.slice(-1)[0]?.amount || 0
                : '',
            currency:
              !isPaypalSubscription && !isSubscription
                ? paymentsData?.activeRecurring?.slice(-1)[0]?.currency || ''
                : '',
          }
        ),
        showCloseButton: true,
        customClass: {
          confirmButton: style.swalConfirmButton,
          cancelButton: style.swalCancelButton,
          popup: style.swalPopup,
        },
      };

      if ((isPaypalSubscription || isSubscription) && !isPauseUsed) {
        Object.assign(swalOptions, {
          showCancelButton: true,
          confirmButtonText: t('PAYMENTS_PAUSE_INSTEAD'),
          cancelButtonText: t('PAYMENTS_CANCEL_ANYWAY'),
        });
      } else {
        Object.assign(swalOptions, {
          confirmButtonText: t('PAYMENTS_CANCEL_RECURRING'),
        });
      }

      const userPrompt = await Swal.fire(swalOptions);

      if (userPrompt.isConfirmed) {
        if ((isPaypalSubscription || isSubscription) && pauseRecurring) {
          await pauseRecurring(session.user.accessToken);
        } else {
          await deleteCard(t, session, paymentsData, setPaymentsData, false);
        }
      } else if (
        userPrompt.dismiss === Swal.DismissReason.cancel &&
        (isPaypalSubscription || isSubscription)
      ) {
        await deleteCard(t, session, paymentsData, setPaymentsData, false);
      }
    } else if (session && !isActiveRecurring) {
      await deleteCard(t, session, paymentsData, setPaymentsData, false);
    }
  } catch (error) {
    console.error('Failed order', error);
  }
};

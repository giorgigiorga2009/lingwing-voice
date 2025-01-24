import { GetProfileData } from '@utils/profileEdit';
import createSwalHtml from '../paymentsSwal';
import Swal from 'sweetalert2';
import addOneMonth from '../addOneMonth';
import style from '../../../pages/payments.module.scss';
import { contineRecurring, pauseRecurring } from '@utils/getUserPayemnts';
import { NextRouter } from 'next/router';
import { Session } from 'next-auth';

const isProfileFilled = async (session: Session) => {
  if (session) {
    try {
      const profile = await GetProfileData(session.user.accessToken);
      if (profile && profile.profile && profile.local) {
        const phoneNumber = profile.profile.phoneNumber;
        const email = profile.local.email;

        if (
          phoneNumber === undefined ||
          phoneNumber === '' ||
          phoneNumber === null ||
          email === undefined ||
          email === '' ||
          email === null
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        // console.log('Profile structure is invalid.');
        return false;
      }
    } catch (error) {
      // console.error('Failed to get profile data:', error);
      return false;
    }
  } else {
    console.log('Session is not defined.');
    return false;
  }
};

export const handlePauseRecurring = async (
  session: Session,
  t: (key: string) => string,
  nextPaymentDate: string,
  router: NextRouter,
  isPaypalSubscription?: boolean
) => {
  try {
    if (session) {
      const isProfileComplete = await isProfileFilled(session);

      if (isProfileComplete) {
        const userPromptPause = await Swal.fire({
          html: createSwalHtml(
            t('PAYMENTS_PAUSE_RECURRING'),
            isPaypalSubscription ? t('PAYMENTS_PAUSE_RECURRING_TEXT_ARE_YOU_SURE_SUBSCRIPTION') : t('PAYMENTS_PAUSE_RECURRING_TEXT_ARE_YOU_SURE'),
            {textAlign: 'center'}
          ),
          cancelButtonText: t('FAQ_NO'),
          confirmButtonText: t('FAQ_YES'),
          showCloseButton: true,
          showCancelButton: true,
          customClass: {
            cancelButton: style.swalCancelButton,
            confirmButton: style.swalConfirmButton,
            actions: style.swal2actions,
            popup: style.swalPopup,
          },
        });
        if (userPromptPause.isConfirmed) {
          const userPromptPause2 = await Swal.fire({
            html: createSwalHtml(
              t('PAYMENTS_PAUSE_RECURRING'),
              isPaypalSubscription ? t(
                'PAYMENTS_PAUSE_RECURRING_TEXT_ARE_YOU_SURE_SUBSCRIPTION_NEXT'
              ) : `${t(
                'PAYMENTS_PAUSE_RECURRING_TEXT_ARE_YOU_SURE_NEXT'
              )} ${addOneMonth(nextPaymentDate)}`,
              {textAlign: 'center'}
            ),
            cancelButtonText: t('PAYMENTS_SWAL_BUTTON_CANCEL'),
            confirmButtonText: t('PAYMENTS_SWAL_BUTTON_CONTINUE'),
            showCloseButton: true,
            showCancelButton: true,
            customClass: {
              cancelButton: style.swalCancelButton,
              confirmButton: style.swalConfirmButton,
              actions: style.swal2actions,
              popup: style.swalPopup,
            },
          });
          if (userPromptPause2.isConfirmed) {
            await pauseRecurring(session.user.accessToken);
            await Swal.fire({
              html: createSwalHtml(
                t('PAYMENTS_PAUSE_RECURRING'),
                isPaypalSubscription ? t('PAYMENTS_PAUSE_SUBSCRIPTION_SUCCESS') : `${t('PAYMENTS_PAUSE_INSTALLMENT_FINAL')} ${addOneMonth(
                  nextPaymentDate,
                  true
                )} ${t('PAYMENTS_PAUSE_INSTALLMENT_FINAL_PART2')} ${t(
                  'PAYMENTS_PAUSE_INSTALLMENT_FINAL_PART3'
                )}  ${addOneMonth(nextPaymentDate, true)} ${t(
                  'PAYMENTS_PAUSE_INSTALLMENT_FINAL_PART4'
                )}`,
                {textAlign: 'center'}
              ),
              cancelButtonText: t('SWAL_RESET_CLOSE_BUTTON'),
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: false,
              customClass: {
                cancelButton: style.swalCancelButton,
                popup: style.swalPopup,
              },
            });
          }

        }
      } else {
        const userPrompt = await Swal.fire({
          html: createSwalHtml(
            t('PAYMENTS_PAUSE_RECURRING'),
            t('PAYMENTS_PAUSE_RECURRING_TEXT_IF_PROFILE_IS_NOT_FILLED')
          ),
          confirmButtonText: t('APP_PROFILE_EDIT'),
          showCloseButton: true,
          customClass: {
            confirmButton: style.swalConfirmButton,
            popup: style.swalPopup
          },
        });
        if (userPrompt.isConfirmed) {
          router.push('/profile');
        }
      }
    }
  } catch (error) {
    console.error('failed order', error);
  }
};

export const handleContinueRecurring = async (
  session: Session,
  t: (key: string) => string
) => {
  if (session) {
    const continueRec = await contineRecurring(session.user.accessToken);
    if (continueRec.status === 200) {
      await Swal.fire({
        text: t('PAYMENTS_CONTINUE_RECURRING_SUCCESS'),
        icon: 'success',
        showConfirmButton: true,
        confirmButtonColor: 'rgb(105 46 150)',
        confirmButtonText: t('SWAL_RESET_BTN_OK'),
        customClass: {
          popup: style.swalPopup
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
          popup: style.swalPopup
        },
      });
    }
  }
};

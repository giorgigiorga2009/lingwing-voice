import { Header } from '@components/header/Header';
import { PageHead } from '@components/PageHead';
import CurrentRecurring from '@components/payments/currentRecurringPart';
import { handleAddCard } from '@components/payments/handlers/handleAddCard';
import {
  handleCancelRecurring,
  handleDeleteCard,
} from '@components/payments/handlers/handleDeleteCard';
import {
  handleContinueRecurring,
  handlePauseRecurring,
} from '@components/payments/handlers/handlePause';
import style from '@pages/payments.module.scss';
import { PaymentsProps, getUserPayements } from '@utils/getUserPayemnts';
import { useTranslation } from '@utils/useTranslation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import paymentImage from '../public/themes/images/v2/payment.png';
import TransactionsHistory from '@components/payments/transactionsHistory';
import StatsPart from '@components/payments/stats';

const Payments = () => {
  const { t } = useTranslation();
  const [paymentsData, setPaymentsData] = useState<PaymentsProps | null>(null);
  const router = useRouter();
  const { data: session, status} = useSession();
  const [isActiveRecurring, setIsActiveRecurring] = useState<boolean>(false);
  const [isSubscription, setIsSubscription] = useState<boolean>(false);
  const pauseIsUsed =
    paymentsData?.activeRecurring[paymentsData.activeRecurring.length - 1]
      ?.order.isPauseUsed;
  const isPauseLog =
    paymentsData?.activeRecurring
      ?.slice(-1)[0]
      ?.order?.recurringLogs?.some((item) => item.isPauseLog === true) ?? false;
  const nextPaymentDate =
    paymentsData?.activeRecurring?.slice(-1)[0]?.order?.nextRecurringDate || '';

  const goBack = () => {
    router.back();
  };
  const [randomNumbers] = useState(
    [Math.floor(Math.random() * 9000) + 1000].map(String)
  );

  useEffect(() => {
    const fetchUserPayments = async () => {
      if (session) {
        await getUserPayements(session.user.accessToken)
          .then((data) => {
            setPaymentsData(data);
            if (data?.activeRecurring && data?.activeRecurring[0]?.order?.status === 1) {
              if (data.activeRecurring[0]?.order?.subscription?.status === 1 || data.activeRecurring[0]?.order?.subscription?.status === 3) {
                setIsSubscription(true);
                setIsActiveRecurring(true);
              } else if(!data.activeRecurring[0]?.order?.subscription){
                setIsActiveRecurring(true);
              }
            }
            return data;
          })
          .catch((error) => {
            console.error('Error fetching userPayments:', error);
          });
      }
    };

    fetchUserPayments();
  }, [session]);
  
  

  if (!session) {
    return null;
  }

  
  return (
    <div className={style.wrapper}>
      <PageHead
        title="META_TAG_PAYMENTS_TITLE"
        description="META_TAG_PAYMENTS_DESCRIPTION"
        keywords="META_TAG_PAYMENTS_KEYWORDS"
      />
      <Header
        size="s"
        loginClassName={style.loginModal}
        setShowTopScores={() => false}
        showTopScores={false}
      />
      <div className={style.containerWrapper}>
        <div className={style.payments}>{t('APP_HEADER_PAYMENTS')}</div>
        <div className={style.container}>
          <button className={style.cross} onClick={goBack}>
            ✕
          </button>
          <StatsPart paymentsData={paymentsData} />
          <div className={style.secondRow}>
            <div className={style.subTitle}>
              {t('PAYMENTS_STATS_YOUR_CARD')}
            </div>
            {paymentsData?.creditCard.isAttached ? (
              <>
                <div className={style.cardInfo}>
                  <p>**** **** **** {paymentsData?.creditCard.number}</p>
                  <p>{paymentsData?.creditCard.type}</p>
                </div>
                <button
                  onClick={(e) => handleAddCard(e, session, t, paymentImage)}
                >
                  {t('PAYMENTS_STATS_CHANGE_CREDIT_CARD')}
                </button>
                <button
                  onClick={(e) =>
                    handleDeleteCard(
                      session,
                      isActiveRecurring,
                      t,
                      paymentsData,
                      setPaymentsData,
                      randomNumbers,
                      isSubscription
                    )
                  }
                >
                  {t('PAYMENTS_STATS_DELETE_CARD')}
                </button>
                {(isActiveRecurring || isSubscription) && (
                  <>
                    {pauseIsUsed && isPauseLog && (
                      <button
                        onClick={(e) => handleContinueRecurring(session, t)}
                      >
                        {t('PAYMENTS_CONTINUE_RECURRING')}
                      </button>
                    )}
                    {!pauseIsUsed && (
                      <button
                        onClick={(e) =>
                          handlePauseRecurring(
                            session,
                            t,
                            nextPaymentDate,
                            router
                          )
                        }
                      >
                        {t('PAYMENTS_PAUSE_RECURRING')}
                      </button>
                    )}
                    <button
                      onClick={(e) =>
                        handleCancelRecurring(
                          session,
                          isActiveRecurring,
                          t,
                          paymentsData,
                          setPaymentsData,
                          false,
                          isSubscription,
                          pauseIsUsed
                        )
                      }
                    >
                      {t('PAYMENTS_CANCEL_RECURRING')}
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={(e) => handleAddCard(e, session, t, paymentImage)}
                >
                  {t('PAYMENTS_STATS_ADD_CARD')}
                </button>
                {/* this is paypal at this point */}
                {isActiveRecurring && (
                  <>
                    {pauseIsUsed && isPauseLog && (
                      <button
                        onClick={(e) => handleContinueRecurring(session, t)}
                      >
                        {t('PAYMENTS_CONTINUE_RECURRING')}
                      </button>
                    )}
                    {!isPauseLog && (
                      <button
                        onClick={(e) =>
                          handlePauseRecurring(
                            session,
                            t,
                            nextPaymentDate,
                            router,
                            true
                          )
                        }
                      >
                        {t('PAYMENTS_PAUSE_RECURRING')}
                      </button>
                    )}
                    <button
                      onClick={(e) =>
                        paymentsData &&
                        handleCancelRecurring(
                          session,
                          isActiveRecurring,
                          t,
                          paymentsData,
                          setPaymentsData,
                          true,
                          isSubscription,
                          pauseIsUsed
                        )
                      }
                    >
                      {t('PAYMENTS_CANCEL_RECURRING')}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
            <>
              {(isSubscription || isActiveRecurring) && <CurrentRecurring paymentsData={paymentsData} />}
              <TransactionsHistory paymentsData={paymentsData} />
            </>

        </div>
      </div>
    </div>
  );
};

export default Payments;

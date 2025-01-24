import React from 'react';
import style from '../../pages/payments.module.scss'
import { useTranslation } from '@utils/useTranslation';
import { PaymentsProps } from '@utils/getUserPayemnts';

interface CurrentRecurringProps {
  paymentsData: PaymentsProps | null;
}

const transactionHistoryStatus = (paymentsData: any, t: (key: string) => string) => {
    if (!paymentsData || !paymentsData.activeRecurring) {
      return null;
    }

    return paymentsData.activeRecurring.map((recurring: any, index: number) => {
      const recurringLog = recurring.order.recurringLogs[index];
      if (!recurringLog) {
        return null;
      }
      let status = '';
      const isPauseLog = recurringLog.isPauseLog === true;
      if (recurringLog.status === 0 && recurringLog.isPauseLog === true) {
        status = t('PAYMENTS_TRANSACTION_STATUS_PAUSED');
      } else if (recurringLog.status === 0) {
        status = t('PAYMENTS_TRANSACTION_STATUS_SUCCESSFUL');
      } else if (recurringLog.status === 1) {
        status = t('PAYMENTS_TRANSACTION_STATUS_PENDING');
      } else if (recurringLog.status === 2) {
        status = t('PAYMENTS_TRANSACTION_STATUS_FAILED');
      }

      return (
        <div className={style.tableRow} key={index}>
          <div>{recurringLog.time}</div>
          <div>{status}</div>
          <div>
            {!isPauseLog && (
              <>
                {' '}
                {recurring.amount} {recurring.currency}{' '}
              </>
            )}
          </div>
        </div>
      );
    });
  };

const CurrentRecurring: React.FC<CurrentRecurringProps> = ({ paymentsData }) => {
  const { t } = useTranslation();
  if (!paymentsData) {
    return null;
  }
  return (
    <div className={style.thirdRow}>
      <div className={style.subTitle}>{t('PAYMENTS_STATS_HISTORY')}</div>
      <div className={style.recurringLogs}>
        <div className={style.tableHeader}>
          <div>{t('PAYMENTS_STATS_PAYMENT_DATE')}</div>
          <div>{t('PAYMENTS_STATS_STATUS')}</div>
          <div>{t('PAYMENTS_STATS_AMOUNT')}</div>
        </div>
        {transactionHistoryStatus(paymentsData, t)}
        <div className={style.tableRow}>
          {paymentsData?.activeRecurring?.slice(-1)[0]?.order?.status === 1 && (
            <>
              <div>
                {paymentsData?.activeRecurring?.slice(-1)[0]?.order?.nextRecurringDate}
              </div>
              <div>{t('PAYMENTS_TRANSACTION_STATUS_IN_PROGRESS')}</div>
              <div>
                {paymentsData?.activeRecurring?.slice(-1)[0]?.amount}{' '}
                {paymentsData?.activeRecurring?.slice(-1)[0]?.currency}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentRecurring;

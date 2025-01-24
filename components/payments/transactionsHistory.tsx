import { useTranslation } from '@utils/useTranslation';
import style from '../../pages/payments.module.scss';
import { PaymentsProps } from '@utils/getUserPayemnts';

interface TransactionsHistoryProps {
  paymentsData: PaymentsProps | null;
}

const TransactionsHistory: React.FC<TransactionsHistoryProps> = ({
  paymentsData,
}) => {
  const { t } = useTranslation();
  if (!paymentsData) {
    return null;
  }
  return (
    <div className={style.thirdRow}>
      <div className={style.subTitle}>{t('PAYMENTS_STATS_HISTORY')}</div>
      <div className={style.history}>
        <div className={style.tableHeader}>
          <div>{t('PAYMENTS_STATS_PRODUCT')}</div>
          <div>{t('PAYMENTS_STATS_STATUS')}</div>
          <div>{t('PAYMENTS_STATS_METHOD')}</div>
          <div>{t('PAYMENTS_STATS_AMOUNT')}</div>
          <div>{t('PAYMENTS_STATS_PAYMENT_DATE')}</div>
        </div>
        {paymentsData && Array.isArray(paymentsData.transactions) &&
          paymentsData?.transactions.map((transaction, index) => (
            <div className={style.tableRow} key={index}>
              <div>{`${t('PAYMENTS_PACKAGE')} (${
                transaction?.order?.duration
              } ${t('APP_PACKAGE_MONTHS')})`}</div>
              <div>
                {transaction.status === 0
                  ? t('PAYMENTS_TRANSACTION_STATUS_SUCCESSFUL')
                  : transaction.status === 1
                  ? t('PAYMENTS_TRANSACTION_STATUS_PENDING')
                  : t('PAYMENTS_TRANSACTION_STATUS_FAILED')}
              </div>
              <div>
                {transaction.method === 0
                  ? t('PAYMENTS_PLASTIC_CARD')
                  : transaction.method === 5
                  ? t('PAYMENTS_INSTALLMENT')
                  : transaction.method === 6
                  ? t('PAYMENTS_FREE_TRIAL')
                  : transaction.method === 1 && t('PAYMENTS_PAYPAL')}
              </div>
              <div>
                {transaction.amount} {transaction.currency}
              </div>
              <div>{transaction.createdAt}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TransactionsHistory;

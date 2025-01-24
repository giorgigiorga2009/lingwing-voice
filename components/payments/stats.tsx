import { PaymentsProps } from "@utils/getUserPayemnts";
import { useTranslation } from "@utils/useTranslation";
import style from '../../pages/payments.module.scss';

interface StatsProps{
    paymentsData: PaymentsProps | null;
}

const StatsPart: React.FC<StatsProps> = ({paymentsData}) => {
    const {t} = useTranslation()
    if(!paymentsData){
        return null
    }
    
    return(
        <div className={style.firstRow}>
        <div className={style.firstRowContent}>
          <div>{t('PAYMENTS_STATS_REMAINING')}</div>
          <div className={style.statsNum}>
            {paymentsData?.premiumDaysLeft}
          </div>
        </div>
        <div className={style.firstRowContent}>
          <div>{t('PAYMENTS_STATS_TASKS')}</div>
          <div className={style.statsNum}>{paymentsData?.tasks}</div>
        </div>
      </div>
    )

}

export default StatsPart
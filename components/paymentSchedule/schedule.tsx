import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@utils/useTranslation';
import style from './schedule.module.scss';
import checkList from '@public/assets/images/list.png';
import { handlePackageBuy } from '@utils/getPayments';
import { useRouter } from 'next/router';
import { UserInfo, useUserStore } from '@utils/store';

function Schedule() {
  const [schedule, setSchedule] = useState<string[]>([]);
  const [number, setNumber] = useState<number[]>([]);
  const [agreed, setAgreed] = useState(false);
  const currentDate = new Date();
  const { t } = useTranslation();
  const router = useRouter();

  const { Token } = useUserStore((state: UserInfo) => ({
    Token: state.Token,
  }));
  const { packageId, recurring, payWith, currency, sale } = router.query;

  const recurringBoolean = recurring === 'true' ? true : false;

  let duration: number, recurringPrice: number, symbol: string;

  if (typeof window !== 'undefined') {
    const getFromLocalStorage = (key: string) => {
      const data = localStorage.getItem(key);
      return data && data !== 'undefined' ? JSON.parse(data) : null;
    };

    duration = getFromLocalStorage('duration');
    recurringPrice = getFromLocalStorage('recurringPrice');
    symbol = getFromLocalStorage('symbol');
  }

  useEffect(() => {
    const nextDates: string[] = [];
    const nextDate = new Date(currentDate);
    const number: number[] = [];

    for (let i = 1; i <= duration; i++) {
      nextDates.push(nextDate.toISOString().split('T')[0]);
      nextDate.setMonth(nextDate.getMonth() + 1);
      number.push(i);
    }

    setSchedule(nextDates);
    setNumber(number);
  }, []);

  return (
    <div>
      {schedule.length > 0 && (
        <div className={style.paymentSchedule}>
          <h2 className={style.scheduleHeader}>
            {t('PAYMENT_SCHEDULE_HEADER')}
          </h2>
          <table className={style.table}>
            <thead>
              <tr>
                <th>
                  <Image
                    src={checkList}
                    alt=""
                    className={style.checkListPng}
                    width={18}
                    height={18}
                    priority={true}
                  />
                </th>
                <th>{t('PAYMENT_SCHEDULE_DATE')}</th>
                <th>{t('PAYMENT_SCHEDULE_AMOUNT')}</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((date, index) => (
                <tr key={date}>
                  <td>{number[index]}</td>
                  <td>{date}</td>
                  <td>
                    {(recurringPrice / duration).toFixed(1)}
                    {symbol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <label className={style.checkBoxContainer}>
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
            <span className={style.customCheckBox}></span>
            <span className={style.termsAndConditions}>
              {t('PAYMENT_SCHEDULE_LICENSE')}
            </span>
            <a
              className={style.a}
              href="/licensing-agreement"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('loginFooter4')}
            </a>
          </label>
          <div className={style.continueBtn}>
            <button
              onClick={() =>
                handlePackageBuy(
                  packageId as string,
                  recurringBoolean,
                  payWith as string,
                  currency as string,
                  Token as string,
                  sale as string
                )
              }
              className={style.btn}
              disabled={!agreed}
            >
              {t('APP_GENERAL_CONTINUE')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;

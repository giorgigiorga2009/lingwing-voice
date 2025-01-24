import React, { useEffect, useRef, useState } from 'react';
import style from './statsPagePerOnePercent.module.scss';
import { useTranslation } from '@utils/useTranslation';
import CircularProgress from './circularProgress';
import wallClock from '@public/themes/images/v2/clock-with-dots.png';
import parrot from '@public/themes/images/v2/pr-parrot.png';
import Image from 'next/image';
import {
  StatsDataProps,
  StatsPagePerOnePercentProps,
  getStatsPerPercent,
} from '@utils/lessons/getStatsPerPercent';
import { useStatisticPercentStore } from '@utils/store';

const StatsPagePerOnePercent: React.FC<StatsPagePerOnePercentProps> = ({
  courseId,
  completedTasks,
  isUserLoggedIn,
  token,
}) => {
  const { t } = useTranslation();
  const [statsData, setStatsData] = useState<StatsDataProps>();
  const [isStatsVisible, setIsStatsVisible] = useState<boolean>(false);
  const previousPercentRef = useRef(0.1);
  const { setStatisticPercent } = useStatisticPercentStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accomplishStats = await getStatsPerPercent({
          userCourseId: courseId,
          token: token,
        });
        setStatsData(accomplishStats);

        if (accomplishStats && accomplishStats.percent) {
          setStatisticPercent(accomplishStats.percent);
        }

        if (previousPercentRef.current === 0.1) {
          previousPercentRef.current = Math.floor(accomplishStats.percent);
        }
        if (Math.floor(accomplishStats.percent) > previousPercentRef.current) {
          setIsStatsVisible(true);
          previousPercentRef.current = Math.floor(accomplishStats.percent);
        }
      } catch (err) {
        console.error('An error occurred:', err);
      }
    };
    if (courseId && token) {
      fetchData();
    }
  }, [completedTasks, courseId, token]);

  const secondsToHMS = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;

    const formatted = [hours, minutes, sec]
      .map((v) => (v < 10 ? '0' + v : v))
      .join(':');

    return formatted;
  };

  if (!isUserLoggedIn || !isStatsVisible) {
    return null;
  }

  return (
    <div className={style.modal}>
      <div className={style.container}>
        <span className={style.prBg}></span>
        <span className={style.starOne}></span>
        <span className={style.starTwo}></span>
        <span className={style.starThree}></span>
        <span className={style.starFour}></span>
        <span className={style.starFive}></span>
        <div className={style.leftSide}>
          <div className={style.title}>{t('STATS_PER_PERCENT_PROGRESS')}</div>
          <div className={style.barCharts}>
            <div className={style.grammar}>
              <div>
                {t('STATS_PER_PERCENT_GRAMMAR')}{' '}
                <span>
                  {' '}
                  {statsData?.grammar.current} / {statsData?.grammar.max}
                </span>
              </div>
              <div className={style.chart}>
                <div
                  className={style.filled}
                  style={{
                    width: `${
                      ((statsData?.grammar.current || 0) /
                        (statsData?.grammar.max || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className={style.tasks}>
              <div>
                {t('STATS_PER_PERCENT_COMPLETED')}{' '}
                <span>
                  {' '}
                  {statsData?.tasks.current} / {statsData?.tasks.max}
                </span>
              </div>
              <div className={style.chart}>
                <div
                  className={style.filled}
                  style={{
                    width: `${
                      ((statsData?.tasks.current || 0) /
                        (statsData?.tasks.max || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
          <p>{t('STATS_PER_PERCENT_KEEP_LEARNING')}</p>
          <button
            onClick={() => setIsStatsVisible(false)}
            className={style.continueButton}
          >
            <span>{t('STATS_PER_PERCENT_CONTINUE')}</span>
            <span className={style.arrow}></span>
          </button>
        </div>
        <div className={style.rightSide}>
          <div className={style.circularProgress}>
            <CircularProgress
              percentage={statsData?.percent || 0}
              page={'OnePercentPage'}
            />
          </div>
          <div className={style.timeContainer}>
            <Image
              src={wallClock}
              alt=""
              width={25}
              height={25}
              className={style.image}
            />
            <span className={style.time}>{t('STATS_PER_PERCENT_TIME')}</span>
            <span className={style.timeSpent}>
              {secondsToHMS(statsData?.timeSpent || 0)}
            </span>{' '}
          </div>
          <Image src={parrot} alt="" className={style.parrot} />
        </div>
      </div>
    </div>
  );
};

export default StatsPagePerOnePercent;

import { FC, useEffect, useState } from 'react';
import style from './Statistics.module.scss';
import { getStatistics } from '@utils/getStatistics';
import { useTranslation } from '@utils/useTranslation';
import CircularProgress from '../statsPerOnePercent/circularProgress';

interface Props {
  courseId: string;
  token?: string;
  userKey?: string;
}

export interface StatisticProps {
  _id: string;
  allPassedTask: number;
  bonus: number;
  collectedScore: number;
  correctPassedTasks: number;
  daysLeft: number;
  leftScore: number;
  packageName: number;
  percent: number;
  rating: number;
  ratingPosition: number;
  sumAvailableScore: number;
  timeLeft: number;
  totalTimeSpent: number;
  wrongPassedTasks: number;
}

const Statistics: FC<Props> = ({ courseId, token, userKey }) => {
  const { t } = useTranslation();
  const [statisticsData, setStatisticsData] = useState<StatisticProps>();

  useEffect(() => {
    const fetchGrammarData = async () => {
      try {
        const response = await getStatistics({ courseId, token, userKey });

        console.log('response ', response)
        setStatisticsData(response);
      } catch (error) {
        console.error('Failed to fetch grammar data:', error);
      }
    };
    fetchGrammarData();
  }, [courseId]);



  function formatSecondsToTime(totalSeconds: number) {
    if(!totalSeconds) return '00:00:00'
    const date = new Date(Math.round(totalSeconds) * 1000);
    return date?.toISOString().slice(11, 19);
  }


  const CourseProgress = () => (
    <div className={style.progressWrapper}>
      <div className={style.statisticsTitle}>{t('STATISTICS_COURSE')}</div>
      <div>
        {t('STATISTIC_SCORE')}:{' '}
        <span className={style.tasksDone}>
          {statisticsData?.allPassedTask}/
        </span>
        <span className={style.tasksLeft}>{statisticsData?.sumAvailableScore}</span>
      </div>
    </div>
  );

  const RatingSection = () => (
    <div className={style.ratingContainer}>
      <div className={style.ratingWrapper}>
        <div className={style.ratingTitle}>{t('STATISTICS_RATING')} </div>
        <div className={style.ratingSpan}>
          <span>{t('STATISTICS_RATING_POSIION')}</span>
          <span>{t('STATISTICS_RATING')} </span>
        </div>
        <div className={style.ratingsWrapper}>
          <div>{statisticsData?.ratingPosition}</div>
          <div>{statisticsData?.rating}</div>
        </div>
      </div>
    </div>
  );

  const BonusSection = () => (
    <div className={style.bonusContainer}>
      <div className={style.bonusTitle}>{t('STATISTIC_BONUS')}:</div>
      <div className={style.bonus}>
        {statisticsData?.bonus === -1
          ? t('STATISTIC_UNLIMITED')
          : statisticsData?.bonus}
        <span>{t('STATISTIC_TASKS')}</span>
      </div>
    </div>
  );

  const TimeSection = () => (
    <div className={style.timeContainer}>
      <div className={style.progressWrapper}>
        <div className={style.timeHeader}>
          <div className={style.timeTitle}>{t('STATISTIC_TIME')}</div>
          {/* <div>
            Started: <span className={style.date}>14/08/2020</span>{' '}
          </div> */}
        </div>
        {statisticsData && (
          <div className={style.progressContainer}>
            <span
              className={style.progress}
              style={{
                width: `${Math.min(
                  statisticsData.totalTimeSpent === 0 ? 0 : (statisticsData.totalTimeSpent /
                    statisticsData.timeLeft) *
                    100,
                  100
                )}%`,
              }}
            />
            <div className={style.times}>
              <span>{formatSecondsToTime(statisticsData.totalTimeSpent)}</span>
              <span>{formatSecondsToTime(statisticsData.timeLeft)}</span>
            </div>
          </div>
        )}
        <div className={style.descWrapper}>
          <div className={style.timeWrapper}>
            <div className={style.timeSpent}></div>
            <div className={style.desc}>
              {t('STATISTIC_SUM_PASSED_TASK_TIME')}
            </div>
          </div>
          <div className={style.timeWrapper}>
            <div className={style.timeToComplete}></div>
            <div className={style.desc}>{t('STATISTICS_COURSE_END_TIME')}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={style.container}>
      <div className={style.title}>{t('STATISTICS_COURSE')}</div>
      <div className={style.statisticsContainer}>
        <CourseProgress />
        {statisticsData && (
          <div className={style.circle}>
            <CircularProgress
              percentage={statisticsData.percent}
              page={'StatisticsPage'}
            />
          </div>
        )}
      </div>
      <div className={style.ratingAndBonus}>
        <RatingSection />
        <BonusSection />
      </div>
      <TimeSection />
    </div>
  );
};

export default Statistics;

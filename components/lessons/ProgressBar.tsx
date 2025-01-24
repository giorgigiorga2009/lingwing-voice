import { FC, useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';
import style from './ProgressBar.module.scss';
import { CourseObject, TaskData } from '@utils/lessons/getTask';
import { useStatisticPercentStore, useUserStore } from '@utils/store';
import InitialProgressBar from './chat/progressbars/InitialProgressBar';
import SelectedProgressBar from './chat/progressbars/SelectedProgressBar';
import GlobalProgressBar from './chat/progressbars/GlobalProgressBar';

interface Props {
  currentCourseObject: CourseObject;
  userScore: number;
  liveCompletedTasks: TaskData[];
  tab: string;
}

const ProgressBar: FC<Props> = ({
  currentCourseObject,
  userScore,
  liveCompletedTasks,
  tab,
}) => {
  const { statisticPercent } = useStatisticPercentStore();
  const { course, sentDailyTaskCounter } = currentCourseObject;
  const { configuration } = course;
  const { authUserDailyLimit } = configuration;

  const Token = useUserStore((state) => state.Token);

  // const completedTasks = sentDailyTaskCounter + liveCompletedTasks.length;
  const userLiveScore = userScore + liveCompletedTasks.length;

  const liveCompletedTasksCount = liveCompletedTasks?.length || 0;
  const currentCourseUniquePassedTasks =
    currentCourseObject?.uniquePassedTasks || 0;
  const bonus = currentCourseObject?.info.bonus || 0;
  const isPremium = currentCourseObject?.info.premium || false;
  const regTime = currentCourseObject?.info.userCreatedAt || false;
  const isOriginal = currentCourseObject?.isOriginal || 1;
  const lastName = useUserStore((state) => state.lastName);

  const isPastRegTime24Hours =
    useMemo(() => {
      if (!regTime) return false;
      const now = new Date();
      const timeDiff = now.getTime() - new Date(regTime).getTime();
      return timeDiff >= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    }, [regTime]) || false;

  const totalTaskDone =
    liveCompletedTasksCount + currentCourseUniquePassedTasks;

  const [showGlobalProgressBar, setShowGlobalProgressBar] = useState(isPremium);
  const dailyBonusTasksDoneCount = sentDailyTaskCounter >= authUserDailyLimit ? sentDailyTaskCounter - authUserDailyLimit : 0;
  const availableDailyTasksLimit = authUserDailyLimit  +  bonus + dailyBonusTasksDoneCount;
  useEffect(() => {
    const interval = setInterval(() => {
      setShowGlobalProgressBar((prev) => !prev);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div
      className={classnames(style.progressBar, style.ratingStyle, style[tab])}
    >
     
      <div className={style.scoreContainer}> 
        <span className={style.scoreText}>
          Score: <span className={style.scoreNumber}>{userScore}</span>{' '}
        </span>
        <span className={style.percent}> 
          {/* {parseFloat(currentCourseObject.percent).toFixed(1)} */}
          {/* {parseFloat(statisticPercent).toFixed(1)}% */}
        </span>
      </div> 

    

      {totalTaskDone <= ( authUserDailyLimit   + 10 ) && !isPremium && !isPastRegTime24Hours && (
        <InitialProgressBar
          courseProgress={currentCourseObject}
          completedTasks={liveCompletedTasks}
          Token={Token || null}
          isPastRegTime24Hours={isPastRegTime24Hours}
          isOriginal={isOriginal}
          lastName={lastName}
          bonus={bonus}
        />
      )}

      <div
        style={{
          // backgroundColor: 'red',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={() => setShowGlobalProgressBar(!showGlobalProgressBar)}
      >
        {Token &&
          (isPremium ||
            (totalTaskDone > authUserDailyLimit + 10 && bonus > 0  ) ||
            isPastRegTime24Hours) && (  
            <GlobalProgressBar
              courseProgress={currentCourseObject}
              completedTasks={liveCompletedTasks}
              Token={Token || null}
              showGlobalProgressBar={showGlobalProgressBar}
            />
          )}
        
        {Token &&
          (isPremium ||
            (totalTaskDone > authUserDailyLimit + 10 && bonus > 0  ) ||
            isPastRegTime24Hours) && (
            <SelectedProgressBar
              courseProgress={currentCourseObject}
              completedTasks={liveCompletedTasks}
              Token={Token || null}
              availableTasksLimit={availableDailyTasksLimit || 0}
              showGlobalProgressBar={showGlobalProgressBar}
            />
          )}
      </div>
    </div>
  );
};

export default ProgressBar;

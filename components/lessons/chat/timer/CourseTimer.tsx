import { useFocusStore } from '@utils/store';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import styles from './CourseTimer.module.scss';
import { useRouter } from 'next/router';

interface CourseTimerProps {
  isWorking: boolean;
  setIsWorking: (value: boolean) => void;
  initialTimeSpent: number;
  isMobile?: boolean;
}

const CourseTimer: React.FC<CourseTimerProps> = ({
  isWorking,
  setIsWorking,
  initialTimeSpent,
  isMobile,
}) => {
  const [workSeconds, setWorkSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [showTotalTime, setShowTotalTime] = useState(false);
  const { isMobile: storeIsMobile, setShouldRefocus } = useFocusStore();
  const router = useRouter();
  const isExercisePage = router.pathname.includes('exercise');

  // const { lastName , firstName} = useUserStore();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const incrementTimer = () => {
      if (isWorking) {
        setWorkSeconds((prev) => prev + 1);
      } else {
        setRestSeconds((prev) => prev + 1);
      }
    };

    timer = setInterval(incrementTimer, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isWorking]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .join(':');
  };

  const toggleTimer = () => {
    const newIsWorking = !isWorking;
    setIsWorking(newIsWorking);

    if (!newIsWorking) {
      setRestSeconds(0);
    } else {
      if (isMobile) {
        setShouldRefocus(true);
      }
      setShowTotalTime(false);
    }
  };

  return (
    <div
      className={classNames(styles.timerContainer, {
        [styles.isPaused]: !isWorking,
        [styles.exercisePage]: isExercisePage,
      })}

    >
      {isMobile && (
        <header className={styles.mobileHeader}>
          <h1>Course Timer</h1>
        </header>
      )}
      <button
        title="toggleTimer"
        onClick={toggleTimer}
        className={styles.toggleButton}
      >
        <span className={styles.icon}></span>
      </button>

      {!showTotalTime && (
        <span
          className={styles.time}
          style={{ cursor: isWorking ? 'pointer' : 'default' }}
          onClick={(e) => {
            if (isMobile) {
              e.preventDefault();
              e.stopPropagation();
              setShouldRefocus(false);
            }
            if (isWorking) {
              setShowTotalTime(true);
            }
          }}
        >
          {isWorking ? formatTime(workSeconds) : formatTime(restSeconds)}
        </span>
      )}

      {showTotalTime && (
        <span
          className={styles.time}
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            if (isMobile) {
              e.preventDefault();
              e.stopPropagation();
              setShouldRefocus(false);
            }
            setShowTotalTime(false);
          }}
        >
          {formatTime(workSeconds + initialTimeSpent)}
        </span>
      )}
      {/* 
      {
        (firstName || lastName) && (
          <h2 className={styles.userName}> 
          {firstName || ''} 
          { firstName && lastName && <br/>}
          { lastName || ''}
          
          
          </h2>
        )
      } */}
    </div>
  );
};

export default CourseTimer;

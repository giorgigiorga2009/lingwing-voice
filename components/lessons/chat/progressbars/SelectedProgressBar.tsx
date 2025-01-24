import React, { FC, useEffect, useRef, useState } from 'react';
import style from './SelectedProgressBar.module.scss';
import { TaskData } from '@utils/lessons/getTask';
import classnames from 'classnames';
import { MOBILE_BREAKPOINT } from '@components/home/ChatAnimationContainer';

interface Props {
  courseProgress?: any;
  completedTasks: TaskData[];
  Token: string | null;
  availableTasksLimit: number;
  showGlobalProgressBar: boolean;
}  

const SelectedProgressBar: FC<Props> = ({
  courseProgress,
  completedTasks,
  Token,
  availableTasksLimit,
  showGlobalProgressBar,
}) => {
  const { progressBar, learnMode } = courseProgress;
  const { dailyScores } = progressBar;
  const { failedNumOfTimes, passedNumOfTimes } = dailyScores;

  const textOverRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [minWidth, setMinWidth] = useState('100%');

  const [correct, setCorrect] = useState(passedNumOfTimes);
  const [failed, setFailed] = useState(failedNumOfTimes);

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const liveCompletedTasks = completedTasks.filter((task) => task.taskType !== 'welcome');

  useEffect(() => {
    const updateChildWidth = () => {
      if (textOverRef.current && childRef.current) {
        const textOverRect = textOverRef.current.getBoundingClientRect();
        const textOverWidth = textOverRect.width;

        setMinWidth(textOverWidth + 'px');
      }
    };

    updateChildWidth();
    window.addEventListener('resize', updateChildWidth);
    return () => window.removeEventListener('resize', updateChildWidth);
  }, []);

  useEffect(() => {
    let correctTaskCount = passedNumOfTimes;
    let failedTaskCount = failedNumOfTimes;

    if (liveCompletedTasks && liveCompletedTasks.length > 0) {
      liveCompletedTasks.forEach((task: any) => {
        if (task.isFailed) {
          failedTaskCount++;
        } else {
          correctTaskCount++;
        }
      });

      setCorrect(correctTaskCount);
      setFailed(failedTaskCount);
    }
  }, [liveCompletedTasks]);

  return (
    <div className={style.progressContainer} 
    style = {{
      height: !showGlobalProgressBar ? '1rem' : '0rem',
      opacity: !showGlobalProgressBar ? 1 : 0,
    }}>
      <div className={style.lines}>
        <div className={style.lineWrapper}>
          <div className={style.textOver} ref={textOverRef}> 
            <div  
              className={style.overline}   
              style={{  
                display: 'block',
                width: `${
                  ((correct + failed) / availableTasksLimit) * 100 + '%'
                }`,
              }}
            >
              <div
                ref={childRef}
                style={{
                  minWidth: minWidth, // will be updated via JS
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  whiteSpace: 'nowrap',
                  zIndex: 55,
                }}
              >
                <div className={style.successStatisticNumbers}>
                  <p className={style.correctNumber}>{correct}</p>
                  <p className={style.mistakeNumber}>{failed}</p>
                </div>
                <div className={style.progressLabel}>
                  <p className={style.progressNumeric}>
                    {correct + failed}/{availableTasksLimit}
                  </p>
                  {/* <p className={style.progressTimer}>15:13</p> */}
                  {/* <p className={style.progressPercent}>63%</p> */}
                </div>
              </div>

              <p
                className={style.resultLabel}
                style={{
                  minWidth: `calc(${minWidth} / ${isMobile ? 3 : 4})`,
                  zIndex: '5555',
                  position: 'absolute',
                }}
              >
                {Math.round(((correct + failed) / availableTasksLimit) * 100) +
                  '%'}
              </p>
              <div
                className={style.box}
                // style={{
                // position: 'absolute',
                // width: 'calc(100% - 9px)',
                // height: '100%',
                // backgroundColor: '#692e96',
                // margin: '0px',
                // top: '0px',
                // clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)'

                // }}
              ></div>
            </div>
          </div>

          <div className={style.textUnder}>
            <p
              className={style.resultLabel}
              style={{
                minWidth: `calc(${minWidth} / ${isMobile ? 3 : 4})`,
              }}
            >
              {Math.round(((correct + failed) / availableTasksLimit) * 100) +
                '%'}
            </p>

            <div className={style.successStatisticNumbers}>
              <p className={style.correctNumber}>{correct}</p>
              <p className={style.mistakeNumber}>{failed}</p>
            </div>
            <div className={style.progressLabel}>
              <p className={style.progressNumeric}>
                {correct + failed}/{availableTasksLimit}
              </p>
              {/* <p className={style.progressTimer}>15:13</p> */}
              {/* <p className={style.progressPercent}>63%</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedProgressBar;

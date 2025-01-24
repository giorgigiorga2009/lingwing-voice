import React, { FC, useEffect, useState } from 'react';
import style from './GlobalProgressBar.module.scss';
import { TaskData } from '@utils/lessons/getTask';
import { logHandler } from '@utils/lessons/taskUtils';

interface Props {
  courseProgress?: any;
  completedTasks: TaskData[];
  Token: string | null;
  showGlobalProgressBar: boolean;
}

const calculateCompletionPercentage = (
  totalTaskNum: number,
  currentTaskNum: number
): number => {
  const percentage = (currentTaskNum / totalTaskNum) * 100;

  if (percentage < 10) {
    return Math.floor(percentage * 10) / 10;
  } else {
    return Math.round(percentage);
  }
};

type Section = 'one' | 'two' | 'three';

const returnFullPercentage = (
  one: number,
  two: number,
  three: number,
  section: Section
): string => {
  if (section === 'one') {
    if (two === 0 && three === 0) return '70px';
    if (three === 0) return '140px';
    return '200px';
  }

  if (section === 'two') {
    if (three === 0) return '70px';
    return '140px';
  }

  return '70px';
};

const GlobalProgressBar: FC<Props> = ({
  courseProgress,
  completedTasks,
  Token,
  showGlobalProgressBar,
}) => {
  const { progressBar, course, learnMode } = courseProgress;
  const { oneGreenDot, twoGreenDots, threeGreenDots } = progressBar.greenDots;
  const { subTotalActiveTask } = course;

  const [one, setOne] = useState<number>(oneGreenDot);
  const [two, setTwo] = useState<number>(twoGreenDots);
  const [three, setThree] = useState<number>(threeGreenDots);

  const liveCompletedTasks = completedTasks.filter((task) => task.taskType !== 'welcome');


  useEffect(() => {
    let oneGreen = oneGreenDot;
    let twoGreen = twoGreenDots;
    let threeGreen = threeGreenDots;

    if (liveCompletedTasks && liveCompletedTasks.length > 0) {
      liveCompletedTasks.forEach((item: any) => {
        if (item.answers) {
          const zeroCount = item.answers.filter(
            (answer: any) => answer === 0
          ).length;


          if (zeroCount === 1) {
            oneGreen++;
          } else if (zeroCount === 2) {
            twoGreen++;
          } else if (zeroCount === 3) {
            threeGreen++;
          } 
        }
      });


      setOne(oneGreen);
      setTwo(twoGreen);
      setThree(threeGreen);
    }
  }, [liveCompletedTasks]);

  // console.log(one, two, three, returnFullPercentage(one, two, three, 'one'));
  // console.log(one, two, three, returnFullPercentage(one, two, three, 'two'));
  // console.log(one, two, three, returnFullPercentage(one, two, three, 'three'));
  // console.log('');
  // console.log('################################');

  return (
    <>
      <div className={style.progressContainer}   style = {{
        height: showGlobalProgressBar ? '1rem' : '0rem',
        opacity: showGlobalProgressBar ? 1 : 0,

      }} >
        <div className={style.lines}>
          <div className={style.lineWrapper}>
            <div className={style.textOver}>
              {three > 0 && (
                <div
                  className={style.three}
                  style={{
                    width: `${calculateCompletionPercentage(
                      subTotalActiveTask,
                      three
                    )}%`,
                    minWidth: returnFullPercentage(one, two, three, 'three'),
                  }}
                >
                  <p>
                    {' '}
                    {calculateCompletionPercentage(subTotalActiveTask, three)}%
                  </p>
                  <div className={style.circles}>
                    <div className={style.circle}></div>
                    <div className={style.circle}></div>
                    <div className={style.circle}></div>
                  </div>
                </div>
              )}

              {two > 0 && (
                <div
                  className={style.two}
                  style={{
                    width: `calc( 100% * ${calculateCompletionPercentage(
                      subTotalActiveTask,
                      two
                    )}  / 100 )`,
                    minWidth: returnFullPercentage(one, two, three, 'two'),
                  }}
                >
                  <p>
                    {' '}
                    {calculateCompletionPercentage(subTotalActiveTask, two)}%
                  </p>
                  <div className={style.circles}>
                    <div className={style.circle}></div>
                    <div className={style.circle}></div>
                  </div>
                </div>
              )}

              {/* {one > 0 && ( */}
              <div
                className={style.one}
                style={{
                  width: `calc( 100% * ${calculateCompletionPercentage(
                    subTotalActiveTask,
                    one
                  )}  / 100 )`,
                  minWidth: returnFullPercentage(one, two, three, 'one'),
                }}
              >
                <p>
                  {' '}
                  {calculateCompletionPercentage(subTotalActiveTask, one)}%
                </p>
                <div className={style.circles}>
                  <div className={style.circle}></div>
                </div>
              </div>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalProgressBar;

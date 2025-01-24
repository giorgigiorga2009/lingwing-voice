import React, { FC, useEffect, useRef, useState } from 'react';
import style from './InitialProgressBar.module.scss';
import { TaskData } from '@utils/lessons/getTask';

interface Props {
  courseProgress?: any;
  completedTasks: TaskData[];
  Token: string | null;
}

interface ProgressData {
  index: number;
  current: number;
  total: number;
  label: string;
  slug: string;
  emptyBtnColor: string;
  fillBtnColor: string;
  emptyBtnTextColor: string;
  fillBtnTextColor: string;
  emptyLabelColor: string;
  fillLabelColor: string;
  emptyLineColor: string;
  fillLineColor: string;
}

const commonColors = {
  emptyBtnColor: '#e6ece9',
  fillBtnColor: '#f6a121',
  emptyBtnTextColor: '#f6a121',
  fillBtnTextColor: 'white',
  emptyLabelColor: '#624379',
  fillLabelColor: 'white',
  emptyLineColor: '#eaeaea',
  fillLineColor: '#6b2d8f',
};

const progressData: ProgressData[] = [
  {
    index: 0,
    current: 2,
    total: 10,
    label: 'გაცნობა',
    slug: 'welcome',
    ...commonColors,
  },
  {
    index: 1,
    current: 0,
    total: 5,
    label: 'რეგისტრაცია',
    slug: 'registration',
    ...commonColors,
  },
  {
    index: 2,
    current: 0,
    total: 10,
    label: 'ბონუსი',
    slug: 'bonus',
    ...commonColors,
  },
];

const showLabelHandler = (index: number, obj: any) => {
  if (index === 0 || obj[index].current > 0) return true;

  if (index > 0 && obj[index - 1].current === obj[index - 1].total) return true;

  if (obj[index].current > 0) return true;

  return false;
};

const updateProgressData = (course: any, progressObj: any) => {
  const {
    sentDailyTaskCounter: completedTaskNumber, // last completed task number ( updates when getCourse is called or completedtasks are updated )
    Token, // Authed user token
  } = course;

  let initialSumOfTotals = 0; // keeps track of how many task must be completed before entering next section

  const respObj = progressObj.map(({ slug, current, total, ...item }: any) => {
    let completedVal = 0; // total Completed tasks count for this section
    let isDone = false; // if user has completed all tasks on this section

    switch (slug) {
      case 'welcome':
        initialSumOfTotals += total;

        if (completedTaskNumber >= initialSumOfTotals) {
          completedVal = total; // if user completed more tasks than total 'current' field will be set to total number
          isDone = true; // for this section all tasks are completed
        } else {
          completedVal = completedTaskNumber; // still need some tasks to complete, update 'current' field for this section
        }

        break;

      case 'registration':
        if (completedTaskNumber >= initialSumOfTotals + total) {
          completedVal = total;
          isDone = true;
        } else if (completedTaskNumber - initialSumOfTotals > 0) {
          completedVal = completedTaskNumber - initialSumOfTotals;
        } else {
          completedVal = 0;
        }

        initialSumOfTotals += total;

        // completedVal =
        //   completedTaskNumber > 15
        //     ? total
        //     : completedTaskNumber - 10 > 0
        //     ? completedTaskNumber - 10
        //     : 0;

        break;
      case 'bonus':
        if (completedTaskNumber >= initialSumOfTotals + total) {
          completedVal = total;
          isDone = true;
        } else if (completedTaskNumber - initialSumOfTotals > 0) {
          completedVal = completedTaskNumber - initialSumOfTotals;
        } else {
          completedVal = 0;
        }

        initialSumOfTotals += total;

        // completedVal =
        //   completedTaskNumber > 25
        //     ? total
        //     : completedTaskNumber - 15 > 0
        //     ? completedTaskNumber - 15
        //     : 0;
        break;
      default:
        break;
    }

    return {
      ...item,
      slug,
      total,
      current: completedVal,
      isDone,
    };
  });

  const authFilteredData =
    Token && false
      ? respObj.filter((item: any) => item.slug !== 'registration')
      : respObj;

  return authFilteredData;
};

const InitialProgressBar: FC<Props> = ({
  courseProgress,
  completedTasks,
  Token,
}) => {
  const textOverRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const [minWidth, setMinWidth] = useState('100%');

  const [data, setData] = useState(() => {
    if (
      Token &&
      courseProgress.sentDailyTaskCounter !== 10 &&
      localStorage.getItem('progressType') !== 'continue'
    ) {
      
      // logHandler(`
        
      //       Token: ${Token},
      //       sentTask : ${courseProgress.sentDailyTaskCounter};
      //       Cached Progress Type : ${localStorage.getItem('progressType')}
      //   `);

      const ind = progressData.findIndex(
        (item) => item.slug === 'registration'
      );

      if (ind > 0) {
        progressData[ind - 1].total =
          progressData[ind - 1].total + progressData[ind].total;

        progressData.splice(ind, 1);
      }
    }

    return updateProgressData(
      { ...courseProgress, Token: Token },
      progressData
    );
  });

  useEffect(() => {
    if (completedTasks.length > 0) {
      if (
        courseProgress.sentDailyTaskCounter + completedTasks.length === 10 &&
        Token === null
      ) {
        localStorage.setItem('progressType', 'continue');
      }

      setData(
        updateProgressData(
          {
            ...courseProgress,
            sentDailyTaskCounter:
              courseProgress.sentDailyTaskCounter + completedTasks.length,
            Token: Token,
          },
          progressData
        )
      );
    }
  }, [completedTasks]);

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

  return (
    <div className={style.progressContainer}>
      <div className={style.lines}>
        {data.map((item: any, index: number) => {
          return (
            <div
              className={style.lineWrapper}
              key={item.index}
              style={{
                width: `calc(100% / ${data.length})`,
                backgroundColor: `${item.emptyLineColor}`,
              }}
            >
              <div
                className={style.circle}
                style={{
                  backgroundColor: `${
                    item.isDone ||
                    item.current > 0 ||
                    showLabelHandler(index, data)
                      ? item.fillBtnColor
                      : item.emptyBtnColor
                  }`,
                  color: `${
                    item.isDone ||
                    item.current > 0 ||
                    showLabelHandler(index, data)
                      ? item.fillBtnTextColor
                      : item.emptyBtnTextColor
                  }`,
                  boxShadow: `${
                    item.current > 0
                      ? '0px 0px 1px 1px rgb(185 96 24 / 56%)'
                      : '0px 0px 2px 1px rgb(204 214 229 / 56%)'
                  }`,
                }}
              >
                {index + 1}
              </div>

              <div
                className={style.textOver}
                ref={textOverRef}
                style={{
                  color: `${
                    item.current > 0
                      ? item.fillLabelColor
                      : item.emptyLabelColor
                  }`,
                }}
              >
                <div
                  className={style.overline}
                  style={{
                    width: `${(item.current / item.total) * 100}%`,
                    backgroundColor: `${item.fillLineColor}`,
                  }}
                >
                  <div
                    ref={childRef}
                    className="child"
                    style={{
                      minWidth: minWidth, // will be updated via JS
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      display: 'flex',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <p
                      style={{
                        margin: 'auto',
                        textAlign: 'center',
                      }}
                    >
                      {item.label}
                    </p>

                    {item.current > 0 || true ? (
                      <p
                        style={{
                          position: 'absolute',
                          right: '20px',
                          top: '0px',
                          padding: '0px',
                          margin: '0px',
                        }}
                      >{`${item.current}/${item.total}`}</p>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>

              <div
                className={style.textUnder}
                style={{
                  backgroundColor: `${item.emptyLineColor}`,
                  color: `${item.emptyLabelColor}`,
                }}
              >
                <p
                  style={{
                    opacity: showLabelHandler(index, data) ? '1' : '0',
                  }}
                >
                  {item.label}
                </p>

                {item.current > 0 ? (
                  <p>{`${item.current}/${item.total}`}</p>
                ) : (
                  ''
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InitialProgressBar;

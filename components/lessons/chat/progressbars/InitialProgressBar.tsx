import React, { FC, useEffect, useRef, useState } from 'react';
import style from './InitialProgressBar.module.scss';
import { TaskData } from '@utils/lessons/getTask';
import { useTranslation } from '@utils/useTranslation';

interface Props {
  courseProgress?: any;
  completedTasks: TaskData[];
  Token: string | null;
  isPastRegTime24Hours: boolean;
  isOriginal: number;
  lastName: string;
  bonus: number;
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

const showLabelHandler = (index: number, obj: any) => {
  if (index === 0 || obj[index].current > 0) return true;

  if (index > 0 && obj[index - 1].current === obj[index - 1].total) return true;

  if (obj[index].current > 0) return true;

  return false;
};

/** Updates Data for Progress Bar */
const getData = (
  isOriginal: number,
  Token: string | null,
  authUserDailyLimit: number,
  unAuthUserDailyLimit: number,
  totalFinishedTasks: number,
  bonusLimit: number
) => {
  let firstCurrent = 0;
  let secondCurrent = 0;
  let thirdCurrent = 0;

  let firstMax = 0;
  let secondMax = 0;
  let thirdMax = bonusLimit;




  const isSliced = isOriginal === 2 && Token;

  if (isSliced) {
    firstMax = authUserDailyLimit;

    firstCurrent =
      totalFinishedTasks > authUserDailyLimit
        ? authUserDailyLimit
        : totalFinishedTasks;

    thirdCurrent =
      totalFinishedTasks > authUserDailyLimit + thirdMax
        ? thirdMax
        : totalFinishedTasks - authUserDailyLimit;
    thirdCurrent = thirdCurrent > 0 ? thirdCurrent : 0;
    // console.log('welcome back');
  } else {
    firstMax = unAuthUserDailyLimit;
    secondMax = authUserDailyLimit - unAuthUserDailyLimit;

    firstCurrent =
      totalFinishedTasks > unAuthUserDailyLimit
        ? unAuthUserDailyLimit
        : totalFinishedTasks;

    secondCurrent =
      totalFinishedTasks > authUserDailyLimit
        ? authUserDailyLimit - unAuthUserDailyLimit
        : totalFinishedTasks - unAuthUserDailyLimit;
    secondCurrent = secondCurrent > 0 ? secondCurrent : 0;


    thirdCurrent =
      totalFinishedTasks > authUserDailyLimit + thirdMax
        ? thirdMax
        : totalFinishedTasks - authUserDailyLimit;
    thirdCurrent = thirdCurrent > 0 ? thirdCurrent : 0;

    // console.log('გამარჯობა ახალო იუზერო');
  }

  const allDataArray = [
    {
      index: 0,
      current: firstCurrent,
      total: firstMax,
      label: 'CHAT_PROGRESSBAR_LABEL1',
      slug: 'welcome',
      ...commonColors,
    },
    {
      index: 1,
      current: secondCurrent,
      total: secondMax,
      label: 'CHAT_PROGRESSBAR_LABEL2',
      slug: 'registration',
      ...commonColors,
    },
    {
      index: 2,
      current: thirdCurrent,
      total: thirdMax,
      label: 'CHAT_PROGRESSBAR_LABEL3',
      slug: 'bonus',
      ...commonColors,
    },
  ];

  if (isSliced) {
    return allDataArray.filter((item) => item.slug !== 'registration');
  }

  return allDataArray;
};

const InitialProgressBar: FC<Props> = ({
  courseProgress,
  completedTasks,
  Token,
  isPastRegTime24Hours,
  isOriginal,
  lastName,
  bonus
}) => {
  const textOverRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const { uniquePassedTasks, course } = courseProgress;
  const { authUserDailyLimit, unAuthUserDailyLimit } = course.configuration;
  const [minWidth, setMinWidth] = useState('100%');
  const [data, setData] = useState<any[]>([]);
  const {t} = useTranslation();
  const bonusDone = uniquePassedTasks - authUserDailyLimit;
  const bonusLimit = bonusDone > 0 ? bonusDone + bonus : bonus;


  const liveCompletedTasks = completedTasks.filter((task) => task.taskType !== 'welcome').length;

  // let liveCompletedTasks = localStorage.getItem('firstStepDone') === 'true' ? completedTasks.length : completedTasks.length > 8  ? completedTasks.length - 8 : 0;

  useEffect(() => {
    const totalFinishedTasks = uniquePassedTasks + liveCompletedTasks;
    let newData = getData(
      isOriginal,
      Token,
      authUserDailyLimit,
      unAuthUserDailyLimit,
      totalFinishedTasks, 
      bonusLimit
    );
    
    if(bonusLimit === 0 && lastName !== '') {
      newData = newData.filter((item) => item.slug !== 'bonus');
    }
    setData(newData);
  }, [
    completedTasks,
    isOriginal,
    authUserDailyLimit,
    unAuthUserDailyLimit,
    Token,
    uniquePassedTasks,
  ]);

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
  }, [data]);

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
                      {t(`${item.label}`)}
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
                   {t(`${item.label}`)}
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

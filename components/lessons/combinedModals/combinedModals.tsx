import React, { useMemo, useState } from 'react';
import { PackageData } from '@utils/getPackages';
import RateLingwingModal from '../rateLingwing/rateLingwing';
import MicEnableModal from '../micEnableModal/micEnableModal';
import { CourseObject, TaskData } from '@utils/lessons/getTask';
import LessonsFlowPopUps from '../lessonsFlowPopUps/lessonsFlowPopUps';
import FillProfileForTasks from '../fill-proflie-for-tasks/fillProfileForTasks';
import { useSoundStore, useUserStore } from '@utils/store';

type CombinedPopupProps = {
  token: string | null;
  courseName?: string | string[];
  courseId: string;
  isUserLoggedIn: boolean;
  completedTasks?: TaskData[];
  unAuthuserDailyLimit: number;
  languageTo?: string | string[];
  languageFrom?: string | string[];
  dailyTaskLeft: number;
  currentCourseObject?: CourseObject;
  dailyReachedLimitDate?: string | Date;
  packagesData?: PackageData;
  setShowModal: (isModal: boolean) => void;
  getTasksHandler: () => void;
};

const CombinedModalComponent: React.FC<CombinedPopupProps> = (props) => {
  const {
    token,
    courseName,
    courseId,
    isUserLoggedIn,
    completedTasks,
    unAuthuserDailyLimit,
    languageTo,
    languageFrom,
    dailyTaskLeft,
    currentCourseObject,
    dailyReachedLimitDate,
    setShowModal,
    getTasksHandler,
  } = props;

  if (!currentCourseObject) return null;

  const { course, sentDailyTaskCounter } = currentCourseObject;
  const { configuration } = course;
  const { authUserDailyLimit, unAuthUserDailyLimit } = configuration;

  const liveCompletedTasksCount =
    completedTasks?.filter((task) => task.taskType !== 'welcome').length || 0;
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
    const totalToDaysTaskDone = liveCompletedTasksCount + sentDailyTaskCounter;
  const dailyTotalDone = liveCompletedTasksCount + sentDailyTaskCounter;

  const soundAllowed = useSoundStore((state) => state.soundAllowed);
  const [hasProfileData, setHasProfileData] = useState<boolean>(
    lastName === '' ? false : true
    );
    
  // if (!soundAllowed && token) return null;

  return (
    <>
      {/* Registration modal */}
      {!token && totalTaskDone === unAuthuserDailyLimit && (
        <LessonsFlowPopUps
          courseName={courseName}
          token={token}
          popUpNumber={1}
          completedTasks={liveCompletedTasksCount}
          languageTo={languageTo}
          languageFrom={languageFrom}
        />
      )}

      {token &&
        !isPastRegTime24Hours &&
        bonus === 0 &&
        totalToDaysTaskDone === authUserDailyLimit &&
        lastName === ''  &&
        !hasProfileData &&
        !isPremium && ( 
          <FillProfileForTasks
            setShowModal={setShowModal}
            token={token}
            completedTasks={completedTasks?.filter(
              (task) => task.taskType !== 'welcome'
            )}
            isUserLoggedIn={isUserLoggedIn}
            getTasksHandler={() => {
              getTasksHandler();
            }}
            setHasProfileData={setHasProfileData}
          />
        )}



      {token &&
        totalToDaysTaskDone >= authUserDailyLimit &&
        bonus === 0 &&
        ( hasProfileData  || isPastRegTime24Hours) && 
         !isPremium && (
          <LessonsFlowPopUps
            token={token}
            popUpNumber={2}
            dailyLimitDate={dailyReachedLimitDate}
            courseName={courseName}
          />
        )}

      {/* {
        token &&
        (dailyTaskLeft <= 0 || liveCompletedTasksCount >= dailyTaskLeft) &&
        bonus + dailyTaskLeft - liveCompletedTasksCount <= 0 &&
        !isPremium &&
        (hasProfileData || totalTaskDone === 25) && (
          <LessonsFlowPopUps
            token={token}
            popUpNumber={2}
            dailyLimitDate={dailyReachedLimitDate}
            courseName={courseName}
          />
        )} */}

      {/* <StatsPagePerOnePercent
        token={token}
        isUserLoggedIn={isUserLoggedIn}
        courseId={courseId}
        completedTasks={completedTasks}
      /> */}

      {/* <RateLingwingModal completedTasks={completedTasks} /> */}
      {/* <MicEnableModal completedTasks={completedTasks} /> */}
    </>
  );
};

export default CombinedModalComponent;

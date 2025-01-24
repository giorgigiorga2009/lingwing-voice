import React from 'react'
import { PackageData } from '@utils/getPackages'
import RateLingwingModal from '../rateLingwing/rateLingwing'
import MicEnableModal from '../micEnableModal/micEnableModal'
import { CourseObject, TaskData } from '@utils/lessons/getTask'
import LessonsFlowPopUps from '../lessonsFlowPopUps/lessonsFlowPopUps'
import FillProfileForTasks from '../fill-proflie-for-tasks/fillProfileForTasks'
import StatsPagePerOnePercent from '../statsPerOnePercent/statsPagePerOnePercent'

type CombinedPopupProps = {
  token: string | null
  courseName?: string | string[]
  courseId: string
  isUserLoggedIn: boolean
  completedTasks?: TaskData[]
  unAuthuserDailyLimit: number
  languageTo?: string | string[]
  languageFrom?: string | string[]
  dailyTaskLeft: number
  currentCourseObject?: CourseObject
  dailyReachedLimitDate?: string | Date
  packagesData?: PackageData,
  setShowModal: (isModal: boolean) => void
}

const CombinedModalComponent: React.FC<CombinedPopupProps> = props => {
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
    setShowModal
  } = props

  return (
    <>
      {!token && completedTasks?.length === unAuthuserDailyLimit && (
        <LessonsFlowPopUps
          courseName={courseName}
          token={token}
          popUpNumber={1}
          completedTasks={completedTasks.length}
          languageTo={languageTo}
          languageFrom={languageFrom}
        />
      )}
     
      {token &&
        dailyTaskLeft <= 0 &&
        !currentCourseObject?.info.bonus &&
        !currentCourseObject?.info.premium && (
          <LessonsFlowPopUps
            token={token}
            popUpNumber={2}
            dailyLimitDate={dailyReachedLimitDate}
            courseName={courseName}
          />
        )}

      <StatsPagePerOnePercent
        token={token}
        isUserLoggedIn={isUserLoggedIn}
        courseId={courseId}
        completedTasks={completedTasks}
      />

      <RateLingwingModal completedTasks={completedTasks} />
      <MicEnableModal completedTasks={completedTasks} />
    </>
  )
}

export default CombinedModalComponent

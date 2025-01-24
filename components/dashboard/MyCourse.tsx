import React, { FC } from 'react'
import MySubCourse from './MySubCourse'
import PromoSlider from './PromoSlider'
import MyMainCourse from './MyMainCourse'
import style from './MyCourse.module.scss'
import classNames from 'classnames'
import { LanguageFrom } from '@utils/languages'

interface Course {
  name: string
  uniqueStudentsCount: number
  courses: SubCourse[]
  index?: number
}

export interface SubCourse {
  certificate: boolean
  name: string
  _id: string
  percent: string
  languageSubStandard: {
    name: string
  }
  rating: number
  allPassedTasks: number
  slug: string
  status: {
    start: boolean
    continue: boolean
    buy: boolean
  }
  iLearnFromNameCode: string,
  iLearnFrom: any[]
}

interface Props {
  token?: string
  course: Course
  myLanguage: {
    nameCode: any
  }
  LANGUAGE_NAMES: {
    [key: string]: string
  }
  indexOfCourse: number;
  handleResetNotification: () => void,
  setIsChooseLangFromModalOpen: (isOpen: boolean) => void,
  setChooseLangFromArray: (languages: LanguageFrom[]) => void,
  setTargetCourseData: (data: any) => void,
} 
 
const MyCourse: FC<Props> = ({
  token,
  course,
  myLanguage,
  LANGUAGE_NAMES,
  indexOfCourse,
  handleResetNotification,
  setIsChooseLangFromModalOpen,
  setChooseLangFromArray,
  setTargetCourseData,
}) => {
  return (
    <>
     
      <div
        className={classNames(
          style.container,
          indexOfCourse === 0 ? style.container_first_one : null,
        )}
      >
        <MyMainCourse
          course={course}
          key={course.name}
          myLanguage={myLanguage}
          LANGUAGE_NAMES={LANGUAGE_NAMES}
        />
        {course.courses.map((subCourse, indexOfSubCourse) => {
          return (
            <MySubCourse
              token={token}
              subCourse={subCourse}
              key={subCourse._id}
              indexOfSubCourse={indexOfSubCourse}
              indexOfCourse={indexOfCourse}
              onResetCourse={handleResetNotification}
              setIsChooseLangFromModalOpen={setIsChooseLangFromModalOpen}
              setChooseLangFromArray={setChooseLangFromArray}
              setTargetCourseData={setTargetCourseData}
            />
          )
        })}
      </div>
      {indexOfCourse === 0 && (
        <div className={style.carousel_in_courses_box}>
          <PromoSlider />
        </div>
      )}
    </>
  )
}

export default MyCourse

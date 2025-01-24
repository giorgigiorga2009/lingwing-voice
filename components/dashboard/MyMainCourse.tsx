import React, { FC } from 'react'
import FlagIcon from './FlagIcon'
import AirplaneIcon from './AirplaneIcon'
import TotalStudents from './TotalStudents'
import style from './MyMainCourse.module.scss'
import { useTranslation } from '../../utils/useTranslation'

interface Course {
  name: string
  uniqueStudentsCount: number
}

interface Props {
  course: Course
  myLanguage: {
    nameCode: string
  }
  LANGUAGE_NAMES: {
    [key: string]: string
  }
}

const MyMainCourse: FC<Props> = ({ course, myLanguage, LANGUAGE_NAMES }) => {
  const { t } = useTranslation()

  return (
    <div className={style.container}>
      <div className={style.title_and_icon}>
        <FlagIcon
          item={myLanguage}
          size="big"
          LANGUAGE_NAMES={LANGUAGE_NAMES}
        />
        <h2 className={style.title}>
          <span>{t(LANGUAGE_NAMES[myLanguage.nameCode])}</span>
          <span>{course.name}</span>
        </h2>
      </div>
      <TotalStudents course={course} />
      <AirplaneIcon />
    </div>
  )
}

export default MyMainCourse

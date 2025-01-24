import React, { FC } from 'react'
import style from './TotalStudents.module.scss'
import { useTranslation } from '../../utils/useTranslation'
import { getNumberWithComa } from '../../utils/getNumberWithComa'

interface Course {
  name: string
  uniqueStudentsCount: number
}

interface Props {
  course: Course
}

const TotalStudents: FC<Props> = ({ course }) => {
  const { t } = useTranslation()

  return (
    <h6 className={style.total_students}>
      <span>{getNumberWithComa(course.uniqueStudentsCount)}</span>
      <span>{t('wizardStudents')}</span>
    </h6>
  )
}

export default TotalStudents

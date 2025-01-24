import FlagIcon from './FlagIcon'
import classNames from 'classnames'
import { FC, useState } from 'react'
import AirplaneIcon from './AirplaneIcon'
import style from './MyLanguage.module.scss'
import RotatableArrow from '../shared/RotatableArrow'

interface Props {
  languageItem: {
    _id: string
    nameCode: string
    standards: {
      courses: {
        percent: string
      }[]
    }[]
  }
  indexOfLang: number
  activeLang: number
  changeActiveLang: (indexOfLang: number) => void
  t: (key: string, params?: object) => string
  LANGUAGE_NAMES: {
    [key: string]: string
  }
  myCourse: React.ReactNode
}

const MyLanguage: FC<Props> = ({
  languageItem,
  indexOfLang,
  activeLang,
  changeActiveLang,
  t,
  LANGUAGE_NAMES,
  myCourse,
}) => {
  const [dropCourse, setDropCourse] = useState(false)

  const percents = languageItem.standards.flatMap(({ courses }) =>
    courses.map(({ percent }) => parseInt(percent)),
  )

  const sum = percents.reduce((acc, curr) => acc + curr, 0)

  // Calculating average
  const average = sum / percents.length

  return (
    <>
      <div
        className={classNames(style.container, {
          [style.container_active]: activeLang === indexOfLang && !dropCourse,
          [style.active_both_screens]: activeLang === indexOfLang && dropCourse,
        })}
      >
        <button
          onClick={() => changeActiveLang(indexOfLang)}
          className={classNames(style.button, style.overlay_desktop)}
        ></button>
        <button
          onClick={() => {
            changeActiveLang(indexOfLang)
            setDropCourse(!dropCourse)
          }}
          className={classNames(style.button, style.overlay_mobile)}
        ></button>
        <div className={style.course_and_icon}>
          <FlagIcon
            item={languageItem}
            size="small"
            LANGUAGE_NAMES={LANGUAGE_NAMES}
          />
          <h3>{t(LANGUAGE_NAMES[languageItem.nameCode])}</h3>
        </div>

        <div className={style.dropdown}>
          <RotatableArrow open={activeLang === indexOfLang && dropCourse} />
        </div>
        {activeLang === indexOfLang && dropCourse && (
          <div className={style.circle}>
            <AirplaneIcon />
          </div>
        )}
        <p className={style.progress}>
          {average.toFixed(0)}
          <span className={style.percent}>%</span>
        </p>
      </div>
      {/* my courses down here are called only for small screen, 
      for desktop its called in dashboard file in pages folder cause design demands it
      to be there*/}
      {indexOfLang === activeLang && dropCourse && (
        <div className={style.drop_course}>{myCourse}</div>
      )}
    </>
  )
}

export default MyLanguage

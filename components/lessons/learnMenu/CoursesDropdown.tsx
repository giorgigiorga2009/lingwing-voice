import Link from 'next/link'
import Foco from 'react-foco'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { Locale } from '@utils/localization'
import { FC, Fragment, useState } from 'react'
import style from './CoursesDropdown.module.scss'
import { LOCALES_TO_LANGUAGES } from '@utils/languages'
import { LanguageCourse } from '@utils/lessons/getLanguageCoursesList'

interface Props {
  languageCoursesList: LanguageCourse[]
  languageTo: string
}

export const CoursesDropdown: FC<Props> = ({
  languageCoursesList,
  languageTo,
}) => {
  const router = useRouter()
  const interfaceLanguage = LOCALES_TO_LANGUAGES[router.locale as Locale]
  const currentCourse = languageCoursesList.find(item => item.current === true)

  // const [selected, setSelected] = useState<LanguageFrom>(interfaceLanguage)
  const [open, setOpen] = useState(false)
  // console.log(languageCoursesList)
  return (
    <Foco
      component="div"
      onClickOutside={() => setOpen(false)}
      className={style.dropdown}
    >
      <button className={style.button} onClick={() => setOpen(!open)}>
        <div className={classNames(style.flag, style[languageTo])} />
        {currentCourse?.title[interfaceLanguage]}
        {/* <div className={style.arrow} /> */}
      </button>
      {open && (
        <div className={style.dropdownContent}>
          {languageCoursesList.map((course: LanguageCourse) => (
            <Fragment key={course._id}>
              <Link
                className={style.option}
                onClick={() => setOpen(false)}
                href={{
                  pathname: '/aboutCourse', 
                  query: {
                    languageTo,
                    languageFrom: course.iLearnFrom,
                    courseName: course.slug,
                  },
                }}
              >
                {course.title[interfaceLanguage]}
                {course.current === true && (
                  <span className={style.activeMark} />
                )}
              </Link>
            </Fragment>
          ))}
        </div>
      )}
    </Foco>
  )
}

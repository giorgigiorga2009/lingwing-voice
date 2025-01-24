import React from 'react'
import LeaderBoard from './LeaderBoard'
import style from './Scores.module.scss'
import { ScoresProps } from '@utils/getReadCourse'
import { useTranslation } from '@utils/useTranslation'
import RedirectButton from '@components/reusables/RedirectButton'

const Scores: React.FC<ScoresProps> = ({
  studyingTheCourse,
  top,
  fullDescription,
  languageTo,
  languageFrom,
  courseName,
}) => {
  const { t } = useTranslation()
  const initialLength = 100

  return (
    <div className={style.container}>
      <div className={style.leftContainer}>
        <p
          className={style.title}
          dangerouslySetInnerHTML={{ __html: t('ABOUT_COURSE_INTERESTING') }}
        />
        <div className={style.bubbleContainer}>
          <p className={style.totalPractitionersNum}>
            {studyingTheCourse?.toLocaleString('en-US')}
          </p>
          <p
            className={style.peoplePracticing}
            dangerouslySetInnerHTML={{
              __html: t('ABOUT_COURSE_PEOPLE_PRACTICING'),
            }}
          />
        </div>
        <p className={style.description}>{fullDescription}</p>
        <RedirectButton
          href={`lessons/course?languageTo=${languageTo}&languageFrom=${languageFrom}&courseName=${courseName}`}
        >
          {t('ABOUT_COURSE_START_LEARNING')}
        </RedirectButton>
      </div>

      <div className={style.rightContainer}>
        <p
          className={style.title}
          dangerouslySetInnerHTML={{ __html: t('ABOUT_COURSE_TOP_SCORES') }}
        />
        <div className={style.topUsers}>
          {top?.map((data, index) => {
            const length = initialLength - index * 10
            return (
              <LeaderBoard key={data.position} data={data} length={length} />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Scores

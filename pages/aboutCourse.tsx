import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import style from './aboutCourse.module.scss'
import Loader from '@components/loaders/loader'
import { PageHead } from '@components/PageHead'
import { Footer } from '@components/wizard/Footer'
import { Header } from '@components/header/Header'
import Scores from '@components/about-course/Scores'
import { getReadCourse } from '@utils/getReadCourse'
import { LOCALES_TO_LANGUAGES } from '@utils/languages'
import CourseInfo from '@components/about-course/CourseInfo'
import AboutQuotes from '@components/about-course/AboutQuotes'
import { HomeFooter } from '@components/reusables/footer/HomeFooter'

const AboutCourse = () => {
  const router = useRouter()
  const { courseName, languageTo, languageFrom } = router.query
  const currentLanguage =
    router.locale &&
    LOCALES_TO_LANGUAGES[router.locale as keyof typeof LOCALES_TO_LANGUAGES]

  const fetchCourseData = async () => {
    if (currentLanguage && courseName) {
      try {
        const data = await getReadCourse(currentLanguage, courseName)
        return data
      } catch (error) {
        throw new Error(String(error))
      }
    }
  }

  const {
    data: courseData,
    isLoading,
    isError,
  } = useQuery(['courseData', currentLanguage, courseName], fetchCourseData)
  return (
    <div className={style.mainConainer}>
      <PageHead
        title={'META_TAG_ABOUTCOURSE_TITLE_' + (languageTo || 'geo')}
        description={
          'META_TAG_ABOUTCOURSE_DESCRIPTION_' + (languageTo || 'geo')
        }
        keywords={'META_TAG_ABOUTCOURSE_KEYWORDS_' + (languageTo || 'geo')}
      />
      <Header
        size="s"
        loginClassName={style.loginModal}
        setShowTopScores={() => false}
        showTopScores={false}
      />
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <div>Error fetching course data.</div>
      ) : (
        <div className={style.container}>
          <CourseInfo
            info={courseData?.info}
            title={courseData?.title}
            smallDescription={courseData?.smallDescription}
            languageTo={languageTo}
            languageFrom={languageFrom}
            courseName={courseName}
          />
          <Scores
            fullDescription={courseData?.fullDescription}
            studyingTheCourse={courseData?.studyingTheCourse}
            top={courseData?.top}
            languageTo={languageTo}
            languageFrom={languageFrom}
            courseName={courseName}
          />
          <AboutQuotes promo={courseData?.promo} />
          {/* <Footer /> */}
          <HomeFooter />

        </div>
      )}
    </div>
  )
}

export default AboutCourse

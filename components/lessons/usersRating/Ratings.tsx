import Image from 'next/image'
import style from './Ratings.module.scss'
import { FC, useState, useEffect, useRef } from 'react'
import { getRatings } from '@utils/lessons/getRatings'
import { useTranslation } from '@utils/useTranslation'
import defaultImg from '/public/themes/images/v2/parrot_headphones.png'
import classNames from 'classnames'

interface User {
  avatar: string
  current: string
  firstName: string
  lastName: string
  position: number
  rating: string
}

interface Period {
  period: 'topTwenty' | 'daily' | 'weekly'
}

interface Props {
  courseId: string
  userCourseId: string
  userScore?: number
  token?: string | null
  showTopScores: boolean
  open: boolean
  setOpen: (open: boolean) => void
  setShowTopScores: (showTopScores: boolean) => void
}

const Ratings: FC<Props> = ({
  courseId,
  userScore,
  token,
  userCourseId,
  showTopScores,
  open,
  setOpen,
  setShowTopScores
}) => {
  const { t } = useTranslation()
  const ratingsRef = useRef<HTMLDivElement>(null);
  const [ratings, setRatings] = useState<User[]>([])
  // const [open, setOpen] = useState(false)
  const [period, setPeriod] = useState<Period['period']>('daily')
  const PERIODS: Period['period'][] = ['topTwenty', 'daily', 'weekly']

  const PERIOD_NAMES = ['RATING_TOP_20', 'RATING_DAILY', 'RATING_WEEKLY']

  const isMobile = () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 1023
  }

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const currentPeriod = period !== 'topTwenty' ? userCourseId : courseId
        const response = await getRatings({
          courseId: currentPeriod,
          period,
          token,
        })
        setRatings(response)
      } catch (error) {
        console.error('Failed to fetch Ratings data:', error)
      }
    }
    fetchFaqData()
  }, [period, userScore, courseId, userCourseId, token])


  const handleContainerClick = () => {
    if (isMobile()) {
      setShowTopScores(true)
    }
  }

  return (
    <div
      className={`${classNames(style.containerWrapper, {
        [style.withBlur]: !showTopScores
      })}`}
      onClick={handleContainerClick}
      role="button" 
      tabIndex={0} 
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleContainerClick(); 
        }
      }}
    >
      <div className={style.showContainer}>
        {open === showTopScores ? (
          <button title='hideButton' className={style.hideText} onClick={() => setShowTopScores(!showTopScores)}>
            {t('RATING_TOP_HIDE')}
          </button>
        ) : (
          <button title='showButton' className={style.showText} onClick={() => setShowTopScores(!showTopScores)}>
            {t('RATING_TOP_SCORES')}
          </button>
        )}

        <button title='arrowButton'
          className={
            open === showTopScores ? style.hideButton : style.showButton
          }
          onClick={() => setShowTopScores(!showTopScores)}
        />
      </div>

      <div
        className={
          open === showTopScores
            ? `${style.container} ${style.show}`
            : style.container
        }
        onClick={(e) => e.stopPropagation()} 
        role="button" 
        tabIndex={0} 
        onKeyDown={(e) => {
          if (e.key === ' ') {
            e.stopPropagation(); 
          }
        }}
      >
        <div className={style.header}>
          <button
          title='arrowButtonLeft'
            className={style.buttonLeft}
            onClick={() =>
              setPeriod(PERIODS[(PERIODS.indexOf(period) + 2) % PERIODS.length])
            }
          />
          <div className={style.title}>
            {t(PERIOD_NAMES[PERIODS.indexOf(period)])}
          </div>
          <button
          title='arrowButtonRight'
            className={style.buttonRight}
            onClick={() =>
              setPeriod(PERIODS[(PERIODS.indexOf(period) + 1) % PERIODS.length])
            }
          />
        </div>
        <div className={style.usersContainer}>
          {ratings && ratings.length > 0 &&
            ratings.map((user: User, index) => (
              <div key={index} className={style.userWrapper}>
                <Image
                  className={style.image}
                  src={user.avatar ?? defaultImg}
                  width={50}
                  height={50}
                  alt=""
                />
                <div className={style.position}>{user.position}</div>
                <div>
                  <div className={style.name}>
                    {user.firstName + ' ' + user.lastName ?? ''}
                  </div>
                  <span className={style.ratingTitle}>Rating: </span>
                  <span className={style.rating}>{user.rating}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Ratings

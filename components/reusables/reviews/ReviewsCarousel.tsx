import { range } from 'lodash'
import style from './ReviewsCarousel.module.scss'
import { FC, useEffect, useState, useRef } from 'react'
import { useTranslation } from '@utils/useTranslation'
import { getReviews, ReviewData } from '@utils/getReviews'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'
import classNames from 'classnames'


interface ReviewsCarouselProps {
  isWizardPage?: boolean // New optional prop
}
interface ReviewProps {
  review: ReviewData
  onClick: () => void // Add click handler
}

const Review: FC<ReviewProps> = ({ review, onClick }) => {
  return (
    <div className={style.review} onClick={onClick}>
      <div className={style.reviewContent}>
        <div className={style.leftArrow} />
        
        <div className={style.userInfo}>
          <div className={style.avatarContainer}>
            <Image
              className={style.avatar}
              src={review.avatarURL}
              alt="review avatar"
              width={40}
              height={40}
            />
          </div>
          <div className={style.userName}>{review.userName}</div>
        </div>
        <div className={style.stars}>
          {range(review.rating).map((item) => (
            <span key={item} className={style.star} />
          ))}
        </div>
        <div className={style.quote}>
          <div className={style.text}>{review.review}</div>
        </div>

        <div className={style.rightArrow} />
      </div>
    </div>
  )
}

export const ReviewsCarousel: FC<ReviewsCarouselProps> = ({ isWizardPage }) => {
  const { t } = useTranslation()
  const [reviewsData, setReviewsData] = useState<ReviewData[]>()
  const [autoplaySpeed, setAutoplaySpeed] = useState(1000)
  const [isPaused, setIsPaused] = useState(false)
  const sliderRef = useRef<Slider>(null) 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getReviews()
        setReviewsData(response)
      } catch (error) {
        console.log('Error while fetching reviews')
      }
    }
    fetchData()
  }, [])

  const handleMouseEnter = () => {
    setIsPaused(true) 
  }
  const handleMouseLeave = () => {
    setIsPaused(false) 
    setAutoplaySpeed(500) 
    sliderRef.current?.slickNext() 
    setTimeout(() => {
      setAutoplaySpeed(1000) 
      if (sliderRef.current) {
        sliderRef.current.slickPlay() 
      }
    }, 500) 
  }

  


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1.6667,
    slidesToScroll: 1,
    autoplay: !isPaused,
    autoCenter: true,
    centerPadding: '0px',
    autoplaySpeed,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          dots: false,
          infinite: true,
          speed: 500,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 1500,
          pauseOnHover: true,
          slidesToShow: 1.6667,
          arrows: false,
        },
      },
    ],
  }

  const handleReviewClick = (index: number) => {
    const slider = sliderRef.current
    if (!slider) return

    const slidesToShow = settings.slidesToShow || 1.6667
    const slidesCount = reviewsData?.length || 0

    let targetIndex = Math.round(index - Math.floor(slidesToShow))
    if (settings.infinite) {
      if (targetIndex < 0) {
        targetIndex = slidesCount + targetIndex
      } else if (targetIndex >= slidesCount) {
        targetIndex = targetIndex - slidesCount
      }
    } else {
      targetIndex = Math.max(0, Math.min(slidesCount - 1, targetIndex))
    }

    slider.slickGoTo(targetIndex)
  }

  return (
    <div
      className={classNames(style.container, isWizardPage && style.wizardPage)}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <div className={style.carousel}>
        {reviewsData && (
          <Slider {...settings} ref={sliderRef}>
            {reviewsData.map((review, index) => (
              <Review
                key={review._id}
                review={review}
                onClick={() => handleReviewClick(index)} 
              />
            ))}
          </Slider>
        )}
      </div>
      <a
        href="https://www.facebook.com/lingwingcom/reviews"
        rel="noopener noreferrer"
        className={style.label}
        target="_blank"
      >
        {t('reviewsLabel')}
      </a>
    </div>
  )
}

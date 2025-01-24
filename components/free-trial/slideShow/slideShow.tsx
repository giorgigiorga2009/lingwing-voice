'use client'

import React, { useState, useEffect } from 'react'
import style from './slideShow.module.scss'
import { images, texts } from '@utils/const'
import { useTranslation } from '@utils/useTranslation'

const SlideShow = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const { t } = useTranslation()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex(prevIndex => (prevIndex + 1) % images.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={style.slideShowContainer}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`${style.slide} ${
            index === currentSlideIndex ? style.active : ''
          }`}
          style={{ backgroundImage: `url(${image})` }}
        >
          <h3 className={style.slideText}>{t(texts[index])}</h3>
        </div>
      ))}
    </div>
  )
}

export default SlideShow

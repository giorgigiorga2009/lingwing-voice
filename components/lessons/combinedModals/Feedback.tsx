import {
  getFeedbackCategories,
  sendFeedback,
  feedback,
} from '@utils/lessons/getFeedback'
import Foco from 'react-foco'
import html2canvas from 'html2canvas'
import style from './Feedback.module.scss'
import { Locale } from '@utils/localization'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from '@utils/useTranslation'
import { LOCALES_TO_LANGUAGES } from '@utils/languages'
import { CourseObject, TaskData } from '@utils/lessons/getTask'

interface Props {
  token: string | null 
  setOpenFeedback: () => void
  currentCourseObject: CourseObject
  currentTaskData: TaskData | undefined
  screenshotRef: React.RefObject<HTMLDivElement>
  UserEmail: string | undefined
  locale: string | string[] | undefined
}

interface Category {
  _id: string
  category: string
  subCategory: SubCategory[]
}

interface SubCategory {
  _id: string
  parent: string
  name: string
}

const Feedback: FC<Props> = ({
  token,
  setOpenFeedback,
  currentCourseObject,
  currentTaskData,
  screenshotRef,
  UserEmail,
  locale,
}) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState(UserEmail)
  const [response, setResponse] = useState(0)
  const lang = LOCALES_TO_LANGUAGES[locale as Locale]
  const [feedbackText, setFeedbackText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [feedbackCategoriesData, setFeedbackCategoriesData] = useState<
    Category[]
  >([])
  // const [feedbackData, setFeedbackData] = useState<feedback>()

  const handleCaptureScreenshot = async (): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
      requestAnimationFrame(async () => {
        try {
          if (screenshotRef.current) {
            const canvas = await html2canvas(screenshotRef.current)
            const screenshotImage = new Image()
            screenshotImage.src = canvas.toDataURL()
            // const screenshotWindow = window.open('')
            //screenshotWindow?.document.write(screenshotImage.outerHTML)
            resolve(screenshotImage.src)
          }
        } catch (error) {
          console.error('Failed to capture screenshot:', error)
          reject(error)
        }
      })
    })
  }

  useEffect(() => {
    const fetchFeedbackCategories = async () => {
      try {
        const response = await getFeedbackCategories({
          token,
          lang,
        })
        setFeedbackCategoriesData(response)
      } catch (error) {
        console.error('Failed to fetch feedback data:', error)
      }
    }
    fetchFeedbackCategories()
  }, [])

  const handleSendFeedback = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const browserInfo = navigator.userAgent
    const browserName = browserInfo.match(
      /(Safari|Chrome|Firefox|Edge|IE|Opera)/i,
    )
    let browser
    browserName ? (browser = browserName[0]) : (browser = '')

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    const os = navigator.platform

    const resolution = {
      width:
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth,
      height:
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight,
    }

    const screenSize = resolution.width + 'x' + resolution.height
    
    try {
      const screenshotImageSrc = await handleCaptureScreenshot()

      if (currentTaskData) {
        const feedbackData: feedback = {
          category: selectedCategory,
          course: currentCourseObject.course._id,
          device: {
            browser: browser,
            mobile: isMobile,
            os: os,
            screenSize: screenSize,
          },
          email: email,
          image: screenshotImageSrc || '',
          subCategory: selectedSubCategory,
          task: {
            id: currentTaskData.id,
            level: 0,
            ordinalNumber: currentTaskData.ordinalNumber,
            type: currentTaskData.taskType,
          },
          text: feedbackText,
          userCourse: currentCourseObject._id,
        }

        const response = await sendFeedback({ token, feedbackData, lang })

        setResponse(response.status)
      }
    } catch (error) {
      console.error('Failed to handle screenshot:', error)
    }
  }
  
  return (
    <div className={style.wrapper}>
      <Foco
        component="div"
        onClickOutside={setOpenFeedback}
        className={style.modal}
      >
        {response === 200 ? (
          <div className={style.success}>{t('FEEDBACK_SENT_SUCCESSFULLY')}</div>
        ) : (
          <div className={style.title}>{t('FEEDBACK')}</div>
        )}

        <button title={'close'} className={style.close} onClick={setOpenFeedback} />
        <form onSubmit={handleSendFeedback}>
          <select
            title={'feedbacjCategory'}
            name="feedbacjCategory"
            id="feedbacjCategory"
            onChange={e => setSelectedCategory(e.target.value)}
            required={true}
          >
            <option key={-1} value={-1}>
              {t('FEEDBACK_TOPIC')} ⭐
            </option>
            {feedbackCategoriesData.map((category: Category, index) => (
              <option key={index} value={category._id}>
                {category.category}
              </option>
            ))}
          </select>
          <select
            title={'feedbackSubCategory'}
            name="feedbackSubCategory"
            id="feedbackSubCategory"
            onChange={e => setSelectedSubCategory(e.target.value)}
          >
            <option key={-1} value={-1}>
              {t('FEEDBACK_SUB_TOPIC')} ⭐
            </option>
            {selectedCategory &&
              feedbackCategoriesData
                .find(category => category._id === selectedCategory)
                ?.subCategory.map(subCategory => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </option>
                ))}
          </select>
          <textarea
            autoComplete="off"
            spellCheck="false"
            data-gramm="false"
            placeholder={t('FEEDBACK_WRITE_PROBLEM_OR_RECOMMENDATION')}
            value={feedbackText}
            onChange={e => setFeedbackText(e.target.value)}
            required={true}
          ></textarea>
          <div className={style.inputAndButton}>
            <input
              placeholder={t('FEEDBACK_REQUIRED_EMAIL')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={!feedbackText}
              required={true}
            />
            <button
              className={style.button}
              type="submit"
              onClick={handleCaptureScreenshot}
            >
              {t('FEEDBACK_SEND')}
            </button>
          </div>
        </form>
      </Foco>
    </div>
  )
}

export default Feedback

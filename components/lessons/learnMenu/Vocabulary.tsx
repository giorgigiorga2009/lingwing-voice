import {
  getGrammaticalCategories,
  getDictionaryTopics,
} from '@utils/lessons/getVocabulary'
import {
  getCurrentLanguageCoursesList,
  LanguageCourse,
} from '@utils/lessons/getLanguageCoursesList'
import style from './Vocabulary.module.scss'
import VocabularyTable from './VocabularyTable'
import { FC, useEffect, useState } from 'react'
import { CourseObject } from '@utils/lessons/getTask'
import { useTranslation } from '@utils/useTranslation'

interface Props {
  currentCourseObject: CourseObject
  LanguageFrom: string | string[] | undefined
  token?: string
}

const Vocabulary: FC<Props> = ({
  currentCourseObject,
  LanguageFrom,
  token,
}) => {
  const { t } = useTranslation()
  const [grammaticalCategoriesData, setGrammaticalCategoriesData] = useState([])
  const [dictionaryTopicsData, setDictionaryTopicsData] = useState([])
  const [currentLanguageCoursesList, setCurrentLanguageCoursesList] =
    useState<LanguageCourse[]>()

  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [searchText, setSearchText] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(
    currentCourseObject.course._id,
  )
  const langFrom: string =
    typeof LanguageFrom === 'string'
      ? LanguageFrom
      : Array.isArray(LanguageFrom)
      ? LanguageFrom[0]
      : ''

  useEffect(() => {
    const fetchLanguageCourses = async () => {
      try {
        const response = await getCurrentLanguageCoursesList({
          languageFrom: LanguageFrom,
          languageTo: currentCourseObject.course.iLearn.nameCode,
          token,
          languageCourseId: currentCourseObject.course._id,
          languageId: currentCourseObject.course.iLearn._id,
        })

        setCurrentLanguageCoursesList(response)
      } catch (error) {
        console.error('Failed to fetch language courses data:', error)
      }
    }

    const fetchGrammaticalCategories = async () => {
      try {
        const response = await getGrammaticalCategories({
          iLearnId: currentCourseObject.course.iLearn._id,
          courseId: currentCourseObject.course._id,
          LanguageFrom,
          token,
        })
        setGrammaticalCategoriesData(response)
      } catch (error) {
        console.error('Failed to fetch Grammatical Categories data:', error)
      }
    }
    const fetchDictionaryTopics = async () => {
      try {
        const response = await getDictionaryTopics({
          iLearnId: currentCourseObject.course.iLearn._id,
          courseId: currentCourseObject.course._id,
          LanguageFrom,
          token,
        })
        setDictionaryTopicsData(response)
      } catch (error) {
        console.error('Failed to fetch Grammatical Categories data:', error)
      }
    }

    fetchLanguageCourses()
    fetchDictionaryTopics()
    fetchGrammaticalCategories()
  }, [])

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.title}>{t('DICTIONARY_TITLE')}</div>
        <select
          name="languageCourses"
          id="languageCourses"
          onChange={e => setSelectedCourse(e.target.value)}
        >
          {currentLanguageCoursesList &&
            currentLanguageCoursesList.map((course, index) => (
              <option key={index} value={course._id}>
                {
                  course.title[
                    langFrom as 'eng' | 'ben' | 'tur' | 'esp' | 'geo' | 'rus'
                  ]
                }
              </option>
            ))}
        </select>
        <select
          name="grammaticalCategories"
          id="grammaticalCategories"
          onChange={e =>
            setSelectedCategory(
              e.target.selectedIndex > 0
                ? e.target.options[e.target.selectedIndex].text
                : '',
            )
          }
        >
          <option key={-1} value={-1}>
            {t('DICTIONARY_GRAMMAT_CAT_OPTION')}
          </option>
          {grammaticalCategoriesData.map((category, index) => (
            <option key={index} value={index}>
              {category}
            </option>
          ))}
        </select>
        <select
          name="dictionaryTopics"
          id="dictionaryTopics"
          onChange={e =>
            setSelectedTopic(
              e.target.selectedIndex > 0
                ? e.target.options[e.target.selectedIndex].text
                : '',
            )
          }
        >
          <option key={-1} value={-1}>
            {t('DICTIONARY_TOPIC_OPTION')}
          </option>
          {dictionaryTopicsData.map((topic, index) => (
            <option key={index} value={index}>
              {topic}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder={t('DICTIONARY_SEARCH')}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>
      <VocabularyTable
        iLearnId={currentCourseObject.course.iLearn._id}
        LanguageFrom={LanguageFrom}
        token={token}
        selectedCourse={selectedCourse}
        searchText={searchText}
        selectedCategory={selectedCategory}
        selectedTopic={selectedTopic}
      />
    </div>
  )
}

export default Vocabulary

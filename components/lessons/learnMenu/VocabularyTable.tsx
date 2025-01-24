import style from './Vocabulary.module.scss'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from '@utils/useTranslation'
import { getDictionary } from '@utils/lessons/getVocabulary'

interface Props {
  iLearnId: string
  LanguageFrom: string | string[] | undefined
  token?: string
  selectedCourse: string
  searchText: string
  selectedCategory: string
  selectedTopic: string
}

interface Dictionary {
  index: number
  grammaticalCategory: string
  topic: string
  translation: string
  word: string
}

const VocabularyTable: FC<Props> = ({
  iLearnId,
  LanguageFrom,
  token,
  selectedCourse,
  searchText,
  selectedCategory,
  selectedTopic,
}) => {
  const { t } = useTranslation()

  const [dictionaryData, setDictionaryData] = useState([])
  const [sortField, setSortField] = useState<
    'word' | 'translation' | 'grammaticalCategory' | 'topic' | null
  >(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (
    field: 'word' | 'translation' | 'grammaticalCategory' | 'topic',
  ) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }

    const sortedData = [...dictionaryData].sort((a, b) => {
      if (a[field] < b[field]) return sortDirection === 'asc' ? -1 : 1
      if (a[field] > b[field]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    setDictionaryData(sortedData)
  }

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const response = await getDictionary({
          iLearnId: iLearnId,
          courseId: selectedCourse,
          searchText: searchText,
          grammarCategory: selectedCategory,
          topic: selectedTopic,
          LanguageFrom,
          token,
        })

        setDictionaryData(response)
      } catch (error) {
        console.error('Failed to fetch dictionary data:', error)
      }
    }

    fetchDictionary()
  }, [selectedCategory, selectedTopic, selectedCourse, searchText])

  return (
    <table className={style.table}>
      <thead>
        <tr>
          <th onClick={() => handleSort('word')}>{t('DICTIONARY_WORD')}</th>
          <th onClick={() => handleSort('translation')}>
            {t('DICTIONARY_TRANSLATION')}
          </th>
          <th onClick={() => handleSort('grammaticalCategory')}>
            {t('DICTIONARY_GRAMMATICAL_CATEGORY')}
          </th>
          <th onClick={() => handleSort('topic')}>{t('DICTIONARY_TOPIC')}</th>
        </tr>
      </thead>
      <tbody>
        {dictionaryData.length > 0
          ? dictionaryData.map((dictionary: Dictionary, index) => (
              <tr key={index}>
                <td>{dictionary.word}</td>
                <td>{dictionary.translation}</td>
                <td>{dictionary.grammaticalCategory}</td>
                <td>{dictionary.topic}</td>
              </tr>
            ))
          : null}
      </tbody>
    </table>
  )
}

export default VocabularyTable

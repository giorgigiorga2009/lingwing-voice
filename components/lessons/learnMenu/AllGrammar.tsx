// import DOMPurify from 'dompurify'
import classNames from 'classnames'
import style from './AllGrammar.module.scss'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from '@utils/useTranslation'
import { getAllGrammar, getGrammarItem } from '@utils/lessons/getAllGrammar'
import xss from 'xss';

interface Props {
  courseId: string
  LanguageFrom: string | string[] | undefined
  token?: string
  userKey?: string
}

interface Grammar {
  _id: string
  title: string
  passed: boolean
  
}

const AllGrammar: FC<Props> = ({ courseId, LanguageFrom, token, userKey }) => {
  const { t } = useTranslation()
  const [clicked, setClicked] = useState(-1)
  const [grammarData, setGrammarData] = useState([])
  const [grammarItem, setGrammarItem] = useState('')

  const fetchGrammarItem = async (item: string) => {
    try {
      const response = await getGrammarItem({
        courseId,
        LanguageFrom,
        item,
        token,
        userKey
      })


      // const sanitizedHTML = DOMPurify.sanitize(response)   
      const sanitizedHTML = xss(response)   
      setGrammarItem(sanitizedHTML)
    } catch (error) {
      console.error('Failed to fetch grammar item data:', error)
    }
  }


  useEffect(() => {
    const fetchGrammarData = async () => {
      try {
        const response = await getAllGrammar({ courseId, LanguageFrom, token ,  userKey })
        setGrammarData(response)
      } catch (error) {
        console.error('Failed to fetch grammar data:', error)
      }
    }
    fetchGrammarData()
  }, [LanguageFrom, courseId])

  if (!grammarData) return null

  return (
    <div className={style.container}>
      <div className={style.title}>{t('GRAMMAR_TITLE')}</div>
      {Array.isArray(grammarData) && grammarData.map((grammar: Grammar, index) => (
        <div key={index} className={style.wrapper}>
          <button
            className={classNames(
              style.grammarTitle,
              clicked === index && style.open,
            )}
            onClick={() => {
              fetchGrammarItem(grammar._id)
              setClicked(clicked === index ? -1 : index)
            }}
          >
            {grammar.title}
          </button>
          {index === clicked && (
            <div
              dangerouslySetInnerHTML={{ __html: grammarItem }}
              className={classNames(
                style.grammar,
                index === clicked && style.open,
              )}
            />
          )}
        </div>
      ))} 
    </div>
  )
}

export default AllGrammar

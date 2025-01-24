import axios from 'axios'
import getConfig from 'next/config'
//const { process.env } = getConfig()

interface Props {
  iLearnId: string
  courseId: string
  LanguageFrom: string | string[] | undefined
  token?: string
  searchInVocabularyText?: string
  grammarCategory?: string
  searchText?: string
  topic?: string
}

export const getGrammaticalCategories = async ({
  iLearnId,
  courseId,
  LanguageFrom,
  token,
}: Props) => {
  const headers = {
    Authorization: token ?? '',
  }
  const params = {
    lang: LanguageFrom,
    filters: JSON.stringify({
      course: courseId,
      limit: 100,
      skip: 0,
    }),
    iLearn: 'eng',
    iLearnFrom: LanguageFrom,
    iLearnId: iLearnId,
  }

  const url = `${
    process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
  }/public/dictionary/grammaticalCategories`

  try {
    const response = await axios.get(url, {
      headers: headers,
      params: params,
    })
    return response.data.data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getDictionaryTopics = async ({
  iLearnId,
  courseId,
  LanguageFrom,
  token,
}: Props) => {
  const headers = {
    Authorization: token ?? '',
  }
  const params = {
    lang: LanguageFrom,
    filters: JSON.stringify({
      course: courseId,
      limit: 100,
      skip: 0,
    }),
    iLearn: 'eng',
    iLearnFrom: LanguageFrom,
    iLearnId: iLearnId,
  }

  const url = `${
    process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
  }/public/dictionary/topics`

  try {
    const response = await axios.get(url, {
      headers: headers,
      params: params,
    })
    return response.data.data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getDictionary = async ({
  iLearnId,
  courseId,
  searchText,
  grammarCategory,
  topic,
  LanguageFrom,
  token,
}: Props) => {
  const headers = {
    Authorization: token ?? '',
  }
  const params = {
    lang: LanguageFrom,
    filters: JSON.stringify({
      course: courseId,
      searchText: searchText,
      grammar: grammarCategory,
      topic: topic,
      limit: 100,
      skip: 0,
    }),
    iLearn: 'eng',
    iLearnFrom: LanguageFrom,
    iLearnId: iLearnId,
  }

  const url = `${
    process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
  }/public/dictionary`

  try {
    const response = await axios.get(url, {
      headers: headers,
      params: params,
    })
    return response.data.data
  } catch (error) {
    console.log(error)
    return error
  }
}

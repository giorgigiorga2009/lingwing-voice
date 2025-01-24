import axios from 'axios'

export type LanguageCourse = {
  _id: string
  slug: string
  title: {
    ben: string
    tur: string
    rus: string
    esp: string
    geo: string
    eng: string
  }
  iLearnFrom: string
  current: boolean
}

export const getCurrentLanguageCoursesList = async ({
  languageTo,
  languageFrom,
  languageCourseId,
  token,
  languageId,
}: {
  languageTo: string | string[]
  languageFrom: string | string[] | undefined
  token: string | undefined
  languageCourseId: string
  languageId: string
}): Promise<LanguageCourse[] | undefined> => {
  const url = `${
    process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
  }/public/getCurrentLanguageCoursesList?lang=${languageTo}&currentCourseId=${languageCourseId}&currentILearnFrom=${languageFrom}&currentLanguageId=${languageId}`
  const payload = {
    currentLanguageId: languageId,
    currentCourseId: languageCourseId,
    currentILearnFrom: languageFrom,
  }
  const config = {
    headers: { Authorization: token ?? '' },
  }

  try {
    const response = await axios.post(url, payload, config)
    return response.data.data
  } catch (error) {
    console.log(error)
  }
}

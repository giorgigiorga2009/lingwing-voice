import axios from 'axios'

export const getUserId = async ({
  languageTo,
  languageFrom,
  courseName,
  Token,
}: {
  languageTo: string | string[]
  languageFrom: string | string[]
  courseName: string | string[]
  Token: string
}): Promise<string | undefined> => {
  try {
    const response = await axios({
      url: `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/public/startLearning/${courseName}/${languageFrom}?lang=${languageTo}`,
      headers: {
        authorization: Token ?? '',
      },
    })

    // console.log(response)
    return response.data.data.userKey
  } catch (error) {
    console.log(error)
  }
}
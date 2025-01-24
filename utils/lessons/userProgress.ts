import axios from 'axios'

interface UserProgressParams {
  lang: string
  userKey: string
}

export const userProgress = async ({
  lang,
  userKey,
}: UserProgressParams): Promise<boolean> => {
  const url = `${
    process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
  }/public/erase/userProgress?lang=${lang}`

  const payload = {
    userKey,
  }
  const config = {}

  try {
    await axios.post(url, payload, config)
    return true
  } catch (error) {
    console.error('An error occurred while saving task:', error)
    return false
  }
}

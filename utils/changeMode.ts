import axios from 'axios'
import getConfig from 'next/config'
//const { process.env } = getConfig()

const HEADERS = {
  'Content-Type': 'application/json;charset=UTF-8',
  Accept: 'application/json, text/plain, */*',
}

export const changeMode = (
  userCourseId: string,
  learnMode: 1 | 2 | 3,
  token?: string,
) => {
  return axios({
    method: 'post',
    url: `${
      process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
    }/public/learn/changeMode/${userCourseId}`,
    headers: {
      ...HEADERS,
      Authorization: token ?? '',
    },
    data: {
      learnMode,
      userCourseId,
    },
  })
    .then(response => response.data.data)
    .catch(error => {
      throw error
    })
}

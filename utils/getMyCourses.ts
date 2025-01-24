import axios from 'axios'
import getConfig from 'next/config'
//const { process.env } = getConfig()

export const getMyCoursesData = (token: string): Promise<any> => {
  return axios
    .get(
      `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/user/getStartedCourses?lang=eng`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    .then(response => response.data)
    .catch(error => console.log(error))
}

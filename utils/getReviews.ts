import axios from 'axios'
import getConfig from 'next/config'
//const { process.env } = getConfig()

export type ReviewData = {
  _id: string
  review: string
  userName: string
  rating: number
  avatarURL: string
}

export const getReviews = (): Promise<ReviewData[]> => {
  return axios
    .get(
      `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/public/reviews`,
    )
    .then(response => response.data.data)

    .catch(error => console.log(error))
}

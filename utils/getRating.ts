import axios from 'axios'
import getConfig from 'next/config'
//const { process.env } = getConfig()

export const getRating = () => {
  return (
    axios
      .get(
        `${
          process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
        }/public/rating/daily/63b4057e60bc820e2464068b?lang=eng`,
      )
      // `${process.env.defaultURL}/public/rating/weekly/63b4057e60bc820e2464068b?lang=eng`
      // `${process.env.defaultURL}/public/rating/topTwenty/57b98900b5d1d5f225bdeb32?lang=eng&userKey=209d5290-76db-11ed-ace4-33f75a8650df`
      .then(response => response.data.data)

      .catch(error => console.log(error))
  )
}

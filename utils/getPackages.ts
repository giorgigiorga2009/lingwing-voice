import axios from 'axios'
import getConfig from 'next/config'
//const { process.env } = getConfig()

export type PackageData = {
  coupon: {
    exists: boolean
    isUsageExceded: boolean
    isValid: boolean
    type: string
  },
  packages: [
    {
      _id: string
      title: string
      duration: number
      sale: number
      mostPopular: boolean

      currency: [
        {
          price: number
          oldPrice: number
          recurringPrice: number
          _id: { symbol: string }
        },
      ]

      feature: {
        tasks: number
        certificate: boolean
        grammarAndStatistics: boolean
        voiceRecognition: boolean
      }

      discountUsers: {
        active: boolean
        percent: number
      }
    },
    {
      _id: string
      title: string
      duration: number
      sale: number
      mostPopular: boolean

      currency: [
        {
          price: number
          oldPrice: number
          recurringPrice: number
          _id: { symbol: string }
        },
      ]

      feature: {
        tasks: number
        certificate: boolean
        grammarAndStatistics: boolean
        voiceRecognition: boolean
      }

      discountUsers: {
        active: boolean
        percent: number
      }
    },
  ]

  currencies: [
    {
      identifier: string
      symbol: string
    },
  ]
}

export interface CouponCheck {
  coupon: string
  token: string
  body: {
    code: string
    currency: string
    deviceType?: number
  }
}

export interface PackagesInfoProps {
  token?: string;
  header: string
  paragraph: string
  buttonText: string
  index: number | string
  fromGelText?: string
}

export const getPackages = (coupon: string): Promise<PackageData> => {
  return axios
    .get(
      `${
        process.env.DEFAULT_URL || process.env.NEXT_PUBLIC_DEFAULT_URL
      }/public/inter/packages${'?coupon=' + (coupon ?? '')}`,
    )
    .then(response => response.data.data)

    .catch(error => console.log(error))
}
export const getCheckedCoupon = async ({ coupon, token, body }: CouponCheck) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DEFAULT_URL}/public/coupon/check/${coupon}`,
      
        body,
        {
          headers: {
            Authorization: token,
          }
        }
    )
    return response.data
  } catch (error) {
    console.error('Failed coupon check', error)
  }
}
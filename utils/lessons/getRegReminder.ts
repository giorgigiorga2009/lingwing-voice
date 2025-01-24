import { PaymentsProps } from '@utils/getUserPayemnts'

export interface RegistrationReminderPopupProps {
  token: string | null
  courseName?: string | string[]
  paymentsData?: PaymentsProps | null
  dailyLimitDate?: string | Date
  duration?: number
  price?: number
  language?: string | string[] | undefined
  packetTitle?: string
  creditCard?: string
  popUpNumber: number
  completedTasks?: number
  totalTasksAmount?: number
  languageTo?: string | string[] | undefined
  languageFrom?: string | string[] | undefined
}

export type PackageDataForLessonsFlow = {
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
    },
  ]
  currencies: [
    {
      identifier: string
      symbol: string
    },
  ]
}

import { FormEvent } from 'react'

export type jsonData = {
  firstName: string
  lastName: string
  avatar: string
  email: string
  gender: number
  phoneNumber: string
  birthday: {
    year: string | null
    month: string | null
    day: string | null
  }
  country: string
  city: string
  newsletterSubscription: boolean
  smsSubscription: boolean
}

export const prepareJsonData = (
  e: FormEvent<HTMLFormElement>,
  phoneNumber: string,
  profilePicture?: string,
): jsonData => {
  return {
    firstName: e.currentTarget.firstName?.value || '',
    lastName: e.currentTarget.lastName?.value || '',
    avatar: profilePicture || '',
    email: e.currentTarget.email?.value || '',
    gender: e.currentTarget.gender?.value || 0,
    phoneNumber: phoneNumber || '',
    birthday: {
      year: e.currentTarget.year?.value || null,
      month: e.currentTarget.month?.value || null,
      day: e.currentTarget.day?.value || null,
    },
    country: e.currentTarget.country?.value || '',
    city: e.currentTarget.city?.value || '',
    newsletterSubscription:
      e.currentTarget.newsletterSubscription?.checked || false,
    smsSubscription: e.currentTarget.smsSubscription?.checked || false,
  }
}

export default prepareJsonData

import axios from 'axios';
import getConfig from 'next/config';
//const { process.env } = getConfig()

interface Transactions{
  order:{
    duration: number
  }
  status: number
  method: number
  amount: number
  currency: string
  createdAt: string
}

interface RecurringLogs {
    time: string
    status: number
    isPauseLog: boolean
}
interface Order {
  isPauseUsed: boolean
  status: number
  nextRecurringDate: string
  recurringLogs: RecurringLogs[]
}
interface Recurring {
  order: Order
  amount: string
  currency: string
}

export interface PaymentsProps {
  currency: string
  price: number
  activeRecurring: Recurring[]
  transactions: Transactions[]
  premiumDaysLeft: number;
  tests: number;
  tasks: number;
  creditCard: any;
}

export const getUserPayements = (authToken: string) => {
  return axios
    .get(
      `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/user/userPaymentsList`,
      {
        headers: {
          authorization: authToken,
        },
      }
    )
    .then((response) => response.data.data)
    .catch((error) => console.log(error));
};

export const changeCreditCard = async (authToken: string, isPrompt: boolean) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DEFAULT_URL}/user/changeCreditCard`,
      {prompt: isPrompt},
      { headers: { authorization: authToken } }
    );
    return response.data
  } catch (error) {
    console.error('failed during calling changeCreditCard', error);
  }
};
export const deleteCreditCard = async (authToken: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DEFAULT_URL}/user/removeAttachedCard`,
      {},
      {
        headers: {
          authorization: authToken,
        },
      }
    );
    return response.data
  } catch (error) {
    console.error('failed during calling deleteCreditCard', error);
  }
};
export const pauseRecurring = async (authToken: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DEFAULT_URL}/user/pauseRecurring`,
      {},
      {
        headers: {
          authorization: authToken,
        },
      }
    );
    return response.data
  } catch (error) {
    console.error('failed during calling pauseRecurring', error);
  }
};

export const contineRecurring = async (authToken: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DEFAULT_URL}/user/continueRecurring`,
      {},
      {
        headers: {
          authorization: authToken,
        },
      }
    );
    return response.data
  } catch (error) {
    console.error('failed during calling continueRecurring', error);
  }
};

export const disableRecurring = async (authToken: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DEFAULT_URL}/user/disableRecurring`,
      {},
      {
        headers: {
          authorization: authToken,
        },
      }
    );
    return response.data
  } catch (error) {
    console.error('failed during calling disableRecurring', error);
  }
};

import axios from 'axios';

export interface getFreeTrialTransactionProps {
  data: {
    currency?: string;
    packageId?: string;
    paymentType: string;
    accessToken: string;
  }
}

export const getFreeTrialTransaction = async ({
 data
}: getFreeTrialTransactionProps) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DEFAULT_URL}/user/freeTrial/activate`,
      {
        currency: data.currency,
        packageId: data.packageId,
        paymentType: data.paymentType,
        // recurring: 'true'
      },
      {
        headers: {
          Authorization: data.accessToken,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error('failed to get transaction url from provider');
    throw err;
  }
};

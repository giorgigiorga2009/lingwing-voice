import axios from 'axios';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { IconURL } from 'next/dist/lib/metadata/types/metadata-types';
import { UserInfo, useUserStore } from './store';
import { packageId } from '@components/packages/PricingCards';
import { getFreeTrialTransaction } from './getTransactions';

const { publicRuntimeConfig } = getConfig();

export interface PaymentProps {
  value: string;
  index: number;
}

export interface PayWithOptions {
  value: string;
  logo: string;
}

export interface PaymentMethod {
  nameCode: string;
  logo: string;
  recurring: boolean;
}

export interface PackageResponse {
  packages: Package[];
  currencies: Currency[];
  coupon: any;
}

interface Package {
  _id: string;
  title: string;
  duration: number;
  sale: number;
  mostPopular: boolean;
  upsell: Upsell;
  currency: CurrencyPackage[];
  languages: Language[];
  discountUsers: DiscountUsers;
  feature: Feature;
  position: number;
  recurring: boolean;
  recurringSale: string | null;
  identifier?: string;
}

interface Upsell {
  giftCoupon: GiftCoupon;
  duration: Duration;
  duration2: Duration2;
  tasks: Tasks;
  tests: Tests;
}

interface GiftCoupon {
  text: Record<string, string>;
  amount: number;
  active: boolean;
}

interface Duration {
  text: Record<string, string>;
  amount: number;
  active: boolean;
}

interface Duration2 {
  active: boolean;
  amount: number;
  text: Record<string, string>;
}

interface Tasks {
  active: boolean;
  amount: number;
  text: Record<string, string>;
}

interface Tests {
  active: boolean;
  amount: number;
  text: Record<string, string>;
}

interface CurrencyPackage {
  priority: number;
  _id: Currency;
  price: string;
  upsellDurationAdditionalPrice: number;
  upsellGiftAdditionalPrice: number;
  main: boolean;
  upsell: Record<string, number>;
  recurringPrice: number;
}

interface Currency {
  _id: string;
  name: string;
  identifier: string;
  symbol: string;
}

interface Language {
  languageId: string;
  _id: string;
}

interface DiscountUsers {
  active: boolean;
  percent: number;
}

interface Feature {
  allTask: boolean;
  certificate: boolean;
  grammarAndStatistics: boolean;
  tasks: number;
  tests: number;
  voiceRecognition: boolean;
}

export interface ParamsObjectProps {
  packageId?: string;
  currency?: string;
  recurring?: boolean;
  payWith?: string;
  sale?: string;
}

export interface PaymentOptionProps {
  currentPackage?: any;
  monthlyPayment?: number;
  selectedCurrency: number;
  payWithOptions: PaymentMethod[] | undefined;
  accessToken: string;
  checkedPackageOrderId: string;
}

export interface PaymentButtonProps {
  selectedOption: string;
  payWithOption: string;
  handlePackageBuy: () => void;
  duration?: number | null;
  payAtOnceText?: string;
  paramsObject?: ParamsObjectProps;
  accessToken: string;
  isDisabled: boolean;
  buttonText?: string;
}

export const getPayWithList = async (): Promise<PaymentMethod[]> => {
  return await axios
    .get(
      `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/public/paymentMethods/list`
    )
    .then((response) => response.data.data)
    .catch((error) => {
      console.log(error);
      return { status: 500, data: [] };
    });
};

export const getUserProfileCreationDate = async (authToken: string | null) => {
  try {
    const response = await axios.get(
      `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/user/profile`,
      {
        headers: {
          Authorization: authToken ?? '',
        },
      }
    );
    return response.data.data.info.createDate;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getRecurringStatus = async (authToken: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_DEFAULT_URL}/user/getActiveRecurring`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// those two are for post and get
export const getCheckedPackageId = async (
  Id: string,
  authToken: string,
  coupon?: string
): Promise<any> => {
  try {
    const response = await axios.post(
      `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/public/package/check`,
      {
        packageId: Id,
        // promoCode: "7AFE7E",
        promoCode: coupon,
        selectedCurrency: 'GEL',
      },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const getCheckedPackageBuy = async (
  orderId: string,
  paymentType: string,
  currency: string,
  authToken: string,
  sale?: number | string,
  packageId?: string
  // deviceType?: string,
): Promise<any> => {
  try {
    const saleNumber = Number(sale);

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_DEFAULT_URL}/user/package/buy`,
      {
        orderId,
        recurring: true,
        paymentType,
        currency,
        sale: saleNumber,
        packageId,
      },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error('failed creating URL', error);
  }
};

export const getPackageDataById = async (
  id: string | number,
  authToken: string | undefined
): Promise<PackageResponse | undefined> => {
  try {
    const res = await axios.get(
      `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/public/getorder/${id}`,
      {
        headers: {
          Authorization: authToken ?? '',
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const handlePackageBuy = async (
  checkedPackageOrderId: string,
  recurring: boolean,
  payWithOption: string,
  currencyValue: string,
  accessToken: string,
  currentPackageSale?: number | string,
  packageId?: string,
  isFree?: boolean

) => {
  try {
    if (checkedPackageOrderId && payWithOption && accessToken && !isFree) {
      const url = await getCheckedPackageBuy(
        checkedPackageOrderId,
        payWithOption,
        currencyValue,
        accessToken,
        currentPackageSale,
        packageId
      );
      window.open(url, '_blank');
    } 
  } catch (error) {
    console.error('Failed to handle package buy', error);
  }
};

export const handleFreeTrial = async (
  payWithOption: string,
  packageId: string,
  currencyValue: string,
  accessToken: string,

) => {
  try {
    if (payWithOption && accessToken) {
      const currency = currencyValue === 'GEL' ? 'GEL' : 'USD';
      const paymentType = payWithOption;
      const data = {
        currency,
        packageId,
        paymentType,
        accessToken,
      }

      const url = await getFreeTrialTransaction({data});
      window.open(url.data, '_blank');
    }
  } catch (error) {
    console.error('Failed to handle package buy', error);
  }
};
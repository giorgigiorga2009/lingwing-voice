import axios from 'axios';
interface Props {
  courseId: string;
  token?: string | null;
  userKey?: string | null;
}

export const getStatistics = async ({ courseId, token, userKey }: Props) => {
  const headers = {
    Authorization: token ?? '',
  };

  return await axios
    .get(
      `${
        process.env.NEXT_PUBLIC_DEFAULT_URL
      }/public/statistics/small/${courseId}?lang=eng${
        userKey && !token ? '&userKey=' + userKey : ''
      }`,
      {
        headers: headers,
      }
    )
    .then((response) => response.data.data)
    .catch((error) => {
      console.log(error);
      return error;
    });
};

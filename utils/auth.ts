import axios from 'axios';
interface Auth {
  email: string;
  password: string;
  repeatPassword?: string;
  referral?: string | string[];
  userKey?: string;
}

export interface socialAuth {
  provider: string;
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  existingToken?: string;
}

interface resetPassword {
  currentPassword?: string | undefined;
  newPassword: string;
  repeatPassword: string;
  token?: string | undefined;
  expirationToken?: string | string[] | undefined;
}
 
type setPassword = Pick<resetPassword, 'newPassword' | 'repeatPassword' | 'token'>;

const HEADERS = {
  'Content-Type': 'application/json;charset=UTF-8',
  Accept: 'application/json, text/plain, */*',
};

export const getToken = async ({
  email,
  password,
  repeatPassword,
  referral,
  userKey = '',
}: Auth) => {
  return axios({
    method: 'post',
    url: `${
      process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
    }/public/auth/signup?lang=eng`,
    // headers: {
    //   ...HEADERS,
    //   Authorization: 'null',
    // },
    data: {
      profile: {
        email,
        password,
        confirmPassword: repeatPassword,
        referral
      },
      userKey: userKey,
    },
  })
    .then((response) => response.data.data.token)
    .catch((error) => console.log(error));
};

export const auth = async ({
  email,
  password,
  repeatPassword,
  referral,
  userKey = '',
}: Auth) => {
  return getToken({ email, password, repeatPassword, referral, userKey })
    .then((response) =>
      axios({
        url: `${
          process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
        }/user/profile?lang=eng`,
        headers: {
          ...HEADERS,
          Authorization: response,
        },
      })
    )
    .then((response) => response.data)
    .catch((error) => console.log(error));
};

export const login = ({ email, password }: Auth) => {
  return (
    axios({
      method: 'post',
      url: `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/public/auth/login?lang=eng`,
      // headers: {
      //   ...HEADERS,
      //   Authorization: 'null',
      // },
      data: {
        email,
        password,
      },
    })
      //.then(response => response.data.token)   Production
      .then((response) => response.data.data.token)
      .catch((error) => console.log(error))
  );
};

export const getUserProfileData = (token: string) => {
  return axios({
    url: `${
      process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
    }/user/profile`,
    headers: {
      ...HEADERS,
      Authorization: token,
    },
  })
    .then((response) => response.data)
    .catch((error) => console.log(error));
};

export const socialLogin = ({
  provider,
  id,
  name,
  email,
  image,
  existingToken,
}: socialAuth) => {
  return (
    axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_DEFAULT_URL}/public/auth/social`,
      headers: {
        Authorization: existingToken || '',
      },
      data: {
        provider,
        id,
        name,
        email,
        image,
      },
    })
      //.then(response => response.data.token)   Production
      .then((response) => response.data.token)
      .catch((error) => console.log(error))
  );
};

export const unlinkAccount = async (provider: string, token: string) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_DEFAULT_URL}/user/auth/unlink`,
      {
        provider: provider,
      },
      {
        headers: {
          Authorization: token || '',
        },
      }
    );
    return res;
  } catch (error) {
    console.error('failed unlinking an account', error);
  }
};

export const setPassword = async ({newPassword, repeatPassword, token}: setPassword) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_DEFAULT_URL}/user/auth/setPassword`,
      {
        password: newPassword,
        confirmPassword: repeatPassword
      },
      {
        headers:{
          Authorization: token || '',
        }
      }
    )
    return res.data
  } catch (error) {
    console.error('failed setting password', error)
  }
}

export const resetPassword = async ({
  currentPassword,
  newPassword,
  repeatPassword,
  token,
  expirationToken,
}: resetPassword) => {
  return axios({
    method: 'post',
    url: `${
      process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
    }/public/auth/reset`,
    headers: {
      ...HEADERS,
      Authorization: token || '',
    },
    data: {
      currentPassword,
      password: newPassword,
      confirmPassword: repeatPassword,
      token: expirationToken,
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const forgotPassword = async (email: string) => {
  return axios({
    method: 'post',
    url: `${
      process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
    }/public/auth/forgot`,
    // headers: {
    //   ...HEADERS,
    // },
    data: {
      email,
    },
  })
    .then((response) => response.data.data)
    .catch((error) => {
      throw error;
    });
};

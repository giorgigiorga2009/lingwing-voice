import React, { useState } from 'react';
import Image from 'next/image';
import style from './social.module.scss';
import { signIn } from 'next-auth/react';
import tic from '@public/assets/images/tick-check/green-tick.png';
import arrow from '@/public/assets/images/arrows/arrow-right-white-v2.png';
import { unlinkAccount } from '@utils/auth';
import { useUserStore } from '@utils/store';

interface SocialData {
  network: 'facebook' | 'google' | 'twitter' | 'linkedin';
  image: string;
  arrowOrTic: boolean | undefined;
  color: string;
  width: number;
  height: number;
  isSignUpPage?: boolean;
}

const Social = (data: SocialData) => {
  const [IsTic, setIsTic] = useState<boolean | null>(null);


  const token = useUserStore((state) => state.Token);
  const handleSignIn = async () => {
    if (IsTic ?? data.arrowOrTic) {
      try {
        const unlink = await unlinkAccount(data.network, token);
        if (unlink && unlink.data.status === 200) {
          setIsTic(false);
        }
      } catch (error) {
        console.error('failed unlinking an account', error);
      }
    } else {
      try {
        const options = data.isSignUpPage
          ? { callbackUrl: '/' }
          : undefined;

        await signIn(data.network, options);
      } catch (error) {
        console.error('Sign-in error:', error);
      }
    }
  };

  return (
    <button className={style.socialLink} onClick={handleSignIn} type="button">
      <div className={style.left} style={{ backgroundColor: data.color }}>
        <Image
          src={data.image}
          width={data.width}
          height={data.height}
          alt=""
        />
      </div>
      <div className={style.right}>
        {IsTic ?? data.arrowOrTic ? (
          <Image src={tic} width={20} height={20} alt="" />
        ) : (
          <Image src={arrow} width={12} height={20} alt="" />
        )}
      </div>
    </button>
  );
};

export default Social;

import Link from 'next/link';
import Social from './Social';
import Image from 'next/image';
import style from './rightSide.module.scss';
import ImageComponent from './imageComponent';
import { ProfileData } from '@utils/profileEdit';
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@utils/useTranslation';
import { facebook, linkedin, google, twitter, padlock } from './imports';

type Props = {
  data?: ProfileData;
  ProfilePicture: string;
  onProfilePictureChange: (value: string) => void;
  isFormFilled: boolean;
};

const RightSide: React.FC<Props> = ({ data, isFormFilled }) => {
  const { t } = useTranslation();
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [gender, setGender] = useState<number | undefined>(
    data?.profile?.gender
  );
  const [newsletterSubscription, setNewsletterSubscription] = useState<boolean>(
    data?.profile?.newsletterSubscription || false
  );
  const [smsSubscription, setSmsSubscription] = useState<boolean>(
    data?.profile?.smsSubscription || false
  );

  const [agreePolicy, setAgreePolicy] = useState<boolean>(true);

  useEffect(() => {
    if (data) {
    setGender(data?.profile.gender);
    setNewsletterSubscription(data.profile?.newsletterSubscription || false);
    setSmsSubscription(data.profile?.smsSubscription || false);
    }
  }, [data]);

  return (
    <div className={style.rightContainer}>
      <ImageComponent
        CroppedImage={setProfilePicture}
        defaultImage={data?.profile?.avatar || profilePicture}
      />
      <p>{t('APP_PROFILE_CONNECT_SOCIAL')}</p>
      <div className={style.socialLinks}>
        <Social
          network="facebook"
          image={facebook.src}
          arrowOrTic={data?.socials.facebook.enabled}
          color="rgb(82, 91, 172)"
          width={12}
          height={20}
        />
        <Social
          network="google"
          image={google.src}
          arrowOrTic={data?.socials.google.enabled}
          color="rgb(227, 78, 78)"
          width={27}
          height={20}
        />
      </div>
      <div className={style.newsAndGender}>
        <div className={style.switches}>
          <p>{t('APP_PROFILE_GETTING_NEWS')}</p>
          <label className={style.switch}>
            <input
              name="newsletterSubscription"
              type="checkbox"
              checked={newsletterSubscription}
              onChange={() =>
                setNewsletterSubscription(!newsletterSubscription)
              }
            />
            <span className={style.slider}></span>
            <span>{t('APP_PROFILE_SUBSCRIPTION')}</span>
          </label>

          <label className={style.switch}>
            <input
              name="smsSubscription"
              type="checkbox"
              checked={smsSubscription}
              onChange={() => setSmsSubscription(!smsSubscription)}
            />
            <span className={style.slider}></span>
            <span>{t('APP_PROFILE_SMS_SUBSCRIPTION')}</span>
          </label>
        </div>

        <div className={style.genderContainer}>
          <p>{t('APP_PROFILE_GENDER')}:</p>
          <div className={style.gender}>
            <input
              type="radio"
              name="gender"
              id="male"
              value="1"
              checked={gender === 1}
              onChange={() => setGender(1)}
            />
            <label
              htmlFor="male"
              className={gender === 1 ? style.maleLabelActive : style.maleLabel}
              data-text={t('APP_PROFILE_MALE')}
            >
              {t('APP_PROFILE_MALE')}
            </label>
          </div>
          <div>
            <input
              type="radio"
              name="gender"
              id="female"
              value="2"
              checked={gender === 2}
              onChange={() => setGender(2)}
            />
            <label
              htmlFor="female"
              className={
                gender === 2 ? style.femaleLabelActive : style.femaleLabel
              }
            >
              {t('APP_PROFILE_FEMALE')}
            </label>
          </div>
        </div>
      </div>
      <div className={style.changePassword}>
        <Image src={padlock.src} width={12} height={20} alt="" />
        <Link href="/update-password">{t('APP_PROFILE_CHANGE_PASSWORD')}</Link>
      </div>
      <div className={style.bottomContainer}>
        <div className={style.agree}>
          <input
            name="Agree"
            type="checkbox"
            checked={agreePolicy}
            onChange={() => setAgreePolicy(!agreePolicy)}
          />
          <p>
            {t('APP_MARKETING_POLICY_1')}{' '}
            <Link href="privacy-policy">{t('APP_MARKETING_POLICY_2')}</Link>
            {t('APP_MARKETING_POLICY_3')}
          </p>
        </div>
        <button className={style.button} type="submit" disabled={!isFormFilled}>
          {t('APP_GENERAL_SAVE_CHANGES')}
        </button>
      </div>
    </div>
  );
};

export default RightSide;
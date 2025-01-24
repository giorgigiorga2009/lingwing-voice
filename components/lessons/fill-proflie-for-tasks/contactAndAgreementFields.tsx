import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PhoneInput from 'react-phone-number-input';
import style from './fillProfileForTasks.module.scss';
import { useTranslation } from '@utils/useTranslation';

interface Props {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  gender: number;
  setGender: (value: number) => void;
  setIsFormFilled: (isFormFilled: boolean) => void;
}

const ContactAndAgreementFields: React.FC<Props> = ({
  phoneNumber,
  setPhoneNumber,
  gender,
  setGender,
  setIsFormFilled
}) => {
  const { t } = useTranslation();
  const [isPhoneFilled, setIsPhoneFilled] = useState<boolean>(false);
  const [isGenderFilled, setIsGenderFilled] = useState<boolean>(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState<boolean>(false);
  

  const checkFormFilled = () => {
    const isFormFilled = isPhoneFilled && isGenderFilled && isAgreementChecked;
    setIsFormFilled(isFormFilled); 
  };

  useEffect(() => {
    checkFormFilled();
  }, [isPhoneFilled, isGenderFilled, isAgreementChecked]);

  const handlePhoneChange = (value?: string) => {
    setPhoneNumber(value || '');
    setIsPhoneFilled(!!value); 
  };

  const handleGenderChange = (value: number) => {
    setGender(value);
    setIsGenderFilled(true); 
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreementChecked(e.target.checked); 
  };
  return (
    <>
      <div className={style.phoneNumber}>
        <label htmlFor="PhoneNumber">{t('APP_PROFILE_MOBILE')}</label>
        <PhoneInput
          name="phone"
          className={style.phone}
          onChange={handlePhoneChange}
          defaultCountry="GE"
          value={phoneNumber}
          placeHolder="555 12 34 56"
          required
        />
      </div>
      <div className={style.gender}>
        <label htmlFor="gender">{t('APP_PROFILE_GENDER')}:</label>
        <div>
          <input
            type="radio"
            name="gender"
            id="male"
            value="1"
            checked={gender === 1}
            onChange={() => handleGenderChange(1)}
            required
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
            onChange={() => handleGenderChange(2)}
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
      <div className={style.agree}>
        <input name="Agree" type="checkbox" required onChange={handleAgreementChange} />
        <p>
          {t('APP_MARKETING_POLICY_1')}{' '}
          <Link href="/licensing-agreement" target="_blank" rel="noopener noreferrer">{t('APP_MARKETING_POLICY_2')}</Link>
          {t('APP_MARKETING_POLICY_3')}
        </p>
      </div>
    </>
  );
};

export default ContactAndAgreementFields;

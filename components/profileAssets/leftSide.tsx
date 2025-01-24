import GenerateDate from './generateDate';
import ProfileInput from './profileInput';
import style from './leftSide.module.scss';
import 'react-phone-number-input/style.css';
import CountrySelector from './countrySelector';
import { ProfileData } from '@utils/profileEdit';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@utils/useTranslation';
import ShowErr from '@components/shared/ShowInputError';
import { getPhoneValidation } from '@utils/validations';
type Props = {
  data?: ProfileData;
  onPhoneNumberChange: (value: string) => void;
  setIsFormFilled: (isFilled: boolean) => void;
};

const LeftSide: React.FC<Props> = ({ data, onPhoneNumberChange, setIsFormFilled }) => {
  const [firstNameFocus, setFirstNameFocus] = useState<boolean>(false);
  const [lastNameFocus, setLastNameFocus] = useState<boolean>(false);
  const [emailFocus, setEmailFocus] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>(data?.profile?.phoneNumber || '');
  const isPhoneValid = getPhoneValidation(phoneNumber);
  const [isFirstNameFilled, setIsFirstNameFilled] = useState<boolean>(false)
  const [isLastNameFilled, setIsLastNameFilled] = useState<boolean>(false)
  const [isEmailFilled, setIsEmailFilled] = useState<boolean>(false)
  const [isPhoneFilled, setIsPhoneFilled] = useState<boolean>(false)
  const { t } = useTranslation();

  const handlePhoneChange = (value?: string) => {
    const newValue = value || '+995';
    setPhoneNumber(newValue);
    onPhoneNumberChange(newValue); 
    setIsPhoneFilled(!!newValue && newValue.length > 0 && getPhoneValidation(newValue));
  };

  useEffect(() => {
    const isFormFilled = isFirstNameFilled && isLastNameFilled && isEmailFilled && isPhoneFilled;
    setIsFormFilled(isFormFilled);
  }, [isFirstNameFilled, isLastNameFilled, isEmailFilled, isPhoneFilled]);

  useEffect(() => {
    handlePhoneChange(data?.profile?.phoneNumber);
  }, [data]);

  const birthdayDay = data?.profile?.birthday?.day || 0;
  const birthdayMonth = data?.profile?.birthday?.month || 0;
  const birthdayYear = data?.profile?.birthday?.year || 0;



  return (
    <div className={style.leftContainer}>
      <ProfileInput
        name="firstName"
        type="text"
        text={t('APP_PROFILE_FIRST_NAME')}
        onFocus={() => setFirstNameFocus(true)}
        onBlur={() => setFirstNameFocus(false)}
        focused={firstNameFocus}
        value={data?.profile?.firstName || ''}
        setIsFormFilled={setIsFirstNameFilled}
      />
      <ProfileInput
        name="lastName"
        type="text"
        text={t('APP_PROFILE_LAST_NAME')}
        onFocus={() => setLastNameFocus(true)}
        onBlur={() => setLastNameFocus(false)}
        focused={lastNameFocus}
        value={data?.profile?.lastName || ''}
        setIsFormFilled={setIsLastNameFilled}
      />
      <ProfileInput
        name="email"
        type="email"
        text={t('APP_PROFILE_EMAIL_ADDRESS')}
        onFocus={() => setEmailFocus(true)}
        onBlur={() => setEmailFocus(false)}
        focused={emailFocus}
        value={data?.local?.email || ''}
        setIsFormFilled={setIsEmailFilled}
      />
      <div className={style.phoneNumber}>
        <label htmlFor="PhoneNumber">{t('APP_PROFILE_MOBILE')}</label>
        <PhoneInput
          country={'ge'}
          value={data?.profile?.phoneNumber || phoneNumber}
          onChange={handlePhoneChange}
          inputClass={style.phoneInput}
          containerClass={style.phoneContainer}
          buttonClass={style.phoneButton}
          dropdownClass={style.phoneDropdown}
          placeholder='+995 512 345 678'
        />
      </div>
      <div className={style.error}>
        {!isPhoneValid && phoneNumber.length > 0 && (
          <ShowErr ErrText={t('FIELD_REQUIRED')} />
        )}
      </div>
      <div className={style.birthDate}>
        <label htmlFor="birthdate">{t('APP_PROFILE_AGE')}</label>
        <GenerateDate
          defaultDay={birthdayDay}
          defaultMonth={birthdayMonth}
          defaultYear={birthdayYear}
        />
      </div>
      <div className={style.country}>
        <CountrySelector
          defaultCountry={data?.profile?.country}
          defaultCity={data?.profile?.city}
        />
      </div>
    </div>
  );
};

export default LeftSide;
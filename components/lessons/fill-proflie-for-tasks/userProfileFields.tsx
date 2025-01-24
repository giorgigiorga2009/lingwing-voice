import ProfileInput from '@components/profileAssets/profileInput'
import React, { useState, useEffect } from 'react'
import style from '@components/lessons/fill-proflie-for-tasks/userProfileFields.module.scss'
import GenerateDate from '@components/profileAssets/generateDate'
import { useTranslation } from '@utils/useTranslation'

interface Props {
  setIsFormFilled: (isFilled: boolean) => void; // Receive the callback as a prop
}

const UserProfileFields: React.FC<Props> = ({ setIsFormFilled }) => {
  const { t } = useTranslation()
  const [firstNameFocus, setFirstNameFocus] = useState<boolean>(false)
  const [lastNameFocus, setLastNameFocus] = useState<boolean>(false)
  const [isFirstNameFilled, setIsFirstNameFilled] = useState<boolean>(false)
  const [isLastNameFilled, setIsLastNameFilled] = useState<boolean>(false)
  const [isDateFilled, setIsDateFilled] = useState<boolean>(false)
  useEffect(() => {
    const isFormFilled = isFirstNameFilled && isLastNameFilled && isDateFilled
    setIsFormFilled(isFormFilled)
  }, [isFirstNameFilled, isLastNameFilled, isDateFilled])

  return (
    <>
      <ProfileInput
        name="firstName"
        type="text"
        text={t('APP_PROFILE_FIRST_NAME')}
        onFocus={() => setFirstNameFocus(true)}
        onBlur={() => setFirstNameFocus(false)}
        focused={firstNameFocus}
        required={true}
        setIsFormFilled={setIsFirstNameFilled}
      />
      <ProfileInput
        name="lastName"
        type="text"
        text={t('APP_PROFILE_LAST_NAME')}
        onFocus={() => setLastNameFocus(true)}
        onBlur={() => setLastNameFocus(false)}
        focused={lastNameFocus}
        required={true}
        setIsFormFilled={setIsLastNameFilled}
      />

      <div className={style.birthDate}>
        <label htmlFor="birthdate">{t('APP_PROFILE_AGE')}</label>
        <GenerateDate
          BRadius="lighterBorderColor"
          required={true}
          setIsDateFilled={setIsDateFilled}
        />
      </div>
    </>
  )
}

export default UserProfileFields

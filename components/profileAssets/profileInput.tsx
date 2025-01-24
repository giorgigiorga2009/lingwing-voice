import React, { useState, useEffect } from 'react'
import style from './profileInput.module.scss'
import { ProfileData } from '@utils/profileEdit';
import ShowErr from '@components/shared/ShowInputError';
import { useTranslation } from '@utils/useTranslation';
import { getFieldValidation } from '@utils/validations';

interface Props {
  required?: boolean
  name: string
  type: string
  text: string
  onFocus: () => void
  onBlur: () => void
  focused: boolean
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  setIsFormFilled?: (isFormFilled: boolean) => void
}

const ProfileInput: React.FC<Props> = ({
  required,
  name,
  type,
  text,
  onFocus,
  onBlur,
  focused,
  value = '',
  setIsFormFilled,
}) => {
  const [inputValue, setInputValue] = useState<string>(value)
  const isFieldValid = getFieldValidation(inputValue);

  const {t} = useTranslation()

  useEffect(() => {
    setInputValue(value)
    updateFormFilledStatus(value)
  }, [value])

  const updateFormFilledStatus = (currentValue: string) => {
    if (setIsFormFilled) {
      setIsFormFilled(currentValue.length > 0)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setInputValue(newValue)
    updateFormFilledStatus(newValue)
  }

  return (
    <div className={style.container}>
      <label
        htmlFor={name}
        className={`${focused || inputValue ? style.labelTop : ''}`}
      >
        {text}
      </label>
      <input
        title={text}
        name={name}
        onFocus={onFocus}
        onBlur={onBlur}
        type={type}
        onChange={handleInputChange}
        value={inputValue}
        required={required}

      />
      <div className={style.error}>
      {!isFieldValid && inputValue.length === 0 && (
        <ShowErr ErrText={t('FIELD_REQUIRED')} />
      )}
      </div>
    </div>
  )
}

export default ProfileInput

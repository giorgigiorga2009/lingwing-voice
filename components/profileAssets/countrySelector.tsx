import React, { useState, useEffect } from 'react'
import { CountryDropdown } from 'react-country-region-selector'
import { Country, City } from 'country-state-city'
import styles from './countrySelector.module.scss'
import { useTranslation } from '@utils/useTranslation'
import { fetchUserLocation } from '@utils/getUserLocation'
// import countries from 'i18n-iso-countries'
// import 'i18n-iso-countries/langs/ka.json'

// countries.registerLocale(require('i18n-iso-countries/langs/ka.json'))

// const getCountryNameInGeorgian = (alpha2Code: string) => {
//   return countries.getName(alpha2Code, 'ka', { select: 'official' })
// }

interface CustomCity {
  name: string
  countryCode: string
}

interface Props {
  defaultCountry?: string
  defaultCity?: string
}

const CountrySelector: React.FC<Props> = ({
  defaultCountry = '',
  defaultCity = '',
}) => {
  const [country, setCountry] = useState(defaultCountry)
  const [city, setCity] = useState(defaultCity)
  const { t } = useTranslation()
  const translatedCityName = (name: string): string => t(name)
  useEffect(() => {
    if(!defaultCity){
    const getUserLocation = async () => {
      const data = await fetchUserLocation()
      if (data) {
        // const translatedCountry = getCountryNameInGeorgian(data.country_code)
        // setCountry(data.country_name)
        setCity(translatedCityName(data.city) || data.city)
      }
    }

    getUserLocation()
  }
  }, [])

  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry)
    setCity('')
  }

  const handleCityChange = (selectedCity: string) => {
    setCity(selectedCity)
  }

  const getCities = (): CustomCity[] => {
    const countryObj = Country.getAllCountries().find(c => c.name === country)
    if (countryObj) {
      const countryCode = countryObj.isoCode
      const cities = City.getCitiesOfCountry(countryCode)
      return (
        cities?.map(city => ({
          name: translatedCityName(city.name),
          countryCode,
        })) || []
      )
    }
    return []
  }

  return (
    <div className={styles.container}>
      <div className={styles.selector}>
        <label>{t('APP_PROFILE_COUNTRY')}</label>
        <div className={styles.country}>
          <CountryDropdown
            name="country"
            value={country}
            onChange={handleCountryChange}
            valueType="full"
            priorityOptions={['US', 'CA', 'GB']}
          />
        </div>
      </div>
      <div className={styles.selector}>
        <label>{t('APP_PROFILE_CITY')}</label>
        <select
          title="city"
          name="city"
          value={city}
          onChange={e => handleCityChange(e.target.value)}
          disabled={!country}
        >
          <option value="">Select City</option>
          {getCities().map((city, index) => (
            <option key={`${city.name}-${index}`} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default CountrySelector
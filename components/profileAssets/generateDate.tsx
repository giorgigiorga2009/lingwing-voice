import React, { useEffect, useState } from 'react'
import style from './generateDate.module.scss'
import { useTranslation } from '@utils/useTranslation'
import classNames from 'classnames'

interface Option {
  value: any
  label: any
}

interface Props {
  required?: boolean
  onChange?: any
  BRadius?: string
  defaultYear?: number | null
  defaultMonth?: number | null
  defaultDay?: number | null
  setIsDateFilled?: (isFormFilled: boolean) => void
}

const monthsStrings = [
  'MONTH_JANUARY',
  'MONTH_FEBRUARY',
  'MONTH_MARCH',
  'MONTH_APRIL',
  'MONTH_MAY',
  'MONTH_JUNE',
  'MONTH_JULY',
  'MONTH_AUGUST',
  'MONTH_SEPTEMBER',
  'MONTH_OCTOBER',
  'MONTH_NOVEMBER',
  'MONTH_DECEMBER',
]

const generateYears = (): Option[] => {
  const currentYear = new Date().getFullYear()
  const years: Option[] = []

  for (let year = currentYear; year >= currentYear - 100; year--) {
    years.push({ value: year, label: String(year) })
  }

  return years
}

const generateMonths = (): Option[] => {
  const months: Option[] = []

  for (let month = 1; month <= 12; month++) {
    const monthName = new Date(0, month - 1).toLocaleString('default', {
      month: 'long',
    })
    months.push({ value: month, label: monthName })
  }
  return months
}

const generateDays = (month: number, year: number): Option[] => {
  if (!month || !year) return []

  const daysInMonth = new Date(year, month, 0).getDate()
  const days: Option[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ value: day, label: String(day) })
  }
  return days
}

const GenerateDate: React.FC<Props> = ({
  required,
  BRadius: borderColor,
  defaultDay,
  defaultMonth,
  defaultYear,
  setIsDateFilled,
}) => {
  const [selectedYear, setSelectedYear] = useState<Option | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<Option | null>(null)
  const [selectedDay, setSelectedDay] = useState<any | null>(null)
  useEffect(() => {
    if (defaultYear !== undefined && defaultYear !== null) {
      setSelectedYear({ value: defaultYear, label: String(defaultYear) })
    }

    if (defaultMonth !== undefined && defaultMonth !== null) {
      setSelectedMonth({
        value: defaultMonth,
        label: new Date(0, defaultMonth - 1).toLocaleString('default', {
          month: 'long',
        }),
      })
    }

    if (defaultDay !== undefined && defaultDay !== null) {
      setSelectedDay({ value: defaultDay, label: String(defaultDay) })
    }
  }, [defaultDay, defaultMonth, defaultYear])

  useEffect(() => {
    updateDateFilledStatus()
  }, [selectedDay, selectedMonth, selectedYear])

  const years: Option[] = generateYears()
  const months: Option[] = generateMonths()
  const days: Option[] = generateDays(
    selectedMonth?.value as number,
    selectedYear?.value as number,
  )

  const updateDateFilledStatus = () => {
    if (setIsDateFilled) {
      setIsDateFilled(!!selectedYear && !!selectedMonth && !!selectedDay)
    }
  }

  const handleYearChange = (selectedOption: Option | null) => {
    setSelectedYear(selectedOption)
    setSelectedDay(null) // Reset selected day when year changes
  }

  const handleMonthChange = (selectedOption: Option | null) => {
    setSelectedMonth(selectedOption)
    setSelectedDay(null) // Reset selected day when month changes
  }

  const handleDayChange = (selectedOption: any | null) => {
    setSelectedDay(selectedOption)
  }

  const { t } = useTranslation()
  return (
    <div className={style.container}>
      <select
        name="year"
        className={classNames(style.select1, {
          [style.lighterborderColor]: borderColor === 'lighterBorderColor',
        })}
        value={selectedYear?.value}
        required={required}
        onChange={e =>
          handleYearChange(
            years.find(year => year.value == e.target.value) || null,
          )
        }
      >
        <option value=""> {t('APP_PROFILE_YEAR')}</option>
        {years.map(year => (
          <option key={year.value} value={year.value}>
            {year.label}
          </option>
        ))}
      </select>
      <select
        name="month"
        className={classNames(style.select2, {
          [style.lighterborderColor]: borderColor === 'lighterBorderColor',
        })}
        value={selectedMonth?.value}
        required={required}
        onChange={e =>
          handleMonthChange(
            months.find(month => month.value == e.target.value) || null,
          )
        }
      >
        <option value="">{t('APP_PROFILE_MONTH')}</option>
        {months.map((month, index) => (
          <option key={month.value} value={month.value}>
            {t(monthsStrings[index])}
          </option>
        ))}
      </select>
      <select
        name="day"
        className={classNames(style.select3, {
          [style.lighterborderColor]: borderColor === 'lighterBorderColor',
        })}
        value={selectedDay?.value || ''}
        required={required}
        onChange={e => {
          const selectedDayOption = days.find(day => day.value == e.target.value) || null;
          handleDayChange(selectedDayOption);  // Directly pass the selected day
        }}
      >
        <option value="">{t('APP_PROFILE_DATE')}</option>
        {days.map(day => (
          <option key={day.value} value={day.value}>
            {day.label}
          </option>
        ))}
      </select>
    </div>
  )
}




export default GenerateDate



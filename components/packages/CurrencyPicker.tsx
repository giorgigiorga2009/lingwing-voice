import { FC } from 'react'
import { useStore } from '@utils/store'
import style from './CurrencyPicker.module.scss'

interface Props {
  // selectedCurrency: number
  identifier: string
  symbol: string
  index: number
  //onClick: () => void
}

export const Currency: FC<Props> = ({
  //selectedCurrency,
  identifier,
  symbol,
  index,
  //onClick,
}) => {
  const selectedCurrency = useStore(state => state.selectedCurrency)
  const changeCurrency = useStore(state => state.changeCurrency)

  // console.log(selectedCurrency)

  return (
    <>
      <input
        id={identifier}
        type="radio" 
        className={style.currency}
        checked={index === selectedCurrency}
        onChange={() => changeCurrency(index)}
      />
      <label className={style.label} htmlFor={identifier}>
        {symbol + ' ' +identifier}
      </label>
    </>
  )
}

import { FC } from 'react'
import style from './CurrencySymbol.module.scss'
import classNames from 'classnames'

interface Props {
  whereTo?: number
  symbol: string
}

export const CurrencySymbol: FC<Props> = ({ whereTo, symbol }) => {
  return (
    <span
      className={classNames(style.symbol, {
        [style.symbolForFlowPopUp]: whereTo === 1,
      })}
    >
      {symbol}
    </span>
  )
}

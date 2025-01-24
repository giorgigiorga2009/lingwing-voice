import { FC } from 'react'
import style from './MistakesCounter.module.scss'
import CircularProgress from './statsPerOnePercent/circularProgress'

interface Props {
  percentage: number
  errorLimit: number
}

export const MistakesCounter: FC<Props> = ({ percentage, errorLimit }) => {

  return (
    <div className={style.circle}>
      <CircularProgress
        page={percentage >= 0 ? 'MistakesCounter' : 'FailState'}
        percentage={percentage >= 0 ? percentage : 100}
        errorLimit={errorLimit}
      />
    </div>
  )
}

import style from './Timer.module.scss'
import { FC, useState, useEffect } from 'react'

interface TimerProps {
  trigger: boolean | undefined
}

const Timer: FC<TimerProps> = ({ trigger }) => {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (trigger && timeLeft < 100) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft + 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [trigger, timeLeft])

  return <div className={style.timer}>00:{timeLeft}</div>
}

export default Timer

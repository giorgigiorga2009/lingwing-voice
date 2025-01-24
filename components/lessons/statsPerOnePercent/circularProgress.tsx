import 'react-circular-progressbar/dist/styles.css'
import { CircularProgressbar } from 'react-circular-progressbar'

interface CircularProgressProps {
  percentage: number
  errorLimit?: number
  page: 'OnePercentPage' | 'StatisticsPage' | 'MistakesCounter' | 'FailState'
}

const stylesConfig: { [key: string]: any } = {
  OnePercentPage: {
    path: {
      stroke: '#ffc401',
    },
    trail: {
      stroke: '#502673',
    },
    backgroundColor: { fill: '#0000' },
    text: {
      fontSize: '20px',
      fill: '#fff',
      fontFamily: 'SegoeUI-SemiBold',
    },
  },
  StatisticsPage: {
    path: {
      stroke: '#f6a313',
    },
    trail: {
      stroke: '#f0efee',
    },
    backgroundColor: { fill: '#0000' },
    text: {
      fontSize: '20px',
      fill: '#676767',
      fontFamily: 'SegoeUI',
    },
  },
  MistakesCounter: {
    path: {
      stroke: '#b68de3',
    },
    trail: {
      stroke: '#f7f6f7', 
    },
    backgroundColor: { fill: '#dbccec' },
    text: {
      fontSize: '36px',
      fill: '#692596',
      fontFamily: 'SegoeUI',
    },
  },
  FailState: {
    path: {
      stroke: '#f7f7f7',
    }, 
    trail: {
      stroke: '#f7f7f7',
    },
    backgroundColor: { fill: '#fed1d1' },
    text: {
      fontSize: '36px',
      fill: '#692696',
      fontFamily: 'SegoeUI',
    },
  },
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  errorLimit,
  page,
}) => {
  const flooredPercentage = Math.floor(percentage)
  return (
    <div>
      <CircularProgressbar
        value={flooredPercentage}
        text={
          page === 'MistakesCounter' || page === 'FailState' ? `${errorLimit}` : `${flooredPercentage}%`
        }
        strokeWidth={12}
        background={true}
        styles={{
          path: stylesConfig[page].path,
          trail: stylesConfig[page].trail,
          text: stylesConfig[page].text,
          background: stylesConfig[page].backgroundColor,
        }}
      />
    </div>
  )
}

export default CircularProgress

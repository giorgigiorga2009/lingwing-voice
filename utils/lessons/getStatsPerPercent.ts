import axios from 'axios'
import { TaskData } from './getTask'


export interface RateLingwingProps {
  // onClose: () => void
  completedTasks?: TaskData[]
}

export interface StatsPagePerOnePercentProps {
  token: string | null
  completedTasks?: TaskData[]
  courseId: string
  statsData?: StatsDataProps
  isUserLoggedIn: boolean
}
export interface StatsDataProps {
  grammar: {
    current: number
    max: number
  }
  tasks: {
    current: number
    max: number
  }
  percent: number
  timeSpent: number
}

interface Props {
  userCourseId: string
  token: string | null
}

export const getStatsPerPercent = async ({ userCourseId, token }: Props) => {
  const headers: { [key: string]: string } = {}

  if (token) {
    headers.Authorization = token
  }

  return await axios
    .get(
      `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/user/learn/statisticPerPercent/${userCourseId}`,
      { headers: headers },
    )
    .then(response => response.data.data)
    .catch(error => {
      console.log(error)
      return { status: 500, data: [] }
    })
}

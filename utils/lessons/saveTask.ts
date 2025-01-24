import axios from 'axios'
import { TaskData } from './getTask'

interface SaveTaskParams {
  languageTo: string | string[]
  languageFrom: string | string[]
  Token: string | null
  courseId: string
  userId: string | null
  currentTask: TaskData
  totalMistakes: number
  forgivenErrorQuantity: number
  error: number
}

export const saveTask = async ({
  languageTo,
  languageFrom,
  courseId,
  Token,
  userId,
  currentTask,
  totalMistakes,
  forgivenErrorQuantity,
  error,
}: SaveTaskParams): Promise<boolean> => {
  let url = `${
    process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
  }/public/saveTask/${courseId}/${languageFrom}?lang=${languageTo}`
  if (Token === null) {
    url = `${url}&userKey=${userId}`
  }
  const payload = {
    userCourseId: courseId,
    iLearnFromNameCode: languageFrom,
    userKey: userId,
    // symbols: [],
    task: {
      _id: currentTask._id,
      segment: '', //
      error: error,
      ordinalNumber: currentTask.ordinalNumber,
      timeSpent: currentTask.timeSpent || 0, //
      totalMistakes: totalMistakes,
      taskMistakes: [], // needs more info
      percent: 0.06078288353999514, //
      forgivenErrorQuantity: forgivenErrorQuantity,
      notForgivenErrorQuantity: totalMistakes,
      usedRecognition: 0, //
      totalTypedWithRecognition: 0, //
      totalTypedWithoutRecognition: 1, //
      mistakeWithRecognition: 0, //
      saveType: 0, // ?
      taskType: currentTask.taskType,
    },
  }
  const config = Token ? { headers: { Authorization: Token } } : {}

  try {
    await axios.post(url, payload, config)
    return true
  } catch (error) {
    console.error('An error occurred while saving task:', error)
    return false
  }
}

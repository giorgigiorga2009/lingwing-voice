import { LanguageLevel } from '../getDifficultyLevels'

export const getCourseTable = (response: LanguageLevel[]) => {
  const arr = response.map(level => level.options.map(option => option.title))
  const flatTable = arr.flat()
  return flatTable
}

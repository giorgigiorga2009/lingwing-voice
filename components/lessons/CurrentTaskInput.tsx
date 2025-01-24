import { ReactElement } from 'react'
import { DialogInput } from './Dialog'
import { GrammarButton } from './Grammar'
import { OmittedWords } from './OmittedWords'
import { TaskInputContainer } from './TaskInputContainer'
import { MistakeCorrectionTask } from './MistakeCorrection'
import { CommonProps } from '@utils/lessons/taskInputUtils'

type CurrentTaskInputProps = {
  commonProps: CommonProps | null
  currentMessageIndex?: number
  setCurrentMessageIndex?: (messageIndex: number) => void
}

const CurrentTaskInput = ({
  commonProps,
  currentMessageIndex,
  setCurrentMessageIndex,
}: CurrentTaskInputProps): ReactElement | null => {
  if (!commonProps) return null
  // console.log(
  //   'commonProps.currentTask.taskType->',
  //   commonProps.currentTask.taskType,
  // )

  switch (commonProps.currentTask.taskType) {
    case 'translate':
    case 'dictation':
    case 'replay':
      return (
        <>
          {/* <TaskInputContainer
            commonProps={commonProps}
            taskType={commonProps.currentTask.taskType}
          /> */}
        </>
      )
    case 'dialog':
      return currentMessageIndex !== undefined && setCurrentMessageIndex ? (
        <>
          <DialogInput
            commonProps={commonProps}
            currentMessageIndex={currentMessageIndex}
            setCurrentMessageIndex={setCurrentMessageIndex}
          />
        </>
      ) : null

    case 'omittedwords':
      return (
        <>
          <OmittedWords commonProps={commonProps} />
        </>
      )
    case 'mistakecorrection':
      return (
        <>
          <MistakeCorrectionTask commonProps={commonProps} />
        </>
      )
    case 'grammar':
      return (
        <>
          <GrammarButton commonProps={commonProps} />
        </>
      )
    default:
      return null
  }
}

export default CurrentTaskInput

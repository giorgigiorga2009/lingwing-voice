import classNames from 'classnames'
import { FC, RefObject } from 'react'
import style from './DictationInput.module.scss'

interface Props {
  inputRef: RefObject<HTMLTextAreaElement>
  outputText: string
  onKeyDown: (event: React.KeyboardEvent) => void
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  // onFocus: (event: React.FocusEvent<HTMLElement>) => void
  taskDone: string
  mistake: boolean
}
export const DictationInput: FC<Props> = ({
  inputRef,
  outputText,
  onKeyDown,
  onChange,
  //onFocus,
  taskDone,
  mistake,
}) => {
  return (
    <textarea
      ref={inputRef}
      className={classNames(
        style.input,
        taskDone === '100%' && style.inputDone,
        mistake && style.mistake,
      )}
      autoComplete="off"
      spellCheck="false"
      data-gramm="false"
      value={outputText}
      placeholder="Type your answer"
      onKeyDown={onKeyDown}
      onChange={onChange}
      //onFocus={onFocus}
      // autoFocus
    />
  )
}

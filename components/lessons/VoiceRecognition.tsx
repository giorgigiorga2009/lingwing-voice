import { FC, useEffect } from 'react'
import style from './VoiceRecognition.module.scss'
import { useSpeechRec } from '@utils/lessons/useSpeechRecognition'
import {
  useRecognitionActive,
  getVoiceRecognitionActive,
  useVoiceActive,
} from '@utils/store'

interface VoiceRecognitionProps {
  progress: string,
  locale?: string 
}

export const VoiceRecognition: FC<VoiceRecognitionProps> = ({ progress, locale = '' }) => {
  const { isRecording, toggleRecognition } = useSpeechRec(locale)

  const { isRecordingActive, ToggleRecordingActive } = useRecognitionActive(
    getVoiceRecognitionActive,
  )

  const { isVoicePlaying, ToggleVoicePlaying } = useVoiceActive()

  useEffect(() => {
    if (isRecordingActive) {
      progress === '0%' && toggleRecognition()
      progress === '100%' && toggleRecognition()

      isVoicePlaying && toggleRecognition()
    }
  }, [progress, isVoicePlaying])

  return (
    <button
      className={style.microphoneContainer}
      onClick={() => {
        ToggleRecordingActive(isRecordingActive)
        toggleRecognition()
      }}
    >
      {isRecording ? (
        <div className={style.pulsatingCircle} />
      ) : (
        <span className={style.micIcon} key="mic" />
      )}
    </button>
  )
}
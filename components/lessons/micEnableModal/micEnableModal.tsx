import React, { useState } from 'react';
import Modal from 'react-modal';
import style from './micEnableModal.module.scss';
import Image from 'next/image';
import micPurple from '@public/themes/images/v2/voicerec-mic-purple.png';
import { TaskData } from '@utils/lessons/getTask';
import { useTranslation } from '@utils/useTranslation';
import { useRouter } from 'next/router';

interface MicEnableModalProps {
  completedTasks?: TaskData[];
}

const locales: { [key: string]: string } = {
  deu: 'de-DE',
  eng: 'en-US', // or 'en-GB' for British English
  esp: 'es-ES',
  geo: 'ka-GE',
  fre: 'fr-FR',
  ita: 'it-IT',
  rus: 'ru-RU',
};

const MicEnableModal: React.FC<MicEnableModalProps> = ({ completedTasks }) => {
  const { t } = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(true);

  const router = useRouter();
  const { locale } = router;
  const voiceParams = { continuous: true, language: locales[locale || 'geo'] };


  const closeModal = () => {
    setModalIsOpen(false);
  };

  const enableMicrophone = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      closeModal();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // SpeechRecognition.startListening(voiceParams)

      stream.getTracks().forEach((track) => track.stop());

      closeModal();
    } catch (err) {
      closeModal();
    }
  };

  if (completedTasks?.length !== 5) {
    return null;
  }
  return (
    <Modal
      ariaHideApp={false}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Microphone Permission Modal"
      className={style.modal}
      overlayClassName={style.overlay}
    >
      <div className={style.wrapper}>
        <div className={style.top}>
          <button
            className={style.close}
            onClick={() => {
              closeModal();
            }}
          ></button>
          <span className={style.parrot}></span>
          <div className={style.title}>
            <Image
              src={micPurple}
              alt=""
              width={100}
              height={100}
              className={style.purpleMic}
            />
            <h2>{t('LESSONS_MIC_MODAL_HEADING')}</h2>
          </div>
          <p>{t('LESSONS_MIC_MODAL_TITLE')}</p>
          <ul>
            <li>
              <span>{t('LESSONS_MIC_MODAL_LI1')}</span>
              <span className={style.colored}>
                {t('LESSONS_MIC_MODAL_LI1_SPAN')}
              </span>
              <span>{t('LESSONS_MIC_MODAL_LI1_IS_ON')}</span>
            </li>
            <li>
              <span>{t('LESSONS_MIC_MODAL_LI2')}</span>
              <span className={style.colored}>
                {t('LESSONS_MIC_MODAL_LI2_AREA')}
              </span>
            </li>
            <li>
              <span>{t('LESSONS_MIC_MODAL_LI3')}</span>
              <span className={style.colored}>
                {t('LESSONS_MIC_MODAL_LI3_HEADPHONES')}
              </span>
              <span>{t('LESSONS_MIC_MODAL_LI3_RESULT')}</span>
            </li>
          </ul>
        </div>
        <div className={style.bottom}>
          <button onClick={enableMicrophone}>
            {t('LESSONS_MIC_MODAL_MIC')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MicEnableModal;
